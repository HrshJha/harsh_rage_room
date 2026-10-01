# Harsh Rage Room

A small, deliberately dramatic arcade game about a cartoon Harsh and his oversized ego. Eight attacks, a tattletale lion, and a certificate that is verified by absolutely nobody.

Built with React, TypeScript, GSAP, original SVG artwork, and a Web Audio mix of CC0 Foley and synthesized arcade accents. **Deployment is configured for a Vercel frontend and a Render Node/Hono API.** Telegram never sits between a visitor and the next hit.

## Run locally

Node 24 recommended.

```bash
npm ci
npm run dev
```

Open **http://localhost:5178**. The API runs on port **8787**. Without an environment file, notifications use a labelled dry run. For live local delivery, set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `NOTIFY_DRY_RUN=false` in the ignored `.env`. Both development servers bind to loopback. Port 5178 avoids the other project already using 5173 on this machine.

## Play

Enter a name, or leave it blank to play anonymously, and choose sound or silence. The name lasts for the current browser session. Answer the extremely serious questions and select a weapon. Tap Harsh to aim, or double-click a weapon to auto-aim. Select **Roast Harsh** to write a roast of up to 280 characters. Build rage for Thunder Punch and Emotional Damage. The NO branch has a lie detector, compliments, and a kindness certificate. Completed attacks and submitted roasts are reported to Telegram when live delivery is enabled, subject to spam limits.

Keyboard: **1–8** equip, **Space/Enter** attack when the stage/main area is focused, **M** mute, **Esc** settings. Hold the scanner using Space. Calm Chaos replaces dramatic movement with short comic beats. Lite effects reduce particle count. Browser pinch zoom remains available.

## Check

```bash
npm run lint
npm test
npm run build
npm run check:bundle
npx playwright install chromium webkit
npm run test:e2e
npm run test:perf
```

The unit/API suite uses fake Telegram responses. Browser tests mock notification delivery and cover both paths, personalized attacks and roasts, anonymous entry, keyboard play, offline play, certificates, and accessibility. See [verified results and remaining device checks](docs/QA_CHECKLIST.md).

## Deploy

Use the root `vercel.json` and `render.yaml`. Follow [the Render + Vercel guide](docs/DEPLOYMENT.md) for origins, hCaptcha and Telegram secrets. Both deployment manifests start with dry-run notifications. Live delivery requires explicit environment configuration; credentials never enter the browser bundle.

The [arcade direction](docs/ARCADE_DIRECTION_ADDENDUM.md) and [audio production](docs/ARCADE_AUDIO_ADDENDUM.md) addenda describe the target experience; [QA](docs/QA_CHECKLIST.md) distinguishes implemented features from open listening and device checks. The five everyday attacks use recorded CC0 Foley from the [audio source ledger](docs/audio/ASSET_CREDITS.csv), with varied takes, synth layers, and an optional adaptive music bed. The shipped files are edited Freesound previews; audition and final mix review remain open. Voices, extra rounds/rules, persistent bruises, multiplayer, and real photos are pending or deferred.
