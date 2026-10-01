import { useEffect, useRef, useState } from 'react';
import { Stage, type StageHandle } from './Stage';
import { Icon } from './Icon';
import { Lion } from './Lion';
import { WeaponArt } from './WeaponArt';
import { Modal } from './Modal';
import { useGame } from '../core/store';
import { weapons, weaponById, score } from '../engine/game';
import { audio } from '../engine/audio';
import content from '../content/dialogue.json';

const roastPresets = [
  'Your code is confidence with no test coverage.',
  'Even your bugs have started blaming you.',
  'Your git history needs witness protection.',
  'That ego shipped. Your skills are still in beta.',
  'Your code review left you on read.',
  'Your debugger has trust issues. Understandably.',
  'Your best feature is the Undo button.',
  'Stack Overflow needs a break from your searches.',
];
export default function Room() {
  const fight = useGame((s) => s.fight),
    weapon = useGame((s) => s.weapon),
    line = useGame((s) => s.line),
    delivery = useGame((s) => s.delivery),
    name = useGame((s) => s.name),
    reason = useGame((s) => s.reason),
    freeText = useGame((s) => s.freeText);
  const stage = useRef<StageHandle>(null),
    [complaint, setComplaint] = useState(false),
    [roast, setRoast] = useState(false),
    [roastDraft, setRoastDraft] = useState(''),
    [intro, setIntro] = useState(true);
  useEffect(() => {
    void audio.prepare();
    const t = setTimeout(() => {
      setIntro(false);
      audio.roomEnter();
    }, 650);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest('input,textarea,select,button,[role="dialog"]') ||
        complaint ||
        roast
      )
        return;
      if (/^[1-8]$/.test(e.key)) {
        useGame.getState().setWeapon(weapons[Number(e.key) - 1].id);
        audio.click();
      }
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        if (useGame.getState().weapon === 'roast') setRoast(true);
        else stage.current?.attack();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [complaint, roast]);
  return (
    <div className="room scene-content">
      <div className="room-heading">
        <div>
          <div className="eyebrow">{name || 'ANONYMOUS'} / YOU’RE IN CONTROL</div>
          <h1>
            MAKE IT <span className="yellow-text">PERSONAL.</span>
          </h1>
        </div>
        <div className="round-tag">
          <span>ROUND</span>
          <strong>{String(useGame.getState().round).padStart(2, '0')}</strong>
        </div>
      </div>
      <div className="fight-hud">
        <div className="meter-group ego-group">
          <div className="meter-label">
            <span>HARSH’S EGO</span>
            <strong>
              {fight.ego}
              <small>/100</small>
            </strong>
          </div>
          <div className="meter-track">
            <i style={{ width: `${fight.ego}%` }} />
          </div>
          <div className="meter-note">
            {fight.ego > 75
              ? 'UNREASONABLY CONFIDENT'
              : fight.ego > 50
                ? 'SLIGHTLY HUMBLED'
                : fight.ego > 25
                  ? 'QUESTIONING LIFE CHOICES'
                  : fight.ego > 0
                    ? 'ONE APOLOGY AWAY'
                    : 'EGO HAS LEFT THE CHAT'}
          </div>
        </div>
        <div className="hud-divider" />
        <div className="meter-group rage-group">
          <div className="meter-label">
            <span>
              <Icon name="bolt" size={14} /> YOUR RAGE
            </span>
            <strong>
              {fight.rage}
              <small>%</small>
            </strong>
          </div>
          <div className="meter-track">
            <i style={{ width: `${fight.rage}%` }} />
          </div>
          <div className="meter-note">
            {fight.rage >= 100
              ? 'BOTH ULTIMATES READY'
              : fight.rage >= 60
                ? 'EMOTIONAL DAMAGE READY'
                : 'KEEP GOING. BUILD YOUR RAGE.'}
          </div>
        </div>
        <div className="hud-score">
          <span>ANGER SCORE</span>
          <strong>{String(score(fight)).padStart(3, '0')}</strong>
        </div>
      </div>
      <div className="arena-layout">
        <div className="arena-main">
          <Stage ref={stage} onRoast={() => setRoast(true)} />
          {intro && (
            <div className="fight-intro" aria-hidden="true">
              <span>ROUND {useGame.getState().round}</span>
              <strong>FIGHT!</strong>
            </div>
          )}
          <div className="announcer-bar">
            <Lion className={delivery === 'pending' ? 'lion-delivering' : ''} />
            <div>
              <span>
                CHOTA SHER <i>OFFICIAL TATTLETALE</i>
              </span>
              <p aria-live="polite">{line}</p>
            </div>
            <span
              className={`delivery-status delivery-${delivery}`}
              title="Telegram delivery status"
            >
              <i />
              {
                (
                  {
                    idle: 'ON STANDBY',
                    pending: 'DELIVERING…',
                    delivered: 'DELIVERED',
                    'dry-run': 'PRACTICE DELIVERY',
                    failed: 'SHER TRIPPED',
                    offline: 'OFFLINE — SAVED',
                  } as const
                )[delivery]
              }
            </span>
          </div>
        </div>
        <aside className="weapon-panel">
          <div className="dock-heading">
            <span>
              CHOOSE YOUR
              <br />
              <strong>WEAPON.</strong>
            </span>
            <Icon name="bolt" size={26} />
          </div>
          <div className="weapon-dock">
            {weapons.map((w, i) => {
              const locked = w.cost > fight.rage;
              return (
                <button
                  key={w.id}
                  className={`weapon-button ${weapon === w.id ? 'equipped' : ''} ${locked ? 'locked' : ''} ${w.cost ? 'ultimate-weapon' : ''}`}
                  aria-label={`${w.id === 'roast' ? 'Roast Harsh' : w.short}${locked ? `, requires ${w.cost} rage` : ''}`}
                  aria-pressed={weapon === w.id}
                  disabled={locked}
                  style={{ '--weapon-color': w.color } as React.CSSProperties}
                  onClick={(e) => {
                    if (e.detail > 1) return;
                    audio.click();
                    useGame.getState().setWeapon(w.id);
                    if (w.id === 'roast') setRoast(true);
                    else stage.current?.attack();
                  }}
                >
                  <span className="weapon-key">{i + 1}</span>
                  <WeaponArt id={w.id} />
                  <span className="weapon-label">{w.id === 'roast' ? 'ROAST HARSH' : w.short}</span>
                  {w.cost > 0 && (
                    <span className="weapon-cost">
                      {locked ? <Icon name="lock" size={10} /> : <Icon name="bolt" size={10} />}{' '}
                      {w.cost}% RAGE
                    </span>
                  )}
                  {weapon === w.id && <span className="equipped-dot" />}
                </button>
              );
            })}
          </div>
          <p className="weapon-description">{weaponById[weapon].description}</p>
          <span className="dock-tip">
            <Icon name="keyboard" size={15} /> TAP A MOVE · 1–8 + SPACE ON KEYS
          </span>
        </aside>
      </div>
      <div className="room-bottom">
        <div className="session-stats">
          <span>
            <b>{fight.attacks}</b> ATTACKS
          </span>
          <span>
            <b>×{fight.maxCombo}</b> BEST COMBO
          </span>
          <span>
            <b>
              {fight.attacks ? Math.round((fight.hits / fight.attacks) * 100) : '—'}
              {fight.attacks ? '%' : ''}
            </b>{' '}
            ACCURACY
          </span>
        </div>
        <div className="room-bottom-actions">
          <button className="text-button" onClick={() => setComplaint(true)}>
            FILE A COMPLAINT <Icon name="chevron" size={15} />
          </button>
          <button
            className="button small outline"
            onClick={() => {
              stage.current?.cancel();
              useGame.getState().setScene('verdict');
            }}
          >
            I’M DONE <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {fight.attacks
          ? `Attack ${fight.attacks}. Harsh's ego ${fight.ego} percent. Rage ${fight.rage} percent.`
          : ''}
      </div>
      {complaint && (
        <Modal title="FILE A COMPLAINT" onClose={() => setComplaint(false)}>
          <p className="muted">Completely optional. Exceptionally petty.</p>
          <p className="complaint-identity">
            Filed by <strong>{name || 'Anonymous visitor'}</strong>
          </p>
          <label className="field-label">WHAT DID HE DO?</label>
          <div className="reason-chips">
            {content.reasons.map((r) => (
              <button
                className={r === reason ? 'selected' : ''}
                aria-pressed={r === reason}
                key={r}
                onClick={() => useGame.setState({ reason: r })}
              >
                {r}
              </button>
            ))}
          </div>
          <label className="field-label">
            ANYTHING TO ADD? <span>{freeText.length}/80</span>
            <input
              value={freeText}
              maxLength={80}
              placeholder="Keep it friendly. He's still your friend."
              onChange={(e) => useGame.setState({ freeText: e.target.value })}
            />
          </label>
          <p className="tiny">
            Your chosen name and message are included in reports to Harsh. No IP or location is
            sent.
          </p>
          <button className="button yellow full-width" onClick={() => setComplaint(false)}>
            COMPLAINT NOTED <Icon name="check" />
          </button>
        </Modal>
      )}
      {roast && (
        <Modal title="ROAST HARSH" onClose={() => setRoast(false)}>
          <p className="muted">
            Pick a quick roast or write your own. You can edit any pick before sending.
          </p>
          <div className="roast-presets" aria-label="Quick roast options">
            <span className="roast-presets-label">QUICK ROASTS</span>
            {roastPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`roast-preset ${roastDraft === preset ? 'selected' : ''}`}
                aria-pressed={roastDraft === preset}
                onClick={() => {
                  setRoastDraft(preset);
                  document.getElementById('roast-message')?.focus();
                }}
              >
                {preset}
              </button>
            ))}
          </div>
          <p className="roast-or-write">OR WRITE YOUR OWN</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!roastDraft.trim()) return;
              const submitted = roastDraft;
              setRoast(false);
              setRoastDraft('');
              stage.current?.attack('torso', submitted);
            }}
          >
            <label className="field-label">
              YOUR ROAST <span>{roastDraft.length}/280</span>
              <textarea
                id="roast-message"
                data-autofocus
                value={roastDraft}
                onChange={(e) => setRoastDraft(e.target.value)}
                maxLength={280}
                placeholder="Harsh, your coding skills need a software update..."
                aria-describedby="roast-note"
              />
            </label>
            <p id="roast-note" className="tiny">
              Sent to Harsh after the roast lands. Keep it playful; links and mentions are not
              needed.
            </p>
            <button
              className="button yellow full-width"
              type="submit"
              disabled={!roastDraft.trim()}
            >
              SEND ROAST <Icon name="arrow" size={16} />
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
