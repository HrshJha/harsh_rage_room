import { useEffect, useRef, useState } from 'react';
import { useGame } from '../core/store';
import { audio } from '../engine/audio';
import { WeaponArt } from './WeaponArt';
import { Icon } from './Icon';
import content from '../content/dialogue.json';
export default function Verdict() {
  const [phase, setPhase] = useState(0),
    [spinning, setSpinning] = useState(false),
    [result, setResult] = useState<string[] | null>(null),
    [reels, setReels] = useState(['???', '???', '???']);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    audio.hit('bonk');
    timeouts.current = [
      setTimeout(() => setPhase(1), 1100),
      setTimeout(() => {
        setPhase(2);
        audio.hit('punch');
      }, 3500),
      setTimeout(() => setPhase(3), 6000),
    ];
    return () => timeouts.current.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (!spinning) return;
    const pools = [content.verbs, content.objects, content.durations];
    const final = pools.map((pool) => pool[Math.floor(Math.random() * pool.length)]);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setReels(
        pools.map((pool, i) =>
          elapsed > 1400 + i * 450 ? final[i] : pool[Math.floor(Math.random() * pool.length)],
        ),
      );
      if (elapsed < 2300) audio.reelTick(400 + elapsed / 10);
      else {
        clearInterval(interval);
        setResult(final);
        setSpinning(false);
        audio.win();
      }
    }, 90);
    return () => clearInterval(interval);
  }, [spinning]);
  const skip = () => {
    timeouts.current.forEach(clearTimeout);
    setPhase(3);
  };
  return (
    <div className="verdict-scene scene-content">
      <div className="eyebrow">THE SUPREME COURT OF ANNOYANCE</div>
      <div className="gavel-illustration">
        <WeaponArt id="bonk" />
      </div>
      <h1>
        THE VERDICT
        <br />
        IS <span className="yellow-text">IN.</span>
      </h1>
      {phase < 3 ? (
        <>
          <div className="charges">
            {phase >= 1 &&
              content.charges
                .slice(
                  useGame.getState().fight.crits > 0 ? 0 : 2,
                  useGame.getState().fight.crits > 0 ? 3 : 5,
                )
                .map((c, i) => (
                  <p key={c}>
                    <span>0{i + 1}</span>
                    {c}
                    <Icon name="check" />
                  </p>
                ))}
          </div>
          {phase >= 2 && <div className="guilty-stamp">GUILTY ON ALL COUNTS</div>}
          <button className="text-button" onClick={skip}>
            SKIP THE LEGAL DRAMA <Icon name="arrow" />
          </button>
        </>
      ) : (
        <div className="sentence-machine">
          <div className="eyebrow">LET FATE CHOOSE HIS SENTENCE.</div>
          <div className="sentence-reels">
            {reels.map((r, i) => (
              <div key={i} className={spinning ? 'spinning' : ''}>
                <small>{['THE ACTION', 'THE SACRIFICE', 'THE DAMAGE'][i]}</small>
                <strong>{r}</strong>
              </div>
            ))}
          </div>
          {result ? (
            <button
              className="button yellow"
              onClick={() => useGame.getState().makeCertificate('revenge', result.join(' '))}
            >
              MAKE IT OFFICIAL <Icon name="arrow" />
            </button>
          ) : (
            <button className="button yellow" disabled={spinning} onClick={() => setSpinning(true)}>
              {spinning ? 'JUSTICE IS BUFFERING…' : 'SPIN THE SENTENCE'} <Icon name="repeat" />
            </button>
          )}
          <p className="tiny">Legally binding in exactly zero jurisdictions.</p>
        </div>
      )}
    </div>
  );
}
