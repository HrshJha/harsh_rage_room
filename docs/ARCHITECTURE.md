<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

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


