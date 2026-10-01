import type { AttackId, ZoneId, Anger } from '../../../shared/contracts';
export interface Weapon {
  id: AttackId;
  label: string;
  short: string;
  damage: [number, number];
  gain: number;
  cost: number;
  color: string;
  word: string;
  description: string;
  impact: number;
  duration: number;
}
export const weapons: Weapon[] = [
  {
    id: 'slap',
    label: 'The classic slap',
    short: 'Slap',
    damage: [6, 9],
    gain: 8,
    cost: 0,
    color: '#ffd55b',
    word: 'WHAP!',
    description: 'Five fingers. One opinion.',
    impact: 200,
    duration: 650,
  },
  {
    id: 'punch',
    label: 'Ego adjustment',
    short: 'Punch',
    damage: [9, 13],
    gain: 8,
    cost: 0,
    color: '#ff755c',
    word: 'POW!',
    description: 'A very direct message.',
    impact: 190,
    duration: 700,
  },
  {
    id: 'chappal',
    label: 'Flying chappal',
    short: 'Chappal',
    damage: [8, 11],
    gain: 8,
    cost: 0,
    color: '#bc9bff',
    word: 'THWACK!',
    description: 'Mom-approved accuracy.',
    impact: 520,
    duration: 1100,
  },
  {
    id: 'bonk',
    label: 'Brain reboot',
    short: 'Bonk',
    damage: [5, 8],
    gain: 8,
    cost: 0,
    color: '#ffd55b',
    word: 'BONK!',
    description: 'Have you tried restarting him?',
    impact: 240,
    duration: 700,
  },
  {
    id: 'tomato',
    label: 'Organic feedback',
    short: 'Tomato',
    damage: [4, 7],
    gain: 6,
    cost: 0,
    color: '#ff755c',
    word: 'SPLAT!',
    description: 'Fresh. Organic. Personal.',
    impact: 420,
    duration: 850,
  },
  {
    id: 'roast',
    label: 'Verbal violence',
    short: 'Roast',
    damage: [10, 14],
    gain: 10,
    cost: 0,
    color: '#bc9bff',
    word: 'ROASTED!',
    description: 'Words leave a different mark.',
    impact: 600,
    duration: 1050,
  },
  {
    id: 'thunder',
    label: 'Thunder punch',
    short: 'Thunder',
    damage: [28, 35],
    gain: 0,
    cost: 100,
    color: '#b6ff63',
    word: 'KABOOM!',
    description: '100 rage. Zero chill.',
    impact: 1050,
    duration: 2600,
  },
  {
    id: 'emotional',
    label: 'Emotional damage',
    short: 'Emotional',
    damage: [20, 25],
    gain: 0,
    cost: 60,
    color: '#ff91bf',
    word: 'EMOTIONAL DAMAGE',
    description: 'Sharma ji ka beta enters the chat.',
    impact: 1500,
    duration: 3200,
  },
];
export const weaponById = Object.fromEntries(weapons.map((w) => [w.id, w])) as Record<
  AttackId,
  Weapon
>;
export const zoneMultipliers: Record<ZoneId, number> = {
  glasses: 1.5,
  nose: 1.3,
  forehead: 1.2,
  cheeks: 1,
  hair: 0.8,
  torso: 0.7,
};
export interface Hit {
  id: AttackId;
  at: number;
  side: 'left' | 'right';
  hit: boolean;
}
export interface Fight {
  ego: number;
  rage: number;
  attacks: number;
  hits: number;
  crits: number;
  ultimates: number;
  combo: number;
  maxCombo: number;
  damage: number;
  history: Hit[];
  counts: Record<AttackId, number>;
  asleep: boolean;
  stunnedUntil: number;
  firstHitAt: number;
  lastHitAt: number;
  anger: Anger;
}
export function freshFight(anger: Anger): Fight {
  return {
    ego: 100,
    rage: [0, 25, 60, 100][anger],
    attacks: 0,
    hits: 0,
    crits: 0,
    ultimates: 0,
    combo: 0,
    maxCombo: 0,
    damage: 0,
    history: [],
    counts: Object.fromEntries(weapons.map((w) => [w.id, 0])) as Record<AttackId, number>,
    asleep: false,
    stunnedUntil: 0,
    firstHitAt: 0,
    lastHitAt: 0,
    anger,
  };
}
export function comboName(history: Hit[], sleeping = false): string | null {
  if (sleeping) return 'SLEEPING BEAUTY';
  const ids = history.map((h) => h.id),
    tail = (n: number) => ids.slice(-n).join(',');
  if (tail(3) === 'chappal,slap,emotional') return 'DESI MOM SPECIAL';
  if (new Set(ids.filter((id) => !weaponById[id].cost)).size === 6) return 'FULL SET';
  if (tail(5) === 'bonk,bonk,bonk,bonk,bonk') return 'BONK-A-DOODLE';
  if (tail(3) === 'tomato,tomato,tomato') return 'SALAD';
  const pair = history.slice(-2);
  if (
    pair.length === 2 &&
    pair.every((h) => h.id === 'slap') &&
    pair[0].side !== pair[1].side &&
    pair[1].at - pair[0].at <= 600
  )
    return 'SLAP SANDWICH';
  if (ids.length >= 3 && new Set(ids.slice(-3)).size === 3) return 'HAT-TRICK';
  return null;
}
export function resolveAttack(
  fight: Fight,
  id: AttackId,
  zone: ZoneId | null,
  now: number,
  side: 'left' | 'right',
  rng = Math.random,
) {
  const w = weaponById[id];
  if (fight.ego <= 0 || fight.rage < w.cost) return null;
  const hit = zone !== null,
    crit =
      hit && (id === 'thunder' || fight.asleep || rng() < 0.08 + (zone === 'glasses' ? 0.1 : 0));
  const history = hit
    ? [...(now - fight.lastHitAt <= 2500 ? fight.history : []), { id, at: now, side, hit }].slice(
        -30,
      )
    : [];
  const combo = hit ? (now - fight.lastHitAt <= 2500 ? fight.combo + 1 : 1) : 0;
  const base = w.damage[0] + rng() * (w.damage[1] - w.damage[0]);
  const damage = hit
    ? Math.round(
        base *
          zoneMultipliers[zone] *
          Math.min(2, 1 + 0.1 * (combo - 1)) *
          (crit ? 2 : 1) *
          (fight.asleep ? 2 : 1) *
          (now < fight.stunnedUntil ? 1.2 : 1),
      )
    : 0;
  const next: Fight = {
    ...fight,
    ego: Math.max(0, fight.ego - damage),
    rage: Math.max(0, Math.min(100, fight.rage - w.cost + (hit ? w.gain : 0))),
    attacks: fight.attacks + 1,
    hits: fight.hits + Number(hit),
    crits: fight.crits + Number(crit),
    ultimates: fight.ultimates + Number(w.cost > 0),
    combo,
    maxCombo: Math.max(fight.maxCombo, combo),
    damage: fight.damage + damage,
    history,
    counts: { ...fight.counts, [id]: fight.counts[id] + 1 },
    asleep: false,
    stunnedUntil: id === 'bonk' && hit ? now + 1200 : 0,
    firstHitAt: fight.firstHitAt || (hit ? now : 0),
    lastHitAt: hit ? now : fight.lastHitAt,
  };
  return {
    next,
    damage,
    crit,
    hit,
    comboName: comboName(history, fight.asleep && hit),
    first: hit && fight.hits === 0,
    ko: next.ego === 0,
  };
}
export function score(fight: Fight) {
  return Math.round(
    fight.damage +
      50 * fight.ultimates +
      25 * fight.crits +
      10 * fight.maxCombo +
      [0, 50, 100, 200][fight.anger],
  );
}
export function favourite(fight: Fight): AttackId {
  return weapons.reduce(
    (a, w) => (fight.counts[w.id] > fight.counts[a] ? w.id : a),
    'slap' as AttackId,
  );
}
export function hitZone(x: number, y: number): ZoneId | null {
  if (x < 100 || x > 345 || y < 35 || y > 465) return null;
  if (y < 116) return x > 135 && x < 315 ? 'hair' : null;
  if (y < 145) return 'forehead';
  if (y < 196 && x > 130 && x < 321) return 'glasses';
  if (y < 230 && x > 192 && x < 254) return 'nose';
  if (y < 284) return 'cheeks';
  return x > 115 && x < 324 ? 'torso' : null;
}
export function createDeck<T>(items: readonly T[], rng = Math.random) {
  let pool: T[] = [],
    last: T | undefined;
  return () => {
    if (!pool.length) {
      pool = [...items];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      if (pool.length > 1 && pool.at(-1) === last)
        [pool[0], pool[pool.length - 1]] = [pool[pool.length - 1], pool[0]];
    }
    last = pool.pop();
    return last!;
  };
}
