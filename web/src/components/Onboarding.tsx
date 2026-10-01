import { HeroArt } from './Welcome';
import { useEffect, useRef, useState } from 'react';
import { HarshRig } from './HarshRig';
import { Icon } from './Icon';
import { useGame } from '../core/store';
import { audio } from '../engine/audio';
import { beginSession } from '../net/client';
import { events } from '../core/events';
import { angerLabels, type Anger } from '../../../shared/contracts';
import content from '../content/dialogue.json';
export function AngerScreen() {
  const [selected, setSelected] = useState<Anger>(1),
    [mashing, setMashing] = useState(false),
    [remaining, setRemaining] = useState(3),
    [count, setCount] = useState(0),
    [result, setResult] = useState<Anger | null>(null);
  const taps = useRef(0),
    end = useRef(0),
    interval = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (interval.current) clearInterval(interval.current);
    },
    [],
  );
  const start = () => {
    taps.current = 0;
    setCount(0);
    setRemaining(3);
    setMashing(true);
    setResult(null);
    end.current = Date.now() + 3000;
    interval.current = setInterval(() => {
      const ms = end.current - Date.now();
      setRemaining(Math.max(0, ms / 1000));
      if (ms <= 0) {
        clearInterval(interval.current!);
        setMashing(false);
        const rate = taps.current / 3;
        const level: Anger = rate < 3 ? 0 : rate < 5 ? 1 : rate <= 8 ? 2 : 3;
        setSelected(level);
        setResult(level);
        audio.win();
      }
    }, 40);
  };
  const play = () => {
    audio.click();
    useGame.getState().start(selected);
    void beginSession();
  };
  return (
    <div className="setup-scene scene-content">
      <div className="setup-copy">
        <button
          className="text-button back-link"
          onClick={() => useGame.getState().setScene('intro')}
        >
          ← BACK TO DENIAL
        </button>
        <div className="eyebrow">STEP 01 / EMOTIONAL ASSESSMENT</div>
        <h1>
          HOW BAD
          <br />
          IS <span className="yellow-text">IT?</span>
        </h1>
        <p className="hero-subtitle">
          Be honest. This is a very serious
          <br />
          and completely unlicensed facility.
        </p>
        {mashing ? (
          <div className="mash-card">
            <span className="eyebrow">PROVE IT • {remaining.toFixed(1)}s</span>
            <button
              className="mash-button"
              onClick={() => {
                taps.current++;
                setCount(taps.current);
                audio.click();
              }}
            >
              RAGE
              <br />
              <b>{count}</b>
              <small>TAP OR PRESS SPACE</small>
            </button>
          </div>
        ) : (
          <>
            <div className="anger-options" role="group" aria-label="Choose anger level">
              {angerLabels.map((label, i) => (
                <button
                  key={label}
                  className={`anger-option anger-${i} ${selected === i ? 'selected' : ''}`}
                  aria-pressed={selected === i}
                  onClick={() => {
                    setSelected(i as Anger);
                    audio.click();
                  }}
                >
                  <span className="anger-number">0{i + 1}</span>
                  <span>{label}</span>
                  <span className="anger-bars">{'▮'.repeat(i + 1)}</span>
                  <Icon name={selected === i ? 'check' : 'chevron'} size={18} />
                </button>
              ))}
            </div>
            {result !== null && (
              <p className="mash-result" role="status">
                {count} taps. Diagnosis: {angerLabels[result]}. Concerning.
              </p>
            )}
            <button className="button yellow full-width" onClick={play}>
              TAKE ME TO THE ROOM <Icon name="arrow" />
            </button>
            <button className="text-button prove-it" onClick={start}>
              Not convinced? <strong>PROVE IT.</strong> 3-second rage test.
            </button>
          </>
        )}
      </div>
      <div className={`anger-art anger-mood-${selected}`}>
        <HeroArt key={selected} angry={selected > 1} />
        <div className={`rage-readout level-${selected}`}>
          <span>INITIAL RAGE</span>
          <strong>
            {[0, 25, 60, 100][selected]}
            <small>%</small>
          </strong>
          <span>
            {
              [
                'A MILD INCONVENIENCE',
                'SOMEONE LEFT YOU ON SEEN',
                'EMOTIONAL DAMAGE UNLOCKED',
                'BOTH ULTIMATES. GOD HELP HIM.',
              ][selected]
            }
          </span>
          <div className="readout-meter">
            <i style={{ width: `${[4, 25, 60, 100][selected]}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
export function LieDetector() {
  const [progress, setProgress] = useState(0),
    [done, setDone] = useState(false),
    [line, setLine] = useState('The machine would like a word.');
  const started = useRef(0),
    frame = useRef(0);
  const release = () => {
    cancelAnimationFrame(frame.current);
    if (!done) {
      setProgress(0);
      setLine('Inconclusive. Hold it like you mean it.');
    }
  };
  const hold = () => {
    if (done || started.current) return;
    started.current = Date.now();
    audio.click();
    const tick = () => {
      const p = Math.min(1, (Date.now() - started.current) / 1800);
      setProgress(p);
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else {
        started.current = 0;
        setDone(true);
        audio.hit('bonk');
        setLine('Our totally legitimate machine disagrees.');
      }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    started.current = 0;
    release();
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return (
    <div className="lie-scene scene-content">
      <div className="eyebrow">DEPARTMENT OF HIGHLY SUSPICIOUS CLAIMS</div>
      <h1>{done ? 'LIE DETECTED.' : 'OH, REALLY?'}</h1>
      <p className="hero-subtitle">{line}</p>
      <div className={`lie-machine ${done ? 'detected' : ''}`}>
        <div className="machine-leds">
          <i />
          <i />
          <i />
          <span>TRUTH-O-MATIC 3000</span>
        </div>
        <div className="lie-gauge">
          <div className="gauge-labels">
            <span>HONEST</span>
            <span>HARSH’S PR TEAM</span>
          </div>
          <div className="needle" style={{ transform: `rotate(${-60 + progress * 120}deg)` }} />
          <div className="gauge-pivot" />
        </div>
        <button
          className="scan-pad"
          disabled={done}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            hold();
          }}
          onPointerUp={stop}
          onPointerCancel={stop}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
              e.preventDefault();
              hold();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              stop();
            }
          }}
          aria-label="Hold to scan for 1.8 seconds"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            {[16, 25, 34, 43].map((r) => (
              <path
                key={r}
                d={`M${50 - r} 70V${52 - r / 2}a${r} ${r} 0 0 1 ${r * 2} 0v${r}m-${r * 1.5} 0v-${r}`}
              />
            ))}
          </svg>
          <span>{done ? '100% SUSPICIOUS' : 'HOLD TO SCAN'}</span>
          <small>{done ? 'CERTIFIED BY ABSOLUTELY NOBODY' : 'FINGER OR SPACEBAR • 1.8 SEC'}</small>
          <div className="scan-progress" style={{ width: `${progress * 100}%` }} />
        </button>
      </div>
      {done ? (
        <div className="lie-actions">
          <button className="button yellow" onClick={() => useGame.getState().setScene('anger')}>
            FINE, YES. <Icon name="arrow" />
          </button>
          <button
            className="button outline"
            onClick={() => useGame.getState().setScene('compliment')}
          >
            STILL NO. <Icon name="heart" />
          </button>
        </div>
      ) : (
        <p className="tiny">98% accurate. The other 2% is also a lie.</p>
      )}
    </div>
  );
}
export function ComplimentScreen() {
  const selected = useGame((s) => s.selectedCompliments);
  return (
    <div className="kind-scene scene-content">
      <div className="eyebrow pink-text">AN UNEXPECTED PLOT TWIST</div>
      <h1>
        CHOOSE
        <br />
        <span className="pink-text">KINDNESS.</span>
      </h1>
      <p className="hero-subtitle">
        Suspicious. But we’ll allow it.
        <br />
        Pick up to three nice things to send him.
      </p>
      <div className="compliment-layout">
        <div className="compliment-grid">
          {content.compliments.map((line) => (
            <button
              className={`compliment-card ${selected.includes(line) ? 'selected' : ''}`}
              key={line}
              aria-pressed={selected.includes(line)}
              onClick={() => {
                audio.chord([440, 550]);
                useGame.setState({
                  selectedCompliments: selected.includes(line)
                    ? selected.filter((s) => s !== line)
                    : [...selected, line].slice(-3),
                });
              }}
            >
              <Icon name={selected.includes(line) ? 'check' : 'heart'} />
              {line}
            </button>
          ))}
        </div>
        <div className="kind-character">
          <HarshRig expression="kind" />
          <span>“Wait. You’re being NICE?”</span>
        </div>
      </div>
      <button
        className="button pink"
        disabled={!selected.length}
        onClick={() => {
          events.emit({ type: 'compliment', lines: selected });
          audio.win();
          useGame.getState().makeCertificate('kindness', 'CONTINUE BEING A DECENT HUMAN');
        }}
      >
        SEND SOME LOVE <Icon name="heart" />
      </button>
      <button className="text-button" onClick={() => useGame.getState().setScene('anger')}>
        Okay fine, hit him instead →
      </button>
    </div>
  );
}
