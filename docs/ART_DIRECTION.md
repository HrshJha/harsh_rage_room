<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 4. Creative direction

### 4.1 Three directions considered
**A — ARCADE FIGHT NIGHT.** 90s fighting-game energy: VS splash, health bars, "ROUND 1 — FIGHT!", K.O. slam, CRT scanlines. Deep purple/charcoal, neon cyan/yellow/red. Character is chunky, thick-outlined. Sound: chiptune stings, announcer cadence. Changes the experience by giving it **structure** (rounds, HP, ultimates).

**B — COMIC BOOK CHAOS.** Halftone dots, off-register print, speech balloons, giant onomatopoeia (POW/WHAP/BONK), panel-breaking impacts. Warm paper-cream + CMYK-ish red/yellow/cyan. Sound: foley-like and cartoonish. Changes the experience by making **every hit a typographic event**.

**C — DESI MASALA MELODRAMA.** Bollywood action-poster and TV-serial drama: triple zoom-ins, dhishoom, saturated reds/golds, Hinglish captions, chappal as sacred weapon. Sound: dramatic stings, tabla-ish hits. Changes the experience by making the humour **culturally specific and instantly recognisable**.

### 4.2 Chosen: **FIGHT NIGHT × COMIC IMPACT × MASALA MOMENTS** `[NEW]`
- **Structure** from A (HUD, ego bar, rounds, K.O., VS card).
- **Impact layer** from B (halftone burst behind every hit, onomatopoeia, thick outlines).
- **Flavour** from C, used sparingly: the Chappal, the *Sharma Ji Ka Beta* ultimate (triple zoom-in sting), Hinglish captions, Mom's call.
- Rule: *A is the skeleton, B is the skin, C is the punchline.* Never all three at max in the same second.

### 4.3 Visual references (in words)
Fighting-game character-select screen with a hand-inked comic cover; halftone orange burst behind a fat yellow "BONK!"; a purple arcade cabinet glowing in a dark room; a bus-stop poster for a 1980s action film; a school marksheet stamped in red ink.

---


## 14. Visual identity & design system

### 14.1 Palette (CSS custom properties)
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0E0A1F` | Base background |
| `--night` | `#1A1033` | Surfaces |
| `--violet` | `#5B2EFF` | Calm accent, level A |
| `--hot` | `#FF2E4D` | Rage red |
| `--orange` | `#FF7A1A` | Rim, impact fills |
| `--yellow` | `#FFD60A` | Impact text, highlights |
| `--cyan` | `#19E3FF` | Electric/UI accent |
| `--lime` | `#B6FF3B` | Success/pop |
| `--paper` | `#FFF4D6` | Comic paper, certificate |
| `--white` | `#FFFFFF` | Flash |
Contrast: `--yellow`/`--paper` on `--ink` pass AA/AAA; never place `--cyan` text on `--paper`.

### 14.2 Typography (self-hosted via `@fontsource`, SIL OFL)
| Role | Font | Size (fluid) |
|---|---|---|
| Impact/onomatopoeia | **Bangers** | `clamp(56px, 18vw, 140px)` |
| Headlines | **Anton** | `clamp(36px, 10vw, 80px)` |
| UI/body | **Rubik** (variable) | 16–20 px |
| HUD numbers | **Press Start 2P** (sparingly) | 10–14 px |
Rule: Latin script only; Hinglish in Latin. Fallback stack `Impact, "Arial Black", sans-serif`.

### 14.3 Spacing & layout
4 px grid; scale 4/8/12/16/24/32/48/64. Min touch target 56×56 px. Safe-area insets respected. `100dvh` for full-height scenes. Max content width 960 px on desktop; the stage keeps a 9:16-friendly aspect.

### 14.4 Buttons
Pill-block arcade buttons with 4 px ink outline + 6 px offset hard shadow; press = translate(0,4px) + shadow shrink; colours by role (YES red, NO violet, basics cyan/yellow, ultimates animated gradient). Disabled ultimates: dim + lock icon + "RAGE 62%" label.

### 14.5 Background & depth layers (back → front)
1. Halftone gradient (CSS radial dots, two layers).
2. Floating props (chappals, tomatoes) slow-drifting at 0.3× parallax.
3. Stage floor + shadow.
4. Harsh SVG.
5. Decals canvas/SVG.
6. FX canvas (particles, speed lines).
7. Text-pop layer (onomatopoeia, damage numbers).
8. HUD.
9. Overlays (flash, crack, vignette).
10. Modals/drawers.

### 14.6 Animation language
Snappy and elastic. Hard cuts for impact, springs for recovery. Everything has a 1–2 frame pause at the moment of impact.

### 14.7 Certificate design
Paper `--paper` with fine grain (static PNG 40 KB), double border, corner flourishes, red ink stamp, handwritten-font signature (Caveat or system cursive subset). 4:5 and 9:16 variants share one layout function.

### 14.8 Logo / favicon
Wordmark "HARSH RAGE ROOM" with the A as a fist; favicon = Harsh's angry-face circle (SVG), OG image 1200×630 (static).

---


