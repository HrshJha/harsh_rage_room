<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

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


