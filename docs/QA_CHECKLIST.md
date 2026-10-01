# Verification record

Local verification on 1 October 2026, Node 24.14.1. These results describe this build on this machine.

## Passed

- TypeScript, ESLint, production frontend/API builds, and dependency audit (zero reported vulnerabilities).
- 75 unit/API/content tests: damage, combos, scores, critical hits, hit zones, tokens, sanitization, rate limits, idempotency, reserved final report, simulated Telegram failures/retries, and exact named roast formatting.
- 32 browser cases passed on a clean rerun across desktop Chromium, Pixel-sized Chromium, and iPhone-sized WebKit, including personalized attack payloads, exact custom roast text, anonymous entry, and session name retention. Twenty-five cross-browser duplicate or failure-injection checks are intentionally skipped.
- Sound-on browser checks on all three profiles load all 20 audio files, start decoded Foley buffers for Test Sound and contact, and play three distinct slap takes in sequence. A missing-slap-file injection falls back without breaking an attack.
- The same sound-on and missing-file cases pass against a locally served production build. All 20 shipped clips match their source-ledger SHA-256 hashes. Eight personalized-action cases also pass against the production build. Vercel hosting itself remains unverified.
- 12 production-build cases passed across those browsers: revenge path/export/replay, kindness, keyboard/Calm/offline play, and automated serious/critical accessibility checks.
- Every weapon commits exactly one attack result; rapid input respects recovery; both rage-gated ultimates operate.
- 360 × 640 portrait and 844 × 390 landscape weapon docks remain reachable.
- Real local API session token and dry-run delivery were verified earlier. A completed custom roast from the browser was accepted by the live Telegram API (`202`, `mode: live`) using the backend-only token and destination chat. Most browser cases mock transport for deterministic UI testing.
- Original landing, arena and downloaded certificate visually inspected. Retained examples are in `docs/previews`.
- Two Lighthouse simulated mobile runs of the personalized entry build with the headline font inlined measured performance 98, accessibility 100, and LCP 1873–1978 ms. TBT was 0 ms and CLS was 0.0031–0.0034. Earlier runs with a separate font request ranged from 1933 to 2126 ms. The 2-second target still has a narrow margin and is not a real-device guarantee. Reports are generated under `.lighthouseci`.

## Remaining external validation

- Actual Android/iOS hardware: sustained frame rate, thermal load, Safari audio unlocking, vibration, safe areas, native file sharing and silent-switch behaviour. Browser emulation does not establish these.
- Render/Vercel deployment and cold-start behaviour under production network conditions. No hosted resources were created.
- Live Redis coordination, hCaptcha domain configuration, hosted Render/Vercel delivery, provider errors, and human confirmation of received Telegram messages. Local development uses memory coordination; one live send was accepted by Telegram, which does not establish long-term delivery reliability.
- Human screen-reader and contrast review beyond the automated accessibility cases.

## Implementation scope

The complete playable loop, eight weapons, original animated SVG rig, hit stop, particles, damage/crit/combo/rage logic, compliments, sentence reels, certificates and resilient notification client are implemented. The new entry form accepts a session-retained name or anonymous entry. Completed attacks and submitted free-text roasts enqueue personalized Telegram reports with action timestamps; backend HTML escaping preserves the roast text, and existing rate limits cap rapid sends. The rig uses a smaller reusable expression set than the PRD's fifteen bespoke expressions. Five everyday moves now use edited CC0 Foley previews at the visual contact marker, with variation bags, per-move synth layers, pan, fallback cues, a master volume/mute path and an optional adaptive music bed. The 20 decoded clips were measured for short onset and normal sample peak, and the production audio payload is 72 KiB. These measurements do not establish the summed true peak, perceptual balance, or device sync; blind listening, real-device QA, and final mix review in [the arcade audio addendum](ARCADE_AUDIO_ADDENDUM.md) remain open.
