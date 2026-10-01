import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import { secureHeaders } from 'hono/secure-headers';
import { z } from 'zod';
import { notifySchema } from '../../shared/schemas';
import { newSession, verifyToken, ipKey, cleanText } from './security';
import { MemoryCoordinator, type Coordinator } from './coordinator';
import { Telegram, formatReport } from './telegram';
export interface Config {
  secret: string;
  enabled: boolean;
  dryRun: boolean;
  origins: string[];
  captchaSecret: string;
  production: boolean;
  botToken: string;
  chatId: string;
  trustProxy: boolean;
}
export function createApp(
  config: Config,
  coordinator: Coordinator = new MemoryCoordinator(),
  telegram = new Telegram(config.botToken, config.chatId),
  fetcher: typeof fetch = fetch,
) {
  const app = new Hono();
  app.use('*', secureHeaders());
  app.use(
    '/api/*',
    cors({
      origin: (origin) => (config.origins.includes(origin) ? origin : ''),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    }),
  );
  app.use(
    '/api/*',
    bodyLimit({ maxSize: 4096, onError: (c) => c.json({ error: 'body_too_large' }, 413) }),
  );
  app.use('/api/*', async (c, next) => {
    if (c.req.method === 'POST') {
      const origin = c.req.header('origin');
      if (origin && !config.origins.includes(origin))
        return c.json({ error: 'origin_not_allowed' }, 403);
      if (!c.req.header('content-type')?.startsWith('application/json'))
        return c.json({ error: 'json_required' }, 415);
    }
    await next();
  });
  app.get('/api/health', (c) =>
    c.json({ ok: true, notify: config.enabled, mode: config.dryRun ? 'dry-run' : 'live' }),
  );
  app.post('/api/session', async (c) => {
    const input = z
      .object({ captchaToken: z.string().max(4096).optional() })
      .strict()
      .safeParse(await c.req.json().catch(() => null));
    if (!input.success) return c.json({ error: 'bad_request' }, 400);
    const ip = config.trustProxy
      ? c.req.header('x-forwarded-for')?.split(',').at(-1)?.trim() || 'unknown'
      : 'local';
    const key = ipKey(ip, config.secret);
    if (!(await coordinator.rate(`session:${key}`, 10, 600000)))
      return c.json({ error: 'rate_limited', retryAfter: 600 }, 429);
    if (!config.dryRun && config.captchaSecret) {
      if (!input.data.captchaToken) return c.json({ error: 'captcha_required' }, 403);
      try {
        const r = await fetcher('https://api.hcaptcha.com/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: config.captchaSecret,
            response: input.data.captchaToken,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error('provider_unavailable');
        const data = (await r.json()) as { success: boolean; hostname?: string };
        if (!data.success) return c.json({ error: 'captcha_failed' }, 403);
      } catch {
        if (!(await coordinator.rate(`captcha-outage:${key}`, 2, 600000)))
          return c.json({ error: 'rate_limited', retryAfter: 600 }, 429);
      }
    }
    return c.json(newSession(config.secret));
  });
  app.post('/api/notify', async (c) => {
    if (!config.enabled) return c.json({ error: 'disabled' }, 503);
    const auth = c.req.header('authorization') || '';
    const claims = verifyToken(auth.startsWith('Bearer ') ? auth.slice(7) : '', config.secret);
    if (!claims) return c.json({ error: 'bad_token' }, 401);
    const parsed = notifySchema.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: 'invalid' }, 400);
    const event = parsed.data;
    for (const field of ['name', 'reason', 'freeText', 'sentence'] as const)
      if (event[field])
        event[field] = cleanText(
          event[field]!,
          field === 'name' ? 20 : field === 'sentence' ? 150 : 80,
        );
    if (parsed.data.freeText !== undefined && !event.freeText)
      return c.json({ error: 'empty_message' }, 400);
    const ip = config.trustProxy
      ? c.req.header('x-forwarded-for')?.split(',').at(-1)?.trim() || 'unknown'
      : 'local';
    if (
      !(await coordinator.rate(`notify:${ipKey(ip, config.secret)}`, 30, 600000)) ||
      !(await coordinator.rate('global', 60, 60000))
    )
      return c.json({ error: 'rate_limited', retryAfter: 60 }, 429);
    const final = event.kind === 'final',
      r = await coordinator.reserve(claims.sid, event.eventId, final);
    if (!r.ok)
      return r.duplicate
        ? c.json({ ok: true, mode: config.dryRun ? 'dry-run' : 'live' }, 409)
        : c.json({ ok: false, retryAfter: r.retryAfter || 5 }, 429);
    let success = false,
      lock: string | null = null;
    try {
      if (config.dryRun) {
        success = true;
        return c.json({ ok: true, mode: 'dry-run' }, 202);
      }
      lock = await coordinator.acquireSend();
      if (!lock) return c.json({ ok: false, retryAfter: 2 }, 429);
      const sent = await telegram.send(formatReport(event, claims.sid));
      success = sent.ok;
      if (sent.ok) return c.json({ ok: true, mode: 'live' }, 202);
      if (sent.status === 429) return c.json({ ok: false, retryAfter: sent.retryAfter || 5 }, 429);
      return c.json({ error: 'telegram_unavailable' }, 502);
    } finally {
      await coordinator.complete(claims.sid, event.eventId, final, success);
      if (lock) {
        const held = lock;
        setTimeout(() => void coordinator.releaseSend(held).catch(() => {}), 1100);
      }
    }
  });
  app.onError((_error, c) => {
    console.error(JSON.stringify({ kind: 'api_error', path: c.req.path }));
    return c.json({ error: 'service_unavailable' }, 503);
  });
  app.notFound((c) => c.json({ error: 'not_found' }, 404));
  return app;
}
