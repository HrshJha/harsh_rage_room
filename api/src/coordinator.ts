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
