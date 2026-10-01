import { angerLabels, type AttackId, type NotifyEvent } from '../../shared/contracts';
import { cleanText, escapeHtml } from './security';
const moves: Record<AttackId, { emoji: string; label: string; hit: string; miss: string }> = {
  slap: { emoji: '🥊', label: 'Slap', hit: 'slapped you', miss: 'tried to slap you' },
  punch: { emoji: '👊', label: 'Punch', hit: 'punched you', miss: 'tried to punch you' },
  chappal: {
    emoji: '🩴',
    label: 'Chappal',
    hit: 'hit you with a chappal',
    miss: 'threw a chappal at you',
  },
  bonk: { emoji: '🔨', label: 'Bonk', hit: 'bonked you', miss: 'tried to bonk you' },
  tomato: {
    emoji: '🍅',
    label: 'Tomato',
    hit: 'splatted you with a tomato',
    miss: 'threw a tomato at you',
  },
  roast: { emoji: '🔥', label: 'Roast Harsh', hit: 'roasted you', miss: 'tried to roast you' },
  thunder: {
    emoji: '💥',
    label: 'Thunder Punch',
    hit: 'thunder-punched you',
    miss: 'tried a thunder punch',
  },
  emotional: {
    emoji: '💔',
    label: 'Emotional Damage',
    hit: 'dealt emotional damage to you',
    miss: 'tried emotional damage',
  },
};
const angerNames = {
  little: angerLabels[0],
  pretty: angerLabels[1],
  extremely: angerLabels[2],
  beyond: angerLabels[3],
};
export function formatReport(event: NotifyEvent, sid: string, now = new Date()) {
  const safe = (s: string, max = 80) => escapeHtml(cleanText(s, max)),
    visitor = safe(event.name?.trim() || 'Anonymous visitor', 20),
    move = event.attack ? moves[event.attack] : undefined;
  let headline: string;
  switch (event.kind) {
    case 'attack':
      headline = `${move?.emoji || '💥'} ${visitor} ${event.hit ? move?.hit : move?.miss}${event.hit ? '!' : ' and missed!'}`;
      break;
    case 'first_blood':
      headline = `🚨 ${visitor} landed the first ${move?.label || 'attack'}!`;
      break;
    case 'combo':
      headline = `🔥 ${visitor} landed a combo!`;
      break;
    case 'ultimate':
      headline = `⚡ ${visitor} used ${move?.label || 'an ultimate attack'}!`;
      break;
    case 'ko':
      headline = `💀 ${visitor} knocked out Harsh’s ego!`;
      break;
    case 'compliment':
      headline = `💌 ${visitor} sent Harsh compliments!`;
      break;
    case 'final':
      headline = `📜 ${visitor} finished a Rage Room run!`;
      break;
  }
  const lines = [`<b>${headline}</b>`];
  if (move) lines.push(`Attack: <b>${move.label}</b>`);
  if (event.anger) lines.push(`Anger: ${angerNames[event.anger]}`);
  if (event.kind === 'attack' && event.attack === 'roast' && event.roastText)
    lines.push(`“${escapeHtml(event.roastText)}”`);
  if (event.combo) lines.push(`Combo: <b>${safe(event.combo.name)}</b> ×${event.combo.length}`);
  if (event.reason) lines.push(`Reason: ${safe(event.reason)}`);
  if (event.freeText) lines.push(`Message: ${safe(event.freeText)}`);
  if (event.compliments) lines.push(...event.compliments.map((c) => `♡ ${safe(c, 100)}`));
  if (event.stats) {
    const s = event.stats;
    lines.push(
      `Attacks: <b>${s.attacks}</b> · Ultimates: ${s.ultimates} · Crits: ${s.crits}`,
      `Score: <b>${Math.round(s.score)}</b> · Accuracy: ${Math.round(s.accuracy * 100)}% · Max combo: ${s.maxCombo}`,
      `Favourite: ${safe(s.weaponFavourite)} · ${Math.round(s.durationMs / 1000)}s · Round ${s.round} · Visit ${s.visitN}`,
      `First hit: ${(s.ttfhMs / 1000).toFixed(1)}s · Shared/downloaded: ${s.shared ? 'yes' : 'no'}`,
    );
  }
  if (event.sentence) lines.push(`Sentence: <i>${safe(event.sentence, 150)}</i>`);
  const timestamp = event.kind === 'attack' && event.occurredAt ? new Date(event.occurredAt) : now;
  lines.push(
    'Time: ' +
      new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(timestamp) +
      ' IST',
    `Session: #${sid.slice(0, 4).toUpperCase()}`,
    '<i>Verified by Chota Sher. Approved by nobody.</i>',
  );
  return lines.join('\n');
}
export interface TelegramResult {
  ok: boolean;
  status: number;
  retryAfter?: number;
}
export class Telegram {
  private brokenUntil = 0;
  constructor(
    private token: string,
    private chatId: string,
    private fetcher: typeof fetch = fetch,
    private sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
  ) {}
  async send(text: string): Promise<TelegramResult> {
    if (this.brokenUntil > Date.now()) return { ok: false, status: 502 };
    let plain = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await this.fetcher(
          `https://api.telegram.org/bot${this.token}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: this.chatId,
              text: plain
                ? text
                    .replace(/<[^>]+>/g, '')
                    .replaceAll('&amp;', '&')
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
                    .replaceAll('&#39;', "'")
                    .replaceAll('&quot;', '"')
                : text,
              ...(!plain ? { parse_mode: 'HTML' } : {}),
            }),
            signal: AbortSignal.timeout(3000),
          },
        );
        if (response.ok) return { ok: true, status: 202 };
        if ([401, 403, 404].includes(response.status)) {
          this.brokenUntil = Date.now() + 60000;
          return { ok: false, status: 502 };
        }
        if (response.status === 400 && !plain) {
          plain = true;
          continue;
        }
        if (response.status === 429) {
          const body = (await response.json()) as { parameters?: { retry_after?: number } };
          return {
            ok: false,
            status: 429,
            retryAfter: Math.max(1, Number(body.parameters?.retry_after || 5)),
          };
        }
        if (response.status >= 500 && attempt === 0) {
          await this.sleep(500);
          continue;
        }
        return { ok: false, status: 502 };
      } catch {
        if (attempt === 0) {
          await this.sleep(500);
          continue;
        }
        return { ok: false, status: 502 };
      }
    }
    return { ok: false, status: 502 };
  }
}
