# HARSH RAGE ROOM — Arcade audio production addendum

> **Version:** 2.1 · **Date:** 1 October 2026 · **Status:** implementation specification with open listening and device QA.
>
> **Authority:** This document replaces the sound direction in PRD §11 and §5 of the arcade direction addendum. The original PRD still governs the game outside sound. Five everyday moves now use edited CC0 Foley previews with synthesized accents; final mix and real-device listening checks remain open. Proposed numbers are **project targets**, not browser guarantees or published loudness standards.

**Current implementation (1 October 2026).** The game ships 18 varied contact clips and two material layers sourced from individually checked CC0 Freesound pages. The clips are short edits of compressed HQ previews, not lossless masters or a new in-house Foley recording session. Hits fire at the accepted visual contact callback, with per-move synth accents, no immediate repeated take, impact panning, a 16-voice budget, graceful missing-file fallback, a test cue, and an optional rage-reactive bed that ducks under hits. The [source ledger](audio/ASSET_CREDITS.csv) and [rebuild notes](audio/README.md) are part of this implementation. The review and device targets below remain open until they are listened to and measured on real devices.

## 1. The sound of the room

The joke is a tiny fictional action presented with championship-level seriousness. A move should first sound like a **specific safe material**—palm on padded leather, glove on bag, rubber slipper on cushion, foam mallet on a hollow prop, tomato on a tray—and then receive one short arcade exaggeration. A louder generic boom is not a stronger move. The listener should recognize the move with eyes closed, including on a phone speaker. No voice line or effect may suggest realistic injury.

The energy arc is **quiet curiosity → one cabinet cue after sound is enabled → isolated first hit → rhythmic variation → one special peak → a breath of silence → result**. Sound stays off by default until a clear visitor gesture enables it. Mute and a master volume slider remain visible in the room; sound is never required to understand a result. Browsers commonly block audible playback before interaction, and W3C advises user-initiated audio with independent controls. [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [W3C audio control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html).

### Sonic vocabulary

| Family | Job | Character | Typical length |
|---|---|---|---|
| Air/cloth movement | Make travel readable | Filtered, directional, quiet | 80–220 ms |
| Material contact | Identify the move | Real recorded transient, usually centred | 50–180 ms |
| Body/prop resonance | Add weight without an injury sound | Low-mid, controlled on small speakers | 80–250 ms |
| Arcade sweetener | Turn material into a comic beat | Pitch drop, spring, star ping or tiny chord | 80–350 ms |
| UI and score | Confirm an action | Dry mechanical click, concise note | 30–120 ms |
| Background bed | Hold the room together | Optional, quiet, sparse rhythm | Loopable; off by default |

Use fewer layers when the material sound already works. The source recording must remain audible in the complete mix. A critical hit changes **space, arrangement and timing** before it changes level. Emotional Damage uses silence as its signature.

## 2. Move recipes and contact sheet

All timing below is relative to the **visual contact marker at `t = 0`**. These are edit targets, not a promise of exact acoustic simultaneity on every device. Every effect must survive a missing sample by using the current procedural sound or silence, while the visual attack completes normally. Use safe props and surfaces; do not strike a person.

| Move | Recorded core and safe capture | Layer choreography relative to contact | Variation and restraint |
|---|---|---|---|
| **Slap** | Palm on doubled leather pad or soft upholstery; 5–6 clean takes. | Cloth swipe `−130 ms`; dry palm crack `0`; short padded low-mid thump `+8 ms`; optional tiny comic pop `+55 ms`. Keep the crack forward. | Four approved cracks minimum. Swap swipe and tail independently. Rare squeak no more than 1 in 10 hits. |
| **Punch** | Boxing glove on heavy bag or padded training shield plus a separate cushion thud; 4–5 takes. | Close air rush `−170 ms`; glove transient `0`; bag body `+5–12 ms`; very short arcade bass accent `+15 ms`. Keep bag texture above the bass. | Three weight classes chosen by move strength; do not randomize a heavy hit for every tap. Punch may feel fuller than slap without a large peak jump. |
| **Chappal** | Foam/rubber slipper flex, swing and tap on cushion or folded mat; 4–5 takes. | Rubber swish `−200 ms` following the curved path; slipper slap `0`; flap/rattle `+30–70 ms`; occasional tiny squeak. | Core rubber signature stays stable. Rotate flap and impact takes. Gently pan travel, centre the contact. |
| **Bonk** | Foam mallet on hollow wood or plastic prop; 4 distinct resonances. | Small air cue `−120 ms`; hollow knock `0`; tuned resonant body `+10 ms`; two tiny star pings `+75/+145 ms`. | Rotate real resonances; use the established rising bonk ladder for short combos. No long metallic ring. |
| **Tomato** | Tomato crush on a tray or wet sponge squeeze; separate light droplets; 4 dry/wet takes. | Throw swish `−220 ms`; short wet splat `0`; droplets `+60–120 ms`; perhaps a quiet bubble. | Two dryness groups; avoid visceral squelch or gore associations. Tail remains quieter than splat. |
| **Thunder Punch** | The approved glove/bag punch remains the centre; short metal rattle or designed crackle is an accent. | Charge from about `−450 ms`; rush `−90 ms`; glove contact `0`; compact low-mid hit `+10 ms`; victory sting only after impact. | Normal and rare critical arrangement. Keep the critical's peak near the normal version; thin the bed first. Avoid a sustained electric whine. |
| **Emotional Damage** | One dry UI tick, optional room tone; no contact sound. | Duck the bed from `−120 ms`; tick or tape stop `0`; 150–300 ms comedic silence; understated text/voice after the pause. | Alternate tick, soft notification and silence. No bass hit. |
| **Combo finisher** | Reuse the actual move recordings, then one authored finisher accent. | Each accepted hit keeps its own contact marker. One small ascending cue follows the final hit, never every hit at once. | Named sequences can change the final cadence; cap one finisher sting per combo window. |

Make the first Slap the reference mix. It should have one clean, immediate contact and a readable Harsh reaction; extra tails are earned by repeated play. Foley for the five everyday moves is **P0** for this addendum. Thunder, Emotional Damage and combo polish are **P1**, while optional voice is **P2**. This priority replaces the original PRD's procedural-only launch assumption for a future audio-focused release; it does not imply the shipped local prototype already has these files.

## 3. Variation that sounds authored

For every frequently repeated impact, create at least **four approved contact takes for Slap** and **three each for Punch, Chappal, Bonk and Tomato**. Build a shuffled bag per move; do not replay the previous take, and avoid the previous two when at least four suitable takes exist. Refill the bag only after its current set is exhausted. Classify takes by light/medium/heavy and choose within the current intensity class before applying randomness. Store a stable event seed when a recorded session must replay identically.

Apply subtle changes only after the takes are matched: core-contact playback rate roughly **0.97–1.03**, swipe/tail rate **0.95–1.05**, onset jitter within **±8 ms** for non-contact layers, and level trim within **±0.75 dB**. Keep the primary contact on `t = 0`. Pitch changes from playback-rate also change duration; audition the shortened and lengthened versions. Never randomize the master gain or make a critical hit a surprise volume jump. If the same move is tapped during a tail, fade that tail over about 20–40 ms or use the voice cap below.

Three types of contrast matter: **material** (leather, rubber, hollow prop, wet splat), **temporal shape** (sharp slap versus longer bonk), and **aftertaste** (spring, flap, droplets or silence). Multiple exported takes that differ only in file name do not count as variation.

## 4. Mix, dynamics and adaptive bed

Use one graph: decoded sample or synth voice → per-voice trim/pan → `impact`, `ui`, `voice` or `music` bus → gentle bus control → master mute/volume → destination. A `DynamicsCompressorNode` can control overlapping peaks, but it is **not a true-peak limiter** and cannot replace edited source files or measurement of the summed output. [MDN compressor reference](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode).

| Element | Starting relationship to a normal contact | Behaviour |
|---|---|---|
| Material transient | Reference | Clear and central; one primary transient per accepted hit. |
| Whoosh and comic tail | About 6–12 dB quieter by ear | Pan or widen movement, then get out of the way. |
| Arcade bass accent | Quiet enough that the real material still identifies the move | Emphasize 100–350 Hz on small speakers; avoid relying only on sub-bass. |
| UI click | Clearly below attacks | Cancel or coalesce rapid repeated clicks. |
| Optional background bed | About 15–20 dB beneath a hit by ear | Its arrangement grows with rage; its steady output level does not. |
| Optional voice | Clear over the bed, lower than impact | Max one line per several seconds; independent voice toggle. |

These relative trims are starting points to audition, not a claim that numerical amplitude alone predicts perceived loudness. **House delivery targets:** editable masters retain at least about 6 dB of sample-peak headroom; the loudest rendered combination stays below **−3 dBTP** after encoding; no audible crackle, clipped transient or sudden critical-hit leap. Check with a true-peak meter and by listening. This is a project comfort target, **not** an EBU or browser requirement. EBU R 128 describes broadcast programme loudness and true-peak measurement; applying its −23 LUFS programme target to a 100 ms game slap would be a category error. Measure short effects by their transient, spectral balance and relative listening level, then assess longer bed/result passages separately. [EBU loudness overview](https://tech.ebu.ch/loudness/), [EBU short-form supplement](https://tech.ebu.ch/publications/r128s1), [FFmpeg filters](https://ffmpeg.org/ffmpeg-filters.html#ebur128).

At contact, duck the bed about **6–9 dB**, beginning around 10–20 ms before a planned impact when possible, holding for 60–100 ms, and recovering over 180–300 ms. On an unplanned tap, start the duck immediately; never delay gameplay for an envelope. During the comic hit-stop, let the contact and brief tail remain audible while music and incidental effects step back. A crit earns a short pre-hit dropout and a distinct sting, not a higher output ceiling. Maintain one master volume and mute path for **every** sound. `Mute` silences immediately; `Sound test` plays a representative normal hit at the selected level, never the loudest critical. Persist volume and mute with the existing local settings mechanism.

The background bed is optional and **off by default**. If enabled, keep one small seamless arcade groove at a stable pulse (initial concept: 115–125 BPM). Add or remove percussion/arp layers at rage thresholds; do not accelerate every loop or raise the master. Return to a sparse bed after a result. Use original synthesis or a separately licensed recording, not a recognizable song. Voice lines, if recorded with the subject's approval, remain off by default and are loaded only when enabled.

## 5. Playback and synchronization contract

Use a single `AudioContext`, created or resumed from the visitor's sound-on gesture; request `latencyHint: 'interactive'` but treat it as a hint. Load short samples with `fetch` and `decodeAudioData` once, cache `AudioBuffer`s, and create a **new** `AudioBufferSourceNode` for each playback because source nodes are one-shot. Start with a broadly supported MP3 delivery file; add Opus only after browser/device checks show a real size benefit and dependable decoding. Preserve lossless WAV masters outside the public build. [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode), [MDN codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs).

The animation controller emits `attackAnticipation`, `attackContact`, `attackRecovery` and `attackCancelled` with an attack ID and move ID. Schedule movement layers from anticipation; trigger the material transient from the **accepted** contact event, not from button press, sprite start, network delivery or a rejected tap. Play only one primary contact per accepted attack. The sound manager returns a cancel/fade handle so a scene change, hidden tab or aborted timeline cannot leave a loop or hanging gain envelope. Decode core hit assets before the first room attack; never block an attack on the network. A missing or failed file uses the existing procedural cue once and records a local diagnostic without exposing visitor content.

Web Audio's clock can schedule a buffer precisely, but actual acoustic onset includes browser and device output latency. Use `AudioContext.getOutputTimestamp()` or `outputLatency` when available for diagnostics, then tune the animation/contact offset by **recording a real device's screen and audio**. Do not assume those APIs remove latency or work on every older device. Proposed first-pass acceptance: median perceived contact error within **±50 ms** on tested desktop and **±80 ms** on tested phones, with no obvious late hit in a ten-move replay. Document measured devices and methods. These thresholds are team targets to refine after listening. [MDN output timestamp](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp), [MDN output latency](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency).

Cap active sample/synth voices around **16**, with one protected contact transient per accepted hit. When full, steal the oldest quiet tail or ambience voice first, fading it briefly; never cut the hero transient to preserve a star ping. Rate-limit UI clicks and combo stings separately. Suspend on `visibilitychange: hidden`; on return, resume only if the visitor opted into sound and the browser permits it. Audio errors must not stall the visual timeline. Schedule gain changes with `AudioParam` automation rather than competing direct writes after envelopes are queued. [MDN AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam).

## 6. Foley session and asset pipeline

1. **Plan the props.** Leather pad/upholstery, glove and training shield, foam/rubber chappal and cushion, foam mallet and hollow box, tomato or wet sponge and washable tray. Record surfaces, not bodies. Work away from copyrighted music and other voices. If anyone else records or voices material, obtain a written grant for use in this game and future edits.
2. **Capture.** Prefer 48 kHz, 24-bit WAV or recorder-native lossless; use a phone for drafts if needed. Set gain so the hardest rehearsal hit does not clip. Mark prop, surface, distance and take number. Capture 5–10 seconds of room tone at each setup. Record close and roomier takes, and at least the take counts in §2.
3. **Edit.** Remove handling noise and dead air, preserve the first transient, use a small leading margin and 3–8 ms fade where needed to avoid clicks. Remove DC offset and excessive low rumble. A short tail may need 20–60 ms fade. Do not hard-normalize every layer to the same peak or erase material texture with heavy denoising.
4. **Design.** Keep an editable session with each layer separate. Make a contact-only version, then add movement, body and sweetener one at a time. Compare at matched perceived level. Bounce each approved variant and inspect its waveform at the intended contact marker.
5. **Encode.** Retain masters in a non-public `audio-source/` location. Export short mono MP3s at a quality that survives blind listening; start around 96–128 kb/s, then compare a smaller encode. Mono is appropriate for most contact sounds; pan at playback. Verify decoded onset after encoding because encoder padding can shift tiny transients. Avoid shipping unused takes.
6. **Measure and listen.** Render the normal hit, critical hit, fastest accepted combo and result sequence to lossless audio for peak/true-peak review. Check tiny phone speaker, laptop, and headphones at low and moderate volume. Adjust material balance before adding loudness. Recheck after the browser integrates the files.

For an approved mono master, these are reproducible **delivery and measurement examples**, not an automatic mix preset. Replace paths with the actual approved files; compare the decoded MP3 to its master. The `ebur128` report includes true peak for a rendered *complete sequence*, which is more informative than checking a single layer in isolation. [FFmpeg filter documentation](https://ffmpeg.org/ffmpeg-filters.html#ebur128).

```sh
ffmpeg -i audio-source/slap-contact-01.wav -ac 1 -c:a libmp3lame -b:a 112k web/public/audio/slap/contact-01.mp3
ffmpeg -i audio-source/qa-fastest-combo.wav -filter_complex 'ebur128=peak=true' -f null -
```

Suggested first asset manifest (names are examples, not completed assets):

```text
web/public/audio/
  ui/cabinet-enter.mp3             ui/button-01.mp3
  slap/contact-01..04.mp3          slap/swipe-01.mp3
  punch/contact-01..03.mp3         punch/air-01.mp3
  chappal/contact-01..03.mp3       chappal/rubber-01.mp3
  bonk/contact-01..03.mp3          bonk/star-01.mp3
  tomato/contact-01..03.mp3        tomato/droplets-01.mp3
  special/thunder-charge.mp3       special/combo-finish.mp3
```

P0 loads only the UI cue and five everyday-move families when sound is on. Specials and the optional bed load when needed. Initial working budget: **≤350 KB transferred for core audio** and **≤1.2 MB for all optional audio**, measured after encoding. These are product budgets to test, not guarantees; preserve quality if a smaller file damages a recognizable transient.

## 7. Sources and rights

**Recommended order:** (1) original self-recorded prop Foley for the five signature moves; (2) a small licensed CC0 pack for generic UI and arcade accents; (3) individual sourced effects only where a real gap remains. None of the pages below is approval for an unseen individual file.

| Source | Best use | Rights check before shipping |
|---|---|---|
| [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) / [UI Audio](https://kenney.nl/assets/ui-audio) | Generic cabinet clicks and UI confirmations, not all five hero impacts. | The asset pages identify these packs as **CC0**; Kenney says game assets on asset pages can be used commercially without required attribution. Still record pack, filename and date. [Kenney support](https://kenney.nl/support). |
| [Freesound](https://freesound.org/) | Specific rubber, wet, hollow or room Foley when original capture falls short. | License is **per file**: CC0, CC BY and CC BY-NC are all present. Prefer CC0; CC BY requires creator credit, license link and change notice. Exclude NC for this project's deployable baseline. Uploaded material can still have provenance problems, so audition and review individual pages. [Freesound FAQ](https://freesound.org/help/faq/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). |
| [Sonniss GDC Game Audio Bundle](https://gdc.sonniss.com/) | A carefully chosen professional layer if a suitable source cannot be recorded. | Current v2.0 license allows use in finished games and interactive projects, but bars supplying the sounds **as sounds**, including modified or redesigned files in sound packs/templates; AI training is prohibited. For a web game with directly fetchable audio URLs, review the specific delivery plan before selecting it. Keep the license version and download date; the applicable version is the one published when downloaded. [Sonniss license](https://sonniss.com/gdc-bundle-license/). |

CC0 does not establish that an uploader truly owned a recording and does not waive unrelated personality or trademark rights. Avoid recognizable songs, third-party dialogue, famous game/movie hit sounds, and realistic injury audio. For every chosen source, record **asset ID, local file, original URL, creator, exact license/version, download date, modification, required public credit, approval, and file hash** in `docs/audio/ASSET_CREDITS.csv`. Keep a copy or screenshot of the relevant license terms in the private production folder when they can change. Publish required attribution alongside the finished project; do not conceal it in a private ledger. [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## 8. Delivery order and release review

**Pass 1 — reference hit:** Record and implement four Slap takes, swipe and one restrained low-mid accent. Confirm contact timing and the mute/volume path in the existing app. If Slap does not sound good at low volume on a phone, fix its material and timing before designing a bigger special.

**Pass 2 — material identities:** Produce Punch, Chappal, Bonk and Tomato with the approved take counts and shuffled-bag rules. Preserve current procedural cues as fallback. Review all five in a blind A/B session at matched overall level.

**Pass 3 — full mix:** Add group buses, ducking, voice limit and optional bed. Design Thunder, Emotional Damage, combo and result stingers. Build a sound-test control; verify the bed stops when muted or hidden.

**Pass 4 — device and rights gate:** Measure normal, critical and rapid-combo output; review five moves on actual phone speaker, laptop and headphones. At least four of five listeners should distinguish each of the five core moves by sound alone in an informal blinded check. Check visual-only play, screen-reader use, muted play, headphone comfort, browser reload, in-app browser audio unlocking, missing file recovery and no stuck sound after switching scenes. This listener test is a **proposed acceptance check**, not a result already achieved. Every shipped external file must have a completed credits row and an allowed use.

**Ship when:** first contact feels immediate; all five material identities are audible at a comfortable low level; no obvious identical repeat in a 20-hit run; a ten-hit rapid sequence does not clip or leave tails behind; music ducks under accepted impacts; sound off never blocks progress; actual-device timing and licensing checks are documented. Report any failed or untested item as open rather than calling the audio upgrade complete.
