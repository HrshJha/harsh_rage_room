<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 5. Visitor journey

### 5.1 Scene map (state machine)
```
GATE ──► INTRO ──► ANGER ──► ROOM(round r) ──► VERDICT ──► CERTIFICATE ──► REPLAY ─┐
          │ NO        ▲            ▲  │ K.O. or "I'M DONE"                           │
          ▼           │            │  └──────────────────────────────────────────────┤
        LIE_DETECTOR ─┘ (FINE, YES)│                                                 │
          │ STILL NO               │                         (new round: ROOM r+1) ◄─┘
          ▼                        │
       COMPLIMENT ──► CERT_KIND ───┘ ("Okay fine, hit him" → ANGER)
```
Any scene: Settings drawer (sound, voice, motion, haptics, language) is always reachable.

### 5.2 Step-by-step
| # | Scene | What happens | Exit |
|---|---|---|---|
| 1 | **GATE** | Black screen, Chota Sher peeks in. "BEST WITH SOUND. HARSH'S DIGNITY IS BEST WITH EARMUFFS." Buttons: **SOUND ON** / **SILENT**. Tap unlocks AudioContext, sets `audioSession`, preloads assets in idle. | INTRO |
| 2 | **INTRO** | Title letters slam in. Harsh peeks from the bottom looking suspicious. Buttons: **YES, EXTREMELY** / **NO, NOT REALLY**. Small disclosure line: *"Everything you click is reported to Harsh in real time. That's the whole point."* | YES → ANGER · NO → LIE_DETECTOR |
| 3a | **ANGER** | "ARE YOU ACTUALLY ANGRY AT HIM?" Four choices **or** PROVE IT (mash). Result sets anger level, starting rage %, theme intensity. | ROOM r1 |
| 3b | **LIE_DETECTOR** | Hold the pad 1.8 s. Needle jumps. "LIE DETECTED." | **FINE, YES** → ANGER · **STILL NO** → COMPLIMENT |
| 3c | **COMPLIMENT** | Pick compliments; Harsh blooms; Telegram gets a 💌; wholesome Certificate of Unnecessary Kindness. Footer button: "OKAY FINE, HIT HIM." | CERT_KIND / ANGER |
| 4 | **ROOM** | VS card → "ROUND 1 — FIGHT!" → main loop (§7). Complaint chips + optional name appear in a drawer, not blocking. | Ego 0 → K.O. · "I'M DONE" |
| 5 | **VERDICT** | 8 s cinematic: gavel, charges typed out, "GUILTY ON ALL COUNTS". Then the **Sentence Slot Machine**. | CERTIFICATE |
| 6 | **CERTIFICATE** | Stamp slams, stats count up. Buttons: **SHARE**, **ANOTHER ROUND**, **RESTART**. | REPLAY |
| 7 | **REPLAY** | Round 2 (rules change) or fresh session with persistent bruises. | — |

### 5.3 Anger levels (distinct behaviour, not just labels)
| Choice | Start rage | Theme | Harsh | Special |
|---|---|---|---|---|
| A LITTLE ANNOYED | 0% | Calm purple | Nervous, one sweat drop | Gentler shake; Chota Sher is condescending |
| PRETTY ANGRY | 25% | Violet → orange rim | Wary, backs up | Tomatoes get a damage bonus |
| EXTREMELY ANGRY | 60% | Orange/red | Hides half behind a desk | Ultimate (Emotional Damage) unlocked at start |
| BEYOND HUMAN LIMITS | 100% | Full red, vein overlay, slow screen throb | Terrified, laptop shield | **Both ultimates unlocked**; ambient low rumble |

### 5.4 Replay & return
- **Same session:** after K.O. → "ANOTHER ROUND" (P1: rule changes — R2 helmet, R3 dodging).
- **Next visit (localStorage, no server):** lifetime attacks, visit count; Harsh shows up **still wearing last visit's bandaid**; dialogue references the count.

---


## 6. Screen specifications

### 6.1 GATE `P0`
- Layout: Chota Sher sprite (3 poses: peek, smirk, roar) bottom-centre; headline Bangers 40–64 px; two 56 px-tall buttons stacked on mobile, side by side ≥ 640 px.
- Behaviour: first pointer-down anywhere on a button runs `audio.unlock()` (create/resume `AudioContext`, set `navigator.audioSession.type = "playback"` if present, play a 1-sample silent buffer). SOUND ON plays `intro_hit` immediately as the reward. SILENT sets `settings.muted = true`.
- Preload: after choice, fetch sample pack with `requestIdleCallback` (fallback `setTimeout`). The UI never waits for it.
- Acceptance: no sound before a tap; choice persists; works with keyboard (Tab/Enter).

### 6.2 INTRO `P0`
- Sequence (0 → 2.2 s): background halftone fades in (300 ms) → title words slam in staggered 90 ms (`back.out(2.4)`, scale 1.8→1, rotate ±6°) with `intro_hit` → subtitle types in → Harsh slides up from the bottom edge peeking (spring), eyes dart left/right → buttons pop in with 70 ms stagger.
- Buttons: oversized, tilt toward the pointer (±4°) on desktop; idle wobble every ~4 s on mobile; press = squash (scaleY 0.92) then release overshoot.
- Title pool (random, no repeat across visits): see §12.1.
- **NO button** gets a gag: on first hover/press-hold it nervously shifts 8 px; no actual dodging (dodging buttons are inaccessible and annoying).

### 6.3 ANGER `P0`
- Prompt slams in. Four tall buttons (A LITTLE ANNOYED … BEYOND HUMAN LIMITS) with progressively larger type and more aggressive colour.
- **Anger-o-meter** (SVG arc gauge) fills as the pointer/finger hovers or selects each option; needle shakes harder at higher levels; background tint and Harsh's expression change live.
- **PROVE IT** link: "Not convinced? Prove it." → 3-second rage-mash: tap/click as fast as possible. Level = taps/s: <3 → A LITTLE · 3–5 → PRETTY · 5–8 → EXTREMELY · >8 → BEYOND. Keyboard users: Space mashing works. Result *overrides* selection and shows a one-liner.
- Result beat (1.2 s): Harsh reaction + dialogue line from §12.3 → transition: screen wipes diagonally with a comic burst, VS card appears.

### 6.4 LIE_DETECTOR `P0` (NO path)
- Pad (big circle, "PLACE FINGER HERE" / "HOLD SPACE"). Hold 1.8 s: scan line sweeps, needle spikes, ticking sound ramps. Release early → "INCONCLUSIVE. TRY HARDER." (retry).
- Result stamp: **LIE DETECTED**. Buttons: **FINE, YES** (→ ANGER) / **STILL NO** (→ COMPLIMENT, `P1`; in MVP STILL NO plays a 3-line gag then routes to ANGER with "Okay, but the machine says…").
- Telegram: `lie_detector` event (P1).

### 6.5 COMPLIMENT `P1`
- Deck of 8 backhanded-wholesome compliments ("He is… consistently online."). Tap up to 3: each makes Harsh bloom (cheeks pink, heart particles), then a tiny "…suspicious" frown.
- Send → Chota Sher delivers a 💌 to Harsh. Certificate of Unnecessary Kindness.

### 6.6 ROOM `P0` — layout
```
┌──────────────────────────────┐  HUD (top, safe-area aware)
│ [🔊][⚙]   EGO ████████░░ 82% │  ego bar · settings · sound
│ RAGE ███░░  COMBO x3  ×1.5   │  rage meter · combo
├──────────────────────────────┤
│                              │
│        STAGE (SVG + canvas)  │  Harsh centred, ~55–60% of viewport height
│            (  HARSH  )       │  decal layer, particle canvas, text-pop layer
│                              │
│  🦁 announcer strip          │  one line of commentary
├──────────────────────────────┤
│ [SLAP][PUNCH][CHAPPAL][BONK] │  dock row 1 (basics) — thumb zone
│ [TOMATO][ROAST][⚡][💔]       │  dock row 2 (roast + 2 ultimates, dim until charged)
└──────────────────────────────┘
```
- Landscape/desktop: dock becomes a vertical column on the right; HUD stays top.
- **Interaction model** `[NEW]`: tap a weapon to **equip** (stays equipped); tap/click the stage to attack **at that point**. Double-tap a weapon = auto-aim random zone. Whiff (tap outside Harsh's padded hit area) = comedic miss.
- Chip drawer ("Why are you mad?"): chips like *He replied "ok"* · *Commits on Friday* · *Left me on seen* · *Excess confidence* · *Just because*; optional name field (default "Anonymous"). Selected chip appears in the Telegram report.
- "I'M DONE" in the settings drawer jumps to VERDICT.

### 6.7 VERDICT `P0` (cinematic, ≈ 8 s, skippable by tap)
1. Lights drop; spotlight on a gavel. **BANG** (`gavel`), screen shakes 6 px.
2. "THE SUPREME COURT OF ANNOYANCE" lower-third. Charges type out (3 chosen from §12.9 based on stats).
3. Gavel again. Giant stamp: **GUILTY ON ALL COUNTS**.
4. `P1`: **Sentence Slot Machine** — 3 reels (verb / object / duration) spin 2.4 s with ticking, stop staggered; result becomes the sentence on the Certificate and in Telegram.

### 6.8 CERTIFICATE `P0`
- Paper-textured card (see §14.7). Fields: name or ANONYMOUS HERO · attacks · weapon of choice · max combo · accuracy · anger score · sentence (P1) · serial `HRR-2026-XXXX` · date · signatures (Chota Sher, Supreme Court). Stamp **"VERIFIED BY NOBODY"** slams last.
- Buttons: **SHARE** (Web Share API with PNG; fallback download), **ANOTHER ROUND**, **RESTART**.
- Generation: rendered client-side to a 1080×1350 canvas (and 1080×1920 story variant) from the same data; no server image rendering.

---


