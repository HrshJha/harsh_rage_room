import gsap from 'gsap';
import type { AttackId } from '../../../shared/contracts';
import { weaponById } from './game';

export type Contact = { hit: boolean; ko: boolean; crit: boolean; combo: number };
export interface AttackMotion {
  root: HTMLElement;
  id: AttackId;
  x: number;
  y: number;
  direction: number;
  variant: number;
  calm: boolean;
  gentle: boolean;
  chain: number;
  contact: () => Contact | null;
  recovery: () => void;
  complete: () => void;
}

// All action motion lives on one cancellable timeline. Contact is a single marker:
// game damage, notification, sound, pose and stage lighting share that instant.
export function choreograph(a: AttackMotion) {
  const { root, id, x, y, direction: d, variant: v, calm, gentle } = a;
  const q = (selector: string) => root.querySelector(selector)!;
  const prop = q('.attack-prop'),
    head = q('#head'),
    body = q('#harsh-root');
  const face = q('#face'),
    glasses = q('#glasses'),
    arms = root.querySelectorAll('#arm-l, #arm-r');
  const camera = q('.stage-camera'),
    light = q('.impact-light'),
    graphic = q('.impact-graphic');
  const word = q('.impact-text'),
    quote = q('.roast-lettering'),
    stars = q('.orbit-stars');
  const physical = id !== 'roast' && id !== 'emotional';
  const pace = calm ? 1 : 1 + Math.min(a.chain, 5) * 0.025;
  const at = calm ? 0.2 : weaponById[id].impact / 1000;
  const stop = calm ? 0 : id === 'thunder' ? 0.075 : id === 'punch' ? 0.065 : 0.045;
  const recover = at + stop;
  const duration = calm ? (physical ? 0.65 : 1.7) : weaponById[id].duration / 1000;
  const t = gsap.timeline({ paused: true, onComplete: a.complete }).timeScale(pace);
  gsap.set([head, body, face, glasses, arms], { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
  gsap.set(head, { transformOrigin: '50% 84%' });
  gsap.set(body, { transformOrigin: '50% 95%' });
  gsap.set(arms, { transformOrigin: '50% 8%' });
  gsap.set(face, { transformOrigin: '50% 50%' });
  gsap.set(camera, { x: 0, y: 0, rotation: 0, scale: 1 });
  gsap.set(prop, { x: x - 70, y: y - 70, opacity: 0, scale: 1, rotation: 0 });
  gsap.set([word, graphic, light, stars], { opacity: 0 });
  gsap.set(graphic, { x: x - 110, y: y - 110, scale: 0.3, rotation: v * 17 });
  gsap.set(quote, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 });
  root.dataset.phase = 'anticipation';
  if (calm) {
    if (physical) t.to(prop, { opacity: 1, duration: 0.12 }, 0);
    else t.to(quote, { opacity: 1, duration: 0.15 }, 0);
  } else {
    t.to(
      head,
      { rotation: -d * 5, y: -3, duration: Math.min(at * 0.6, 0.2), ease: 'power2.out' },
      0,
    );
    t.to(arms, { rotation: (id === 'bonk' ? -1 : d) * 8, duration: 0.15 }, 0);
    switch (id) {
      case 'slap':
        t.fromTo(
          prop,
          { x: x + d * 230 - 70, y: y - 10, rotation: d * 42, scale: 0.85, opacity: 1 },
          { x: x + d * 255 - 70, y: y - 40, rotation: d * 58, duration: 0.12, ease: 'power2.out' },
          0,
        ).to(
          prop,
          {
            x: x - 70,
            y: y - 70,
            rotation: -d * 24,
            scale: 1.3,
            duration: at - 0.12,
            ease: 'expo.in',
          },
          0.12,
        );
        break;
      case 'punch':
        t.fromTo(
          prop,
          { x: x + d * 150 - 70, y: y + 110, scale: 0.6, rotation: -d * 35, opacity: 1 },
          { x: x + d * 200 - 70, y: y + 125, scale: 0.75, duration: at - 0.11, ease: 'power2.out' },
          0,
        ).to(
          prop,
          {
            x: x - 70,
            y: y - 70,
            scale: 1.55,
            rotation: d * 12,
            duration: 0.11,
            ease: 'power4.in',
          },
          at - 0.11,
        );
        break;
      case 'chappal':
        t.fromTo(
          prop,
          { x: x - d * 330 - 70, y: y + 120, scale: 0.65, rotation: -d * 80, opacity: 1 },
          {
            x: x - d * 160 - 70,
            y: y - 210 - v * 15,
            scale: 1,
            rotation: d * (180 + v * 90),
            duration: at * 0.62,
            ease: 'power2.out',
          },
          0,
        ).to(prop, {
          x: x - 70,
          y: y - 70,
          rotation: d * (360 + v * 180),
          scaleX: 1.1,
          scaleY: 1.2,
          duration: at * 0.38,
          ease: 'power3.in',
        });
        break;
      case 'bonk':
        t.fromTo(
          prop,
          { x: x - 70, y: y - 250, rotation: -22, opacity: 1 },
          { y: y - 270, rotation: 18, duration: 0.14, ease: 'power2.out' },
          0,
        )
          .to(prop, { rotation: 12, duration: at - 0.23 }, 0.14)
          .to(
            prop,
            { y: y - 70, rotation: -10, scaleY: 1.3, duration: 0.09, ease: 'power4.in' },
            at - 0.09,
          );
        break;
      case 'tomato':
        t.fromTo(
          prop,
          { x: x - d * 260 - 70, y: y + 100, scale: 0.5, rotation: -50, opacity: 1 },
          {
            x: x - d * 100 - 70,
            y: y - 160,
            scale: 0.9,
            rotation: 70,
            duration: at * 0.65,
            ease: 'power2.out',
          },
          0,
        ).to(prop, {
          x: x - 70,
          y: y - 70,
          scaleX: 0.8,
          scaleY: 1.25,
          rotation: 130,
          duration: at * 0.35,
          ease: 'power3.in',
        });
        break;
      case 'thunder':
        t.fromTo(
          prop,
          { x: x + d * 180 - 70, y: y + 90, scale: 0.7, rotation: -d * 30, opacity: 1 },
          { x: x + d * 205 - 70, y: y + 100, scale: 1.05, duration: at - 0.12, ease: 'power2.in' },
          0,
        )
          .to(light, { opacity: gentle ? 0.1 : 0.4, duration: at - 0.12 }, 0)
          .to(
            prop,
            { x: x - 70, y: y - 70, scale: 1.8, rotation: d * 8, duration: 0.12, ease: 'expo.in' },
            at - 0.12,
          );
        break;
      case 'roast':
        t.fromTo(
          quote,
          { opacity: 0, y: 35, rotation: -3, scale: 0.94 },
          { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.22, ease: 'power3.out' },
          0,
        ).to(head, { rotation: 6, y: 8, duration: 0.22, ease: 'power2.inOut' }, 0.25);
        break;
      case 'emotional':
        t.fromTo(
          quote,
          { opacity: 0, scale: 1.1, y: -20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25 },
          0,
        )
          .to(head, { rotation: -7, y: 10, duration: 0.22 }, 0.3)
          .to(body, { scaleY: 0.94, duration: 0.2 }, 0.55);
        break;
    }
  }
  t.call(
    () => {
      root.dataset.phase = 'launch';
    },
    undefined,
    Math.max(0.1, at - 0.12),
  );
  t.call(
    () => {
      root.dataset.phase = 'contact';
      const result = a.contact();
      root.dataset.result = result?.hit ? 'hit' : 'miss';
      if (!result?.hit) return;
      const strength = gentle ? 0.45 : 1;
      const poses: Record<
        AttackId,
        { rotation: number; x: number; y: number; scaleX: number; scaleY: number }
      > = {
        slap: { rotation: -d * (22 + v * 5), x: -d * 16, y: 2, scaleX: 0.85, scaleY: 1.06 },
        punch: { rotation: -d * 18, x: -d * 13, y: -16, scaleX: 1.08, scaleY: 0.87 },
        chappal: { rotation: d * (16 + v * 5), x: d * 14, y: 8, scaleX: 1.12, scaleY: 0.85 },
        bonk: { rotation: 3, x: 0, y: 20, scaleX: 1.22, scaleY: 0.72 },
        tomato: { rotation: -d * 10, x: -d * 8, y: -8, scaleX: 0.94, scaleY: 1.04 },
        roast: { rotation: -8, x: 0, y: 22, scaleX: 1, scaleY: 1 },
        thunder: { rotation: -d * 27, x: -d * 22, y: -20, scaleX: 1.1, scaleY: 0.82 },
        emotional: { rotation: 12, x: 0, y: 20, scaleX: 1, scaleY: 0.95 },
      };
      if (!calm) {
        const pose = poses[id];
        gsap.set(head, { ...pose, rotation: pose.rotation * strength });
        gsap.set(body, {
          rotation: id === 'punch' || id === 'thunder' ? -d * 10 * strength : 0,
          scaleY: id === 'bonk' ? 0.9 : 1,
        });
        gsap.set(face, { scaleX: id === 'slap' ? 0.88 : 1 });
        gsap.set(glasses, { rotation: d * (id === 'bonk' ? 12 : 7), y: id === 'punch' ? -12 : 3 });
        gsap.set(camera, {
          x: physical ? -d * (id === 'thunder' ? 10 : 5) * strength : 0,
          y: id === 'bonk' ? 7 * strength : 0,
        });
      }
    },
    undefined,
    at,
  );
  t.set(word, { opacity: 1, scale: calm ? 1 : 1.35, rotation: physical ? -7 : 0 }, at).to(
    word,
    { scale: 1, duration: 0.16, ease: 'back.out(2)' },
    recover,
  );
  if (physical) {
    t.set(graphic, { opacity: 1, scale: calm ? 0.65 : 0.85 }, at).to(
      graphic,
      { scale: calm ? 0.8 : 1.35, opacity: 0, duration: 0.3 },
      recover,
    );
  }
  if (!calm) {
    t.set(light, { opacity: gentle ? 0.1 : id === 'thunder' ? 0.55 : 0.23 }, at).to(
      light,
      { opacity: 0, duration: 0.35 },
      recover,
    );
    t.to(
      camera,
      {
        x: d * (gentle ? 1 : 3),
        y: 0,
        duration: 0.035,
        repeat: id === 'thunder' ? 3 : 1,
        yoyo: true,
      },
      recover,
    ).to(camera, { x: 0, y: 0, duration: 0.09 }, recover + 0.16);
    switch (id) {
      case 'slap':
        t.to(
          prop,
          {
            x: x - d * 150 - 70,
            y: y - 100,
            rotation: -d * 65,
            opacity: 0,
            duration: 0.18,
            ease: 'power2.out',
          },
          recover,
        );
        t.to(head, { rotation: d * 10, x: d * 5, scaleX: 1, scaleY: 1, duration: 0.16 }, recover);
        break;
      case 'punch':
        t.to(
          prop,
          {
            x: x + d * 160 - 70,
            y: y + 130,
            scale: 0.65,
            opacity: 0,
            duration: 0.26,
            ease: 'power3.in',
          },
          recover,
        );
        t.to(body, { x: -d * 15, y: -12, rotation: -d * 12, duration: 0.15 }, recover);
        break;
      case 'chappal':
        t.to(
          prop,
          {
            x: x + d * 150 - 70,
            y: y - 190,
            rotation: d * (650 + v * 180),
            scale: 0.8,
            duration: 0.19,
            ease: 'power2.out',
          },
          recover,
        ).to(prop, {
          x: x + d * 250,
          y: y + 170,
          rotation: d * 900,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
        break;
      case 'bonk':
        t.to(
          prop,
          { y: y - 170, rotation: 30, scaleY: 1, duration: 0.18, ease: 'power3.out' },
          recover,
        ).to(prop, { y: y - 260, opacity: 0, duration: 0.2 }, recover + 0.2);
        t.set(stars, { opacity: 1, rotation: -12, scale: 0.8 }, recover)
          .to(stars, { rotation: 18, scale: 1.1, duration: 0.45, ease: 'sine.inOut' }, recover)
          .to(stars, { opacity: 0, duration: 0.2 }, duration - 0.2);
        t.to(head, { rotation: -12, scaleY: 1.08, scaleX: 0.96, duration: 0.15 }, recover).to(
          head,
          { rotation: 8, duration: 0.13 },
        );
        break;
      case 'tomato':
        t.set(prop, { scaleX: 1.9, scaleY: 0.4 }, at).to(
          prop,
          { opacity: 0, scale: 2.2, duration: 0.1 },
          recover,
        );
        t.to(arms, { rotation: 22, duration: 0.13 }, recover);
        break;
      case 'thunder':
        t.to(
          prop,
          { x: x - d * 220 - 70, y: y - 120, scale: 2.2, opacity: 0, duration: 0.15 },
          recover,
        );
        t.to(
          body,
          { y: -65, x: -d * 28, rotation: -d * 16, duration: 0.22, ease: 'power3.out' },
          recover,
        );
        break;
      case 'roast':
      case 'emotional':
        t.to(
          body,
          {
            y: 15,
            scaleY: 0.93,
            rotation: id === 'roast' ? -4 : 6,
            duration: 0.28,
            ease: 'power2.inOut',
          },
          recover,
        );
        t.to(arms, { rotation: id === 'roast' ? -18 : 20, duration: 0.28 }, recover);
        break;
    }
  } else t.to(prop, { opacity: 0, duration: 0.12 }, recover + 0.12);
  t.call(
    () => {
      root.dataset.phase = 'recovery';
      a.recovery();
    },
    undefined,
    recover + 0.24,
  );
  t.to(
    [head, face, glasses, arms],
    {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      duration: calm ? 0.15 : 0.35,
      ease: 'back.out(1.6)',
    },
    duration - 0.38,
  )
    .to(
      body,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: calm ? 0.15 : 0.38,
        ease: id === 'thunder' ? 'bounce.out' : 'power2.out',
      },
      duration - 0.38,
    )
    .to(word, { opacity: 0, duration: 0.15 }, duration - 0.15);
  return t;
}
