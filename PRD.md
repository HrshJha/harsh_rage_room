# HARSH RAGE ROOM — Product Requirements Document

> **Version** 1.1 · **Date** 2026-10-01 · **Owner** Harsh · **Status** Approved for implementation planning
> **This file is the product foundation.** The [arcade direction addendum](docs/ARCADE_DIRECTION_ADDENDUM.md) now governs visual identity, named-room entry, attack motion and Telegram copy; the [arcade audio addendum](docs/ARCADE_AUDIO_ADDENDUM.md) governs sound and takes precedence over both earlier sound sections. These are target requirements for the next iteration. The shipped prototype and its open checks are described in [QA_CHECKLIST.md](docs/QA_CHECKLIST.md). The generated topic extracts in `/docs` retain the original PRD sections for reference.

> **October cinematic revision:** The latest implementation uses charcoal and burnt orange, a centered character stage, single-tap weapon controls and per-weapon choreography. [CINEMATIC_MOTION.md](docs/CINEMATIC_MOTION.md) records the implemented timing, interaction and accessibility rules and supersedes older visual/motion proposals below. Audio production requirements still apply.
> **Implementation amendment — 2026-10-01 (takes precedence over historical sections below):**
> - Ship all P0 plus Compliment Mode and Sentence Slot Machine. Other P1/P2 remain deferred.
> - User selected **Vercel frontend + Render Node/Hono API**. All Cloudflare/Worker/Wrangler/Durable Object/Turnstile instructions below are superseded. Use Render Key Value (Redis) for short-lived rate limits, dedupe and send coordination, never analytics. Local uses an in-memory equivalent and can use either dry-run or live Telegram transport. Production live notifications require Redis and hCaptcha; no secrets in Vite.

## Personalized Rage Room update · 1 October 2026

This later user request supersedes earlier optional-name, non-empty-name, preset-roast, and batched-attack notification rules in this PRD and the arcade direction addendum. On opening, ask once for a visitor name before entering the room. Trim it to 20 characters, retain it for the browser session, and allow a blank entry as **Anonymous**. Explain beside the input that completed actions are reported to Harsh through Telegram. Merely opening the site or entering a name sends no notification.

Each completed slap, punch, chappal, bonk, tomato, thunder punch, emotional-damage move, and roast queues a report with the visitor name, action, anger, and action timestamp. A missed move is identified as missed. Selecting **Roast Harsh** opens a free-text form; submission requires 1–280 non-blank characters, and the exact submitted text is sent to Telegram with markup escaped. The backend alone holds the bot token and destination chat. Short-lived per-session, IP-hash, and global limits prevent spam; delivery is best effort when those limits or network failures intervene. Render and Vercel deployment requirements remain as specified below.
> - Cross-origin API accepts only configured frontend origins. Use HMAC bearer sessions and authenticated fetch keepalive on exit. Live notifications remain disabled until credentials are supplied.
> - Shared attack IDs use `thunder`, not `thunder_punch`. Final report occurs after sharing/downloading, replay/restart, or exit; certificate data is frozen at entry. One final event ID is reused.
> - Eight reports/session includes one reserved final; final bypasses session spacing only. Operational records expire, raw IP and user messages are not logged. hCaptcha provider outages use stricter limits; invalid challenges are rejected.
> - Original SVG cartoon, procedural audio, Hinglish, IST. No private facts: marksheet gag uses a fictional "EGO SCORE". Another round is a new normal fight/session.
> - One hero attack at a time. Light-attack recovery can be fast-forwarded after impact; ambient decals continue separately. Input timing powers tomato-rain/backhand gestures; only accepted attacks deal damage.
> - Follow reduced-motion preferences; rapid attacks share a global flash cooldown. Keep browser pinch zoom available.
> - Current implementation/verification status is recorded in docs/QA_CHECKLIST.md. Real-device and live-delivery checks must not be marked passed without evidence.
> - Deployment commands/configuration in docs/DEPLOYMENT.md supersede §24. This is an original open-source-ready project; content approval and live launch remain owner-controlled.

**Priority tags:** `P0` = MVP (must ship) · `P1` = Polish release · `P2` = Experimental.
**Status tags:** `[REQ]` = from the original brief · `[NEW]` = added/changed by this PRD (with reason in §2).

---

## 0. Document control

| Item | Value |
|---|---|
| Working title | Harsh Rage Room |
| Tagline | "IS HARSH IRRITATING YOU? We've developed a highly unnecessary solution." |
| Format | Single-page interactive web arcade (mobile-first), no accounts, no install |
| Mascot / announcer | **Chota Sher** (the existing Telegram bot, promoted to an on-screen tattletale lion) |
| Target session | 60–120 seconds, 12+ attacks, ends in a verdict + shareable certificate |
| Audience | Harsh's friends, classmates, followers (mostly Indian, mostly on phones, many on mid-range Android) |
| Tone | Dramatic presentation of trivial things. Cartoon violence only. Affectionate, never cruel. |

---

## 1. Vision, pillars, success metrics

### 1.1 One-line pitch
A 90-second arcade fight night where anyone can lovingly assault a cartoon Harsh with chappals, tomatoes and thunder — while a tiny lion named Chota Sher tattles on them to the real Harsh, live.

### 1.2 Design pillars (decision tie-breakers, in order)
1. **Hit-feel above all.** Every attack has anticipation → strike → hit-stop → impact → reaction → recovery. If it doesn't feel good with the sound off, it isn't done.
2. **Joke density.** A new gag every ~2 seconds. No line repeats within a session (no-repeat decks, §12).
3. **Zero friction.** First hit within 10 seconds of landing. No signup, no forms before fun.
4. **A shareable artefact.** Every session ends in something worth screenshotting (the Certificate).
5. **The tattle loop is visible.** The Telegram joke is not hidden plumbing; Chota Sher visibly "delivers" each report.

### 1.3 Success metrics
| Metric | Target | How measured |
|---|---|---|
| Time to first hit | ≤ 10 s median | Client timer → included in `final` Telegram report |
| Visitors reaching first hit | ≥ 60% | `first_blood` count ÷ Cloudflare Web Analytics visits |
| Attacks per session | ≥ 12 avg | `final` report `attacks` |
| Reach verdict screen | ≥ 25% | `final` count ÷ `first_blood` count |
| Certificate shared/downloaded | ≥ 15% of verdicts | Client event → `final` report flag `shared` |
| Returning within 7 days | ≥ 20% | localStorage visit counter → `final` report `visit_n` |
| Telegram delivery success | ≥ 98% | Worker logs (`wrangler tail` / Workers Logs) |
| LCP (4G, mid-range Android) | < 2.0 s | Lighthouse CI |
| Crash-free sessions | 100% (no blank screens) | Playwright + manual device matrix |

> There is deliberately **no analytics database**. Harsh's Telegram *is* the analytics dashboard. Cookie-less Cloudflare Web Analytics is optional (P1).

### 1.4 Anti-goals
No accounts. No ads. No third-party trackers. No photoreal violence or real photos of anyone but Harsh (and only by Harsh's choice). No harassment channel (the free-text path is capped and filtered, §16.6). No multiplayer, no 3D engine, no database in MVP.

---

## 2. Concept critique and decision log

### 2.1 What's already strong
- The central joke — *a deliberately over-engineered solution to a trivial annoyance* — scales well to every detail (sound, fake legalese, certificates).
- "Telegram pings Harsh" gives the visitor a **real consequence**. That's the hook that makes people send the link to others.
- Cartoon actions with distinct sound identities (WHAP, BONK, splat) are a proven dopamine loop.

### 2.2 What will become repetitive or weak (and the fix)
| Risk in the brief | Why it fails | Fix |
|---|---|---|
| 7 equal buttons that each play one animation | Press → watch → repeat gets stale by attack 8 | Weapon select + **aim at body zones**, rage meter, ultimates, combos, mystery events, damage stages |
| 4 quiz-like screens before any fun | Feels like a form | Merge questions into playable beats (lie detector, rage-mash) and let Harsh be on screen from frame 1 |
| NO = dead end | Half the visitors hit it first | NO → Lie Detector → Compliment Mode (wholesome, sends a Telegram "💌") |
| Pop-up jokes | Reads like a SaaS toast | Jokes live in the **world**: speech bubbles, announcer, character reactions, decals |
| Notification per attack | Spams Harsh, hits Telegram limits | Event batching + named combos + final report (§16) |
| Generic share | "I got 87%" is forgettable | A **Certificate** + Sentence Slot Machine + canvas-rendered share card |
| Static dialogue | Obvious loops | No-repeat decks, context (anger/zone/combo/time of day/visit count) |

### 2.3 Decision log
| ID | Brief said | We do | Why |
|---|---|---|---|
| D-01 | 4 linear screens | Fight-night loop: ego HP, rage meter, rounds, K.O. | Gives goals, makes replay meaningful |
| D-02 | 7 attack buttons | 6 basics + 2 **ultimates** gated by rage meter; weapon + aim | Escalation and tension |
| D-03 | Pick anger level | Pick **or** "PROVE IT" mash test that overrides | Tactile, funny, still accessible |
| D-04 | NO path funny | Lie Detector → Compliment Mode | Wholesome payoff + shareable |
| D-05 | Framer Motion, GSAP, CSS, Lottie, Rive "where appropriate" | **GSAP + CSS only** | One engine, smallest bundle; Lottie/Rive deferred (§10.1) |
| D-06 | FastAPI or serverless | **Cloudflare Worker (Hono, TypeScript)** serving API + static assets, one deploy. FastAPI documented as fallback (§17.9) | No cold starts, free tier, token never in browser, no CORS |
| D-07 | Cartoon character | **Layered SVG rig** + persistent damage decals | Crisp on all DPRs, animatable per-part, tiny payload |
| D-08 | Voice reactions optional | **Harsh's own voice**, 8 lines, opt-in | Funniest possible source, zero licensing |
| D-09 | Courtroom | 8-second **Verdict cinematic** inside the aftermath, not a separate mini-game | 80% of the joke, 15% of the effort |
| D-10 | Sound files | **Mostly procedural Web Audio**, 4 self-recorded hero sounds | Tiny payload, infinite variation, no licence risk |
| D-11 | Optional reason text | Preset chips first, ≤80-char free text, filtered | Protects Harsh's Telegram from abuse |
| D-12 | Start muted | **Sound Gate** screen (explicit choice) | Solves autoplay + sets the tone |
| D-13 | Random punishment generator | **Sentence Slot Machine** (3 reels) in the verdict | Tiny arcade game, adds a Telegram punchline |
| D-14 | Repeat-visit dialogue | Persistent **bruises** from last visit + visit-count lines (localStorage) | Zero backend, big delight |
| D-15 | Country/visitor info | Not collected (country optional, default off) | Privacy requirement |
| D-16 | — | **Cut:** 3D character, multiplayer, accounts, speech recognition, global leaderboard in MVP | Effort ≫ laughs |

### 2.4 Idea Index (evaluated, not blindly implemented)
Entertainment 1–5 · Effort S/M/L · **Decision**: ✅ P0 / 🟡 P1 / 🧪 P2 / ❌ cut.

| # | Idea | Ent. | Eff. | Decision |
|---|---|---|---|---|
| 1 | **Chota Sher tattle animation** — tiny lion sprints across the screen to "deliver" each report | 5 | S | ✅ |
| 2 | **Hit zones** (glasses, nose, forehead, cheeks, hair, torso) with unique reactions | 5 | M | ✅ |
| 3 | **Persistent damage**: handprints, tomato splats, bumps, bandaids, chappal pile | 5 | M | ✅ |
| 4 | **Rage meter → ultimates** | 4 | S | ✅ |
| 5 | **Ego bar** with deadpan labels | 4 | S | ✅ |
| 6 | **Lie Detector** (hold to scan) on NO | 5 | S | ✅ |
| 7 | **Compliment Mode** (NO path end) | 4 | S | 🟡 |
| 8 | **Emotional Damage = "Sharma Ji Ka Beta"** ultimate | 5 | M | ✅ |
| 9 | **Musical bonk ladder** — consecutive bonks climb a pentatonic scale | 5 | S | ✅ |
| 10 | **Sleeping bonus** — idle 15 s → Harsh snores; hit him asleep for ×2 + jump scare | 5 | S | ✅ |
| 11 | **Whiffs** — missing Harsh is its own gag, counted in accuracy | 4 | S | ✅ |
| 12 | **Flick-to-throw** chappal/tomato by velocity | 4 | M | 🟡 |
| 13 | **Rage-mash calibration** ("PROVE IT") | 4 | S | ✅ |
| 14 | **Typographic roast** — words become projectiles | 5 | M | ✅ (cards) / 🟡 (typed) |
| 15 | **Mystery events** (anvil, auto-rickshaw, Mom calling, Wi-Fi buffering…) | 5 | M | 🟡 |
| 16 | **Rounds 2–3** with rule changes (helmet, dodging) | 4 | M | 🟡 |
| 17 | **Combo system** with named combos | 4 | S | ✅ |
| 18 | **Sentence Slot Machine** + Certificate + canvas share card | 5 | M | ✅ (certificate) / 🟡 (slots) |
| 19 | **Shake-phone earthquake** attack | 3 | S | 🟡 |
| 20 | **Dialogue that knows time/date/visit count** | 4 | S | 🟡 |
| 21 | **Persistent bruises on return** | 5 | S | 🟡 |
| 22 | **Live editable Telegram message** (one message that ticks up) | 3 | M | 🟡 |
| 23 | **Harsh Fights Back** — inline buttons in Telegram ("👀 Seen", "😈 Counter") that pop up on the visitor's screen live | 5 | L | 🧪 |
| 24 | **Global slap counter** ("Harsh attacked 1,284 times today") | 3 | M | 🧪 |
| 25 | **Face-Plate Mode** — Harsh's own photo as a sticker face on the cartoon body (Harsh opts in) | 4 | M | 🧪 |
| 26 | Procedural chiptune fight music that speeds up with rage | 3 | M | 🟡 |
| 27 | Rhythm "PERFECT" timing bonus | 3 | M | 🧪 |
| 28 | Rive character rig | 3 | L | 🧪 |
| 29 | Voice recognition ("shout to punch") | 2 | L | ❌ |
| 30 | 3D character (Three.js) | 2 | L | ❌ |
| 31 | Accounts/leaderboards | 1 | L | ❌ |

---

## 3. Research findings (verified 2026-10-01)

> Version numbers move. Before pinning, run `npm view <pkg> version`. Links in §26.

| Area | Finding | Decision |
|---|---|---|
| **GSAP** | GSAP is **100% free including all former "Club" plugins** (SplitText, MorphSVG, DrawSVG, MotionPath, CustomWiggle, Inertia…), including commercial use, since Webflow's acquisition. Install everything from the public `gsap` npm package (3.14.x seen). Official React helper: `@gsap/react` (`useGSAP`). No `.npmrc` token needed. | **Use** — sole animation engine |
| **Motion (ex-Framer Motion)** | Package `motion` (`motion/react`). ~34 KB full; ~4.6 KB with `LazyMotion` + `m`. Good for declarative React UI. | **Skip** — would duplicate GSAP |
| **Lottie / dotLottie** | Great for designer-authored vector clips; adds runtime and an After Effects workflow we don't have | **Skip** |
| **Rive** | State-machine rigs are ideal for characters, but needs the Rive editor + wasm runtime | **P2 only** |
| **CSS** | `transform`/`opacity` keyframes for idle breathing, parallax, button wobble | **Use** |
| **Canvas 2D** | Custom pooled particle system (~150 LOC); `canvas-confetti` (tiny) for the victory burst | **Use** |
| **Web Audio API** | Needed for synth, pitch/pan variation, ducking. Howler.js has no synthesis | **Use** a thin in-house engine (~250 LOC) |
| **Telegram Bot API limits** | ≈ 1 msg/s per chat, ≈ 30 msg/s overall, ≈ 20 msg/min per group; excess → HTTP 429 with `retry_after`. Telegram says limits aren't exactly documented, so we stay far under | Server-side throttle + batching (§16) |
| **Cloudflare Workers (Free)** | 100,000 requests/day, 1,000 req/min burst, 50 subrequests/request; static assets can be served by the same Worker | Single Worker: API + SPA assets |
| **Cloudflare Turnstile** | Free up to 1M siteverify/month; usually invisible; no SLA on the free tier | Use, but **fail open to rate limits** if Turnstile is down (§16.7) |
| **Sound licences** | **Kenney** = CC0. **Freesound** = per-sound licence (filter to **CC0**; avoid CC-BY-NC). **Pixabay** = Pixabay Content License (commercial OK, no attribution, can't resell the raw file). **Mixkit** = free licence. **BBC archive = non-commercial → avoid.** | Log every asset in `docs/ASSETS.md` |
| **iOS audio quirk** | Web Audio can be silenced by the ringer switch; Safari 16.4+ exposes `navigator.audioSession` (`type = "playback"`) — verify on device | Set it at Sound Gate; fall back to a silent `<audio>` loop |
| **Haptics** | `navigator.vibrate` works on Android Chrome, not iOS Safari | Feature-detect, silent fallback |

---

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

## 12. Dialogue bible

> All lines live in `src/content/*.json`, tagged by `context` (scene, anger, zone, combo, hour, visit_n), picked through **no-repeat decks** (shuffle → draw → reshuffle only when exhausted, never repeating the last line across reshuffle). Two languages: **Hinglish** (default) and **English** (settings toggle, P1). Harsh must approve every line. `{cgpa}` comes from `facts.json` (example value 8.36).

### 12.1 Intro titles (random)
- IS HARSH IRRITATING YOU?
- HARSH AGAIN?
- DID HARSH JUST SAY "OK"?
- BREAKING: HARSH HAS BEEN ANNOYING.
- FEELING SLAP-HAPPY?
- HARSH HAS 99 PROBLEMS. YOU ARE ONE.
Subtitles: "We've developed a highly unnecessary solution." · "Certified by absolutely nobody." · "Violence, but make it cartoon." · "No Harsh was harmed. Several egos were."

### 12.2 Button labels
YES, EXTREMELY · YES, VERY MUCH · OBVIOUSLY · / NO, NOT REALLY · NO, I'M SUSPICIOUS · NOPE (nervous)

### 12.3 Anger results
- **A LITTLE ANNOYED:** "Adorable. Like a mosquito with feelings." · "That's it? Okay, a warm-up round." · "Chota Sher: 'We'll start with the starter pack.'" · "Fine. Gentle chaos it is."
- **PRETTY ANGRY:** "Now we're talking." · "Harsh is sweating. Good." · "Rage meter: warming up." · "Someone was ignored on WhatsApp."
- **EXTREMELY ANGRY:** "Emotional Damage unlocked. Handle with care." · "Harsh has hidden behind the desk. It won't help." · "The lion approves." · "The council has been informed."
- **BEYOND HUMAN LIMITS:** "WARNING: ENTITY IS NO LONGER HUMAN." · "Harsh has locked the door. Doors don't help." · "Both ultimates unlocked. May God have mercy on his ego." · "THE VEINS. THE VEINS ARE OUT."
- **PROVE IT result:** "Eleven taps per second. Concerning." · "Your thumb has filed a complaint." · "Wow, that's actual anger. Or you have a game controller."

### 12.4 NO path
- On NO: "Hmm. The Anger Detector disagrees." · Harsh smirks: "I knew you liked me."
- Lie detector idle: "Place finger. Tell the truth. Or at least try." · Early release: "INCONCLUSIVE. YOUR THUMB IS HIDING SOMETHING."
- Result: "LIE DETECTED. You've been irritated since the group chat." · Harsh: "…ok, that hurts."
- STILL NO: "Fine. Then you are either lying or a saint." · "Let's test the saint theory."
- Compliments (backhanded-wholesome): "He is… consistently online." · "He tries. Sometimes." · "He once made a good decision." · "His memes are mid, but they're his." · "He is helpful when he remembers." · "He has never been late to be late." · "His code compiles on the second try." · "He is a fine human. Allegedly."

### 12.5 Attack captions (3 random per attack, shown under the onomatopoeia)
- **SLAP:** "Direct hit on the ego." · "That left a mark. A hand-shaped one." · "Sound of justice." · "A slap a day keeps the attitude away." · "Spicy."
- **PUNCH:** "Right on the confidence." · "Rent-free no more." · "That was for the 'ok'." · "He felt that in the next timeline." · "Bam. Ouch. Wow."
- **CHAPPAL:** "Aaj kal ke bacche…" · "Direct from Mummy." · "Blue-strap diplomacy." · "Beta, yeh tumhare liye." · "Sandal of justice."
- **BONK:** "Hollow. Like his promises." · "Bonk on delivery." · "Go directly to bonk jail." · "Instant humility." · "That's a lot of brain noise."
- **TOMATO:** "Fresh from the mandi." · "Organic. Non-refundable." · "Farm-to-face." · "That was ripe." · "Salad for the soul."
- **THUNDER PUNCH:** "THE SKY HAS FILED A COMPLAINT." · "ZEUS WOULD LIKE A WORD." · "SCIENCE CANNOT EXPLAIN THIS."
- **EMOTIONAL DAMAGE:** "SHARMA JI KA BETA WOULD NEVER." · "Marksheet. Delivered." · "EGO.EXE HAS STOPPED RESPONDING."
- **ROAST:** "Peer reviewed." · "Get a towel." · "Citation: needed. Burn: confirmed."
- **WHIFF:** "Missed. Harsh didn't even flinch." · "Swing and a miss. Very athletic." · "The air is now in pain."

### 12.6 Harsh's reaction bubbles / comebacks
"Ow?" · "Why meeee?" · "I was just vibing." · "Arre yaar!" · "I didn't even do anything!" · "Mummy ko mat batana." · "This is a hate crime against me." · "I'll remember this at the next group project." · "Bro what." · "Ouch, but make it dramatic." · "I'm calling Chota Sher." · "That's illegal in several fictional countries." · "Did I deserve that? Probably." · "I wasn't even listening." · "Okay, that one was fair."

### 12.7 Chota Sher announcer (one line, bottom strip)
"Reporting this to Harsh." · "Nice one. I've told him." · "I am legally required to tattle." · "Combo detected. I'm writing it down." · "He knows. He knows." · "Rage full. Be careful." · "I'm a lion, not a lawyer." · "Message delivered. He's reading it." · "Meow—*cough*—ROAR." · "That one deserves its own paragraph." · "Telegram is lit."

### 12.8 Absurd warnings (HUD banners, ≤ 1 per 20 s)
- WARNING: HARSH'S EGO IS RUNNING OUT OF STORAGE.
- THIS ATTACK HAS BEEN ESCALATED TO THE SUPREME COURT.
- PLEASE WAIT WHILE HARSH PROCESSES YOUR EMOTIONAL DAMAGE.
- HARSH HAS PUSHED TO PROD ON A FRIDAY. NOBODY IS SURPRISED.
- LOW BATTERY: HARSH'S PATIENCE.
- ERROR 404: DIGNITY NOT FOUND.
- COMBO DETECTED. HARSH'S INSURANCE NOT COVERED.
- SYSTEM: HARSH HAS BEEN CONFIDENT FOR TOO LONG.

### 12.9 Verdict charges (pick 3 from stats-aware pool)
- "Excessive replying 'ok'."
- "Unauthorised levels of confidence."
- "Being technically right at the worst time."
- "Committing code on a Friday."
- "Leaving the group chat on read."
- "Walking in like he has Wi-Fi in his soul."
- "Suspicious smugness."
- "Failing to reply with a meme."
- "Having a CGPA of {cgpa} and acting like it's 10."
- "Starting five side projects and finishing two."
Verdict stamps: **GUILTY ON ALL COUNTS** · **GUILTY, BUT CUTE** · **GUILTY, AGAIN**.

### 12.10 Sentence slot machine (3 reels)
Verb: **BUY** · **DELIVER** · **PUBLICLY APOLOGISE WITH** · **SING** · **GIFT** · **WRITE** · **COOK** · **ADMIT DEFEAT WITH**
Object: **CHAI** · **SAMOSAS** · **A SORRY SONG** · **THE LAST SLICE** · **A 1000-WORD APOLOGY** · **A HANDWRITTEN NOTE** · **MEMES** · **ONE FULL-VOLUME "SORRY"**
Duration: **FOR 5 PEOPLE** · **BY MONDAY** · **FOR THE ENTIRE TRIBUNAL** · **IN THE GROUP CHAT** · **UNTIL FURTHER NOTICE** · **TODAY, WITH DRAMA** · **WITH EYE CONTACT** · **WITH A BOW**
(Examples: "BUY CHAI FOR 5 PEOPLE", "SING A SORRY SONG IN THE GROUP CHAT".)

### 12.11 Roast cards (30-card deck sample; gentle, editable)
"Harsh's 'quick fix' has its own Jira board." · "Harsh debugs with vibes." · "He opens a terminal like he's defusing a bomb." · "'It works on my machine' is his love language." · "Harsh doesn't need sleep, he needs a commit." · "He once hot-fixed a hotfix." · "Harsh names variables like he names pets: with hope." · "He joins calls to say 'can you repeat that?'" · "His to-do list has a to-do list." · "He puts 'AI' in every sentence, even 'hello'." · "He trained a model to say 'ok'." · "He took 40 minutes to say 'five minutes'." · "His Wi-Fi is his only commitment."

### 12.12 Repeat-visit lines
- 2nd visit: "Back so soon? Harsh is still bruised."
- 3rd: "A returning customer. We love loyalty."
- 5th: "At this point it's a hobby."
- 10th: "Seek help. Also, hit him again."
- 25th: "You've attacked Harsh {n} times. Chota Sher has stopped counting out of fear."
- Same day return: "Again?? He hasn't even healed."
- After midnight (local 00:00–04:59): "Why are you awake? Go to sleep. After one more slap." · Mon: "It's Monday. Harsh is already suffering. Hit him anyway." · Fri: "It's Friday. He's probably deploying."

### 12.13 Error toasts (non-blocking, funny)
- Telegram failed: "Chota Sher tripped on the way. Harsh remains blissfully unaware."
- Rate limited: "Chota Sher is on a tea break. Back in a minute."
- Offline: "No internet. Harsh is safe. Reconnect to resume the violence."
- Audio blocked: "Browser says no sound. Tap the speaker to try again."

### 12.14 Idle taunts (Harsh, 8 s idle)
"Are you gonna do something?" · "I'm waiting. Casually." · "Take your time. I have all day." · "Is this a staring contest?" · "…I'm bored. Hit me."

---

## 13. Easter eggs & surprises

| # | Trigger | Effect | Eff. |
|---|---|---|---|
| 1 | Tap Harsh's glasses 10× quickly | Glasses become heart-shaped; Harsh blushes, then recoils | S |
| 2 | Hold on his nose 2 s | Honk. Whole stage squeaks | S |
| 3 | Konami code (↑↑↓↓←→←→BA) | Disco mode: neon + chiptune + Harsh dances | M |
| 4 | Type "bruh" anywhere | Giant BRUH slams the screen + voice (if enabled) | S |
| 5 | Local time 00:00–04:59 | Harsh in pyjamas with a tiny sleep cap; "Go sleep" line | S |
| 6 | Friday | Banner: "HARSH IS PROBABLY PUSHING TO PROD"; production-down siren joke | S |
| 7 | Shake the phone (devicemotion) | Earthquake: everything falls, Harsh sways | M |
| 8 | Triple-tap Chota Sher | He roars and "bites" the screen (crack decal) | S |
| 9 | Tap footer commit hash | Fake build log scrolls: "Build failed: Harsh not found" | S |
| 10 | 3 consecutive whiffs | Harsh offers a comfort chair and pats the visitor's weapon: "It's okay." | S |
| 11 | Bonk the same spot 5× | A pimple-like bump pops with "pop" and Harsh sighs | S |
| 12 | Cursor chappal (desktop, press `C`) | Cursor becomes a spinning chappal | S |
| 13 | All 6 basics in one session | Hidden achievement toast "COLLECTOR" + golden chappal skin | S |
| 14 | Pile 6 chappals | The pile topples; Harsh slips on one | S |
| 15 | Ego exactly 1% | Harsh whispers "…please." — a heartbeat; next hit = K.O. slam | S |
| 16 | Reach K.O. without ever missing | Certificate gets "PERFECT AIM" ribbon | S |
| 17 | Visit on a configured festival date | Seasonal skin / attack swap (e.g., crackers, gulal) via `events.json` | M |
| 18 | Never attack for 60 s | Harsh walks off, sits and plays on the tiny laptop; the stage fills with idle jokes | S |
| 19 | Tap the "9.9" marksheet | It becomes "7.0". Sharma Ji's son cries | S |
| 20 | URL `?mom=1` | Phone rings, "MOM" calls Harsh at a random moment | S |
| 21 | Tap the tiny laptop prop | "Works on my machine" speech bubble | S |
| 22 | Hold SLAP for 3 s | Windmill slap | S |

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

## 15. Mobile, desktop and accessibility

### 15.1 Mobile (primary) `P0`
- Portrait is primary; dock sits in the thumb zone (bottom 35% of the viewport); stage uses the middle; HUD in the top safe area.
- Touch targets ≥ 56 px; `touch-action: manipulation`; `user-select: none`; `-webkit-tap-highlight-color: transparent`; prevent double-tap zoom and pull-to-refresh on the stage (`overscroll-behavior: none`).
- Pointer Events only (no separate mouse/touch code paths). No hover-dependent features; hover polish is a desktop-only enhancement.
- `100dvh`, `env(safe-area-inset-*)`, `viewport-fit=cover`.
- Haptics: `navigator.vibrate` patterns — slap 15 ms, punch 25 ms, bonk 20 ms, thunder ramp + 80 ms, K.O. 120 ms. Feature-detect; Settings toggle.
- Landscape: dock becomes a right-side column; HUD condenses.
- Performance mode auto-switch (§10.5) with a manual "Lite effects" toggle.
- iOS: `audioSession` + resume on interaction; test with the ringer switch off/on.

### 15.2 Desktop `P0`/`P1`
- Larger stage, side dock, keyboard hotkeys **1–8** to select weapons, **Space/Enter** to attack at last position, **Esc** opens Settings, **M** mutes.
- `P1`: pointer-reactive eyes/parallax, cursor weapon preview, hover sounds and tilt on buttons.

### 15.3 Accessibility `P0`
| Area | Requirement |
|---|---|
| Reduced motion | `prefers-reduced-motion: reduce` → **Calm Chaos** mode: no shake, no flash, no parallax; attacks become 3-frame comic panels with fades; Settings override ("Full / Calm") |
| Photosensitivity | ≤ 1 full-screen flash per attack; no flicker > 3 Hz anywhere; "Gentle FX" toggle removes flashes and zoom |
| Screen reader | Live region announces outcomes ("Slap landed on glasses. Critical! Ego 62 percent."), not every particle; all controls labelled |
| Keyboard | Full flow playable with keyboard; visible focus ring (3 px `--cyan`) |
| Contrast | AA minimum for text; critical text on solid chips |
| No audio dependency | Every sound has a visual counterpart; no required audio cues |
| Time | No timed forms; combo windows are gameplay only |
| Language | Hinglish/English toggle `P1` |

---

## 16. Telegram integration — Render edition

### 16.1 Transport and consent
The Vercel frontend calls the Render Node/Hono API. Only the API knows the Telegram bot token and destination chat. Reports contain user-chosen names/reasons, game statistics, random session aliases and IST timestamps. No IP, user agent, precise location, cookie or referrer is reported. Intro disclosure explains the tattle loop. Local dry-run sends are labelled PRACTICE DELIVERY; local live sends use the configured bot and chat.

### 16.2 API contracts
- `POST /api/session`: JSON `{captchaToken?: string}` → `{token, sid, expiresAt}`. HMAC-SHA256 tokens last 30 minutes. Live delivery validates hCaptcha; invalid responses return 403. Provider outages fall back to two session issuances per hashed IP per ten minutes.
- `POST /api/notify`: bearer-authenticated JSON `{eventId, kind, attack?, hit?, occurredAt?, roastText?, anger?, reason?, name?, freeText?, combo?, sentence?, compliments?, stats?, device?}`. Shared types are in `shared/contracts.ts`; runtime validation is in `shared/schemas.ts`.
- New completed moves use `kind: "attack"`, with `attack`, `hit`, and ISO `occurredAt`; roasts also require `roastText`. Legacy kinds `first_blood`, `combo`, `ultimate`, and `ko` remain parseable for saved outboxes. `final` and `compliment` remain in use. Attack IDs use `thunder`, not `thunder_punch`.
- Success is `202 {ok:true, mode:"dry-run"|"live"}`. Completed duplicate is 409. Pending duplicate and throttled requests are 429 with retryAfter. Invalid bodies 400, invalid tokens 401, disabled service 503, Telegram failures 502.
- `GET /api/health` → `{ok:true, notify:boolean, mode:"dry-run"|"live"}`. No secrets.

### 16.3 Limits and temporary state
Render Key Value coordinates per-IP keyed hashes, per-session counts, dedupe and serialized sends across API instances. Limits: 10 session creations / 10 minutes, 30 notify requests / 10 minutes, 60 notify requests / minute globally. Seven non-final reports plus one reserved final per session, five seconds between ordinary reports. Final bypasses only the per-session interval. Operational records expire; no message text or analytics history is stored. Local development uses equivalent in-memory coordination for dry-run or live delivery.

### 16.4 Error handling
Timeouts and Telegram 5xx receive one server retry; formatting errors get one plain-text fallback. Telegram 429 is passed back with retry_after for client backoff. Bad bot/chat responses open a 60-second circuit. The client queues at most seven events per session for ten minutes, retries at most three times, and preserves pending sessions through replay. Authenticated fetch keepalive sends a best-effort final on exit. Exactly-once Telegram delivery is not promised after ambiguous timeouts or loss of operational storage.

### 16.5 Final reports
Certificate statistics freeze at entry. Final is submitted on successful share/download, replay, restart, or exit, with the sentence and known shared flag. Reuse one final event ID. Reporting never blocks animation or input.

### 16.6 Security
Explicit allowed frontend origins, JSON-only request bodies capped at 4 KB, schema validation, control-character/URL/mention removal, length limits, a light profanity filter, HTML escaping, and notification kill switch. Real secrets are supplied only in Render. See docs/SECURITY.md and docs/DEPLOYMENT.md for configuration and owner launch checks.

---

## 17. Technical architecture — Vercel + Render

### 17.1 Stack
Frontend: Vite + React + strict TypeScript, Zustand, GSAP, original SVG rigs, pooled Canvas particles, CSS variables and self-hosted fonts. No Three.js, Motion, Rive or Lottie. Audio is procedural Web Audio. Main gameplay and aftermath scenes are lazy-loaded.

Backend: Node 24 + Hono + Zod on Render. `@hono/node-server` binds `0.0.0.0` and `$PORT`; tsup bundles the server. Render Key Value supplies short-lived rate/dedupe/send coordination. hCaptcha replaces Turnstile. No Cloudflare services are used.

Hosting: frontend at Vercel from `web/dist`; Render serves `/api/*`. Vite proxies `/api` to port 8787 locally. Production `VITE_API_BASE` points to Render, and `ALLOWED_ORIGINS` is an exact-origin list.

### 17.2 Modules and interfaces
- `web/src/core`: scene/settings/session store, certificate snapshot and typed event bus.
- `web/src/engine`: pure combat/score/zone/deck logic, audio synthesis, pooled particles.
- `web/src/components`: rig, original weapons, onboarding, arena/director, settings/dialogs and aftermath.
- `web/src/net`: authenticated bootstrap, per-session outbox, bounded retries and truthful delivery state.
- `web/src/share`: two-format Canvas certificate and share/download fallback.
- `shared`: canonical IDs, TypeScript contracts and server validation schemas.
- `api/src`: HTTP API, sanitisation/HMAC, Redis/in-memory coordinators and Telegram transport.

Attack definitions are data-driven by ID, damage interval, rage gain/cost, colour, caption and timing. One hero timeline runs at a time; one buffered input can survive 250 ms. Previously impacted light attacks can fast-forward recovery. Combat state commits once at impact and emits a typed event; networking is a separate subscriber.

### 17.3 Performance and accessibility
Initial first-load budget: 170 KB compressed JS, 350 KB overall excluding lazy assets; LCP under 2 s, TBT below 200 ms and CLS below 0.05 under the recorded Lighthouse run. Manual phone FPS is a separate device check. Canvas caps are 150 particles (60 Lite), DPR ≤ 2. Hide events pause audio and combat. Calm Chaos uses short comic beats; Gentle FX removes flashes/zoom; a shared flash cooldown constrains rapid impacts.

### 17.4 Deployment and observability
Root vercel.json, render.yaml and GitHub CI are the deploy/check entrypoints. Health returns mode without secrets. Error logging excludes payloads and secrets. Real Telegram + hosting smoke tests require owner account configuration. FastAPI is not needed for this selected Node implementation. See docs/DEPLOYMENT.md.

---

## 18. Prioritised roadmap

### 18.1 MVP — "Fight Night" `P0` (≈ 240 focused hours ≈ 6 weeks full-time, or ≈ 10–12 weekends part-time)
Everything needed for a complete, shareable, delightful loop:
- Gate (sound choice), Intro (YES/NO), Anger test (choices + PROVE IT), **Lie Detector** (NO path; STILL NO routes back with a gag).
- Room: placeholder-then-final **SVG rig**, 6 hit zones, ego bar, rage meter, combos (HAT-TRICK, SALAD, BONK-A-DOODLE, DESI MOM SPECIAL, FULL SET), crits, sleeping bonus, whiffs, damage stages, decals.
- **8 actions:** Slap, Punch, Chappal, Bonk, Tomato, Roast (card-pick), Thunder Punch, Emotional Damage.
- Procedural audio for everything + mute/volume + Gate unlock.
- Verdict cinematic (no slot machine) + Certificate with canvas share.
- Telegram: `first_blood`, `combo`, `ultimate`, `ko`, `final`; batching, rate limit, Turnstile, session token, funny failure toast.
- Mobile-first layout, Calm Chaos mode, Lite effects, keyboard play.
- CI, deploy, docs.

### 18.2 Polished release `P1` (≈ +8–10 days)
Self-recorded foley (chappal/slap/tomato/gavel), Harsh voice lines, procedural fight music, Compliment Mode, Sentence Slot Machine, mystery events, rounds 2–3, typed roasts (filtered), flick-to-throw, persistent bruises + visit-count dialogue, time/date-aware lines, shake-phone earthquake, festival skins, live Telegram ticker, Hinglish/English toggle, Cloudflare Web Analytics, more easter eggs, final character art pass.

### 18.3 Experimental `P2`
Harsh Fights Back (Telegram inline buttons + KV + polling), global slap counter (D1/Durable Object), Face-Plate Mode, Rive character, rhythm timing mode, seasonal events engine.

### 18.4 Phase gates
| Gate | Exit criteria |
|---|---|
| G0 Foundations | Repo builds, deploys a "hello" Worker + SPA, CI green |
| G1 One perfect attack | Slap fully polished (anim + sound + reaction + Telegram) on a real phone |
| G2 MVP feature-complete | All P0 tasks done, acceptance criteria pass |
| G3 Friends & family beta | 10 testers on iOS + Android; zero blank screens; Telegram works |
| G4 Public launch | Perf budgets met, security checklist ticked, OG + share tested |

> **Production rule:** build **one attack to final quality first** (Slap, T-040), then replicate the pattern. Don't build 8 mediocre attacks.

---

## 19. Engineering tasks and acceptance criteria

> Estimates are rough focused hours. Each task: `ID · priority · est · depends` → **AC** (acceptance criteria). Lines beginning `- [ ] T-` are machine-readable (see §24 for issue creation).

### E0 — Foundations
- [ ] T-001 · P0 · 1h · — · Scaffold monorepo (`web/`, `api/`, `docs/`, `scripts/`), Git, `.gitignore`, `.editorconfig`. **AC:** `git status` clean; `npm run dev` in `web` serves a page.
- [ ] T-002 · P0 · 2h · T-001 · ESLint + Prettier + TypeScript strict + path aliases + Vitest. **AC:** `npm run lint`, `typecheck`, `test` pass.
- [ ] T-003 · P0 · 2h · T-001 · Worker skeleton (Hono) with `/api/health` + static assets + SPA fallback. **AC:** `wrangler dev` serves SPA and `GET /api/health` → `{ok:true}`.
- [ ] T-004 · P0 · 2h · T-002,T-003 · CI (lint, typecheck, test, build) + deploy workflow. **AC:** PR shows green; `main` deploys to `*.workers.dev`.
- [ ] T-005 · P0 · 1h · T-001 · Fonts (`@fontsource`), global CSS tokens, reset. **AC:** tokens from §14 exist; fonts load without layout shift.
- [ ] T-006 · P0 · 1h · T-001 · Docs skeleton generated from PRD (§24). **AC:** all files in §23 exist.

### E1 — Core engine & state
- [ ] T-010 · P0 · 3h · T-002 · Zustand store (scene, settings, session stats, ego, rage, combo, weapon) + localStorage persistence (`hrr:v1:*`). **AC:** unit tests for reducers; reload preserves settings.
- [ ] T-011 · P0 · 2h · T-010 · `actionLock` (one hero attack, 1 buffered input 250 ms). **AC:** spam-click test never runs two hero timelines; buffered input fires once.
- [ ] T-012 · P0 · 2h · T-002 · `deck` no-repeat shuffler. **AC:** property test: no immediate repeat across reshuffles for ≥ 3 items.
- [ ] T-013 · P0 · 3h · T-010 · Combo + score engine (pure). **AC:** all named combos in §7.6 detected; score formula §7.12 matches tests.
- [ ] T-014 · P0 · 2h · T-010 · Event bus (`GameEvent`). **AC:** audio/fx/HUD/net can subscribe independently.
- [ ] T-015 · P0 · 2h · T-010 · Scene router with GSAP-context cleanup. **AC:** switching scenes leaves 0 active tweens (`gsap.globalTimeline.getChildren().length === 0` after revert).

### E2 — Character
- [ ] T-020 · P0 · 4h · T-005 · Placeholder SVG rig with all layer IDs (§8.2). **AC:** every ID exists; rig renders at 3 viewport sizes.
- [ ] T-021 · P0 · 4h · T-020 · Expression system (15 expressions). **AC:** each expression switchable via `rig.set(exprId)`; storybook-like dev page.
- [ ] T-022 · P0 · 4h · T-020 · Idle brain + sleep + pointer tracking. **AC:** blink/look/sigh cycle; sleeps at 15 s; eyes follow pointer ≤ 4 px.
- [ ] T-023 · P0 · 3h · T-020 · Hit-zone resolver (padded). **AC:** tap on each zone returns correct ID; padding 16 px verified.
- [ ] T-024 · P0 · 3h · T-020 · Damage stages + persistent decals. **AC:** stage visuals change at §7.8 thresholds; decal caps §7.9 respected.
- [ ] T-025 · P1 · 8h · T-020 · Final character art (supplied by Harsh/artist per brief). **AC:** replaces placeholder with identical IDs; no filter/blur; ≤ 80 KB.

### E3 — FX layer
- [ ] T-030 · P0 · 4h · T-005 · Pooled particle canvas + DPR cap + Lite mode. **AC:** 150 particles at ≥ 55 fps on desktop; zero allocations per frame (profiler).
- [ ] T-031 · P0 · 2h · T-015 · Shake + hit-stop utilities. **AC:** shake affects `#stage` only; hit-stop restores in real time.
- [ ] T-032 · P0 · 3h · T-030 · Text-pop (onomatopoeia/damage), impact ring, speed lines, halftone burst. **AC:** each effect callable by id with params.
- [ ] T-033 · P0 · 2h · T-030 · FPS monitor → auto Lite mode. **AC:** simulated 20 fps flips to Lite within 1.5 s.

### E4 — Attacks (spec §9)
- [ ] T-040 · P0 · 10h · E1–E3 · **SLAP** (final quality: anim, reaction variants, audio synth, Telegram event). **AC:** passes the "juice checklist" (§20.4) on a real phone; 3 variants; no identical consecutive reaction.
- [ ] T-041 · P0 · 6h · T-040 · PUNCH. **AC:** uppercut variant; single flash; Shake(10,220).
- [ ] T-042 · P0 · 7h · T-040 · CHAPPAL with MotionPath + pile-up. **AC:** arc differs per tap origin; pile caps at 6; boomerang variant (P1).
- [ ] T-043 · P0 · 5h · T-040 · BONK + musical ladder + stun. **AC:** 5 consecutive bonks climb pentatonic; reset after 1.5 s; stun bonus +20%.
- [ ] T-044 · P0 · 5h · T-040 · TOMATO + drip decals + rain. **AC:** decal cap 8; rain at 3 taps/1 s respects particle cap.
- [ ] T-045 · P0 · 6h · T-040 · ROAST (card picker + SplitText projectiles). **AC:** 6 cards shown from 30; last word hits hardest; text sanitised.
- [ ] T-046 · P0 · 8h · T-040 · THUNDER PUNCH (hold-to-charge, haptics, crack overlay). **AC:** tap = auto-charge; one flash only; works with Calm mode.
- [ ] T-047 · P0 · 8h · T-040 · EMOTIONAL DAMAGE (triple zoom, Sharma Ji silhouette). **AC:** uses `{cgpa}` from `facts.json`; sequence ≤ 3.4 s; Calm mode alternative.
- [ ] T-048 · P0 · 3h · T-040 · WHIFF + accuracy tracking. **AC:** miss outside padded area; counts in stats.
- [ ] T-049 · P0 · 4h · T-040 · K.O. sequence. **AC:** slow-mo, bell, confetti ≤ 60, → VERDICT in ≤ 2.5 s.
- [ ] T-050 · P0 · 3h · T-013 · Crit system + sleeping bonus. **AC:** crit odds per §7.4; asleep hit = ×2 + jump-scare.

### E5 — Audio
- [ ] T-060 · P0 · 6h · T-002 · Audio engine (context, groups, compressor, pool, pan/pitch, ducking, visibility). **AC:** no sound before Gate tap; unit tests for pool/steal.
- [ ] T-061 · P0 · 8h · T-060 · Synth recipes for all `S` sounds in §11.4. **AC:** every ID audible and non-clipping; peak ≤ −3 dBFS.
- [ ] T-062 · P0 · 2h · T-060 · Settings (mute, volume, test sound) + persist. **AC:** survive reload; muted flag honoured everywhere.
- [ ] T-063 · P0 · 2h · T-060 · iOS audio handling (`audioSession`, resume, silent-switch test). **AC:** manual test on iPhone with ringer off/on documented.
- [ ] T-064 · P1 · 4h · T-060 · Sampler + recorded foley pack + ffmpeg pipeline. **AC:** ≤ 500 KB; licence log complete.
- [ ] T-065 · P1 · 3h · T-064 · Voice lines (opt-in, lazy). **AC:** ≤ 1 per 6 s; off by default.
- [ ] T-066 · P1 · 5h · T-060 · Procedural chiptune music w/ rage tempo. **AC:** ducking works; CPU < 5%.

### E6 — Screens
- [ ] T-070 · P0 · 3h · T-060 · GATE. **AC:** §6.1.
- [ ] T-071 · P0 · 5h · T-070 · INTRO (title slam, Harsh peek, buttons). **AC:** §6.2; ≤ 2.2 s to interactive.
- [ ] T-072 · P0 · 5h · T-071 · ANGER (gauge, choices, PROVE IT). **AC:** §6.3; each level changes theme/Harsh/dialogue.
- [ ] T-073 · P0 · 4h · T-071 · LIE_DETECTOR (hold pad, scan, stamp). **AC:** §6.4; keyboard Space works.
- [ ] T-074 · P0 · 8h · E2–E4 · ROOM layout, HUD, dock, weapon equip, aim, drawer. **AC:** §6.6; playable on 360×640 and 1440×900.
- [ ] T-075 · P0 · 5h · T-074 · VERDICT cinematic. **AC:** §6.7 steps 1–3; tap to skip.
- [ ] T-076 · P0 · 6h · T-075 · CERTIFICATE (canvas, share, restart/another round). **AC:** §6.8; PNG downloads; Web Share on mobile.
- [ ] T-077 · P1 · 4h · T-073 · COMPLIMENT mode + kind certificate. **AC:** §6.5.
- [ ] T-078 · P1 · 5h · T-075 · Sentence slot machine. **AC:** 3 reels, staggered stops, result in cert + Telegram.

### E7 — Content
- [ ] T-080 · P0 · 4h · — · Content JSON schemas + loader (Zod) + `facts.json`, `roasts.json`, `charges.json`, `sentences.json`, `dialogue.{hi,en}.json`. **AC:** content validated at build; missing keys fail CI.
- [ ] T-081 · P0 · 3h · T-080 · Harsh approves all lines (review pass). **AC:** checklist in `docs/CONTENT_REVIEW.md` ticked.
- [ ] T-082 · P1 · 3h · T-080 · Context-aware picker (hour, weekday, visit_n). **AC:** §12.12 behaviours; tests with mocked clock.

### E8 — Backend & Telegram
- [ ] T-090 · P0 · 3h · T-003 · Zod schemas + sanitiser (strip URLs/@/control chars, length caps, blocklist). **AC:** table-driven tests for 25 hostile inputs.
- [ ] T-091 · P0 · 3h · T-003 · `/api/session` with Turnstile verify + HMAC token. **AC:** invalid token → 403; valid → token with 30 min exp; Turnstile outage fails open with stricter limits.
- [ ] T-092 · P0 · 4h · T-091 · `/api/notify`: auth, validate, throttle, format, send. **AC:** contract §16.4; message formats §16.3 match.
- [ ] T-093 · P0 · 3h · T-092 · Telegram client (timeout 3 s, retry/429, plain-text fallback, circuit breaker). **AC:** simulated 400/401/429/500 behave per §16.5.
- [ ] T-094 · P0 · 2h · T-092 · Rate limit binding + global cap + dedupe LRU. **AC:** 11th session/10 min from one IP → 429.
- [ ] T-095 · P0 · 1h · T-092 · Kill switch `NOTIFY_ENABLED`. **AC:** false → 503; UI unaffected.
- [ ] T-096 · P0 · 2h · T-092 · Security headers + CSP. **AC:** securityheaders-style check passes; app runs under CSP.
- [ ] T-097 · P0 · 2h · T-092 · `DRY_RUN` mode (logs formatted message, no send). **AC:** used in e2e tests.
- [ ] T-098 · P1 · 4h · T-092 · Live ticker (`editMessageText`). **AC:** one message per session edited silently; final pings.

### E9 — Net client
- [ ] T-100 · P0 · 3h · T-091 · Session bootstrap (invisible Turnstile) + token handling. **AC:** failure doesn't block gameplay.
- [ ] T-101 · P0 · 3h · T-092 · Event queue, batching rules, retry with jitter, `sendBeacon` on `pagehide`. **AC:** ≤ 1 msg/5 s, ≤ 8/session; offline queue flushes.
- [ ] T-102 · P0 · 2h · T-101 · Chota Sher delivery animation + failure toast. **AC:** success/failure both shown; never blocks input.

### E10 — Mobile, accessibility, performance
- [ ] T-110 · P0 · 4h · T-074 · Responsive/safe-area/touch tuning; landscape dock. **AC:** no scrollbars/overscroll on iOS/Android; targets ≥ 56 px.
- [ ] T-111 · P0 · 4h · T-074 · Calm Chaos + Gentle FX modes. **AC:** all attacks have non-motion alternatives; ≤ 1 flash/attack.
- [ ] T-112 · P0 · 3h · T-074 · Keyboard + screen-reader live region. **AC:** whole flow playable by keyboard; axe has 0 serious issues.
- [ ] T-113 · P0 · 3h · T-004 · Lighthouse CI budgets (§17.8). **AC:** CI fails on budget regression.
- [ ] T-114 · P0 · 3h · T-074 · Haptics + Lite mode toggle. **AC:** feature-detected; no errors on iOS.

### E11 — QA & launch
- [ ] T-120 · P0 · 6h · E4–E9 · Playwright e2e (mobile viewport): Gate → YES → Anger → attacks → K.O. → Certificate with `DRY_RUN`. **AC:** green in CI.
- [ ] T-121 · P0 · 4h · — · Device matrix pass (§20.3). **AC:** all rows ticked in `docs/QA_CHECKLIST.md`.
- [ ] T-122 · P0 · 2h · — · OG image, favicon, meta tags, share text. **AC:** link preview checked on WhatsApp/Telegram/X.
- [ ] T-123 · P0 · 2h · — · Secrets set, token rotated, kill-switch tested. **AC:** `SECURITY.md` checklist ticked.
- [ ] T-124 · P0 · 2h · — · README, ASSETS.md, LICENSES. **AC:** every asset has a licence row.

### E12 — Polish & experimental (P1/P2)
- [ ] T-130 · P1 · 8h · E4 · Mystery events (6). **AC:** §7.10.
- [ ] T-131 · P1 · 6h · E4 · Rounds 2–3. **AC:** §7.11.
- [ ] T-132 · P1 · 5h · E4 · Typed roast with filter. **AC:** §16.6 rules enforced client + server.
- [ ] T-133 · P1 · 5h · E2 · Flick-to-throw (velocity). **AC:** chappal/tomato speed → damage; tap fallback.
- [ ] T-134 · P1 · 3h · E1 · Persistent bruises + visit-count dialogue. **AC:** localStorage only.
- [ ] T-135 · P1 · 4h · — · Easter eggs batch #1–#12 (§13). **AC:** each has a test or manual checklist entry.
- [ ] T-136 · P1 · 3h · — · Hinglish/English toggle. **AC:** no missing keys.
- [ ] T-140 · P2 · 12h · E8 · Harsh Fights Back (webhook, KV, polling). **AC:** §16.8; secret-token verified; chat-ID checked.
- [ ] T-141 · P2 · 6h · E8 · Global slap counter (D1/DO). **AC:** write-limited; no PII.
- [ ] T-142 · P2 · 6h · E2 · Face-Plate Mode (opt-in). **AC:** image processed client-side only.

**Estimated MVP total (all P0 tasks):** ≈ 240 focused hours, before character-art and recording time. **Fast path (≈ 90–110 h, ~3 weekends):** Gate, Intro, Anger (choices only), Lie Detector gag, Room with Slap/Punch/Chappal/Bonk/Tomato + Thunder Punch, ego + rage + combos, synth audio, simple Verdict, Certificate, Telegram `first_blood` + `final`. If time is tight, cut order: Roast → Emotional Damage detail → Landscape layout → PROVE IT. **Never cut:** Slap quality, Sound Gate, Telegram failure resilience, Calm mode.

---

## 20. Testing, QA and quality bars

### 20.1 Automated
| Layer | Tooling | Covers |
|---|---|---|
| Unit | Vitest | combo/score engine, deck, sanitiser, token sign/verify, content schemas |
| Component | Vitest + Testing Library | settings, HUD, dock |
| API | Vitest (+ miniflare/`wrangler dev`) | `/api/session`, `/api/notify` contracts, limits, Telegram error matrix (mocked fetch) |
| E2E | Playwright (mobile + desktop projects) | Full flow with `DRY_RUN`, Calm mode, offline, kill switch |
| A11y | `@axe-core/playwright` | 0 serious/critical issues |
| Perf | Lighthouse CI | Budgets in §17.8 |

### 20.2 Property/chaos tests worth having
Rapid-fire 20 clicks/s for 10 s → no overlapping hero timelines, no memory growth > 20 MB. Tab hidden/visible mid-attack → clean resume. Scene change during attack → no orphan tweens. 3G throttling → Gate works before assets finish.

### 20.3 Device matrix (manual)
| Device/browser | Must pass |
|---|---|
| iPhone Safari (current iOS) | Sound with ringer on/off, Web Share, safe areas, no zoom |
| Android Chrome (mid-range, ≤ 4 GB RAM) | 50 fps attacks, haptics, Lite mode switch |
| Android low-end / Samsung Internet | Playable at 30 fps, no crashes |
| Desktop Chrome, Firefox, Safari | Pointer FX, keyboard play, certificate download |
| In-app browsers (Instagram/WhatsApp) | Gate works, audio unlock works, share fallback |

### 20.4 Juice checklist (per attack, must pass before "done")
☐ Anticipation visible (≥ 100 ms) ☐ Hit-stop felt ☐ ≥ 2 audio layers ☐ Reaction differs from last time ☐ Text-pop readable on a 360 px screen ☐ Fun with sound off ☐ Fun with Calm mode ☐ Spammed 10× without glitching ☐ Telegram event emitted exactly once.

---

## 21. Risks and mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Animations overlap/glitch under spam | High | High | `actionLock`, one hero timeline, fast-forward older reactions, chaos tests |
| R2 | iOS silences Web Audio / audio blocked in in-app browsers | High | High | Gate unlock, `audioSession`, silent `<audio>` fallback, visible mute state |
| R3 | Mid-range Android drops frames | Med | High | Lite mode, particle caps, transform/opacity only, FPS monitor |
| R4 | Telegram spam/abuse (free text, bots) | Med | High | Chips-first, filters, Turnstile, rate limits, kill switch |
| R5 | Telegram 429 / outage | Low | Med | Batching, backoff, circuit breaker, site playable without it |
| R6 | Token leakage | Low | Critical | Secrets only on Worker, rotate before launch, CI secret scanning |
| R7 | Existing Chota Sher bot already uses `getUpdates` or another webhook | Med | Med | Outbound `sendMessage` works fine; only P2 webhook conflicts → use a second bot if needed |
| R8 | Art quality (placeholder looks bad) | Med | High | Early art brief, placeholder rig first, SVG layer contract so art swaps in |
| R9 | Scope creep (too many cool ideas) | High | High | Roadmap gates, "one perfect attack first" rule, idea index decisions |
| R10 | Sound licensing mistakes | Low | Med | Procedural/self-recorded first; `ASSETS.md` log; CC0-only external |
| R11 | Jokes land badly / too harsh on Harsh | Low | Med | Harsh approves every line; gentle roasts; English fallback |
| R12 | Photosensitivity complaints | Low | High | ≤ 1 flash/attack, Gentle FX toggle, WCAG 2.3.1 review |
| R13 | Free-tier limits (100k Worker requests/day) after going viral | Low | Low | Static assets are free; API calls small; upgrade is cheap; kill switch |
| R14 | Turnstile outage blocks sessions | Low | Med | Fail open with stricter limits |
| R15 | Visitors don't know sound is expected | Med | Low | Gate screen sells it; Silent mode is fully playable |

---

## 22. Project file structure

```
harsh-rage-room/
├─ PRD.md                         ← this file (source of truth)
├─ README.md
├─ LICENSE
├─ package.json                   ← root scripts only (dev/build/deploy/docs/issues)
├─ .gitignore  .editorconfig  .prettierrc  .nvmrc
├─ .github/
│  ├─ workflows/ci.yml  deploy.yml
│  └─ dependabot.yml
├─ docs/                          ← generated from PRD (see §23) + a few hand-written
│  ├─ JOURNEY.md  GAME_DESIGN.md  ANIMATION.md  SOUND.md  DIALOGUE.md
│  ├─ ART_DIRECTION.md  CHARACTER_BRIEF.md  ACCESSIBILITY.md
│  ├─ TELEGRAM.md  ARCHITECTURE.md  ROADMAP.md  TASKS.md  QA_CHECKLIST.md  RISKS.md
│  └─ ASSETS.md  SECURITY.md  CONTENT_REVIEW.md  DEPLOYMENT.md  CHANGELOG.md   (hand-written)
├─ scripts/
│  ├─ extract-docs.sh  create-issues.sh  encode-audio.sh  optimize-svg.sh
├─ web/
│  ├─ index.html  vite.config.ts  tsconfig*.json  package.json  playwright.config.ts  lighthouserc.json
│  ├─ .env.example               ← VITE_TURNSTILE_SITE_KEY, VITE_API_BASE (optional)
│  ├─ public/
│  │  ├─ favicon.svg  og.jpg  robots.txt
│  │  ├─ audio/   (mp3 samples — created in P1)
│  │  └─ textures/ (paper.webp)
│  ├─ e2e/        flow.spec.ts  a11y.spec.ts  offline.spec.ts  killswitch.spec.ts
│  └─ src/
│     ├─ main.tsx  App.tsx
│     ├─ styles/  tokens.css  base.css  halftone.css  scenes.css
│     ├─ core/    store.ts  actionLock.ts  deck.ts  events.ts  clock.ts  rng.ts  settings.ts
│     ├─ engine/  combo.ts  score.ts  damage.ts  zones.ts
│     │  └─ attacks/  index.ts  slap.ts  punch.ts  chappal.ts  bonk.ts  tomato.ts
│     │               roast.ts  thunder.ts  emotional.ts  whiff.ts  ko.ts
│     ├─ character/  HarshRig.tsx  rig.tsx  expressions.ts  idleBrain.ts  damageStages.ts  decals.ts
│     ├─ fx/      particles.ts  shake.ts  hitstop.ts  textPop.ts  speedLines.ts  fpsMonitor.ts
│     ├─ audio/   engine.ts  unlock.ts  sampler.ts  mixer.ts  music.ts
│     │  └─ recipes/  ui.ts  whoosh.ts  impacts.ts  thunder.ts  stings.ts  jingles.ts  misc.ts
│     ├─ net/     api.ts  queue.ts  retry.ts  beacon.ts  types.ts
│     ├─ share/   certificate.ts  shareApi.ts
│     ├─ content/ dialogue.hi.json  dialogue.en.json  roasts.json  charges.json  sentences.json
│     │            compliments.json  facts.json  events.json  share.json  schema.ts
│     ├─ screens/ Gate.tsx  Intro.tsx  Anger.tsx  LieDetector.tsx  Compliment.tsx
│     │            Room.tsx  Verdict.tsx  Certificate.tsx
│     ├─ ui/      Button.tsx  Hud.tsx  Dock.tsx  SettingsDrawer.tsx  Toast.tsx  Announcer.tsx  ChotaSher.tsx
│     ├─ hooks/   useReducedMotion.ts  usePointer.ts  useHaptics.ts  useGsapScope.ts
│     └─ test/    setup.ts
└─ api/
   ├─ wrangler.toml  package.json  tsconfig.json  .dev.vars.example
   ├─ src/
   │  ├─ index.ts  schemas.ts
   │  ├─ routes/  session.ts  notify.ts  health.ts  tg.ts   (tg = P2)
   │  └─ lib/     telegram.ts  token.ts  sanitize.ts  format.ts  ratelimit.ts  turnstile.ts  headers.ts  env.ts
   └─ test/      sanitize.test.ts  token.test.ts  notify.test.ts  telegram.test.ts
```

---

## 23. Required documentation files

| File | Source | Purpose |
|---|---|---|
| `README.md` | hand-written | What it is, how to run, how to deploy, how to add content, FAQ |
| `docs/JOURNEY.md` | PRD §5–6 | Flow and screen specs |
| `docs/GAME_DESIGN.md` | §7–8 | Systems, character |
| `docs/ANIMATION.md` | §9–10 | Attack specs, motion system |
| `docs/SOUND.md` | §11 | Audio engine, sound table, DIY foley, ffmpeg |
| `docs/DIALOGUE.md` | §12–13 | All copy, easter eggs |
| `docs/ART_DIRECTION.md` | §4, §14 | Direction, tokens |
| `docs/CHARACTER_BRIEF.md` | §8 | Brief for the artist/illustrator |
| `docs/ACCESSIBILITY.md` | §15 | A11y requirements |
| `docs/TELEGRAM.md` | §16 | Messages, API, errors, abuse rules |
| `docs/ARCHITECTURE.md` | §17 | Stack, modules, contracts, deploy |
| `docs/ROADMAP.md` / `TASKS.md` | §18 / §19 | Phases, tasks + AC |
| `docs/QA_CHECKLIST.md` | §20 | Tests, devices, juice checklist |
| `docs/RISKS.md` | §21 | Risk register |
| `docs/ASSETS.md` | hand-written | Licence log for every external asset |
| `docs/SECURITY.md` | hand-written | Secrets, rotation, launch checklist |
| `docs/CONTENT_REVIEW.md` | hand-written | Harsh's line-by-line approval checklist |
| `docs/DEPLOYMENT.md` | hand-written | Step-by-step Cloudflare + GitHub setup |
| `docs/CHANGELOG.md` | hand-written | Keep a Changelog format |

---

## 24. Current commands

Node 24 recommended. Run from the repository root.

```bash
npm ci
npm run dev             # Vite :5178 and Node API :8787
npm run lint
npm run typecheck
npm test
npm run build
npm run check:bundle
npx playwright install chromium webkit
npm run test:e2e
npm run test:perf
npm run docs
```

No secret is required for local dry-run. Copy .env.example to .env only when custom configuration is needed; do not commit .env. Vercel uses npm run build:web and web/dist. Render uses npm run build:api and npm start. Follow docs/DEPLOYMENT.md for platform setup, exact origins, hCaptcha, Telegram and the kill switch. The earlier Wrangler shell scaffold is superseded.

---

## 25. Open questions and assumptions

### 25.1 Assumptions made (change in PRD if wrong)
- Hinglish is the default dialogue language; English toggle in P1.
- Timestamps in IST (`Asia/Kolkata`).
- Render and Vercel accounts are owner-provided; local development requires neither.
- Harsh will provide (or approve) character cues and record foley/voice in P1.
- No analytics DB; Telegram + optional Cloudflare Web Analytics are enough.
- No private CGPA is shipped. The marksheet comparison is an explicitly fictional ego score.

### 25.2 Open questions (none block starting E0–E3)
1. **Chota Sher bot:** does it already run a webhook or `getUpdates` loop for other features? (Only affects P2 "Harsh Fights Back"; outbound `sendMessage` is unaffected.)
2. **Character art:** will you draw it, commission it, or start with the placeholder rig? Which real-world cues (hair, glasses, hoodie) should the cartoon keep?
3. **Domain:** `*.workers.dev` at first, or a custom domain?
4. **Face-Plate Mode (P2):** do you want your actual face on the cartoon body? (Opt-in, client-side only.)
5. **Roast tone:** how spicy can the deck get? Anything off-limits?
6. **Beta testers:** which 8–10 friends (iOS + Android) get the first link?
7. **Festival skins (P1):** which dates matter?

---

## 26. References

> Links were gathered during research on 2026-10-01; confirm exact versions/config keys at implementation time.

| Topic | Link |
|---|---|
| GSAP (free incl. plugins) | https://gsap.com · https://gsap.com/standard-license · https://webflow.com/blog/gsap-becomes-free · https://www.npmjs.com/package/gsap · https://www.npmjs.com/package/@gsap/react |
| Motion (considered, skipped) | https://motion.dev |
| Telegram Bot API / FAQ (limits) | https://core.telegram.org/bots/api · https://core.telegram.org/bots/faq |
| Cloudflare Workers limits | https://developers.cloudflare.com/workers/platform/limits/ |
| Workers static assets | https://developers.cloudflare.com/workers/static-assets/ |
| Workers Rate Limiting binding | https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ |
| Turnstile | https://developers.cloudflare.com/turnstile/ |
| Hono | https://hono.dev |
| Vite | https://vite.dev |
| Web Audio API | https://developer.mozilla.org/docs/Web/API/Web_Audio_API |
| Audio Session API (iOS silent-switch) | https://developer.mozilla.org/docs/Web/API/Navigator/audioSession |
| Vibration / Web Share APIs | https://developer.mozilla.org/docs/Web/API/Vibration_API · https://developer.mozilla.org/docs/Web/API/Navigator/share |
| Sounds (CC0 / safe) | https://kenney.nl/assets?q=audio · https://freesound.org (CC0 filter) · https://pixabay.com/sound-effects/ · https://mixkit.co/free-sound-effects/ · https://opengameart.org |
| Retro SFX generators | https://sfxr.me · https://sfbgames.itch.io/chiptone |
| Fonts | https://fontsource.org |
| Confetti | https://github.com/catdad/canvas-confetti |
| WCAG 2.3.1 (flashes) | https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html |

---

## 27. Appendix — the experience, played out (60-second walkthrough)

**0:00** Aman opens the link on his phone in a WhatsApp in-app browser. Black screen. A tiny lion peeks in: *"BEST WITH SOUND. HARSH'S DIGNITY IS BEST WITH EARMUFFS."* He taps **SOUND ON** — an arcade boom, the title slams in: **IS HARSH IRRITATING YOU?** Cartoon Harsh slides up from the bottom edge, eyes darting.
**0:08** He taps **YES, EXTREMELY**. The screen wipes diagonally with a comic burst. *"ARE YOU ACTUALLY ANGRY AT HIM?"* He taps **PROVE IT**, mashes for 3 seconds: 9 taps/s → **BEYOND HUMAN LIMITS**. The background floods red; Harsh hides behind a laptop. Chota Sher: *"BOTH ULTIMATES UNLOCKED. MAY GOD HAVE MERCY ON HIS EGO."*
**0:18** VS card slams: **HARSH vs YOU**. *"ROUND 1 — FIGHT!"* Aman taps **CHAPPAL**, then taps Harsh's glasses. A chappal spins in on an arc with a Doppler whoosh — **THWACK!** The glasses fly off, Harsh squints and paws around. Telegram buzzes in Harsh's pocket: 🚨 *SOMEONE JUST ATTACKED HARSH!* — and on Aman's screen, the lion sprints across with a tiny envelope.
**0:30** Slap, slap (backhand!), tomato, bonk ×3 — the bonks climb a musical scale. **BONK-A-DOODLE** banner after five. Harsh grows two bumps and a bandaid. A rare **GOLDEN CHAPPAL** crits with a choir sting.
**0:48** Rage meter is full. Aman holds **THUNDER PUNCH**; the screen dims, a heartbeat thuds, Harsh whispers "…no". Release: white-out, lightning, freeze-frame, crack across the screen, Harsh launched into orbit. *"THE SKY HAS FILED A COMPLAINT."* Then **EMOTIONAL DAMAGE**: triple zoom on Harsh's face, Sharma Ji's son slides in with a 9.9 marksheet. Harsh's soul leaves his body. Tiny violin.
**0:58** Ego 0%: **K.O.** Bell, confetti, Harsh sprawled with a ghost above. A gavel bangs: **GUILTY ON ALL COUNTS.** The slot machine spins: **BUY — CHAI — FOR 5 PEOPLE.**
**1:10** The Certificate stamps itself: **CERTIFICATE OF VIRTUAL REVENGE — VERIFIED BY NOBODY.** Aman shares the card to his group. Harsh's Telegram shows the final report: 23 attacks, 2 ultimates, 82% accuracy, sentence: *BUY CHAI FOR 5 PEOPLE.*

*— End of PRD v1.0 —*
