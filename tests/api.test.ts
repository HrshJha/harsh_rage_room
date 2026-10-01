/* eslint no-control-regex: "off" -- Verify hostile control characters are removed. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createApp, type Config } from '../api/src/app';
import { MemoryCoordinator } from '../api/src/coordinator';
import { newSession, verifyToken, cleanText, escapeHtml } from '../api/src/security';
import { formatReport, Telegram } from '../api/src/telegram';
import type { NotifyEvent } from '../shared/contracts';
const config: Config = {
  secret: 'test-secret-long-enough-for-a-test',
  enabled: true,
  dryRun: true,
  origins: ['http://localhost:5178'],
  captchaSecret: '',
  production: false,
  botToken: 'fake',
  chatId: 'test',
  trustProxy: false,
};
const event = (): NotifyEvent => ({
  eventId: crypto.randomUUID(),
  kind: 'first_blood',
  attack: 'slap',
});
const post = (app: ReturnType<typeof createApp>, path: string, body: unknown, token?: string) =>
  app.request(path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:5178',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
afterEach(() => vi.useRealTimers());
describe('tokens and sanitisation', () => {
  it('authenticates a fresh token and rejects tampering/expiry', () => {
    const s = newSession(config.secret, 1000000);
    expect(verifyToken(s.token, config.secret, 1001000)?.sid).toBe(s.sid);
    expect(verifyToken(s.token + 'a', config.secret, 1001000)).toBeNull();
    expect(verifyToken(s.token, 'wrong', 1001000)).toBeNull();
    expect(verifyToken(s.token, config.secret, 2800000)).toBeNull();
  });
  it.each([
    'http://bad.test',
    'https://bad.test/path',
    'www.bad.test',
    't.me/evil',
    '\u0000',
    '\u001f',
    '\u007f',
    '\u200b',
    '\u202e',
    '\u2066',
    '@everyone',
    '@here',
  ])('neutralises %j', (input) => {
    const clean = cleanText(input);
    expect(clean).not.toMatch(/https?:|www\.|t\.me\/|@|\u0000|\u202e|\u2066/);
  });
  it.each([
    '<script>x</script>',
    '<b>hello</b>',
    '<a href="x">x</a>',
    '&lt;b&gt;',
    "it's 'quoted'",
    'a&b',
    '1 > 0',
    'a < b',
    '"hello"',
  ])('escapes %j for Telegram', (s) => {
    const escaped = escapeHtml(s);
    expect(escaped).not.toMatch(/[<>"']/);
  });
  it('limits name length and strips URL text', () => {
    expect(cleanText('a'.repeat(100), 20)).toHaveLength(20);
    expect(cleanText(' hi  @harsh https://bad.test hello\nworld ')).toBe('hi harsh helloworld');
  });
});
describe('API contracts', () => {
  it('exposes health without secrets', async () => {
    const r = await createApp(config).request('/api/health');
    expect(await r.json()).toEqual({ ok: true, notify: true, mode: 'dry-run' });
  });
  it('issues bearer sessions and confirms dry-run without contacting Telegram', async () => {
    const tg = { send: vi.fn() } as unknown as Telegram;
    const app = createApp(config, new MemoryCoordinator(), tg);
    const s = await (await post(app, '/api/session', {})).json();
    const r = await post(app, '/api/notify', event(), s.token);
    expect(r.status).toBe(202);
    expect(await r.json()).toEqual({ ok: true, mode: 'dry-run' });
    expect(tg.send).not.toHaveBeenCalled();
  });
  it('reports a completed named roast with its exact escaped text and action time', async () => {
    const send = vi.fn().mockResolvedValue({ ok: true, status: 202 });
    const tg = { send } as unknown as Telegram;
    const app = createApp({ ...config, dryRun: false }, new MemoryCoordinator(), tg);
    const session = await (await post(app, '/api/session', {})).json();
    expect(send).not.toHaveBeenCalled();
    const roast: NotifyEvent = {
      eventId: crypto.randomUUID(),
      kind: 'attack',
      attack: 'roast',
      name: 'Alex',
      anger: 'extremely',
      hit: true,
      occurredAt: '2026-10-01T12:00:00.000Z',
      roastText: 'Your <code> is shit & needs\na software update.',
    };
    expect((await post(app, '/api/notify', roast, session.token)).status).toBe(202);
    const message = send.mock.calls[0][0] as string;
    expect(message).toContain('🔥 Alex roasted you!');
    expect(message).toContain('Attack: <b>Roast Harsh</b>');
    expect(message).toContain('Anger: Extremely angry');
    expect(message).toContain('Your &lt;code&gt; is shit &amp; needs\na software update.');
    expect(message).toContain('Time: 1 Oct 2026');
  });
  it('rejects blank, overlong and control-character roast messages', async () => {
    const app = createApp(config);
    const session = newSession(config.secret);
    const action = {
      ...event(),
      kind: 'attack',
      attack: 'roast',
      hit: true,
      occurredAt: new Date().toISOString(),
    };
    for (const roastText of [' ', 'x'.repeat(281), 'hello\u202eagain'])
      expect((await post(app, '/api/notify', { ...action, roastText }, session.token)).status).toBe(
        400,
      );
    expect(
      (await post(app, '/api/notify', { ...action, roastText: 'Hello!' }, session.token)).status,
    ).toBe(202);
  });
  it('rejects an invalid bearer', async () =>
    expect((await post(createApp(config), '/api/notify', event(), 'bad')).status).toBe(401));
  it('deduplicates a completed event', async () => {
    const app = createApp(config),
      s = newSession(config.secret),
      e = event();
    expect((await post(app, '/api/notify', e, s.token)).status).toBe(202);
    expect((await post(app, '/api/notify', e, s.token)).status).toBe(409);
  });
  it('reserves final even when normal reports are throttled', async () => {
    const app = createApp(config),
      s = newSession(config.secret);
    expect((await post(app, '/api/notify', event(), s.token)).status).toBe(202);
    expect((await post(app, '/api/notify', event(), s.token)).status).toBe(429);
    expect((await post(app, '/api/notify', { ...event(), kind: 'final' }, s.token)).status).toBe(
      202,
    );
  });
  it('rejects request 11 in the session window', async () => {
    const app = createApp(config);
    for (let i = 0; i < 10; i++) expect((await post(app, '/api/session', {})).status).toBe(200);
    expect((await post(app, '/api/session', {})).status).toBe(429);
  });
  it('rejects hostile origins and oversized bodies', async () => {
    const app = createApp(config);
    expect(
      (
        await app.request('/api/session', {
          method: 'POST',
          headers: { origin: 'https://evil.test', 'content-type': 'application/json' },
          body: '{}',
        })
      ).status,
    ).toBe(403);
    expect((await post(app, '/api/session', { captchaToken: 'a'.repeat(5000) })).status).toBe(413);
  });
  it('rejects invalid kinds and numeric stats', async () => {
    const app = createApp(config),
      s = newSession(config.secret);
    expect((await post(app, '/api/notify', { ...event(), kind: 'unknown' }, s.token)).status).toBe(
      400,
    );
    expect(
      (await post(app, '/api/notify', { ...event(), stats: { attacks: -1 } }, s.token)).status,
    ).toBe(400);
  });
  it('keeps the health route available with notifications disabled', async () => {
    const app = createApp({ ...config, enabled: false });
    expect((await app.request('/api/health')).status).toBe(200);
    expect((await post(app, '/api/notify', event())).status).toBe(503);
  });
  it('rejects a failed captcha', async () => {
    const fetcher = vi.fn(
      async () => new Response(JSON.stringify({ success: false })),
    ) as unknown as typeof fetch;
    const app = createApp(
      { ...config, dryRun: false, captchaSecret: 'fake' },
      new MemoryCoordinator(),
      undefined,
      fetcher,
    );
    expect((await post(app, '/api/session', { captchaToken: 'invalid' })).status).toBe(403);
  });
  it('fails open only twice on a captcha provider outage', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;
    const app = createApp(
      { ...config, dryRun: false, captchaSecret: 'fake' },
      new MemoryCoordinator(),
      undefined,
      fetcher,
    );
    expect((await post(app, '/api/session', { captchaToken: 'fake' })).status).toBe(200);
    expect((await post(app, '/api/session', { captchaToken: 'fake' })).status).toBe(200);
    expect((await post(app, '/api/session', { captchaToken: 'fake' })).status).toBe(429);
  });
});
describe('coordinator', () => {
  it('enforces seven non-final messages and one final', async () => {
    const c = new MemoryCoordinator();
    for (let i = 0; i < 7; i++) {
      const e = String(i);
      expect((await c.reserve('sid', e, false, 10000 + i * 6000)).ok).toBe(true);
      await c.complete('sid', e, false, true);
    }
    expect((await c.reserve('sid', 'extra', false, 80000)).ok).toBe(false);
    expect((await c.reserve('sid', 'final', true, 80000)).ok).toBe(true);
    await c.complete('sid', 'final', true, true);
    expect((await c.reserve('sid', 'final', true, 80001)).duplicate).toBe(true);
  });
  it('does not report a pending duplicate as delivered', async () => {
    const c = new MemoryCoordinator();
    await c.reserve('sid', 'e', true);
    expect(await c.reserve('sid', 'e', true)).toEqual({ ok: false, retryAfter: 2 });
    expect(await c.reserve('sid', 'another-final', true)).toEqual({ ok: false, retryAfter: 2 });
    await c.complete('sid', 'e', true, false);
    expect((await c.reserve('sid', 'e', true)).ok).toBe(true);
  });
  it('serializes concurrent sends', async () => {
    const c = new MemoryCoordinator(),
      a = await c.acquireSend();
    expect(a).toBeTruthy();
    expect(await c.acquireSend()).toBeNull();
    await c.releaseSend(a!);
    expect(await c.acquireSend()).toBeTruthy();
  });
});
describe('Telegram transport', () => {
  it('formats escaped visitor text and IST', () => {
    const report = formatReport(
      { ...event(), kind: 'final', name: '<b>X</b>', sentence: 'BUY CHAI' },
      'abcdef',
      new Date('2026-10-01T00:00:00Z'),
    );
    expect(report).toContain('&lt;b&gt;X&lt;/b&gt;');
    expect(report).toContain('IST');
  });
  it('falls back to plain text for parse errors', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 400 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const t = new Telegram('fake', 'fake', fetcher, async () => {});
    expect((await t.send('<b>Hello</b>')).ok).toBe(true);
    expect(JSON.parse(fetcher.mock.calls[1][1].body).parse_mode).toBeUndefined();
  });
  it.each([401, 403, 404])('opens a circuit on %i', async (status) => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status }));
    const t = new Telegram('fake', 'fake', fetcher, async () => {});
    expect((await t.send('Hello')).status).toBe(502);
    await t.send('again');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('returns retry_after on a Telegram 429', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response('{"parameters":{"retry_after":12}}', { status: 429 }));
    expect(await new Telegram('fake', 'fake', fetcher).send('Hello')).toEqual({
      ok: false,
      status: 429,
      retryAfter: 12,
    });
  });
  it('retries a server failure only once', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 500 }));
    expect((await new Telegram('fake', 'fake', fetcher, async () => {}).send('Hello')).ok).toBe(
      false,
    );
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('recovers after a network error', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValueOnce(new Response('{}'));
    expect((await new Telegram('fake', 'fake', fetcher, async () => {}).send('Hello')).ok).toBe(
      true,
    );
  });
});
