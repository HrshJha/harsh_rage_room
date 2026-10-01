import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { HarshRig, type Expression } from './HarshRig';
import { WeaponArt } from './WeaponArt';
import { useGame } from '../core/store';
import { hitZone, resolveAttack, weaponById, createDeck } from '../engine/game';
import { audio } from '../engine/audio';
import { Particles } from '../engine/particles';
import { choreograph } from '../engine/choreography';
import { events } from '../core/events';
import content from '../content/dialogue.json';
import type { AttackId, ZoneId } from '../../../shared/contracts';
export interface StageHandle {
  attack: (zone?: ZoneId, roastText?: string) => void;
  cancel: () => void;
}
type Input = { x: number; y: number; zone?: ZoneId; roast?: string; id: AttackId; at: number };
const reactionDeck = createDeck(content.reactions);
const reaction: Record<AttackId, Expression> = {
  slap: 'slapped',
  punch: 'punched',
  chappal: 'shocked',
  bonk: 'dazed',
  tomato: 'splatted',
  roast: 'roasted',
  thunder: 'shocked',
  emotional: 'roasted',
};
const recoveryLines: Record<AttackId, string[]> = {
  slap: [
    'That was my good side.',
    'Okay. Message received.',
    'Five stars. Zero consent from my ego.',
  ],
  punch: [
    'My confidence has a dent.',
    'That could have been an email.',
    'I felt that in my LinkedIn.',
  ],
  chappal: [
    'WHO GAVE YOU MOM’S AIM?',
    'That slipper has a return policy.',
    'Desi precision. International damage.',
  ],
  bonk: ['Rebooting common sense…', 'No thoughts. Just bonk.', 'Have you tried turning me off?'],
  tomato: [
    'Organic criticism. Great.',
    'My skincare routine is ruined.',
    'This is not farm-to-face.',
  ],
  roast: ['I need a minute.', 'Okay. That one was personal.', 'My therapist will hear about this.'],
  thunder: [
    'My ancestors felt that.',
    'I would like to unsubscribe.',
    'My ego is in another postcode.',
  ],
  emotional: ['Sharma ji wins again.', 'My confidence is buffering.', 'That hit the childhood.'],
};
export const Stage = forwardRef<StageHandle, { onRoast: () => void }>(({ onRoast }, ref) => {
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null),
    particles = useRef<Particles | null>(null);
  const pending = useRef<Input | null>(null),
    finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pile, setPile] = useState(0),
    [rain, setRain] = useState(false);
  const inputTimes = useRef<number[]>([]);
  const variant = useRef(0),
    generation = useRef(0);
  const fight = useGame((s) => s.fight),
    settings = useGame((s) => s.settings),
    busy = useGame((s) => s.busy);
  const [expression, setExpression] = useState<Expression>('smug');
  const [bubble, setBubble] = useState('Go on. Make it personal.');
  const [active, setActive] = useState<AttackId>('slap');
  const [quote, setQuote] = useState('');
  const [impact, setImpact] = useState({ word: '', damage: 0, combo: '', count: 0 });
  const [decals, setDecals] = useState<{ x: number; y: number; tomato: boolean; angle: number }[]>(
    [],
  );
  const cancel = () => {
    generation.current++;
    timeline.current?.kill();
    timeline.current = null;
    pending.current = null;
    if (finishTimer.current) clearTimeout(finishTimer.current);
    audio.cancelAttack();
    useGame.setState({ busy: false });
    if (host.current) {
      host.current.dataset.phase = 'idle';
      delete host.current.dataset.attack;
      gsap.killTweensOf(host.current.querySelectorAll('*'));
    }
  };
  const attack = (input: Input) => {
    const s = useGame.getState(),
      id = input.id;
    if (s.scene !== 'room' || s.fight.ego <= 0 || weaponById[id].cost > s.fight.rage) return;
    if (id === 'roast' && !input.roast?.trim()) {
      onRoast();
      return;
    }
    if (s.busy) {
      pending.current = input;
      return;
    }
    const root = host.current,
      svg = root?.querySelector('.harsh-rig') as SVGSVGElement | null;
    if (!root || !svg) return;
    timeline.current?.kill();
    const serial = ++generation.current,
      v = variant.current++ % 3;
    const zone = input.zone ?? (id === 'emotional' ? 'torso' : hitZone(input.x, input.y));
    const side = input.x < 220 ? 'left' : 'right';
    const point = svg.createSVGPoint();
    point.x = input.x;
    point.y = input.y;
    const matrix = svg.getScreenCTM(),
      screen = matrix ? point.matrixTransform(matrix) : null;
    const box = root.getBoundingClientRect();
    const px = screen ? screen.x - box.left : box.width / 2;
    const py = screen ? screen.y - box.top : box.height / 2;
    useGame.setState({ busy: true, lastInputAt: Date.now() });
    setActive(id);
    setExpression('nervous');
    setQuote(
      id === 'roast'
        ? input.roast!
        : id === 'emotional'
          ? 'Sharma ji ka beta already shipped it.'
          : '',
    );
    setImpact({ word: '', damage: 0, combo: '', count: 0 });
    root.dataset.attack = id;
    root.dataset.variant = String(v);
    audio.cancelAttack();
    audio.attackStart(id);
    let landed = false,
      knockout = false;
    const t = choreograph({
      root,
      id,
      x: px,
      y: py,
      direction: side === 'left' ? -1 : 1,
      variant: v,
      calm: s.settings.motion === 'calm',
      gentle: s.settings.gentle,
      chain: s.fight.combo,
      contact: () => {
        if (serial !== generation.current || landed) return null;
        landed = true;
        const current = useGame.getState();
        const golden = id === 'chappal' && Math.random() < 0.02;
        const result = resolveAttack(
          current.fight,
          id,
          zone,
          Date.now(),
          side,
          golden ? () => 0 : Math.random,
        );
        if (!result) return null;
        knockout = result.ko;
        if (id === 'chappal' && result.hit) setPile((n) => Math.min(6, n + 1));
        useGame.setState({
          fight: result.next,
          line: result.comboName
            ? `${result.comboName}. That was a statement.`
            : recoveryLines[id][v],
        });
        setExpression(result.hit ? reaction[id] : 'smug');
        setBubble(result.hit ? recoveryLines[id][v] : 'You missed. I’m literally standing here.');
        setImpact({
          word: result.ko ? 'EGO DELETED.' : result.hit ? weaponById[id].word : 'AIRBALL.',
          damage: result.damage,
          combo: result.comboName || (result.next.combo > 1 ? 'KEEP IT GOING' : ''),
          count: result.next.combo,
        });
        events.emit({
          type: 'attack',
          attack: id,
          zone,
          damage: result.damage,
          crit: result.crit,
          hit: result.hit,
          comboName: result.comboName,
          first: result.first,
          ko: result.ko,
          roastText: id === 'roast' ? input.roast : undefined,
          occurredAt: new Date().toISOString(),
        });
        if (result.hit) {
          audio.cancelAttack();
          audio.hit(id, result.crit, (input.x - 220) / 220);
          if (result.comboName) audio.combo();
          if (s.settings.motion !== 'calm')
            particles.current?.burst(
              px,
              py,
              weaponById[id].color,
              id === 'tomato' ? 28 : id === 'thunder' ? 32 : result.comboName ? 22 : 12,
              id === 'tomato' ? 'seed' : id === 'bonk' ? 'star' : 'line',
            );
          if (s.settings.haptics && navigator.vibrate)
            navigator.vibrate(id === 'thunder' ? [20, 25, 35] : 12);
          if (['tomato', 'slap', 'chappal'].includes(id))
            setDecals((old) => [
              ...old.slice(-5),
              {
                x: Math.max(150, Math.min(295, input.x)),
                y: Math.max(150, Math.min(260, input.y)),
                tomato: id === 'tomato',
                angle: v * 24 - 24,
              },
            ]);
        } else audio.miss();
        return { hit: result.hit, ko: result.ko, crit: result.crit, combo: result.next.combo };
      },
      recovery: () => {
        if (!knockout)
          setExpression(
            id === 'bonk' ? 'dazed' : id === 'roast' || id === 'emotional' ? 'roasted' : 'nervous',
          );
      },
      complete: () => {
        if (serial !== generation.current) return;
        root.dataset.phase = 'idle';
        delete root.dataset.attack;
        useGame.setState({ busy: false });
        setExpression(knockout ? 'ko' : useGame.getState().fight.ego < 30 ? 'nervous' : 'smug');
        if (knockout) {
          audio.win();
          setBubble('Fine. You win. Tell nobody.');
          finishTimer.current = setTimeout(() => useGame.getState().setScene('verdict'), 1100);
          return;
        }
        const next = pending.current;
        pending.current = null;
        if (next && Date.now() - next.at < 450) queueMicrotask(() => attack(next));
      },
    });
    timeline.current = t;
    t.play(0);
  };
  useImperativeHandle(ref, () => ({
    attack: (zone, roastText) =>
      attack({
        x: 220,
        y: 178,
        zone: zone || 'glasses',
        roast: roastText,
        id: useGame.getState().weapon,
        at: Date.now(),
      }),
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
        timeline.current?.pause();
        audio.suspend();
      } else {
        timeline.current?.resume();
        audio.resume();
        useGame.setState({ lastInputAt: Date.now() });
      }
    };
    document.addEventListener('visibilitychange', visibility);
    const idle = setInterval(() => {
      const state = useGame.getState();
      if (state.busy || state.fight.ego <= 0 || document.hidden) return;
      if (Date.now() - state.lastInputAt > 15000) {
        setExpression('asleep');
        setBubble('Wake me when you’re interesting.');
      } else if (Date.now() - state.lastInputAt > 8000) setBubble(reactionDeck());
    }, 4000);
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
      data-phase="idle"
      aria-busy={busy}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || busy || settings.motion === 'calm') return;
        const rect = e.currentTarget.getBoundingClientRect();
        gsap.to(e.currentTarget.querySelectorAll('.pupil'), {
          x: ((e.clientX - rect.left - rect.width / 2) / rect.width) * 8,
          y: ((e.clientY - rect.top - rect.height / 2) / rect.height) * 5,
          duration: 0.18,
          overwrite: true,
        });
      }}
      onPointerDown={(e) => {
        if (e.button !== 0 || (e.target as HTMLElement).closest('.roast-lettering')) return;
        const now = Date.now();
        inputTimes.current = [...inputTimes.current.filter((t) => now - t < 1000), now];
        if (
          useGame.getState().weapon === 'tomato' &&
          inputTimes.current.length >= 3 &&
          settings.motion !== 'calm'
        ) {
          setRain(true);
          inputTimes.current = [];
        }
        const svg = host.current?.querySelector('.harsh-rig') as SVGSVGElement | null;
        const matrix = svg?.getScreenCTM();
        if (!svg || !matrix) return;
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const local = point.matrixTransform(matrix.inverse());
        attack({ x: local.x, y: local.y, id: useGame.getState().weapon, at: Date.now() });
      }}
    >
      <div className="stage-topline">
        <span>ROOM 001 / EGO DISPOSAL</span>
        <span className="live-pill">
          <i /> {busy ? 'INCIDENT IN PROGRESS' : 'READY WHEN YOU ARE'}
        </span>
      </div>
      <div className="stage-camera">
        <div className="room-wall" aria-hidden="true">
          <span>NO HARD FEELINGS.</span>
        </div>
        <div className="room-light light-left" />
        <div className="room-light light-right" />
        <div className="arena-word" aria-hidden="true">
          HARSH
        </div>
        <div className="floor-lines" />
        <div className="rig-wrap">
          <HarshRig expression={expression} ego={fight.ego} />
          <svg className="decal-overlay" viewBox="0 0 440 520" aria-hidden="true">
            {decals.map((decal, i) => (
              <g
                key={i}
                transform={`translate(${decal.x} ${decal.y}) rotate(${decal.angle})`}
                opacity=".65"
              >
                {decal.tomato ? (
                  <>
                    <path
                      d="m-24-5-9-17 24 7L0-30l9 18 25-6-13 20 13 12-25 1-8 19-9-19-24 8Z"
                      fill="#de432a"
                    />
                    <path d="M2 8v34" stroke="#de432a" strokeWidth="5" strokeLinecap="round" />
                  </>
                ) : (
                  <ellipse rx="17" ry="11" fill="#d57050" />
                )}
              </g>
            ))}
          </svg>
        </div>
        <div className="orbit-stars" aria-hidden="true">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
        </div>
        <div className="speech-bubble">“{bubble}”</div>
        <div className="target-tag">
          <span className="target-dot" /> HARSH{' '}
          <small>{fight.ego > 50 ? 'STILL THINKS HE’S RIGHT' : 'RECONSIDERING EVERYTHING'}</small>
        </div>
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
          {Array.from({ length: settings.lite ? 4 : 8 }, (_, i) => (
            <div key={i} style={{ left: `${i * 13}%`, animationDelay: `${i * 0.06}s` }}>
              <WeaponArt id="tomato" />
            </div>
          ))}
        </div>
      )}
      <div className="impact-light" />
      <svg className={`impact-graphic graphic-${active}`} viewBox="0 0 220 220" aria-hidden="true">
        <path d="m110 5 13 67 52-43-30 61 69 4-63 28 46 46-65-21-15 69-17-64-58 39 30-60-68-14 68-12-39-57 57 33Z" />
        <circle cx="110" cy="110" r="62" />
      </svg>
      <div className="attack-prop" aria-hidden="true">
        <WeaponArt id={active} />
      </div>
      <div
        className={`roast-lettering ${quote ? 'has-quote' : ''}`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span>
          {active === 'emotional' ? 'UNSOLICITED COMPARISON' : 'YOUR WORDS. HIS PROBLEM.'}
        </span>
        <p>{quote}</p>
      </div>
      <div className="impact-text" aria-hidden="true">
        <strong>{impact.word}</strong>
        {impact.damage > 0 && (
          <span>
            −{impact.damage} EGO {impact.count > 1 ? `/ ×${impact.count}` : ''}
          </span>
        )}
      </div>
      {impact.combo && (
        <div className="chain-callout" key={`${fight.attacks}-combo`}>
          <b>×{impact.count}</b>
          <span>{impact.combo}</span>
        </div>
      )}
      <canvas ref={canvas} className="particle-canvas" aria-hidden="true" />
      <div className="stage-instruction">PICK A MOVE. TAP HARSH TO AIM.</div>
    </div>
  );
});
Stage.displayName = 'Stage';
