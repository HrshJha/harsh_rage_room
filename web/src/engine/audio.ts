import { useGame } from '../core/store';
import type { AttackId } from '../../../shared/contracts';

type Bus = 'impact' | 'ui' | 'music';
type Kind = 'contact' | 'anticipation' | 'accent' | 'music' | 'ui';
type Voice = { source: AudioScheduledSourceNode; gain: GainNode; kind: Kind; at: number };
const core = {
  slap: [1, 2, 3, 4].map((n) => `/audio/slap/contact-0${n}.mp3`),
  punch: [1, 2, 3, 4].map((n) => `/audio/punch/contact-0${n}.mp3`),
  chappal: [1, 2, 3, 4].map((n) => `/audio/chappal/contact-0${n}.mp3`),
  bonk: [1, 2, 3].map((n) => `/audio/bonk/contact-0${n}.mp3`),
  tomato: [1, 2, 3].map((n) => `/audio/tomato/contact-0${n}.mp3`),
};
type Core = keyof typeof core;
const rubber = '/audio/chappal/rubber.mp3';
const droplets = '/audio/tomato/droplets.mp3';

class SoundEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private buses: Partial<Record<Bus, GainNode>> = {};
  private buffers = new Map<string, AudioBuffer | null>();
  private loading = new Map<string, Promise<AudioBuffer | null>>();
  private voices = new Set<Voice>();
  private bags = new Map<Core, string[]>();
  private recent = new Map<Core, string[]>();
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private nextBeat = 0;
  private beat = 0;
  private bonks = 0;
  private lastBonk = 0;
  private lastCombo = 0;

  async unlock() {
    try {
      if (!this.context) {
        const c = new AudioContext({ latencyHint: 'interactive' });
        const master = c.createGain();
        const compressor = c.createDynamicsCompressor();
        compressor.threshold.value = -12;
        compressor.knee.value = 12;
        compressor.ratio.value = 3;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.16;
        master.gain.value = 0;
        master.connect(compressor);
        compressor.connect(c.destination);
        for (const bus of ['impact', 'ui', 'music'] as Bus[]) {
          const gain = c.createGain();
          gain.gain.value = bus === 'music' ? 0.17 : bus === 'ui' ? 0.36 : 0.7;
          gain.connect(master);
          this.buses[bus] = gain;
        }
        this.context = c;
        this.master = master;
      }
      const nav = navigator as Navigator & { audioSession?: { type: string } };
      if (nav.audioSession) nav.audioSession.type = 'playback';
      await this.context.resume();
      this.sync();
      if (!useGame.getState().settings.muted) void this.prepare();
    } catch {
      // Visual play remains available when Web Audio is unavailable.
    }
  }

  private async load(path: string): Promise<AudioBuffer | null> {
    if (this.buffers.has(path)) return this.buffers.get(path) ?? null;
    const pending = this.loading.get(path);
    if (pending) return pending;
    const c = this.context;
    if (!c) return null;
    const promise = fetch(path)
      .then((response) => {
        if (!response.ok || !response.headers.get('content-type')?.includes('audio/'))
          throw new Error(`HTTP ${response.status} or non-audio response`);
        return response.arrayBuffer();
      })
      .then((data) => c.decodeAudioData(data))
      .catch((error: unknown) => {
        console.warn(`Audio asset unavailable: ${path}`, error);
        return null;
      })
      .then((buffer) => {
        this.buffers.set(path, buffer);
        this.loading.delete(path);
        return buffer;
      });
    this.loading.set(path, promise);
    return promise;
  }

  prepare() {
    if (!this.context || useGame.getState().settings.muted) return Promise.resolve();
    return Promise.all(
      [...Object.values(core).flat(), rubber, droplets].map((p) => this.load(p)),
    ).then(() => undefined);
  }

  sync() {
    const c = this.context;
    if (!c || !this.master) return;
    const { settings, scene } = useGame.getState();
    this.master.gain.setTargetAtTime(
      settings.muted ? 0 : settings.volume * 0.8,
      c.currentTime,
      0.012,
    );
    if (!settings.muted && settings.music && scene === 'room' && !document.hidden)
      this.startMusic();
    else this.stopMusic();
    if (!settings.muted) void this.prepare();
  }

  private audible() {
    return !!this.context && this.context.state === 'running' && !useGame.getState().settings.muted;
  }

  private fade(v: Voice, seconds = 0.02) {
    const c = this.context;
    if (!c) return;
    v.gain.gain.cancelScheduledValues(c.currentTime);
    v.gain.gain.setTargetAtTime(0, c.currentTime, seconds / 3);
    try {
      v.source.stop(c.currentTime + seconds);
    } catch {
      /* already stopped */
    }
    this.voices.delete(v);
  }

  private track(source: AudioScheduledSourceNode, gain: GainNode, kind: Kind, at: number) {
    if (this.voices.size >= 16) {
      const oldest =
        [...this.voices].filter((v) => v.kind !== 'contact').sort((a, b) => a.at - b.at)[0] ??
        (kind === 'contact' ? [...this.voices].sort((a, b) => a.at - b.at)[0] : undefined);
      if (oldest) this.fade(oldest, 0.012);
      else if (kind !== 'contact') return false;
    }
    const v = { source, gain, kind, at };
    this.voices.add(v);
    source.onended = () => {
      this.voices.delete(v);
      source.disconnect();
      gain.disconnect();
    };
    return true;
  }

  private sample(path: string, volume: number, pan: number, kind: Kind, rate = 1) {
    const c = this.context;
    const buffer = this.buffers.get(path);
    if (!c || !buffer || !this.audible()) {
      if (!this.buffers.has(path)) void this.load(path);
      return false;
    }
    const source = c.createBufferSource();
    const gain = c.createGain();
    const panner = c.createStereoPanner();
    const at = c.currentTime + 0.003;
    source.buffer = buffer;
    source.playbackRate.value = rate;
    gain.gain.value = volume;
    panner.pan.value = Math.max(-0.7, Math.min(0.7, pan));
    source.connect(gain);
    gain.connect(panner);
    panner.connect(this.buses.impact!);
    if (!this.track(source, gain, kind, at)) {
      source.disconnect();
      gain.disconnect();
      panner.disconnect();
      return false;
    }
    const done = source.onended;
    source.onended = (event) => {
      done?.call(source, event);
      panner.disconnect();
    };
    source.start(at);
    return true;
  }

  private next(id: Core) {
    const recent = this.recent.get(id) ?? [];
    let bag = this.bags.get(id) ?? [];
    if (!bag.length) bag = [...core[id]];
    const eligible = bag.filter((p) => !recent.includes(p));
    const pool = eligible.length ? eligible : bag;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    this.bags.set(
      id,
      bag.filter((p) => p !== chosen),
    );
    this.recent.set(id, [chosen, ...recent].slice(0, core[id].length >= 4 ? 2 : 1));
    return chosen;
  }

  private tone(
    start: number,
    end: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    bus: Bus = 'impact',
    kind: Kind = 'accent',
    delay = 0,
  ) {
    const c = this.context;
    if (!c || !this.audible()) return;
    const source = c.createOscillator(),
      gain = c.createGain(),
      at = c.currentTime + delay;
    source.type = type;
    source.frequency.setValueAtTime(start, at);
    source.frequency.exponentialRampToValueAtTime(Math.max(20, end), at + duration);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(gain);
    gain.connect(this.buses[bus]!);
    if (!this.track(source, gain, kind, at)) {
      source.disconnect();
      gain.disconnect();
      return;
    }
    source.start(at);
    source.stop(at + duration + 0.01);
  }

  private noise(duration: number, cutoff: number, volume: number, bus: Bus, kind: Kind) {
    const c = this.context;
    if (!c || !this.audible()) return;
    const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * duration), c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = c.createBufferSource(),
      filter = c.createBiquadFilter(),
      gain = c.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    gain.gain.value = volume;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.buses[bus]!);
    if (!this.track(source, gain, kind, c.currentTime)) {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      return;
    }
    const done = source.onended;
    source.onended = (event) => {
      done?.call(source, event);
      filter.disconnect();
    };
    source.start();
  }

  private duck() {
    const c = this.context,
      music = this.buses.music;
    if (!c || !music) return;
    const at = c.currentTime;
    music.gain.cancelScheduledValues(at);
    music.gain.setValueAtTime(music.gain.value, at);
    music.gain.linearRampToValueAtTime(0.075, at + 0.012);
    music.gain.setValueAtTime(0.075, at + 0.09);
    music.gain.linearRampToValueAtTime(0.17, at + 0.34);
  }

  click() {
    this.tone(620, 320, 0.06, 0.1, 'square', 'ui', 'ui');
  }
  chord(notes: number[], gap = 0.07) {
    notes.forEach((n, i) => this.tone(n, n, 0.23, 0.09, 'triangle', 'ui', 'ui', i * gap));
  }
  reelTick(pitch: number) {
    this.tone(pitch, pitch * 0.88, 0.035, 0.055, 'square', 'ui', 'ui');
  }
  enter() {
    [130, 196, 262].forEach((n, i) =>
      this.tone(n, n, 0.28, 0.11, 'triangle', 'ui', 'ui', i * 0.065),
    );
  }
  roomEnter() {
    this.tone(98, 49, 0.32, 0.23, 'sine');
    [196, 262, 330].forEach((n, i) =>
      this.tone(n, n, 0.23, 0.08, 'triangle', 'ui', 'ui', i * 0.075),
    );
  }
  attackStart(id: AttackId) {
    if (id === 'thunder') this.tone(75, 480, 0.8, 0.09, 'sawtooth', 'impact', 'anticipation');
    else if (id === 'emotional') {
      [220, 245, 275].forEach((n, i) =>
        this.tone(n, n * 0.84, 0.22, 0.055, 'triangle', 'impact', 'anticipation', 0.22 + i * 0.28),
      );
    } else
      this.noise(
        id === 'chappal' || id === 'tomato' ? 0.25 : 0.12,
        id === 'bonk' ? 850 : 2300,
        0.09,
        'impact',
        'anticipation',
      );
  }
  hit(id: AttackId, crit = false, pan = 0) {
    if (!this.audible()) return;
    this.duck();
    const family = id === 'thunder' ? 'punch' : id === 'emotional' || id === 'roast' ? null : id;
    if (family && family in core) {
      const path = this.next(family as Core);
      if (
        !this.sample(
          path,
          id === 'thunder' ? 0.95 : 0.75,
          pan,
          'contact',
          0.97 + Math.random() * 0.06,
        )
      )
        this.noise(
          id === 'tomato' ? 0.22 : 0.11,
          id === 'slap' ? 3500 : 1600,
          0.31,
          'impact',
          'contact',
        );
    }
    switch (id) {
      case 'slap':
        this.tone(170, 75, 0.12, 0.15, 'sine');
        break;
      case 'punch':
        this.tone(105, 40, 0.27, 0.42, 'sine');
        break;
      case 'chappal':
        this.sample(rubber, 0.28, pan, 'accent');
        this.tone(150, 65, 0.14, 0.12, 'sine');
        break;
      case 'bonk': {
        this.bonks = Date.now() - this.lastBonk < 1500 ? this.bonks + 1 : 0;
        this.lastBonk = Date.now();
        this.tone([262, 294, 330, 392, 440][this.bonks % 5], 88, 0.24, 0.22, 'triangle');
        break;
      }
      case 'tomato':
        this.sample(droplets, 0.35, pan, 'accent');
        this.tone(310, 80, 0.21, 0.09, 'triangle');
        break;
      case 'thunder':
        this.tone(72, 30, 0.64, 0.54, 'sine');
        this.noise(0.28, 500, 0.1, 'impact', 'accent');
        break;
      case 'emotional':
        [330, 311, 294].forEach((n, i) =>
          this.tone(n, n - 30, 0.3, 0.09, 'sawtooth', 'impact', 'accent', i * 0.12),
        );
        break;
      case 'roast':
        this.tone(310, 800, 0.21, 0.17, 'triangle');
        break;
    }
    if (crit) {
      this.tone(500, 810, 0.12, 0.13, 'triangle', 'ui', 'accent');
      this.tone(750, 1150, 0.17, 0.08, 'sine', 'ui', 'accent', 0.06);
    }
  }
  combo() {
    if (Date.now() - this.lastCombo < 400) return;
    this.lastCombo = Date.now();
    [330, 440, 660].forEach((n, i) =>
      this.tone(n, n, 0.22, 0.09, 'triangle', 'ui', 'accent', i * 0.055),
    );
  }
  win() {
    this.stopMusic();
    [262, 330, 392, 523].forEach((n, i) =>
      this.tone(n, n, 0.35, 0.1, 'triangle', 'ui', 'ui', i * 0.11),
    );
  }
  miss() {
    this.tone(250, 70, 0.26, 0.2, 'triangle', 'ui', 'ui');
  }
  async test() {
    await this.unlock();
    if (useGame.getState().settings.muted) return;
    const path = core.slap[0];
    await this.load(path);
    this.duck();
    if (!this.sample(path, 0.75, 0, 'contact')) this.noise(0.11, 3500, 0.31, 'impact', 'contact');
    this.tone(170, 75, 0.12, 0.15, 'sine');
  }
  cancelAttack() {
    for (const v of [...this.voices]) if (v.kind === 'anticipation') this.fade(v, 0.025);
  }
  private startMusic() {
    if (this.musicTimer || !this.context || this.context.state !== 'running') return;
    this.nextBeat = this.context.currentTime + 0.03;
    this.beat = 0;
    this.musicTimer = setInterval(() => this.musicTick(), 45);
    this.musicTick();
  }
  private musicTick() {
    const c = this.context;
    if (!c || !this.audible() || useGame.getState().scene !== 'room') return;
    while (this.nextBeat < c.currentTime + 0.11) {
      const step = this.beat % 16,
        rage = useGame.getState().fight.rage;
      const delay = Math.max(0, this.nextBeat - c.currentTime);
      if (step % 4 === 0) this.tone(78, 43, 0.14, 0.18, 'sine', 'music', 'music', delay);
      if (step === 4 || step === 12)
        this.tone(240, 100, 0.045, 0.032, 'triangle', 'music', 'music', delay);
      if (rage >= 35 && step % 4 === 2)
        this.tone(55, 49, 0.16, 0.085, 'triangle', 'music', 'music', delay);
      if (rage >= 65 && step % 2 === 1)
        this.tone(1500, 700, 0.022, 0.012, 'square', 'music', 'music', delay);
      this.nextBeat += 0.15;
      this.beat++;
    }
  }
  private stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
    for (const v of [...this.voices]) if (v.kind === 'music') this.fade(v, 0.08);
  }
  suspend() {
    this.stopMusic();
    this.cancelAttack();
    void this.context?.suspend();
  }
  resume() {
    if (!useGame.getState().settings.muted) void this.context?.resume().then(() => this.sync());
  }
}
export const audio = new SoundEngine();
