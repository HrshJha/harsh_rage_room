import { create } from 'zustand';
import type { Anger, AttackId, Scene, Delivery, ReportStats } from '../../../shared/contracts';
import { freshFight, score, favourite, type Fight } from '../engine/game';
export interface Settings {
  muted: boolean;
  volume: number;
  music: boolean;
  motion: 'full' | 'calm';
  gentle: boolean;
  lite: boolean;
  haptics: boolean;
}
function read<T>(key: string, fallback: T): T {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(key) || '{}') };
  } catch {
    return fallback;
  }
}
const settings: Settings = {
  muted: true,
  volume: 0.65,
  music: false,
  motion: 'full',
  gentle: false,
  lite: false,
  haptics: true,
};
let visits = 1;
let visitorName = '';
try {
  visits = Math.max(1, Number(localStorage.getItem('hrr:v1:visits') || 0) + 1);
  localStorage.setItem('hrr:v1:visits', String(visits));
} catch {
  /* storage is optional */
}
try {
  visitorName = sessionStorage.getItem('hrr:v1:visitor') || '';
} catch {
  /* storage is optional */
}
export interface Certificate {
  kind: 'revenge' | 'kindness';
  name: string;
  stats: ReportStats;
  sentence: string;
  serial: string;
  date: string;
  compliments: string[];
}
interface State {
  scene: Scene;
  settings: Settings;
  fight: Fight;
  weapon: AttackId;
  busy: boolean;
  name: string;
  reason: string;
  freeText: string;
  startedAt: number;
  landedAt: number;
  visitN: number;
  round: number;
  runId: string;
  delivery: Delivery;
  line: string;
  certificate: Certificate | null;
  selectedCompliments: string[];
  lastInputAt: number;
  setScene: (scene: Scene) => void;
  setSettings: (s: Partial<Settings>) => void;
  setVisitorName: (name: string) => void;
  start: (anger: Anger) => void;
  setWeapon: (id: AttackId) => void;
  makeCertificate: (kind: 'revenge' | 'kindness', sentence: string) => void;
}
export const useGame = create<State>((set, get) => ({
  scene: 'gate',
  settings,
  fight: freshFight(0),
  weapon: 'slap',
  busy: false,
  name: visitorName,
  reason: 'Just because',
  freeText: '',
  startedAt: Date.now(),
  landedAt: Date.now(),
  lastInputAt: Date.now(),
  visitN: visits,
  round: 1,
  runId: crypto.randomUUID(),
  delivery: 'idle',
  line: 'His ego called. It wants a lawyer.',
  certificate: null,
  selectedCompliments: [],
  setScene: (scene) => set({ scene, busy: false, lastInputAt: Date.now() }),
  setSettings: (s) => {
    const next = { ...get().settings, ...s };
    try {
      localStorage.setItem('hrr:v1:settings', JSON.stringify(next));
    } catch {
      /* ephemeral settings */
    }
    set({ settings: next });
  },
  setVisitorName: (name) => {
    const next = name.trim().slice(0, 20);
    try {
      sessionStorage.setItem('hrr:v1:visitor', next);
    } catch {
      /* Session storage is optional. */
    }
    set({ name: next });
  },
  start: (anger) =>
    set({
      scene: 'room',
      fight: freshFight(anger),
      weapon: 'slap',
      busy: false,
      startedAt: Date.now(),
      landedAt: get().certificate || get().fight.attacks ? Date.now() : get().landedAt,
      lastInputAt: Date.now(),
      runId: get().certificate || get().fight.attacks ? crypto.randomUUID() : get().runId,
      certificate: null,
      delivery: 'idle',
      line: 'Pick your weapon. Aim at the ego.',
    }),
  setWeapon: (weapon) => set({ weapon, lastInputAt: Date.now() }),
  makeCertificate: (kind, sentence) => {
    const s = get();
    set({
      scene: 'certificate',
      busy: false,
      certificate: {
        kind,
        name: s.name.trim() || 'ANONYMOUS HERO',
        stats: reportStats(),
        sentence,
        serial: `HRR-${new Date().getFullYear()}-${s.runId.slice(0, 4).toUpperCase()}`,
        date: new Intl.DateTimeFormat('en-IN', {
          dateStyle: 'medium',
          timeZone: 'Asia/Kolkata',
        }).format(new Date()),
        compliments: s.selectedCompliments,
      },
    });
  },
}));
export function reportStats(): ReportStats {
  const s = useGame.getState(),
    f = s.fight;
  return {
    attacks: f.attacks,
    ultimates: f.ultimates,
    crits: f.crits,
    maxCombo: f.maxCombo,
    accuracy: f.attacks ? f.hits / f.attacks : 0,
    score: score(f),
    durationMs: Date.now() - s.startedAt,
    round: s.round,
    visitN: s.visitN,
    ttfhMs: f.firstHitAt ? f.firstHitAt - s.landedAt : 0,
    weaponFavourite: favourite(f),
    shared: false,
  };
}

export function restoreSettings() {
  useGame.setState({
    settings: read<Settings>('hrr:v1:settings', {
      ...settings,
      motion: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'calm' : 'full',
      lite: (navigator.hardwareConcurrency || 8) <= 4,
    }),
  });
}
