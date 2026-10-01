import { describe, it, expect } from 'vitest';
import {
  freshFight,
  resolveAttack,
  comboName,
  createDeck,
  hitZone,
  score,
  type Hit,
} from '../web/src/engine/game';
import type { AttackId } from '../shared/contracts';
const history = (ids: AttackId[]): Hit[] =>
  ids.map((id, i) => ({ id, at: 1000 + i * 300, side: i % 2 ? 'right' : 'left', hit: true }));
describe('combat rules', () => {
  it.each([
    [0, 0],
    [1, 25],
    [2, 60],
    [3, 100],
  ] as const)('anger %i seeds %i rage', (level, rage) => expect(freshFight(level).rage).toBe(rage));
  it('applies zone and combo multipliers once', () => {
    const r = resolveAttack(freshFight(0), 'slap', 'glasses', 1000, 'left', () => 0.5)!;
    expect(r.damage).toBe(11);
    expect(r.next.ego).toBe(89);
    expect(r.next.attacks).toBe(1);
    expect(r.next.rage).toBe(8);
    expect(r.first).toBe(true);
  });
  it('misses count toward accuracy but award neither damage nor rage', () => {
    const r = resolveAttack(freshFight(1), 'tomato', null, 1000, 'left', () => 0.5)!;
    expect(r.next.hits).toBe(0);
    expect(r.next.attacks).toBe(1);
    expect(r.next.rage).toBe(25);
    expect(r.damage).toBe(0);
  });
  it('cannot spend rage it does not have', () =>
    expect(resolveAttack(freshFight(0), 'thunder', 'torso', 1000, 'left')).toBeNull());
  it('thunder consumes 100 rage and guarantees a crit', () => {
    const r = resolveAttack(freshFight(3), 'thunder', 'torso', 1000, 'left', () => 0.99)!;
    expect(r.crit).toBe(true);
    expect(r.next.rage).toBe(0);
    expect(r.next.ultimates).toBe(1);
  });
  it('sleep hit stacks guaranteed crit and sleep multiplier', () => {
    const f = { ...freshFight(0), asleep: true };
    const r = resolveAttack(f, 'slap', 'cheeks', 1000, 'left', () => 0)!;
    expect(r.damage).toBe(24);
    expect(r.next.asleep).toBe(false);
    expect(r.comboName).toBe('SLEEPING BEAUTY');
  });
  it('stun gives the next hit a damage bonus', () => {
    const f = { ...freshFight(0), stunnedUntil: 2000 };
    expect(resolveAttack(f, 'punch', 'cheeks', 1000, 'left', () => 0.5)!.damage).toBe(13);
  });
  it('KO clamps ego and rejects further damage', () => {
    const r = resolveAttack(
      { ...freshFight(0), ego: 1 },
      'slap',
      'glasses',
      1000,
      'left',
      () => 0.5,
    )!;
    expect(r.ko).toBe(true);
    expect(r.next.ego).toBe(0);
    expect(resolveAttack(r.next, 'slap', 'glasses', 2000, 'left')).toBeNull();
  });
  it('breaks an expired combo', () => {
    const a = resolveAttack(freshFight(0), 'tomato', 'torso', 1000, 'left', () => 0.5)!;
    const b = resolveAttack(a.next, 'tomato', 'torso', 4000, 'left', () => 0.5)!;
    expect(b.next.combo).toBe(1);
  });
  it.each([
    ['HAT-TRICK', ['slap', 'punch', 'tomato']],
    ['DESI MOM SPECIAL', ['chappal', 'slap', 'emotional']],
    ['SALAD', ['tomato', 'tomato', 'tomato']],
    ['BONK-A-DOODLE', ['bonk', 'bonk', 'bonk', 'bonk', 'bonk']],
    ['FULL SET', ['slap', 'punch', 'bonk', 'tomato', 'chappal', 'roast']],
    ['SLAP SANDWICH', ['slap', 'slap']],
  ] as [string, AttackId[]][])('recognises %s', (name, ids) =>
    expect(comboName(history(ids))).toBe(name),
  );
  it('computes the score from damage, ultimates, crits, max combo and anger', () =>
    expect(score({ ...freshFight(2), damage: 80, ultimates: 1, crits: 2, maxCombo: 4 })).toBe(320));
  it.each([
    [220, 90, 'hair'],
    [220, 130, 'forehead'],
    [175, 175, 'glasses'],
    [220, 210, 'nose'],
    [150, 240, 'cheeks'],
    [220, 340, 'torso'],
    [5, 5, null],
  ] as const)('maps (%i,%i) to %s', (x, y, zone) => expect(hitZone(x, y)).toBe(zone));
});
describe('dialogue deck', () => {
  it('exhausts each deck and never repeats across shuffles', () => {
    const next = createDeck(['a', 'b', 'c', 'd']);
    let previous = '';
    for (let run = 0; run < 50; run++) {
      const values = [];
      for (let i = 0; i < 4; i++) {
        const v = next();
        expect(v).not.toBe(previous);
        previous = v;
        values.push(v);
      }
      expect(new Set(values).size).toBe(4);
    }
  });
});
