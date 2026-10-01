<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

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


