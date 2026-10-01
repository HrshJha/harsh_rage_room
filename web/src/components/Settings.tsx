import { useGame } from '../core/store';
import { Modal } from './Modal';
import { audio } from '../engine/audio';
export function Settings({ onClose }: { onClose: () => void }) {
  const s = useGame((x) => x.settings),
    set = useGame((x) => x.setSettings);
  return (
    <Modal title="THE CONTROL ROOM" onClose={onClose}>
      <p className="muted">Your chaos. Your comfort level.</p>
      <label className="setting-row">
        Sound effects
        <input
          type="checkbox"
          checked={!s.muted}
          onChange={(e) => {
            set({ muted: !e.target.checked });
            if (e.target.checked) void audio.unlock().then(() => audio.click());
          }}
        />
      </label>
      <label className="setting-row">
        Arcade music <small>Optional background groove, reacts to rage</small>
        <input
          type="checkbox"
          checked={s.music}
          onChange={(e) => set({ music: e.target.checked })}
        />
      </label>
      <label className="setting-row">
        Volume
        <input
          aria-label="Volume"
          type="range"
          min="0"
          max="1"
          step=".05"
          value={s.volume}
          onChange={(e) => {
            set({ volume: Number(e.target.value) });
            audio.sync();
          }}
        />
      </label>
      <label className="setting-row">
        Calm Chaos <small>Comic panels, no camera shake</small>
        <input
          type="checkbox"
          checked={s.motion === 'calm'}
          onChange={(e) => set({ motion: e.target.checked ? 'calm' : 'full' })}
        />
      </label>
      <label className="setting-row">
        Gentle effects <small>No flashes or dramatic zooms</small>
        <input
          type="checkbox"
          checked={s.gentle}
          onChange={(e) => set({ gentle: e.target.checked })}
        />
      </label>
      <label className="setting-row">
        Lite effects <small>Fewer particles, more battery</small>
        <input type="checkbox" checked={s.lite} onChange={(e) => set({ lite: e.target.checked })} />
      </label>
      <label className="setting-row">
        Haptics <small>On supported phones</small>
        <input
          type="checkbox"
          checked={s.haptics}
          onChange={(e) => set({ haptics: e.target.checked })}
        />
      </label>
      <button
        className="button yellow full-width"
        onClick={() => {
          void audio.test();
        }}
        disabled={s.muted}
      >
        TEST SOUND
      </button>
      <p className="tiny">Keyboard: 1–8 equip · Space attack · M mute · Esc settings</p>
    </Modal>
  );
}
