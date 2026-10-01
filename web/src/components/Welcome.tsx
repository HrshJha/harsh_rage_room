import { HarshRig } from './HarshRig';
import { Lion } from './Lion';
import { WeaponArt } from './WeaponArt';
import { Icon } from './Icon';
import { useGame } from '../core/store';
import { audio } from '../engine/audio';
import { beginSession } from '../net/client';
import { useState } from 'react';
export function HeroArt({ angry = false }: { angry?: boolean }) {
  return (
    <div className={`hero-art ${angry ? 'hero-art-angry' : ''}`}>
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
      <div className="hero-burst" />
      <span className="art-star star-one">✦</span>
      <span className="art-star star-two">✧</span>
      <div className="hero-sticker sticker-top">
        BIG EGO.
        <br />
        SMALL HITBOX.
      </div>
      <div className="hero-character">
        <HarshRig expression={angry ? 'nervous' : 'smug'} />
      </div>
      <div className="floating-weapon fw-one">
        <WeaponArt id="chappal" />
      </div>
      <div className="floating-weapon fw-two">
        <WeaponArt id="tomato" />
      </div>
      <div className="hero-sticker sticker-bottom">
        <span className="scribble-arrow">↖</span> THIS GUY.
      </div>
      <span className="hero-art-caption">
        NO HARSHES WERE HARMED.
        <br />
        HIS EGO? DIFFERENT STORY.
      </span>
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
        <div className="eyebrow">
          <span className="tiny-star">✦</span> A HIGHLY UNNECESSARY SOLUTION
        </div>
        {gate ? (
          <>
            <h1 className="entry-title">
              WELCOME TO
              <br />
              <span className="yellow-text">THE RAGE ROOM.</span>
            </h1>
            <p className="hero-subtitle">Before you start causing chaos, tell us who you are.</p>
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
            Big moments get tattled to Harsh on Telegram.
            <br />
            <span>No account. No judgement. Okay, a little judgement.</span>
          </p>
        </div>
      </div>
      <HeroArt />
    </div>
  );
}
