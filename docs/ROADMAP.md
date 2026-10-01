<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

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


