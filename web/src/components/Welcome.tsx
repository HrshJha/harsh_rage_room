import { HarshRig } from './HarshRig';
import { Lion } from './Lion';
import { Icon } from './Icon';
import { useGame } from '../core/store';
import { audio } from '../engine/audio';
import { beginSession } from '../net/client';
import { useState } from 'react';
export function HeroArt({ angry = false }: { angry?: boolean }) {
  return (
    <div className={`hero-art ${angry ? 'hero-art-angry' : ''}`}>
      <div className="hero-room-lines" aria-hidden="true" />
      <div className="hero-disc" aria-hidden="true" />
      <div className="hero-art-index">SUBJECT / 001</div>
      <div className="hero-character">
        <HarshRig expression={angry ? 'nervous' : 'smug'} />
      </div>
      <div className="hero-sticker sticker-top">
        BIG EGO.
        <br />
        MEET CONSEQUENCES.
      </div>
      <div className="hero-art-caption">
        <span>HARSH</span>
        <small>THE REASON YOU’RE HERE.</small>
      </div>
    </div>
  );
}
export function Welcome() {
  const scene = useGame((s) => s.scene);
  const gate = scene === 'gate';
  const [draftName, setDraftName] = useState(() => useGame.getState().name);
  const [sound, setSound] = useState(false);
  const go = () => {
    useGame.getState().setVisitorName(draftName);
    useGame.getState().setSettings({ muted: !sound });
    if (sound) void audio.unlock().then(() => audio.enter());
    useGame.getState().setScene('intro');
    void beginSession();
  };
  return (
    <div className={`welcome scene-content ${gate ? 'welcome-entry' : ''}`}>
      <div className="hero-copy">
        <div className="eyebrow">A PERSONAL MATTER / EST. 2026</div>
        {gate ? (
          <>
            <h1 className="entry-title" aria-label="WELCOME TO THE RAGE ROOM.">
              <span className="entry-kicker">WELCOME TO THE</span>
              <span className="entry-display">
                RAGE
                <br />
                <em>ROOM.</em>
              </span>
            </h1>
            <p className="hero-subtitle">Bad day? Good. Leave it here.</p>
          </>
        ) : (
          <>
            <h1>
              IS HARSH
              <br />
              <span className="irritating">
                IRRITATING
                <svg viewBox="0 0 600 22" aria-hidden="true">
                  <path d="M3 12Q270-3 598 9M23 19Q309 7 573 18" />
                </svg>
              </span>
              <br />
              <span className="you-text">YOU?</span>
              <span className="title-asterisk">✳</span>
            </h1>
            <p className="hero-subtitle">
              Some people meditate.
              <br />
              We built a whole rage room.
            </p>
          </>
        )}
        {gate ? (
          <form
            className="hero-actions entry-form"
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
          >
            <label className="entry-label" htmlFor="visitor-name">
              YOUR NAME <span>OPTIONAL</span>
            </label>
            <input
              id="visitor-name"
              className="entry-input"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={20}
              autoComplete="nickname"
              placeholder="Enter your name..."
              aria-describedby="entry-name-note"
            />
            <p id="entry-name-note" className="entry-note">
              Your name will appear in Harsh’s Telegram notifications. Leave it blank to enter
              anonymously.
            </p>
            <label className="entry-sound">
              <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
              <Icon name={sound ? 'sound' : 'mute'} size={18} />
              <span>PLAY WITH SOUND</span>
            </label>
            <button className="button yellow primary-cta" type="submit">
              ENTER THE RAGE ROOM <Icon name="arrow" />
            </button>
          </form>
        ) : (
          <div className="hero-actions">
            <button
              className="button red primary-cta"
              onClick={() => {
                audio.click();
                useGame.getState().setScene('anger');
              }}
            >
              YES, EXTREMELY. <Icon name="arrow" />
            </button>
            <button
              className="button outline primary-cta"
              onClick={() => {
                audio.click();
                useGame.getState().setScene('lie');
              }}
            >
              NO, HE’S ALRIGHT… <Icon name="heart" />
            </button>
          </div>
        )}
        <div className="hero-disclosure">
          <Lion />
          <p>
            <strong>CHOTA SHER IS WATCHING.</strong>
            <br />
            Your completed moves go straight to Harsh’s Telegram.
            <br />
            <span>Fictional violence. Very real receipts.</span>
          </p>
        </div>
      </div>
      <HeroArt />
    </div>
  );
}
