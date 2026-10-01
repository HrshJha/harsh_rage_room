import Redis from 'ioredis';
export interface Reservation {
  ok: boolean;
  duplicate?: boolean;
  retryAfter?: number;
}
export interface Coordinator {
  rate(key: string, limit: number, windowMs: number): Promise<boolean>;
  reserve(sid: string, eventId: string, final: boolean, now?: number): Promise<Reservation>;
  complete(sid: string, eventId: string, final: boolean, success: boolean): Promise<void>;
  acquireSend(): Promise<string | null>;
  releaseSend(lock: string): Promise<void>;
  close(): Promise<void>;
}
export class MemoryCoordinator implements Coordinator {
  windows = new Map<string, number[]>();
  sessions = new Map<
    string,
    {
      count: number;
      last: number;
      final: false | 'pending' | 'done';
      expires: number;
      events: Map<string, 'pending' | 'done'>;
    }
  >();
  sendLock = false;
  async rate(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const times = (this.windows.get(key) || []).filter((t) => t > now - windowMs);
    if (times.length >= limit) {
      this.windows.set(key, times);
      return false;
    }
    times.push(now);
    this.windows.set(key, times);
    if (this.windows.size > 1000)
      for (const [k, v] of this.windows) if (v.at(-1)! < now - 600000) this.windows.delete(k);
    return true;
  }
  async reserve(
    sid: string,
    eventId: string,
    final: boolean,
    now = Date.now(),
  ): Promise<Reservation> {
    for (const [k, v] of this.sessions) if (v.expires < now) this.sessions.delete(k);
    const s = this.sessions.get(sid) || {
      count: 0,
      last: 0,
      final: false as false | 'pending' | 'done',
      expires: now + 2400000,
      events: new Map<string, 'pending' | 'done'>(),
    };
    this.sessions.set(sid, s);
    if (s.events.get(eventId) === 'done') return { ok: false, duplicate: true };
    if (s.events.has(eventId)) return { ok: false, retryAfter: 2 };
    if (final && s.final === 'done') return { ok: false, duplicate: true };
    if (final && s.final === 'pending') return { ok: false, retryAfter: 2 };
    if (!final && (s.count >= 7 || now - s.last < 5000))
      return {
        ok: false,
        retryAfter: s.count >= 7 ? 1800 : Math.ceil((5000 - now + s.last) / 1000),
      };
    s.events.set(eventId, 'pending');
    s.count++;
    s.last = now;
    if (final) s.final = 'pending';
    return { ok: true };
  }
  async complete(sid: string, eventId: string, final: boolean, success: boolean) {
    const s = this.sessions.get(sid);
    if (!s) return;
    if (success) {
      s.events.set(eventId, 'done');
      if (final) s.final = 'done';
    } else {
      s.events.delete(eventId);
      s.count = Math.max(0, s.count - 1);
      if (final) s.final = false;
    }
  }
  async acquireSend() {
    if (this.sendLock) return null;
    this.sendLock = true;
    return 'local';
  }
  async releaseSend(_lock: string) {
    this.sendLock = false;
  }
  async close() {}
}
const reserveLua = `
local key=KEYS[1]
local event=ARGV[1]
local final=ARGV[2]=='1'
local now=tonumber(ARGV[3])
local state=redis.call('HGET',key,'e:'..event)
if state=='done' then return {0,1,0} end
if state then return {0,0,2} end
if final and redis.call('HGET',key,'final')=='done' then return {0,1,0} end
if final and redis.call('HGET',key,'final')=='pending' then return {0,0,2} end
local count=tonumber(redis.call('HGET',key,'count') or '0')
local last=tonumber(redis.call('HGET',key,'last') or '0')
if not final and count>=7 then return {0,0,1800} end
if not final and now-last<5000 then return {0,0,math.ceil((5000-now+last)/1000)} end
redis.call('HSET',key,'e:'..event,'pending','count',count+1,'last',now)
if final then redis.call('HSET',key,'final','pending') end
redis.call('PEXPIRE',key,2400000)
return {1,0,0}`;
export class RedisCoordinator implements Coordinator {
  redis: Redis;
  constructor(url: string) {
    this.redis = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    this.redis.on('error', () => {
      /* Caller handles backend errors; never log credentials. */
    });
  }
  async ready() {
    if (this.redis.status === 'wait') await this.redis.connect();
    if (this.redis.status !== 'ready') throw new Error('Coordinator unavailable');
  }
  async rate(key: string, limit: number, windowMs: number) {
    await this.ready();
    const now = Date.now();
    const result = await this.redis.eval(
      `redis.call('ZREMRANGEBYSCORE',KEYS[1],'-inf',ARGV[1]-ARGV[2]);if redis.call('ZCARD',KEYS[1])>=tonumber(ARGV[3]) then return 0 end;redis.call('ZADD',KEYS[1],ARGV[1],ARGV[4]);redis.call('PEXPIRE',KEYS[1],ARGV[2]);return 1`,
      1,
      `hrr:rate:${key}`,
      now,
      windowMs,
      limit,
      crypto.randomUUID(),
    );
    return result === 1;
  }
  async reserve(sid: string, eventId: string, final: boolean, now = Date.now()) {
    await this.ready();
    const r = (await this.redis.eval(
      reserveLua,
      1,
      `hrr:session:${sid}`,
      eventId,
      final ? '1' : '0',
      now,
    )) as number[];
    return { ok: r[0] === 1, duplicate: r[1] === 1, retryAfter: r[2] };
  }
  async complete(sid: string, eventId: string, final: boolean, success: boolean) {
    await this.ready();
    await this.redis.eval(
      `if ARGV[3]=='1' then redis.call('HSET',KEYS[1],'e:'..ARGV[1],'done');if ARGV[2]=='1' then redis.call('HSET',KEYS[1],'final','done') end else redis.call('HDEL',KEYS[1],'e:'..ARGV[1]);redis.call('HINCRBY',KEYS[1],'count',-1);if ARGV[2]=='1' then redis.call('HDEL',KEYS[1],'final') end end;return 1`,
      1,
      `hrr:session:${sid}`,
      eventId,
      final ? '1' : '0',
      success ? '1' : '0',
    );
  }
  async acquireSend() {
    await this.ready();
    const id = crypto.randomUUID();
    return (await this.redis.set('hrr:send-lock', id, 'PX', 30000, 'NX')) === 'OK' ? id : null;
  }
  async releaseSend(lock: string) {
    await this.redis.eval(
      `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end`,
      1,
      'hrr:send-lock',
      lock,
    );
  }
  async close() {
    this.redis.disconnect();
  }
}
