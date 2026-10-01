<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 9. Individual attack specifications

> Times in ms from input. Eases are GSAP names. "HS" = hit-stop (global timeline slowed to 5% for N ms, restored with real-time `setTimeout`). "Shake(px, ms)" decays linearly on `#stage` only. All attacks: input lock 280 ms soft (1 queued input buffered for 250 ms). `prefers-reduced-motion`/Calm: replace motion with a 3-frame comic-panel cut + opacity fade, no shake/flash.

### 9.1 SLAP
| t | Visual | Audio | Text |
|---|---|---|---|
| 0 | Giant hand enters from the side opposite tap; Harsh's pupils snap to it, brows up | `whoosh_a` pan from entry side, 120 ms noise sweep 800→2400 Hz | — |
| 0–140 | Anticipation: hand pulls back 40 px, rot −15° (`power2.out`) | — | — |
| 140–200 | Strike arc, 3 ghost copies (35/20/10% opacity) (`power4.in`) | rising whoosh peak | — |
| 200 | **Impact**: HS 70, face squash X1.25/Y0.8, head snaps 25° away, cheek jiggle, handprint decal, impact ring 0→1.6 in 180 ms, 8 droplets with gravity, Shake(6,160) | `slap_hit` (sample + 180→60 Hz sine thump 90 ms), pitch ±6% | **WHAP!** (Bangers 96 px, ±8° rot) |
| 270–650 | Head returns `elastic.out(1,.3)` 380 ms; 30% chance spiral eyes 600 ms; hand exits 150 ms | — | Caption from §12.5 |
Variants: left/right; second slap ≤ 400 ms = **backhand** (hand flips); 1-in-12 **windmill slap** (hand spins 720° first).

### 9.2 PUNCH
| t | Visual | Audio | Text |
|---|---|---|---|
| 0–120 | Fist (perspective via scale) pulls back 0.9× then charges | `whoosh_b` low | — |
| 120–190 | Strike scale 0.4→1.35 toward face (`expo.in`) | — | — |
| 190 | **Impact**: white flash overlay 0.85→0 in 90 ms (single flash), HS 100, radial speed lines burst, Harsh knocked back (scale 0.92, rot 12°), Shake(10,220), halftone burst | `punch_hit` (sub thump 60 Hz + noise crack + 40 ms low-pass tail) | **POW!** |
| 300–700 | Harsh wobbles back; glasses fly off arc if zone=glasses | `debris_tick` | Caption |
Variants: hook left/right; **uppercut** (tap lower face): Harsh lifts 40 px, drops with `thud` + dust puff.

### 9.3 CHAPPAL
| t | Visual | Audio | Text |
|---|---|---|---|
| 0 | Chappal appears at bottom corner nearest tap; spins 720–1080° along a cubic Bézier arc (GSAP MotionPath) apex above Harsh; scale 0.5→1.2; 520 ms `power1.inOut` | `chappal_fly`: Doppler glide 900→500 Hz + pan throw-side→centre | — |
| 520 | **Impact**: sticks to face, face wrinkles, HS 80, Shake(7,180) | `chappal_hit` (recorded thwack) | **THWACK!** |
| 520–1100 | Chappal peels slowly, falls, bounces twice, joins the **pile** (max 6 on floor) | `bounce_soft` ×2 | Caption "Aaj kal ke bacche…" |
Variants: 1-in-10 **boomerang** (returns off-screen); 1-in-50 **GOLDEN CHAPPAL** (crit, choir pad sting).

### 9.4 BONK
| t | Visual | Audio | Text |
|---|---|---|---|
| 0–160 | Wooden mallet rises overhead (`power2.out`) | tiny creak | — |
| 160–240 | Drops (`power3.in`) | whistle fall | — |
| 240 | **Impact**: head squashes Y0.6 for 90 ms, eyes bulge, bump decal pops (`elastic.out`), HS 90, Shake(8,200) | `bonk_N` — hollow FM-ish tone; **N climbs a pentatonic scale on consecutive bonks (resets after 1.5 s)** | **BONK!** |
| 330–1500 | 5 stars orbit head (sin/cos path, 1.2 s) → "DAZED" tag, stun 1.2 s | `star_tinkle` | Caption |

### 9.4b TOMATO
| t | Visual | Audio | Text |
|---|---|---|---|
| 0 | Tomato lobbed from bottom centre in a lazy arc 420 ms, rotates | `lob` (soft whoosh) | — |
| 420 | **Impact** at tap point: splat decal (4 shapes, random rotation), 12 pulp particles, Harsh blinks slowly, 400 ms deadpan pause | `splat` (recorded squish or noise burst + wobbling low-pass) | **SPLAT!** |
| 600–3000 | Drips slide down (`power1.in`), decal persists | `drip` ×2 (quiet) | Caption "…really?" |
Tomato Rain: 3 taps in 1 s → 12 tomatoes shower (particle cap applies).

### 9.5 THUNDER PUNCH (ultimate)
| t | Visual | Audio | Text |
|---|---|---|---|
| Hold 0–1200 | Screen dims 40%, vignette pulses like a heartbeat, fist glows; SVG electric arcs jitter at 20 fps; Harsh shakes, sweats, mouths "…no" | `thunder_charge` rising saw + sub; vibrate pulses accelerating (Android) | "CHARGING…" |
| Release | 1-frame white-out → lightning bolt from top (3 jittered segments, 120 ms) | `thunder_crack` | — |
| +120 | Fist rockets in; **HS 160**, camera punch-in to 1.15 scale, screen-crack overlay drawn with DrawSVG 180 ms | `thunder_boom` (sub sine + noise tail) + `orchestral_sting` (synth saw chord) | **THUNDER PUNCH!!!** (extruded 3D type) |
| +320 | Harsh launched upward off-screen; crater decal; lower third "HARSH IS STILL IN ORBIT" | whistle rise | — |
| +1700 | Harsh crash-lands, bounce, dust | `thud_big` | Caption |
Tap (no hold) = 0.9 s auto-charge. Only one flash per attack (photosensitivity).

### 9.6 EMOTIONAL DAMAGE — "Sharma Ji Ka Beta" (ultimate)
| t | Visual | Audio | Text |
|---|---|---|---|
| 0 | Stage desaturates; Harsh's expression → suspicious | low drone | "ONE MOMENT…" |
| 300 | **Triple zoom-in** on face: 1.0→1.35→1.7→2.0, each snap 120 ms with hard cut | `triple_sting` (original synth: three stabbing minor chords) | — |
| 900 | Silhouette of Sharma Ji's son slides in bottom-right, slick hair, holding a marksheet: **"9.9"** | flute-ish synth motif (original) | — |
| 1500 | Harsh's own number (`{cgpa}` from `facts.json`) floats down and crumbles; ego bar segments fall off one by one | `crumble` ticks | **EMOTIONAL DAMAGE** (glitch type) |
| 2200 | Harsh's soul (translucent duplicate) drifts upward; one anime tear squirts; tiny violin | `violin_sad` | Caption "HARSH'S EGO: BUFFERING" |
| 3200 | Colour returns, Harsh whispers "…ok" | — | — |

### 9.7 ROAST
| t | Visual | Audio | Text |
|---|---|---|---|
| 0 | Card picker slides up (6 cards from a 30-card deck; shuffle button) → select | `card_pick` | — |
| 0–… | Roast is split into words (SplitText); each word flies from the bottom into Harsh's face, stagger 90 ms, tiny flinch per word; **last word hits hardest** | `word_tick` pitch rising per word, final `roast_hit` | The words themselves |
| +end | Harsh's speech bubble comeback (§12.6); **Burn Rating: 8.7/10 (peer reviewed)** fake stat | `rimshot_synth` | — |
`P1`: typed roast (≤ 80 chars, filtered, §16.6).

### 9.8 WHIFF (miss)
Weapon continues off-screen and clatters; Harsh watches it go, then looks at the visitor, deadpan: "…". Counts as a miss in accuracy. `whiff_sad` trombone-ish synth.

### 9.9 K.O.
Final blow → HS 250, slow-mo 20% for 600 ms, **K.O.** slam, bell, confetti (≤ 60 particles), Harsh sprawls with a ghost, Chota Sher dashes in with a megaphone: "AND THE WINNER IS… SOMEONE WITH A CHAPPAL." → VERDICT in 2.4 s.

---


## 10. Motion system

### 10.1 Which tool where
| Tool | Use for | Verdict |
|---|---|---|
| **GSAP core + timelines** | All choreography: attacks, scene transitions, rig reactions, hit-stop via `timeScale` | **Primary** |
| **GSAP MotionPath** | Chappal/tomato arcs | Use |
| **GSAP SplitText** | Title slams, roast words | Use |
| **GSAP DrawSVG / CustomWiggle** | Screen cracks, lightning, shake | Use |
| **CSS keyframes** | Idle breathing, button wobble, parallax, halftone drift (transform/opacity only) | Use |
| **Canvas 2D** | Particles, speed lines, certificate | Use |
| Motion/Framer Motion | — | Skip (duplicate engine) |
| Lottie/dotLottie | — | Skip |
| Rive | Character v2 | P2, only if SVG rig feels stiff |
| Three.js / WebGL | — | Skip (cost ≫ benefit) |

### 10.2 Principles
1. **Anticipation → strike → hit-stop → impact → reaction → recovery** for every attack.
2. **Squash & stretch** on every body hit; volumes feel conserved.
3. **Overlap/follow-through**: glasses, hair tuft, shirt lag 40–80 ms behind the head.
4. **One hero effect per hit**; secondary effects ≤ 2.
5. **Exaggerate timing, not duration**: fast in, slow out; never longer than 1.2 s before the next input is accepted.
6. **Variation**: random ±8% on scale/rotation/duration; no two identical reactions in a row.

### 10.3 Motion tokens
| Token | Value | Use |
|---|---|---|
| `--t-micro` | 90 ms | hover/press |
| `--t-snap` | 140 ms | strikes |
| `--t-base` | 240 ms | UI |
| `--t-slow` | 420 ms | screen wipes |
| Ease impact | `power4.out` | impacts |
| Ease pop | `back.out(2.2)` | title/buttons |
| Ease wobble | `elastic.out(1, 0.35)` | returns |
| Ease strike | `expo.in` / `power4.in` | wind-ups into hits |

### 10.4 Orchestration rules
- **One hero attack timeline at a time**; extra input buffered once (250 ms). Light attacks (slap, tomato) may overlap ≤ 3 by fast-forwarding the older reaction (`tl.progress(1)`).
- Every scene/attack uses `useGSAP({ scope })` so `revert()` kills timelines on unmount — no leaks.
- Pause all timelines and audio on `visibilitychange: hidden`; resume on visible.
- `will-change: transform` only on the character root, hand/fist/mallet props, and text-pop layer; remove after use.
- No layout-triggering properties (`top/left/width/height`) in animation. `transform` + `opacity` only.

### 10.5 Effects budget
| Effect | Full | Lite (auto when FPS < 40 over 1 s, `hardwareConcurrency ≤ 4`, or `deviceMemory ≤ 2`) |
|---|---|---|
| Particles on screen | ≤ 150 | ≤ 60 |
| Ghost/motion-blur copies | 3 | 0 |
| Screen shake | on | on (reduced) |
| Halftone parallax | on | static |
| Confetti | 60 | 20 |
| Decals | 12 | 6 |

### 10.6 Screen transitions
- Question → question: diagonal comic wipe (clip-path polygon, 420 ms `power3.inOut`) with a "whoosh" and a halftone burst at the seam.
- INTRO → ANGER: title shoots off-screen top-left while buttons drop.
- ANGER → ROOM: VS card (Harsh vs YOU) slams, 900 ms, then "ROUND 1 — FIGHT!" with `fight_bell`.
- ROOM → VERDICT: slow-mo K.O., spotlight iris closes to the gavel.

---


