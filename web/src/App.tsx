import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { useGame, restoreSettings } from './core/store';
import { Welcome } from './components/Welcome';
const AngerScreen = lazy(() =>
  import('./components/Onboarding').then((m) => ({ default: m.AngerScreen })),
);
const LieDetector = lazy(() =>
  import('./components/Onboarding').then((m) => ({ default: m.LieDetector })),
);
const ComplimentScreen = lazy(() =>
  import('./components/Onboarding').then((m) => ({ default: m.ComplimentScreen })),
);
import { Settings } from './components/Settings';
import { Icon } from './components/Icon';
import { WeaponArt } from './components/WeaponArt';
import { audio } from './engine/audio';
import { connectNetwork } from './net/client';
const Room = lazy(() => import('./components/Room'));
const Verdict = lazy(() => import('./components/Verdict'));
const Certificate = lazy(() => import('./components/Certificate'));
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    /* Avoid reporting visitor content. */
  }
  render() {
    if (this.state.failed)
      return (
        <div className="recovery-screen">
          <h1>
            HARSH BROKE
            <br />
            THE INTERNET.
          </h1>
          <p>Probably his ego. Let’s try that again.</p>
          <button className="button yellow" onClick={() => location.reload()}>
            RESTART THE ROOM
          </button>
        </div>
      );
    return this.props.children;
  }
}
function Experience() {
  const scene = useGame((s) => s.scene),
    settings = useGame((s) => s.settings),
    [showSettings, setShowSettings] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    restoreSettings();
    return connectNetwork();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = settings.motion;
    document.documentElement.dataset.lite = String(settings.lite);
    audio.sync();
  }, [settings, scene]);
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
  }, [scene, settings.motion]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return;
      if (e.key.toLowerCase() === 'm') {
        const s = useGame.getState();
        s.setSettings({ muted: !s.settings.muted });
        if (s.settings.muted) void audio.unlock();
      }
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]'))
        setShowSettings((s) => !s);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return (
    <div className={`app-shell scene-${scene}`}>
      <a href="#main" className="skip-link">
        Skip to game
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          aria-label="Harsh Rage Room home"
          onClick={(e) => {
            e.preventDefault();
            if (scene === 'gate' || scene === 'intro') return;
            setShowSettings(true);
          }}
        >
          <span className="brand-mark">
            <WeaponArt id="punch" />
          </span>
          <span>
            HARSH
            <span className="brand-second">
              RAGE ROOM<span className="brand-period">®</span>
            </span>
          </span>
        </a>
        <div className="header-center">
          <span className="status-dot" /> OPEN FOR EMOTIONAL BUSINESS
        </div>
        <div className="header-controls">
          <button
            className="icon-button sound-toggle"
            onClick={() => {
              useGame.getState().setSettings({ muted: !settings.muted });
              if (settings.muted) void audio.unlock().then(() => audio.click());
            }}
            aria-label={settings.muted ? 'Turn sound on' : 'Mute sound'}
          >
            <Icon name={settings.muted ? 'mute' : 'sound'} />
          </button>
          <button
            className="icon-button"
            aria-label="Open settings"
            onClick={() => setShowSettings(true)}
          >
            <Icon name="settings" />
          </button>
          <span className="header-edition">
            VOL. 01
            <br />
            <strong>EST. 2026</strong>
          </span>
        </div>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        <Suspense
          fallback={
            <div className="loading-scene">
              <span className="loading-star">✦</span> PREPARING THE DRAMA…
            </div>
          }
        >
          {scene === 'gate' || scene === 'intro' ? (
            <Welcome />
          ) : scene === 'anger' ? (
            <AngerScreen />
          ) : scene === 'lie' ? (
            <LieDetector />
          ) : scene === 'compliment' ? (
            <ComplimentScreen />
          ) : scene === 'room' ? (
            <Room />
          ) : scene === 'verdict' ? (
            <Verdict />
          ) : (
            <Certificate />
          )}
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="footer-facts">
          <span>
            <Icon name="bolt" size={14} /> 8 WAYS TO LET IT OUT
          </span>
          <span>
            <Icon name="heart" size={14} /> 0 REAL INJURIES
          </span>
          <span>
            <Icon name="star" size={14} /> UNLIMITED PETTINESS
          </span>
        </div>
        <span className="footer-signoff">
          MADE WITH LOVE. <s>AND PATIENCE.</s>
        </span>
      </footer>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <Experience />
    </ErrorBoundary>
  );
}
