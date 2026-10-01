<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 11. Sound design

### 11.1 Principles
- Sound is half the joke. **Every attack = whoosh (anticipation) + impact (hero) + reaction foley + optional voice.**
- Layer 2–3 sounds per impact (low thump + mid body + high click) so it punches on phone speakers.
- Randomise: 3 variants per hero sound, playback-rate ±6%, gain ±1.5 dB, stereo pan from impact x-position.
- Silence is a tool: during hit-stop everything except the impact tail ducks −6 dB for the freeze.

### 11.2 Source strategy
| Tag | Meaning | Examples |
|---|---|---|
| **S** | Procedural (Web Audio synth), zero files | UI, whooshes, bonk, thunder, stings, jingles, meters |
| **R** | Self-recorded foley (phone + Audacity) | chappal thwack, slap, tomato squish, gavel knock |
| **V** | Harsh's own voice | 8 optional lines |
| **E** | External CC0/licensed | fallbacks only |

**DIY foley session (≈ 45 min):** (1) chappal slapped on a cushion and on a door; (2) real slap on a thigh/wet towel; (3) squish a ripe tomato in a bowl (or wet sponge); (4) knock a wooden board for the gavel; (5) record voice lines close to the phone mic in a quiet room, 3 takes each. Normalise and encode with the commands in `docs/SOUND.md`.

**External sources (log every file in `docs/ASSETS.md` with URL, licence, author, date):**
Kenney audio packs (CC0) · Freesound (**CC0 filter only**) · Pixabay Sound Effects (Pixabay Content License) · Mixkit free SFX · OpenGameArt (CC0 items only). **Do not use** CC-BY-NC or the BBC archive. Retro generators for placeholders: jsfxr / ChipTone (outputs are free to use).

### 11.3 Engine specification `P0`
- Web Audio API, single `AudioContext`, created/resumed on the Gate tap; `latencyHint: "interactive"`.
- Graph: `voices → group gains (ui, sfx, voice, music) → DynamicsCompressor → master gain → destination`. Music ducks −8 dB for 250 ms on any impact via the music gain envelope.
- Sampler: decode MP3 once into `AudioBuffer`s; pools of variants per ID. Synth: `play(id, {pan, pitch, gain})` runs a recipe function that builds oscillators/noise + envelopes and disposes nodes on `ended`.
- Polyphony cap 12; steal oldest non-hero voice first.
- `StereoPannerNode` per voice (fallback: no pan on unsupported browsers).
- Visibility: `suspend()` on hidden, `resume()` on visible.
- Settings: **Mute**, **Master volume** (0–100), **Voice lines** toggle, **Replay test sound** button. Persist in localStorage. Muted by default until Gate choice.
- Budget: ≤ 15 sample files, ≤ 500 KB total, mono MP3 96 kbps; voice pack lazy-loaded only if enabled.

### 11.4 Sound table (ID → trigger → source → recipe notes)
| ID | Trigger | Src | Notes |
|---|---|---|---|
| `ui_hover` | button hover (desktop) | S | 1200→1600 Hz sine blip, 40 ms |
| `ui_click` | press | S | square 800 Hz + noise tick, 60 ms |
| `ui_toggle` | settings toggles | S | two-note up/down |
| `ui_error` | invalid / net fail | S | low saw buzz 120 ms |
| `intro_hit` | Gate/Intro reveal | S | sub boom 55 Hz + chiptune arpeggio C-E-G-C |
| `screen_whoosh` | transitions | S | bandpassed noise sweep 300→3000 Hz |
| `meter_tick` / `meter_full` | anger meter / rage full | S | stepped pitch rise / power-up chord |
| `lie_scan` / `lie_detected` | lie detector | S | ticking ramp / alarm buzz |
| `fight_bell` | ROUND start | S | metallic FM bell (ratio 1:3.5) |
| `whoosh_a/b/c` | attack anticipation | S | filtered noise, centre/pitch per weapon |
| `slap_hit` | slap | R (+S thump) | sample + 180→60 Hz sine thump |
| `punch_hit` | punch | S (+E) | 60 Hz sub + noise crack |
| `chappal_fly` | chappal flight | S | Doppler glide + pan |
| `chappal_hit` | chappal impact | R | recorded thwack |
| `bonk_1..5` | bonk (ladder) | S | sine+triangle, 320→180 Hz drop with hollow resonance; pentatonic transposition per N |
| `splat` | tomato | R / S | noise burst + wobbling low-pass |
| `thunder_charge` | hold | S | rising saw + sub, LFO tremolo accelerating |
| `thunder_crack/boom` | release | S | white noise burst + sub sine tail, light distortion |
| `orchestral_sting` | crit/ultimate | S | stacked saws chord with slow attack/long reverb tail (convolver from generated noise IR) |
| `triple_sting` | Emotional Damage | S | three stabbing minor chords, 120 ms apart |
| `violin_sad` | Emotional Damage end | S | saw + vibrato LFO + band-pass |
| `crit_ding` | crit | S | bright bell |
| `combo_N` | combo | S | ascending notes per combo count |
| `ko_bell` / `victory_jingle` | K.O. / verdict | S | boxing-bell FM / chiptune fanfare 4 bars |
| `gavel` | verdict | R | knock + reverb |
| `stamp` | certificate | R/S | thud + paper flutter noise |
| `slot_tick/win` | slot machine | S | ticks accelerating / jackpot arpeggio |
| `whiff_sad` | miss | S | descending glide |
| `snore` | asleep | S | filtered noise inhale/exhale loop |
| `sher_mrrp` | Chota Sher delivery | S | short chirpy glide |
| `pop_toast` | toast | S | quick pop |
| `v_*` | voice | V | see §11.5 |

### 11.5 Optional voice lines (Harsh records) `P1`
`v_bruh` (BRUHHH) · `v_why_me` (WHY MEEE?) · `v_ouch` (arre yaar…) · `v_not_again` (phir se?!) · `v_sharmaji` (…Sharma ji ka beta) · `v_mummy` ("Mummy ko mat batana") · `v_nooo` (NOOOO) · `v_ok` (…ok.). Trigger ≤ 1 per 6 s, only on medium+ hits, only if voice toggle is on.

### 11.6 Music `P1`
Procedural chiptune loop (bass + arp + noise hat), 120 BPM → up to 150 BPM with rage; −14 dB under SFX; off by default; ducks on impacts. Pure synth, so no licence risk.

### 11.7 Sound accessibility
Everything is understandable without audio (captions, visual impact). No sound before the Gate tap. Volume ceiling −3 dBFS; no sudden full-scale sounds on load.

---


