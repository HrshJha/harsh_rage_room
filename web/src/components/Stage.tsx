import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { HarshRig, type Expression } from './HarshRig';
import { WeaponArt } from './WeaponArt';
import { useGame } from '../core/store';
import { hitZone, resolveAttack, weaponById, createDeck } from '../engine/game';
import { audio } from '../engine/audio';
import { Particles } from '../engine/particles';
import { events } from '../core/events';
import content from '../content/dialogue.json';
import type { AttackId, ZoneId } from '../../../shared/contracts';
export interface StageHandle {
  attack: (zone?: ZoneId, roastText?: string) => void;
  cancel: () => void;
}
const reactionDeck = createDeck(content.reactions),
  announcerDeck = createDeck(content.announcer);
export const Stage = forwardRef<StageHandle, { onRoast: () => void }>(({ onRoast }, ref) => {
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    prop = useRef<HTMLDivElement>(null),
    text = useRef<HTMLDivElement>(null),
    tl = useRef<gsap.core.Timeline | null>(null),
    particles = useRef<Particles | null>(null),
    buffer = useRef<{ x: number; y: number; at: number; zone?: ZoneId; roastText?: string } | null>(
      null,
    ),
    lastFlash = useRef(0),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    activeAttack = useRef<AttackId>('slap'),
    hitstopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fight = useGame((s) => s.fight),
    settings = useGame((s) => s.settings),
    weapon = useGame((s) => s.weapon),
    busy = useGame((s) => s.busy);
  const hold = useRef(false),
    holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    inputTimes = useRef<number[]>([]);
  const [rain, setRain] = useState(false),
    [pile, setPile] = useState(0);
  const [expression, setExpression] = useState<Expression>('smug'),
    [bubble, setBubble] = useState('Go on. I can take it.'),
    [impact, setImpact] = useState({ word: '', damage: 0, crit: false }),
    [activeWeapon, setActiveWeapon] = useState<AttackId>('slap');
  const lastAttack = useRef({ at: 0, id: 'slap' as AttackId, count: 0 });
  const cancel = () => {
    audio.cancelAttack();
    tl.current?.kill();
    tl.current = null;
    if (timer.current) clearTimeout(timer.current);
    if (hitstopTimer.current) clearTimeout(hitstopTimer.current);
    buffer.current = null;
    hold.current = false;
    if (holdTimer.current) clearTimeout(holdTimer.current);
    useGame.setState({ busy: false });
    if (host.current) gsap.killTweensOf(host.current.querySelectorAll('*'));
  };
  const attack = (x = 220, y = 178, forcedZone?: ZoneId, submittedRoast?: string) => {
    const s = useGame.getState(),
      w = weaponById[s.weapon];
    if (s.scene !== 'room' || s.fight.ego <= 0) return;
    if (w.cost > s.fight.rage) {
      useGame.setState({
        line: `${w.short} needs ${w.cost}% rage. A few more basics should do it.`,
      });
      return;
    }
    if (s.weapon === 'roast' && !submittedRoast?.trim()) {
      onRoast();
      return;
    }
    if (s.busy) {
      buffer.current = { x, y, at: Date.now(), zone: forcedZone, roastText: submittedRoast };
      if (
        ['slap', 'tomato'].includes(activeAttack.current) &&
        ['slap', 'tomato'].includes(s.weapon) &&
        tl.current &&
        tl.current.time() > weaponById[activeAttack.current].impact / 1000 + 0.09
      )
        tl.current.progress(1);
      return;
    }
    const root = host.current;
    if (!root || !prop.current) return;
    const id = s.weapon,
      variant = Math.floor(Math.random() * 3),
      golden = id === 'chappal' && Math.random() < 0.02,
      zone = forcedZone || (id === 'emotional' ? 'torso' : hitZone(x, y)),
      side = x < 220 ? 'left' : 'right',
      calm = s.settings.motion === 'calm',
      gentle = s.settings.gentle,
      p = prop.current,
      head = root.querySelector('#head'),
      body = root.querySelector('#harsh-root'),
      glass = root.querySelector('#glasses'),
      flash = root.querySelector('.stage-flash'),
      hitText = text.current;
    useGame.setState({ busy: true, lastInputAt: Date.now() });
    setExpression('nervous');
    setActiveWeapon(id);
    activeAttack.current = id;
    gsap.killTweensOf([head, glass]);
    gsap.set(head, { rotation: 0, scaleX: 1, scaleY: 1 });
    setImpact({ word: '', damage: 0, crit: false });
    audio.attackStart(id);
    const rect = root.getBoundingClientRect(),
      svg = root.querySelector('.harsh-rig') as SVGSVGElement,
      point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    const matrix = svg.getScreenCTM(),
      screen = matrix
        ? point.matrixTransform(matrix)
        : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const px = screen.x - rect.left,
      py = screen.y - rect.top;
    gsap.set(p, { x: px - 65, y: py - 65, opacity: 0, scale: 0.2, rotation: 0 });
    gsap.set(hitText, { opacity: 0, scale: 0.2, rotation: 0 });
    const finish = () => {
      if (!host.current) return;
      delete root.dataset.attack;
      useGame.setState({ busy: false });
      const f = useGame.getState().fight;
      setExpression(f.ego <= 0 ? 'ko' : f.ego < 30 ? 'nervous' : 'smug');
      if (f.ego <= 0) {
        setBubble('I demand a recount.');
        audio.win();
        timer.current = setTimeout(() => useGame.getState().setScene('verdict'), 1100);
        return;
      }
      const b = buffer.current;
      buffer.current = null;
      if (b && Date.now() - b.at <= 250)
        queueMicrotask(() => attack(b.x, b.y, b.zone, b.roastText));
    };
    const t = gsap.timeline({ onComplete: finish });
    tl.current = t;
    root.dataset.attack = id;
    root.dataset.golden = String(golden);
    if (calm) {
      t.to(p, { opacity: 1, scale: 0.85, duration: 0.12 }).to(p, { scale: 1, duration: 0.08 });
    } else if (id === 'chappal' || id === 'tomato') {
      t.fromTo(
        p,
        {
          x: id === 'chappal' ? -80 : rect.width * 0.3,
          y: rect.height - 20,
          scale: 0.4,
          rotation: -100,
          opacity: 1,
        },
        {
          x: px - 65,
          y: py - 180,
          scale: 1,
          rotation: id === 'chappal' ? 540 : 80,
          duration: w.impact / 1600,
          ease: 'power2.out',
        },
      ).to(p, {
        y: py - 65,
        rotation: id === 'chappal' ? 780 : 150,
        duration: w.impact / 2700,
        ease: 'power2.in',
      });
    } else if (id === 'emotional') {
      setBubble('Sharma ji ka beta got HOW MUCH?');
      t.to(body, { scale: gentle ? 1 : 1.06, duration: 0.12 }, 0.3)
        .to(body, { scale: gentle ? 1 : 1.12, duration: 0.12 }, 0.55)
        .to(body, { scale: gentle ? 1 : 1.18, duration: 0.12 }, 0.8)
        .to(p, { opacity: 1, scale: 1.25, duration: 0.2 }, 1.1);
    } else if (id === 'thunder') {
      t.to(p, { opacity: 1, scale: 0.75, rotation: -12, duration: 0.8 }).to(p, {
        scale: 2,
        rotation: 10,
        duration: 0.2,
        ease: 'expo.in',
      });
    } else {
      const fromX = id === 'bonk' ? 0 : side === 'left' ? -140 : 140;
      const fromY = id === 'bonk' ? -170 : 30;
      t.fromTo(
        p,
        {
          x: px - 65 + fromX,
          y: py - 65 + fromY,
          opacity: 1,
          scale: 0.8,
          rotation: side === 'left' ? -25 : 25,
        },
        { x: px - 65 + fromX * 1.15, y: py - 65 + fromY * 1.1, scale: 0.92, duration: 0.12 },
      ).to(p, {
        x: px - 65,
        y: py - 65,
        scale: 1.1,
        rotation: id === 'slap' && variant === 2 ? 360 : 0,
        duration: 0.08,
        ease: 'power4.in',
      });
    }
    if (id === 'thunder' && hold.current) {
      t.call(
        () => {
          if (hold.current) {
            t.pause();
            holdTimer.current = setTimeout(() => t.resume(), 300);
          }
        },
        undefined,
        0.9,
      );
    }
    t.call(
      () => {
        const current = useGame.getState(),
          r = resolveAttack(
            current.fight,
            id,
            zone,
            Date.now(),
            side,
            golden ? () => 0 : Math.random,
          );
        if (!r) return;
        if (id === 'chappal' && r.hit) setPile((n) => Math.min(6, n + 1));
        useGame.setState({
          fight: r.next,
          line: r.comboName
            ? `${r.comboName}! This is going on your permanent record.`
            : announcerDeck(),
        });
        events.emit({
          type: 'attack',
          attack: id,
          zone,
          damage: r.damage,
          crit: r.crit,
          hit: r.hit,
          comboName: r.comboName,
          first: r.first,
          ko: r.ko,
          roastText: id === 'roast' ? submittedRoast : undefined,
          occurredAt: new Date().toISOString(),
        });
        if (!r.hit) {
          setBubble('…you missed a stationary person.');
          setImpact({ word: 'WHOOPS.', damage: 0, crit: false });
          audio.miss();
        } else {
          audio.hit(id, r.crit, (x - 220) / 220);
          if (!calm) {
            t.pause();
            particles.current?.pause(true);
            hitstopTimer.current = setTimeout(
              () => {
                if (!document.hidden) {
                  t.resume();
                  particles.current?.pause(false);
                }
              },
              r.ko ? 180 : r.crit ? 110 : 65,
            );
          }
          setExpression('hit');
          setBubble(reactionDeck());
          setImpact({ word: r.ko ? 'K.O.' : weaponById[id].word, damage: r.damage, crit: r.crit });
          particles.current?.burst(px, py, w.color, r.ko ? 60 : r.crit ? 32 : 18);
          if (current.settings.haptics && navigator.vibrate)
            navigator.vibrate(id === 'thunder' ? 80 : 15);
          if (!calm) {
            gsap.fromTo(
              head,
              { rotation: 0, scaleX: 1, scaleY: 1 },
              {
                rotation: (side === 'left' ? 1 : -1) * (14 + variant * 7),
                scaleX: id === 'bonk' ? 0.9 : 1.12 + variant * 0.06,
                scaleY: id === 'bonk' ? 0.7 : 0.85,
                duration: 0.06,
                transformOrigin: '50% 80%',
                onComplete: () => {
                  gsap.to(head, {
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.42,
                    ease: 'elastic.out(1,.35)',
                  });
                },
              },
            );
            if (id === 'punch' && y > 200 && !r.ko)
              gsap.to(body, { y: -45, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
            if (zone === 'glasses')
              gsap.fromTo(
                glass,
                { y: 0, rotation: 0 },
                {
                  y: -30,
                  rotation: side === 'left' ? 20 : -20,
                  duration: 0.2,
                  yoyo: true,
                  repeat: 1,
                },
              );
            gsap.fromTo(
              root.querySelector('.rig-wrap'),
              { x: 0 },
              {
                x: side === 'left' ? 8 : -8,
                duration: 0.04,
                yoyo: true,
                repeat: 3,
                clearProps: 'x',
              },
            );
          }
          if (
            !calm &&
            !current.settings.gentle &&
            ['punch', 'thunder'].includes(id) &&
            Date.now() - lastFlash.current > 750
          ) {
            lastFlash.current = Date.now();
            gsap.fromTo(flash, { opacity: 0.65 }, { opacity: 0, duration: 0.15 });
          }
          const svgLayer = root.querySelector('#decal-layer');
          if (svgLayer && ['slap', 'tomato', 'chappal'].includes(id)) {
            const decal = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            decal.setAttribute(
              'transform',
              `translate(${Math.max(136, Math.min(304, x))} ${Math.max(120, Math.min(380, y))}) rotate(${Math.random() * 60 - 30})`,
            );
            decal.setAttribute('opacity', '.7');
            if (id === 'tomato') {
              decal.innerHTML =
                '<path d="M-21-7Q-32-27-8-20L0-31 10-19Q39-21 24-4L32 9 14 16 7 32-5 18-28 22-21 5Z" fill="#df4c43" stroke="none"/><path d="M0 10v28" stroke="#df4c43" stroke-width="5" stroke-linecap="round"/>';
            } else {
              decal.innerHTML =
                '<ellipse rx="17" ry="13" fill="#e77d77" stroke="none"/><path d="m-12-3-4-18m12 14-2-22m10 22 2-20m5 21 5-16" stroke="#e77d77" stroke-width="5"/>';
            }
            svgLayer.appendChild(decal);
            while (svgLayer.children.length > (current.settings.lite ? 6 : 12))
              svgLayer.firstElementChild?.remove();
          }
          if (r.ko && !calm)
            gsap.to(body, {
              rotation: -75,
              y: 90,
              x: -30,
              duration: 0.65,
              ease: 'bounce.out',
              transformOrigin: '50% 90%',
            });
        }
        gsap.fromTo(
          hitText,
          { opacity: 0, scale: 1.8, rotation: -9 },
          { opacity: 1, scale: 1, rotation: -5, duration: calm ? 0.12 : 0.18, ease: 'back.out(2)' },
        );
        if (r.comboName) audio.combo();
        const last = lastAttack.current;
        lastAttack.current = {
          at: Date.now(),
          id,
          count: last.id === id && Date.now() - last.at < 1500 ? last.count + 1 : 1,
        };
      },
      undefined,
      calm ? 0.2 : w.impact / 1000,
    );
    t.to(
      p,
      { opacity: 0, scale: id === 'chappal' ? 0.8 : 1.3, y: py + 40, duration: 0.24 },
      calm ? 0.28 : w.impact / 1000 + 0.1,
    );
    t.to(
      hitText,
      { opacity: 0, scale: 0.95, duration: 0.2 },
      calm ? 0.68 : Math.max(0.65, w.duration / 1000 - 0.2),
    );
    if (id === 'emotional') t.to(body, { scale: 1, duration: 0.35 }, 2.8);
    if (id === 'thunder' && !calm)
      t.to(body, { y: -120, rotation: 8, duration: 0.35, ease: 'power3.out' }, 1.2).to(
        body,
        { y: 0, rotation: 0, duration: 0.5, ease: 'bounce.out' },
        1.65,
      );
  };
  useImperativeHandle(ref, () => ({
    attack: (zone, roastText) => attack(220, 178, zone || 'glasses', roastText),
    cancel,
  }));
  useEffect(() => {
    if (!canvas.current || !host.current) return;
    const p = new Particles(
      canvas.current,
      () => useGame.getState().settings.lite,
      () => useGame.getState().setSettings({ lite: true }),
    );
    particles.current = p;
    const observer = new ResizeObserver(() => p.resize());
    observer.observe(host.current);
    const visibility = () => {
      p.pause(document.hidden);
      if (document.hidden) {
        tl.current?.pause();
        audio.suspend();
      } else {
        tl.current?.resume();
        audio.resume();
        useGame.setState({ lastInputAt: Date.now() });
      }
    };
    document.addEventListener('visibilitychange', visibility);
    const idle = setInterval(() => {
      const s = useGame.getState();
      if (s.busy || s.fight.ego <= 0 || document.hidden) return;
      const elapsed = Date.now() - s.lastInputAt;
      if (elapsed > 15000 && !s.fight.asleep) {
        useGame.setState({ fight: { ...s.fight, asleep: true } });
        setExpression('asleep');
        setBubble('Zzz… wake me when you’re interesting.');
      } else if (elapsed > 8000 && !s.fight.asleep) {
        setBubble('So… are we doing this or what?');
      } else if (s.settings.motion !== 'calm' && host.current) {
        const rig = host.current;
        gsap.to(rig.querySelector('#head'), {
          rotation: (Math.random() - 0.5) * 5,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
        });
        gsap.to(rig.querySelectorAll('.pupil'), {
          x: (Math.random() - 0.5) * 6,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        });
      }
    }, 1500);
    return () => {
      cancel();
      p.destroy();
      observer.disconnect();
      clearInterval(idle);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return (
    <div
      ref={host}
      className={`stage ${settings.motion === 'calm' ? 'stage-calm' : ''}`}
      data-testid="stage"
      aria-busy={busy}
      onPointerUp={() => {
        hold.current = false;
        if (holdTimer.current) clearTimeout(holdTimer.current);
        tl.current?.resume();
      }}
      onPointerCancel={() => {
        hold.current = false;
        tl.current?.resume();
      }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        hold.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        const now = Date.now();
        inputTimes.current = [...inputTimes.current.filter((t) => now - t < 1000), now];
        if (useGame.getState().weapon === 'tomato' && inputTimes.current.length >= 3) {
          setRain(true);
          inputTimes.current = [];
        }
        const svg = host.current?.querySelector('.harsh-rig') as SVGSVGElement | undefined;
        if (!svg) return;
        const m = svg.getScreenCTM();
        if (!m) return;
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const local = point.matrixTransform(m.inverse());
        attack(local.x, local.y);
      }}
    >
      <div className="stage-topline">
        <span>THE EGO HAS LANDED</span>
        <span className="live-pill">
          <i /> LIVE & VERY PERSONAL
        </span>
      </div>
      <div className="arena-word" aria-hidden="true">
        LET IT OUT.
      </div>
      <div className="stage-rays" />
      <div className="floor-lines" />
      <div className="speech-bubble">{bubble}</div>
      <div className="rig-wrap">
        <HarshRig expression={expression} ego={fight.ego} />
      </div>
      <div className="chappal-pile" aria-hidden="true">
        {Array.from({ length: pile }, (_, i) => (
          <div
            key={i}
            style={{
              transform: `translate(${i * 13}px, ${-(i % 3) * 5}px) rotate(${i * 27 - 35}deg)`,
            }}
          >
            <WeaponArt id="chappal" />
          </div>
        ))}
      </div>
      {rain && (
        <div className="tomato-rain" onAnimationEnd={() => setRain(false)} aria-hidden="true">
          {Array.from({ length: settings.lite ? 4 : 12 }, (_, i) => (
            <div key={i} style={{ left: `${i * 8}%`, animationDelay: `${i * 0.06}s` }}>
              <WeaponArt id="tomato" />
            </div>
          ))}
        </div>
      )}
      <div className="emotional-prop" aria-hidden="true">
        <span>SHARMA JI’S BETA</span>
        <strong>9.9</strong>
        <small>FICTIONAL EGO SCORE</small>
      </div>
      <div className="soul-prop" aria-hidden="true">
        <svg viewBox="0 0 80 90">
          <path
            d="M12 75V38q0-32 28-32t28 32v37L57 65 46 79 34 66 23 79Z"
            fill="#f4eee3"
            fillOpacity=".8"
            stroke="#45304f"
            strokeWidth="3"
          />
          <ellipse cx="30" cy="36" rx="5" ry="8" fill="#45304f" />
          <ellipse cx="51" cy="36" rx="5" ry="8" fill="#45304f" />
          <ellipse cx="40" cy="55" rx="7" ry="8" fill="#45304f" />
        </svg>
      </div>
      <svg className="thunder-bolt" viewBox="0 0 100 200" aria-hidden="true">
        <path
          d="M63 0 16 88h39L28 200 91 72H59L82 0"
          fill="#e8ffa1"
          stroke="#382341"
          strokeWidth="3"
        />
      </svg>
      <div className="target-tag">
        <span className="target-dot" /> HARSH <small>SELF-PROCLAIMED NICE GUY</small>
      </div>
      <div className="attack-prop" ref={prop}>
        <WeaponArt id={activeWeapon} />
      </div>
      <div className={`impact-word ${impact.crit ? 'critical' : ''}`} ref={text}>
        <small>
          {impact.crit
            ? '★ CRITICAL HIT ★'
            : impact.damage
              ? `−${impact.damage} EGO`
              : 'A FOR EFFORT'}
        </small>
        <strong>{impact.word}</strong>
      </div>
      <div className="stage-flash" />
      <canvas ref={canvas} className="particle-canvas" aria-hidden="true" />
      <div className="stage-help">
        <span className="aim-mark">＋</span>{' '}
        {weaponById[weapon].cost
          ? 'Tap to unleash. Brace for drama.'
          : 'Tap Harsh to hit. Aim for the glasses.'}
      </div>
    </div>
  );
});
Stage.displayName = 'Stage';
