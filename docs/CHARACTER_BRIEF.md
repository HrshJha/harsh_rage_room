<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 8. Character specification — "Cartoon Harsh"

### 8.1 Style
Chunky thick-outline sticker style, big head (≈ 55% of height), small body, expressive brows. Flat fills with one shadow tone; **no SVG filters or blurs** (perf). Recognisable via silhouette: signature hairstyle, glasses (if applicable), a signature tee. *Harsh supplies the real-world cues (hair, glasses, favourite hoodie); the art brief is in `docs/CHARACTER_BRIEF.md`.*

### 8.2 SVG rig (layer IDs are a contract)
```
harsh-root
├─ shadow
├─ body            (torso, arm-l, arm-r, laptop-prop)
├─ head
│  ├─ hair-back, hair-tuft, ear-l, ear-r
│  ├─ face (cheek-l, cheek-r, nose)
│  ├─ brow-l, brow-r
│  ├─ eye-l (sclera, pupil, lid), eye-r (…)
│  ├─ glasses
│  ├─ mouth-{neutral,o,smirk,grit,wail,tongue,flat}
│  └─ extras: sweat, tear-l, tear-r, stars, zzz, spiral, bump-1..3, bandaid-1..2
└─ decal-layer
```
Use `transform-box: fill-box; transform-origin: center` in CSS for part pivots. Placeholder rig (geometric shapes) ships first so animation work isn't blocked.

### 8.3 Expressions
neutral · suspicious · smug · nervous · surprised · wince · ouch · dizzy (spiral) · deadpan · betrayed · tearful · asleep · ghost (soul leaves) · defeated (K.O. sprawl) · retaliation (R3). Each = brow angle/offset, eye scale/pupil, mouth swap, optional extras.

### 8.4 Idle brain (weighted random, 1.5–4 s)
blink 25% · look around 20% · sigh 12% · yawn 8% · tap on tiny laptop 12% · scratch head 8% · whistle 5% · glance at pointer 10%. After 8 s idle: eyebrow-raise taunt. After 15 s: asleep.
Pointer tracking: pupils ≤ 4 px, head tilt ≤ 3°, parallax layers 2–6 px (desktop pointer / last tap on mobile; disabled in Calm Motion).

### 8.5 Hit reactions
Never repeat the same reaction twice in a row (no-repeat deck per attack×zone×severity). Severity: light (<8 dmg), medium, heavy (>14), crit. At least 3 variants per attack for medium; heavy has unique ones. Reactions return to idle via `elastic.out(1, 0.35)` ≤ 450 ms; interruptible.

---


