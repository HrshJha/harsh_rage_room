import { events } from '../core/events';
import { useGame, reportStats } from '../core/store';
import { angerKeys, type NotifyEvent } from '../../../shared/contracts';
const base = (import.meta.env?.VITE_API_BASE || '').replace(/\/$/, '');
type Pending = { event: NotifyEvent; attempts: number; expires: number };
const sessions = new Map<string, ReportSession>();
let scriptPromise: Promise<void> | undefined;
export async function captchaToken(): Promise<string> {
  const key = import.meta.env?.VITE_HCAPTCHA_SITE_KEY;
  if (!key) return '';
  const w = window as Window & {
    hcaptcha?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      execute: (id: string, options: { async: boolean }) => Promise<{ response: string }>;
      remove: (id: string) => void;
    };
  };
  if (!w.hcaptcha) {
    scriptPromise ??= new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = undefined;
        script.remove();
        reject(new Error('Verification unavailable'));
      };
      document.head.appendChild(script);
    });
    await scriptPromise;
  }
  const container = document.createElement('div');
  document.body.appendChild(container);
  const id = w.hcaptcha!.render(container, { sitekey: key, size: 'invisible' });
  try {
    return (await w.hcaptcha!.execute(id, { async: true })).response;
  } finally {
    w.hcaptcha!.remove(id);
    container.remove();
  }
}
function persist() {
  try {
    const saved = [...sessions.values()]
      .map((s) => ({ run: s.run, token: s.token, queue: s.queue }))
      .filter((s) => s.token && s.queue.length)
      .slice(-3);
    sessionStorage.setItem('hrr:v1:outbox', JSON.stringify(saved));
  } catch {
    /* Memory queue remains available. */
  }
}
class ReportSession {
  token = '';
  queue: Pending[] = [];
  sending = false;
  nextAt = 0;
  boot: Promise<void> | null = null;
  bootAttempts = 0;
  timer: ReturnType<typeof setTimeout> | undefined;
  finalId = crypto.randomUUID();
  finalSent = false;
  shared = false;
  constructor(public run: string) {}
  status(delivery: ReturnType<typeof useGame.getState>['delivery']) {
    if (this.run === useGame.getState().runId) useGame.setState({ delivery });
  }
  bootstrap() {
    if (this.token || this.boot) return this.boot || Promise.resolve();
    if (!navigator.onLine) {
      this.status('offline');
      return Promise.resolve();
    }
    this.bootAttempts++;
    this.boot = (async () => {
      try {
        const challenge = await captchaToken();
        const r = await fetch(`${base}/api/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ captchaToken: challenge }),
          signal: AbortSignal.timeout(25000),
        });
        if (!r.ok) throw new Error('Session unavailable');
        const data = await r.json();
        this.token = data.token;
        void this.flush();
      } catch {
        this.status(navigator.onLine ? 'failed' : 'offline');
        if (this.bootAttempts < 3)
          this.timer = setTimeout(() => {
            this.boot = null;
            void this.bootstrap();
          }, this.bootAttempts * 5000);
      }
    })();
    return this.boot;
  }
  enqueue(event: NotifyEvent) {
    if (event.kind === 'final') {
      const existing = this.queue.find((p) => p.event.kind === 'final');
      if (existing) {
        existing.event = event;
        persist();
        return;
      }
    }
    this.queue.push({ event, attempts: 0, expires: Date.now() + 600000 });
    if (this.queue.length > 7) {
      const index = this.queue.findIndex(
        (p, i) => i > 0 && p.event.kind === 'attack' && p.event.attack !== 'roast',
      );
      this.queue.splice(index < 0 ? 0 : index, 1);
    }
    persist();
    void this.bootstrap().then(() => this.flush());
  }
  async flush(): Promise<void> {
    if (this.sending || !this.token || !this.queue.length) return;
    if (!navigator.onLine) {
      this.status('offline');
      return;
    }
    const p = this.queue[0];
    if (p.expires < Date.now()) {
      this.queue.shift();
      persist();
      return this.flush();
    }
    const wait = p.event.kind === 'final' ? 0 : this.nextAt - Date.now();
    if (wait > 0) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => void this.flush(), wait);
      return;
    }
    this.sending = true;
    this.status('pending');
    let retry = false;
    try {
      const r = await fetch(`${base}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
        body: JSON.stringify(p.event),
        signal: AbortSignal.timeout(15000),
      });
      if (r.ok || r.status === 409) {
        const data = await r.json().catch(() => ({}));
        this.queue.shift();
        this.nextAt = Date.now() + 5000;
        this.status(data.mode === 'dry-run' ? 'dry-run' : 'delivered');
        if (p.event.kind === 'final') this.finalSent = true;
      } else if ([400, 401, 403, 503].includes(r.status)) {
        this.queue.shift();
        this.status('failed');
      } else {
        const data = await r.json().catch(() => ({}));
        p.attempts++;
        if (p.attempts >= 3) {
          this.queue.shift();
          this.status('failed');
        } else {
          retry = true;
          this.nextAt =
            Date.now() +
            Math.max(1500 * 2 ** p.attempts, Number(data.retryAfter || 5) * 1000) +
            Math.random() * 500;
        }
      }
    } catch {
      p.attempts++;
      if (p.attempts >= 3) {
        this.queue.shift();
        this.status('failed');
      } else {
        retry = true;
        this.nextAt = Date.now() + 3000;
      }
    } finally {
      this.sending = false;
      persist();
    }
    if (retry) {
      this.timer = setTimeout(() => void this.flush(), Math.max(0, this.nextAt - Date.now()));
      return;
    }
    void this.flush();
  }
}
function current() {
  const id = useGame.getState().runId;
  let s = sessions.get(id);
  if (!s) {
    s = new ReportSession(id);
    sessions.set(id, s);
    for (const [key, old] of sessions)
      if (key !== id && !old.queue.length && !old.sending) {
        clearTimeout(old.timer);
        sessions.delete(key);
      }
  }
  return s;
}
export function beginSession() {
  return current().bootstrap();
}
function common() {
  const s = useGame.getState();
  return {
    anger: angerKeys[s.fight.anger],
    reason: s.reason,
    name: s.name,
    freeText: s.freeText || undefined,
    device: (matchMedia('(pointer:coarse)').matches ? 'touch' : 'pointer') as 'touch' | 'pointer',
    stats: reportStats(),
  };
}
export function finalReport(shared = false, exit = false) {
  const s = useGame.getState(),
    session = current();
  if (session.finalSent || (!s.fight.attacks && s.certificate?.kind !== 'kindness')) return;
  session.shared = session.shared || shared;
  const event: NotifyEvent = {
    ...common(),
    eventId: session.finalId,
    kind: 'final',
    stats: { ...(s.certificate?.stats || reportStats()), shared: session.shared },
    sentence: s.certificate?.sentence,
  };
  if (exit && session.token) {
    void fetch(`${base}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify(event),
      keepalive: true,
    })
      .then((r) => {
        if (r.ok || r.status === 409) session.finalSent = true;
        else session.enqueue(event);
      })
      .catch(() => session.enqueue(event));
    return;
  }
  session.enqueue(event);
}
let restored = false;
export function connectNetwork() {
  if (!restored) {
    restored = true;
    try {
      const old = JSON.parse(sessionStorage.getItem('hrr:v1:outbox') || '[]');
      if (Array.isArray(old))
        for (const item of old.slice(-3)) {
          if (
            typeof item.run !== 'string' ||
            typeof item.token !== 'string' ||
            !Array.isArray(item.queue)
          )
            continue;
          const s = new ReportSession(item.run);
          s.token = item.token;
          s.queue = item.queue
            .filter((p: Pending) => p.expires > Date.now() && p.event?.eventId)
            .slice(0, 7);
          if (s.queue.length) {
            sessions.set(s.run, s);
            void s.flush();
          }
        }
    } catch {
      /* Expired/corrupt queues are discarded. */
    }
  }
  const unsubscribe = events.on((event) => {
    const s = useGame.getState(),
      session = current();
    if (event.type === 'attack') {
      if (event.attack === 'roast' && !event.roastText?.trim()) return;
      session.enqueue({
        eventId: crypto.randomUUID(),
        kind: 'attack',
        attack: event.attack,
        hit: event.hit,
        occurredAt: event.occurredAt,
        roastText: event.roastText,
        name: s.name,
        anger: angerKeys[s.fight.anger],
      });
    } else if (event.type === 'compliment')
      session.enqueue({
        ...common(),
        eventId: crypto.randomUUID(),
        kind: 'compliment',
        compliments: event.lines,
      });
    else finalReport(event.shared);
  });
  const online = () => {
      for (const s of sessions.values()) {
        if (!s.token) {
          s.boot = null;
          void s.bootstrap();
        } else void s.flush();
      }
    },
    hide = () => finalReport(false, true);
  window.addEventListener('online', online);
  window.addEventListener('pagehide', hide);
  return () => {
    unsubscribe();
    window.removeEventListener('online', online);
    window.removeEventListener('pagehide', hide);
  };
}
