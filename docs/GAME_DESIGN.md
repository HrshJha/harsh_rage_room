<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 7. Game systems

### 7.1 Ego bar (HP) `P0`
Starts at 100. Damage = `base × zoneMult × comboMult × critMult × sleepMult`. K.O. at 0. Label rotates between EGO / DIGNITY / "WI-FI SIGNAL (HARSH)" to keep the HUD funny. Segmented, chunks crumble on big hits.

### 7.2 Attack catalogue
| Action | Type | Base dmg | Rage gain | Notes |
|---|---|---|---|---|
| SLAP | basic | 6–9 | +8 | Fast, left/right by tap side |
| PUNCH | basic | 9–13 | +8 | Uppercut if tapped on lower face |
| CHAPPAL | basic | 8–11 | +8 | Always lands; pile-up debris |
| BONK | basic | 5–8 | +8 | Stuns 1.2 s → next hit +20%; musical ladder |
| TOMATO | basic | 4–7 | +6 | Splat decals; 3 taps in 1 s = tomato rain |
| ROAST | basic | 10–14 | +10 | Words as projectiles; card-pick (P0), typed (P1) |
| THUNDER PUNCH | ultimate | 28–35 | −100 | Hold to charge; needs 100% rage; auto-crit |
| EMOTIONAL DAMAGE | ultimate | 20–25 | −60 | "Sharma Ji Ka Beta"; no contact |

### 7.3 Hit zones `P0`
| Zone | Mult | Special reaction |
|---|---|---|
| Glasses | ×1.5 | Glasses fly off, spin, land; Harsh squints, fumbles around |
| Nose | ×1.3 | Squeaky "boop", eyes cross |
| Forehead | ×1.2 | Big bump, stars (bonk gets bonus) |
| Cheeks | ×1.0 | Jiggle, handprint |
| Hair | ×0.8 | Tuft boings up, stays up |
| Torso | ×0.7 | Wheeze, shirt wrinkle |
Hit area is padded 16 px beyond the art. Zone is resolved from pointer position → SVG `<path data-zone>` hit-testing.

### 7.4 Crits `P0`
Base 8%; +10% when aiming at glasses; guaranteed on Thunder Punch and when Harsh is asleep. **CRITICAL!** slam, 2× hit-stop, short orchestral sting, gold particles, ×2 damage.

### 7.5 Rage meter `P0`
Starts per anger level (0/25/60/100%). Basic hits add rage (table). At 100%: Chota Sher announces **RAGE FULL**, ultimate buttons glow and shake. Consuming an ultimate resets the cost shown above.

### 7.6 Combos `P0`
Window 2.5 s between hits; combo counter multiplies damage ×1.0 + 0.1·(n−1) up to ×2.0. Named combos (shown as a banner; reported in Telegram):

| Name | Trigger | Banner line |
|---|---|---|
| HAT-TRICK | 3 different attacks in a row | "THREE DIFFERENT WAYS TO SAY HI" |
| DESI MOM SPECIAL | Chappal → Slap → Emotional Damage | "BETA, TUM KITNE BADE HO GAYE" |
| SALAD | 3 tomatoes | "FRESH. ORGANIC. THROWN." |
| BONK-A-DOODLE | 5 bonks | "MOUNT HARSH HAS GROWN" |
| FULL SET | all 6 basics in one combo | "COLLECT THEM ALL" |
| SLAP SANDWICH | slap left then right within 600 ms | "A BALANCED MEAL" |
| SLEEPING BEAUTY | any hit while Harsh snores | "RUDE. EFFECTIVE." |

### 7.7 Sleeping bonus `P0`
After 15 s without input Harsh dozes (Zzz, snore SFX). Any hit while asleep = ×2 and a jump-scare reaction ("I WAS RESTING MY EYES").

### 7.8 Damage stages (visual progression) `P0`
| Ego | Look |
|---|---|
| 100–75 | Pristine, smug |
| 75–50 | Bandaid, messy hair, first bump |
| 50–25 | Crooked glasses, sweat, red cheeks, swelling |
| 25–1 | Spiral eyes, tattered shirt, constant tiny stars |
| 0 | K.O.: flat on the floor, X-eyes, ghost soul floats up, bell |

### 7.9 Decals `P0`
Pooled SVG/canvas stamps on Harsh and stage: handprints (max 4), tomato splats with drips (max 8), bumps (max 3), bandaids (max 2), chappal marks (max 3). Persist for the session; **bumps and bandaids persist across visits** (localStorage `P1`). Oldest fades when max exceeded.

### 7.10 Mystery events `P1`
From attack #4 onward, 1-in-8 chance per attack (never twice in a row): a **MYSTERY BOX** drops and opens.
| Event | Effect | Dmg |
|---|---|---|
| Anvil | Drops with whistle; flattens Harsh into a pancake, pops back | 15 |
| Auto-rickshaw | Crosses stage with horn, clips Harsh sideways | 12 |
| Mom is calling | Phone rings (UI vibrates), "MOM (47 missed calls)" — Harsh goes pale | 10 |
| Wi-Fi disconnected | Harsh freezes in a buffering ring for 2 s (free hits ×1.5) | 0 |
| Pigeon drive-by | Fly-by, splat on glasses | 6 |
| Teammate credit | A surprise "Harsh did all the work" praise heals +5 and the visitor must hit him again | −5 |

### 7.11 Rounds `P1`
R1 normal. R2: **helmet** (bonk clangs, chappal knocks it off first). R3: **dodging** — Harsh sidesteps every ~3 s; hit him mid-dodge for ×1.5.

### 7.12 Anger score `P0`
`score = Σdamage + 50·ultimates + 25·crits + 10·maxCombo + angerBonus` where `angerBonus = 0/50/100/200`. Shown on the Certificate and in Telegram.

---


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


