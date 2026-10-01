/* eslint no-control-regex: "off" -- This sanitizer intentionally detects control characters. */
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
// Explicitly remove control characters from untrusted visitor text.
export function cleanText(value: string, max = 80) {
  return value
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/(?:https?:\/\/|www\.|t\.me\/)[^\s]+/gi, '')
    .replace(/@/g, '')
    .replace(/\b(fuck|shit|bitch|bastard)\b/gi, '***')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}
export function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
export interface Claims {
  sid: string;
  iat: number;
  exp: number;
}
export function signToken(secret: string, claims: Claims) {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}
export function newSession(secret: string, now = Date.now()) {
  const claims = {
    sid: randomUUID(),
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + 1800,
  };
  return { token: signToken(secret, claims), sid: claims.sid, expiresAt: claims.exp };
}
export function verifyToken(token: string, secret: string, now = Date.now()): Claims | null {
  try {
    const [body, mac, ...rest] = token.split('.');
    if (!body || !mac || rest.length || token.length > 1024) return null;
    const expected = createHmac('sha256', secret).update(body).digest(),
      actual = Buffer.from(mac, 'base64url');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const c = JSON.parse(Buffer.from(body, 'base64url').toString());
    const seconds = Math.floor(now / 1000);
    if (
      typeof c.sid !== 'string' ||
      !Number.isInteger(c.iat) ||
      !Number.isInteger(c.exp) ||
      c.exp <= seconds ||
      c.iat > seconds + 5 ||
      c.exp - c.iat !== 1800
    )
      return null;
    return c;
  } catch {
    return null;
  }
}
export function ipKey(ip: string, secret: string, now = Date.now()) {
  return createHmac('sha256', secret)
    .update(`ip:${Math.floor(now / 86400000)}:${ip}`)
    .digest('hex')
    .slice(0, 32);
}
