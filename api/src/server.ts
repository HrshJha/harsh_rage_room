import { serve } from '@hono/node-server';
import { randomBytes } from 'node:crypto';
import { createApp, type Config } from './app';
import { MemoryCoordinator, RedisCoordinator } from './coordinator';
const dryRun = process.env.NOTIFY_DRY_RUN !== 'false',
  production = process.env.NODE_ENV === 'production';
const config: Config = {
  secret: process.env.SESSION_HMAC_SECRET || randomBytes(32).toString('hex'),
  enabled: process.env.NOTIFY_ENABLED !== 'false',
  dryRun,
  production,
  origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5178,http://127.0.0.1:5178')
    .split(',')
    .map((x) => x.trim()),
  captchaSecret: process.env.HCAPTCHA_SECRET || '',
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
  trustProxy: process.env.RENDER === 'true',
};
if (!dryRun && config.enabled) {
  for (const key of [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    ...(production ? ['SESSION_HMAC_SECRET', 'REDIS_URL', 'HCAPTCHA_SECRET'] : []),
  ])
    if (!process.env[key]) throw new Error(`${key} is required for live notifications`);
}
const coordinator = process.env.REDIS_URL
  ? new RedisCoordinator(process.env.REDIS_URL)
  : new MemoryCoordinator();
const server = serve(
  {
    fetch: createApp(config, coordinator).fetch,
    hostname: !production && !dryRun ? '127.0.0.1' : '0.0.0.0',
    port: Number(process.env.PORT || 8787),
  },
  (info) => console.log(`Rage Room API listening on ${info.port} (${dryRun ? 'dry-run' : 'live'})`),
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    server.close();
    void coordinator.close().then(() => process.exit(0));
  });
