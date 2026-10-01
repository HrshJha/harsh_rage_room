<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 16. Telegram integration — Render edition

### 16.1 Transport and consent
The Vercel frontend calls the Render Node/Hono API. Only the API knows the Telegram bot token and destination chat. Reports contain user-chosen names/reasons, game statistics, random session aliases and IST timestamps. No IP, user agent, precise location, cookie or referrer is reported. Intro disclosure explains the tattle loop. All local sends are labelled PRACTICE DELIVERY.

### 16.2 API contracts
- `POST /api/session`: JSON `{captchaToken?: string}` → `{token, sid, expiresAt}`. HMAC-SHA256 tokens last 30 minutes. Live delivery validates hCaptcha; invalid responses return 403. Provider outages fall back to two session issuances per hashed IP per ten minutes.
- `POST /api/notify`: bearer-authenticated JSON `{eventId, kind, attack?, anger?, reason?, name?, freeText?, combo?, sentence?, compliments?, stats?, device?}`. Shared types are in `shared/contracts.ts`; runtime validation is in `shared/schemas.ts`.
- Kinds: `first_blood`, `combo`, `ultimate`, `ko`, `final`, `compliment`. Attack IDs use `thunder`, not `thunder_punch`.
- Success is `202 {ok:true, mode:"dry-run"|"live"}`. Completed duplicate is 409. Pending duplicate and throttled requests are 429 with retryAfter. Invalid bodies 400, invalid tokens 401, disabled service 503, Telegram failures 502.
- `GET /api/health` → `{ok:true, notify:boolean, mode:"dry-run"|"live"}`. No secrets.

### 16.3 Limits and temporary state
Render Key Value coordinates per-IP keyed hashes, per-session counts, dedupe and serialized sends across API instances. Limits: 10 session creations / 10 minutes, 30 notify requests / 10 minutes, 60 notify requests / minute globally. Seven non-final reports plus one reserved final per session, five seconds between ordinary reports. Final bypasses only the per-session interval. Operational records expire; no message text or analytics history is stored. Local dry-run uses equivalent in-memory coordination.

### 16.4 Error handling
Timeouts and Telegram 5xx receive one server retry; formatting errors get one plain-text fallback. Telegram 429 is passed back with retry_after for client backoff. Bad bot/chat responses open a 60-second circuit. The client queues at most five events per session for ten minutes, retries at most three times, and preserves pending sessions through replay. Authenticated fetch keepalive sends a best-effort final on exit. Exactly-once Telegram delivery is not promised after ambiguous timeouts or loss of operational storage.

### 16.5 Final reports
Certificate statistics freeze at entry. Final is submitted on successful share/download, replay, restart, or exit, with the sentence and known shared flag. Reuse one final event ID. Reporting never blocks animation or input.

### 16.6 Security
Explicit allowed frontend origins, JSON-only request bodies capped at 4 KB, schema validation, control-character/URL/mention removal, length limits, a light profanity filter, HTML escaping, and notification kill switch. Real secrets are supplied only in Render. See docs/SECURITY.md and docs/DEPLOYMENT.md for configuration and owner launch checks.

---


