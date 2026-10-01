<!-- Based on the user-provided product/design update, 1 October 2026. Its sound section is replaced by ARCADE_AUDIO_ADDENDUM.md; all other sections are retained. -->

# HARSH RAGE ROOM — Arcade direction update
> **Document type:** Product/design addendum to the existing PRD.md
> **Purpose:** Supersede and sharpen the earlier visual, interaction, sound and room-entry direction.
> **Project:** HARSH
> **Experience:** A fictional, over-the-top arcade rage room where visitors use cartoon attacks to vent playful frustration and send Harsh a Telegram notification.
> **Source of truth:** Keep PRD.md as the product foundation. This file governs the arcade art direction, attack feedback and motion. The later Personalized Rage Room update in PRD.md supersedes this document's name validation and notification rules: a blank name enters as Anonymous, and completed attacks and submitted free-text roasts carry name, action and timestamp. The linked arcade audio addendum governs sound. Other directions here are targets, not claims that the prototype implements them.


## 1. The new creative direction

Make it feel like a real arcade game—not a generic AI-generated landing page
The product should feel like a deliberately art-directed arcade fighting-game cabinet crossed with a mischievous comic-book toy. It should be loud in personality, tactile in interaction and precise in execution. It must not look like a SaaS dashboard, a template, a crypto landing page or a pile of random neon gradients.
The intended emotional arc is:
1. Curiosity: “What is this ridiculous thing?”
2. Permission to play: Enter a display name and enter the room.
3. Escalation: Questions build comic tension.
4. Payoff: The visitor picks a move, sees and hears a satisfying cartoon impact.
5. Relief and laughter: The character reacts, the game exaggerates the result, and the visitor can replay or share it.
6. Personal punchline: Harsh receives a Telegram message such as “Maya slapped you.”
The site is a tiny, self-contained piece of internet entertainment. The joke is the absurdly serious presentation of a completely fictional action—not realistic harm.
Brand personality
- Name: HARSH
- Mode: RAGE ROOM / ARCADE MODE
- Tone: cheeky, mischievous, dry, theatrical and self-aware
- Never: threatening, cruel, graphic, humiliating or genuinely hostile
- Primary joke: the interface treats a virtual slap like a championship-level event
Use short, punchy copy. Do not fill every empty space with a joke. Good timing and visual contrast are funnier than constant text.

## 2. Art direction: arcade cabinet, not neon soup


### Visual thesis

Build one strong composition around a game stage. Treat the page as a playable cabinet: a bold title/brand strip, a compact HUD, a central character arena, chunky action controls and a clear status area. The interface should feel authored, not assembled from generic cards.

### Colour system

Use a limited palette with jobs. Avoid gradients as the default surface treatment.

| Token | Hex | Purpose |
| --- | --- | --- |
| ink | #101114 | Main background; near-black, not pure black |
| cabinet | #1B1D22 | Main arcade cabinet / stage surround |
| panel | #292B31 | Secondary panels and control wells |
| paper | #F4F0E6 | Primary text and high-contrast labels |
| muted | #A9A69F | Secondary text |
| rage-red | #F04438 | Primary attack/action colour |
| arcade-yellow | #FFD23F | Warnings, score, impact emphasis |
| electric-blue | #4D8DFF | Utility state, focus, sound/settings |
| success-green | #78D99A | Delivered/complete states only |




### Rules

- Use rage-red for the main action and attack feedback; arcade-yellow for comic impact and score moments.
- Use blue sparingly for controls and information. Do not make every element glow.
- Reserve green for successful completion or notification delivery.
- Prefer solid colour, subtle texture, borders and lighting over gradient-heavy backgrounds.
- Avoid purple-pink AI-style gradients, random glassmorphism, excessive blur, oversized soft cards and decorative blobs.
- Keep text contrast strong. Colour must not be the only way to communicate a state.

### Typography

Use a tightly controlled type system:
- Display / game titles: a condensed, heavy display face (for example, Anton or a similarly licensed condensed font).
- UI / body: a legible geometric or neutral sans (for example, Inter or a comparable system-safe face).
- Score / timer / attack labels: tabular numerals or a restrained arcade-style mono face.
Use large uppercase display type only where it adds impact. Paragraph copy should remain normal case and easy to read. Self-host licensed font files when practical; always define robust fallbacks.

### Shape language and layout

- Prefer squared or lightly chamfered geometry, hard edges and tactile control surfaces.
- Use modest radii (roughly 4–12 px), not pill-shaped everything.
- Give the stage a clear border, inset edge or cabinet frame.
- Make attack buttons feel like physical arcade controls: pressed depth, clear active state and a satisfying release.
- Keep the active task obvious; do not show every feature at once.
- Desktop: one central stage with a compact HUD and visible move deck.
- Mobile: stage first, controls below or in a reachable bottom deck; never require hover.

### Character direction

Use an expressive cartoon Harsh avatar, ideally built from a small, reusable set of character poses or a layered 2D rig. It can be a stylised illustration, not a realistic depiction. The character needs readable states: idle, suspicious, nervous, smug, surprised, stunned, dizzy and victorious/defeated-comically.
Do not generate an unapproved realistic likeness. If a real photo is ever used, make it an explicit owner-provided asset and stylise it clearly as fictional comedy. The first version can use an original illustrated placeholder.

## 3. New room-entry flow: visitors enter a name


### Required flow

Landing → Name card → Irritation questions → Rage Room → Attack → Result
The visitor chooses a display name before entering the room. This is a playful fighter name, not identity verification.

### Name-entry screen

Suggested copy:
WELCOME TO THE HARSH RAGE ROOM
ENTER YOUR FIGHTER NAME
Input placeholder: e.g. Maya, Rahul, chaos.exe
Primary button: ENTER THE ROOM
Behaviour:
- Trim leading/trailing whitespace. A blank name continues as Anonymous.
- Set a practical maximum length (20 characters). Allow normal Unicode names, while rejecting control characters and stripping HTML/markup semantics.
- A fighter-name HUD label is a future visual enhancement; the entered name is used in notifications now.
- Provide a one-line disclosure: Your chosen name and completed move are sent to Harsh via Telegram.
- Do not require an account, email, phone number or Telegram account.
- Keep the name in client-side session state for the current visit. Do not retain it in a database unless a future feature makes that necessary and explains why.
- Visitors can change the name by restarting the entry flow; a dedicated edit control is a future enhancement.
- Never imply that the display name proves who the visitor actually is.
If the visitor leaves the name blank, let them enter and use Anonymous in notifications.

### Question flow

Keep the original yes/no concept, but make the path feel like a quick game rather than a long survey.
Example:
1. IS HARSH IRRITATING YOU? → YES, OBVIOUSLY / NO, HE'S FINE
2. If yes: HOW BAD IS IT? → MILDLY / PRETTY BAD / UNREASONABLE
3. If no: use a playful alternative, e.g. THEN WHY ARE YOU HERE? → JUST CURIOUS / I CHANGED MY MIND
4. Route both paths into the room. The NO path must remain funny and must not trap the visitor.
Do not force multiple confirmations before the fun starts. The complete flow should be quick; allow a direct “skip to room” or equivalent if testing shows that questions slow the experience down.

## 4. The Rage Room: the main playable moment


### Stage composition

The room should have a fixed visual hierarchy:
1. Top HUD: HARSH / RAGE ROOM, fighter name, mute/sound control and a restrained session indicator.
2. Main stage: cartoon Harsh, with enough negative space for incoming attacks and effects.
3. Impact layer: comic bursts, labels, particles and action effects, isolated from the character and controls.
4. Move deck: Slap, Punch, Chappal, Bonk and optional specials.
5. Feedback line: one short line of changing dialogue.
Keep key controls visible after each hit. Do not cover the action buttons with full-screen modals during the core loop.

### Move set and unique animation direction

Each move must feel distinct in animation, sound, motion and punchline. Avoid using one generic “scale up + shake” animation for every action.

| Move | Visual choreography | Sound identity | Example payoff |
| --- | --- | --- | --- |
| SLAP | A stylised hand sweeps in from the side; a tiny anticipation lean; sharp contact; character cheek squash and recoil; a graphic WHAP! bursts near the contact point. | Quick air-whoosh → crisp palm pop → short, warm thump. | THAT SLAP HAD A RECEIPT. |
| PUNCH | Glove pulls back, compresses, then snaps forward; brief impact freeze; bold starburst and controlled stage shake; character bounces back into place. | Short low whoosh → layered punch transient → compact bass thump. | CRITICAL EGO DAMAGE. |
| CHAPPAL | Slipper enters on a readable curved path, briefly spins, hits with a comic impact mark, then drops out of frame. | Fast swish → distinctive soft slap/thwack → tiny rubbery bounce. | DESI JUSTICE HAS ARRIVED. |
| BONK | Oversized prop drops from above; character compresses; three stars orbit the head; stars disappear with a small pop. | Wooden/plastic knock → springy resonant tail. | PLEASE REBOOT HARSH. |
| TOMATO | Tomato arcs in; impact becomes a clean, non-graphic splat burst; red comic shape evaporates into droplets/particles. | Gentle throw whoosh → juicy cartoon splat. | HE HAS BEEN SAUCED. |
| THUNDER PUNCH | Special move: charge-up pose, tiny electric arcs, a fast glove lunge, one high-contrast impact frame and a brief victory freeze. | Rising electric buzz → deep but controlled thump → short arcade sting. | UNNECESSARILY LEGENDARY. |
| EMOTIONAL DAMAGE | No physical impact. The background drops quiet, a brutally plain text card appears, and the avatar slowly looks at the camera. | Optional tiny notification chirp or silence. | THAT ONE WAS PERSONAL. |



The visual effects must remain cartoonish and non-graphic. No blood, wounds, realistic injury, or depiction of real harm.

### The impact recipe

Every major attack should have four readable phases:
1. Anticipation: a brief lean, pullback or wind-up so the move has weight.
2. Travel: a clear directional motion, not an instant teleport.
3. Impact: a short hit-stop (roughly 40–70 ms), a local impact burst and a controlled camera/stage response.
4. Recovery: character reaction, effect decay and a return to a playable idle state.
Use these timings as initial creative targets, then tune them by testing on real devices:
- Slap: about 450–650 ms total.
- Punch: about 550–800 ms total.
- Chappal: about 700–1,000 ms total.
- Bonk: about 600–900 ms total.
- Special move: about 900–1,400 ms total.
These are starting ranges, not hard requirements. Prioritise a readable impact over making every animation fast. The visitor should not have to wait through a long cinematic after every tap.

### Repetition must stay funny

- Alternate between several recovery poses and reaction lines.
- Vary impact burst size and timing within defined limits.
- Introduce rare surprises, not constant randomness.
- Prevent effects from accumulating forever; clean them up after each sequence.
- If multiple inputs happen during an animation, queue or coalesce them cleanly. Never leave the character stuck, the sound looping or the controls disabled indefinitely.

## 5. Sound design — Foley-led arcade audio

The production sound direction is [HARSH RAGE ROOM — Arcade audio production addendum](ARCADE_AUDIO_ADDENDUM.md). It replaces the entire sound section of the submitted update with recording recipes, variation rules, timing and bus requirements, proposed loudness and sync targets, asset workflow, source recommendations, licensing checks and release criteria. The local build now plays edited CC0 Foley previews with synth layers; final mix and real-device listening remain open work.


## 6. Telegram: identify who performed the move


### Required behaviour

The visitor enters a display name when entering the room. When they complete an attack, the backend sends Harsh a Telegram notification that uses that name and move.

### Example messages

💥 MAYA SLAPPED YOU.

Move: SLAP
Rage level: UNREASONABLE
Reason: You are irritating
Session combo: 1 hit

The Harsh Rage Room has recorded the incident.
Other examples:
- 🥊 RAHUL PUNCHED YOU.
- 🩴 ANANYA HIT YOU WITH A CHAPPAL.
- 🔨 DEV BONKED YOU.
- ⚡ ZOYA LANDED A THUNDER PUNCH.

### Notification rules

- Send one notification for each accepted attack in the first release.
- The notification must include the visitor's chosen display name, attack type and optional anger/reason selections.
- A completed combo may be represented by one summary notification rather than one message for every frame or sub-hit.
- Do not notify merely because someone opened the page or typed a name. The notification is triggered by an actual attack action.
- Do not claim an attack was delivered to Telegram until the backend confirms it. If the request fails, show a quiet retry/error state and keep the animation playable.
- Keep attack notifications concise and readable on mobile Telegram.

### Name handling and privacy

- A display name is user-provided text, not a verified identity.
- Trim whitespace, enforce a 20-character maximum, use Anonymous for an empty name, and reject control characters.
- Treat all names and reason text as untrusted input. Do not interpolate raw user input into HTML. Prefer plain-text Telegram messages without parse_mode, or correctly escape it if formatting is ever required.
- Do not collect email, phone, precise location, Telegram username or other unnecessary personal data.
- Tell visitors near the name field that their chosen name and completed move will be sent to Harsh via Telegram.
- Do not expose the Telegram bot token in frontend code, public environment variables, source maps or client network responses.

### Backend contract (implementation target)

The server accepts authenticated `POST /api/notify` events. Completed moves use the shared `attack` event contract, including action time and hit result. Rate limits cap delivery during rapid play.

```json
{
  "eventId": "unique-uuid",
  "kind": "attack",
  "name": "Maya",
  "attack": "slap",
  "hit": true,
  "anger": "extremely",
  "occurredAt": "2026-10-01T12:00:00.000Z"
}
```

The backend validates attack IDs, anger values, the timestamp shape, and roast text length. Do not trust client-supplied notification text. Construct the Telegram message on the server from validated fields and escape free text for Telegram HTML.
Suggested environment variables (server only): `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
The owner must have opened the bot and sent /start (or otherwise established the bot chat) before the bot can message that private chat. Store the owner chat ID in server configuration. The frontend should call only the project's own backend endpoint.

### Abuse and failure handling

- Apply server-side rate limiting by session and a sensible global ceiling.
- Make attack requests idempotent using eventId, so double taps/retries do not create duplicate alerts.
- Set a modest per-session cooldown; do not make the game feel laggy.
- Validate input size and allowed values. Use restrictive CORS appropriate to the deployed site.
- Handle Telegram timeouts, rate limits and non-success responses. Log technical errors without logging bot tokens or unnecessary visitor data.
- The game must continue to work even if Telegram delivery is temporarily unavailable.
- A visitor should never be able to select a chat ID, recipient or arbitrary message destination.

## 7. Make the rage funny and replayable

Prioritise surprise and payoff over a huge feature count.

### High-value ideas

1. The fake arcade announcer: short, occasional lines such as FIGHTER MAYA HAS ENTERED THE ROOM or A COMPLETELY UNNECESSARY COMBO!.
2. Ego health bar: a fictional, clearly comedic meter labelled HARSH'S EGO; it is not a real damage indicator.
3. Combo names: DOUBLE BRUH, CHAPPAL FRENZY, THE GROUP PROJECT SPECIAL and other short, context-aware names.
4. Rare critical hit: a small chance of an elaborate, one-off animation and unusually silly result text. Never make the basic game dependent on random chance.
5. Character personality: Harsh occasionally dodges, acts smug, pleads for mercy or pretends nothing happened. Keep reactions short.
6. No-path jokes: if the visitor says they are not angry, the character may celebrate prematurely or ask why they entered the rage room.
7. Shareable incident card: an optional image or text card containing the visitor's chosen name, move and funny verdict. Do not include private data.
8. Secret interaction: a low-key easter egg, such as clicking the cabinet title several times to trigger a tiny announcer surprise.
9. Replay with variation: keep the visitor's chosen name during the session and rotate through unused reactions before repeating.
10. The absurd final report: a fake arcade results screen with EGO DAMAGE, DRAMA SCORE and APOLOGY STATUS: NOT FOUND.

### Avoid

- Endless question screens before a visitor can play.
- Loud sound on every hover.
- Pop-ups that interrupt the attack.
- Fake loading bars that last longer than the joke.
- Daily streaks, accounts, leaderboards or databases unless there is a demonstrated reason.
- Notifications for mere page visits.
- Realistic injuries, gore or copy that encourages visitors to harm someone in real life.

## 8. Motion system and technical implementation


### Recommended division of responsibility

Use the smallest set of tools that can deliver the experience well:
- React: application state, screens, controls and accessible interaction.
- Motion for React (motion/react): page transitions, button gestures, small UI reactions and layout changes.
- GSAP timelines: the complex, choreographed attack sequences where precise sequencing and a shared playhead matter. Use it only if the team needs that level of timeline control.
- CSS: simple states, focus rings, static textures and lightweight transitions.
- SVG / layered 2D art: first-choice character and impact graphics for the MVP.
- Rive or Lottie: optional for artist-authored character loops or complex vector motion; do not add both without a clear need.
- Web Audio API: playback control, small generated effects or audio layering where useful.
Do not animate the same property on the same element from multiple libraries. Keep a single owner for each animation sequence. Prefer transform and opacity for performance. Avoid animating layout-heavy properties on every frame.

### Motion principles

- Anticipation before impact: the wind-up makes the hit feel earned.
- Fast contact, readable recovery: a short impact beat, then enough time to read the joke.
- Controlled stage shake: shake the stage wrapper, not the whole page; keep the HUD and controls stable where possible.
- One focal effect at a time: do not stack camera shake, full-screen flashes, multiple overlays and particles on every hit.
- Responsive motion: use shorter or simpler effects on small or lower-powered devices.
- Reduced motion: respect prefers-reduced-motion, replacing large motion and shaking with a brief colour/shape cue and clear text.
- No flashing loops: use a restrained impact accent instead of rapid full-screen flashes.

### Suggested animation states

idle
  -> anticipate
  -> move-travel
  -> impact
  -> reaction
  -> recover
  -> idle
The animation controller should prevent conflicting attacks from corrupting the sequence. Either queue a small number of inputs or coalesce them into a combo; document the chosen behaviour and test it.

## 9. Suggested project additions

Adapt these paths to the existing repository rather than duplicating folders or replacing working code. The current workspace already uses `web/src`, `api/src` and `docs`; prefer those established paths.

```text
src/
  components/
    arcade/
      ArcadeCabinet.tsx
      GameHUD.tsx
      NameEntry.tsx
      QuestionCard.tsx
      RageStage.tsx
      Character.tsx
      AttackDeck.tsx
      AttackButton.tsx
      ImpactFX.tsx
      ResultPanel.tsx
      SoundControls.tsx
  features/
    attacks/
      attackCatalog.ts
      attackTimeline.ts
      attackController.ts
    audio/
      audioController.ts
      soundCatalog.ts
    telegram/
      attackClient.ts
  styles/
    tokens.css
    arcade.css
    motion.css
public/
  audio/
  characters/
  fx/
docs/
  PRD.md
  newupdate.md
  tasks/
    00-design-system.md
    01-entry-and-name.md
    02-question-flow.md
    03-character-and-stage.md
    04-attack-animations.md
    05-audio.md
    06-telegram.md
    07-responsive-accessibility.md
    08-qa-and-deployment.md

```
### Commands to create the task placeholders

Run from the repository root. If equivalent files already exist, update them rather than overwriting them.
```sh
mkdir -p docs/tasks \
  src/components/arcade \
  src/features/attacks \
  src/features/audio \
  src/features/telegram \
  src/styles \
  public/audio public/characters public/fx

touch docs/tasks/00-design-system.md \
  docs/tasks/01-entry-and-name.md \
  docs/tasks/02-question-flow.md \
  docs/tasks/03-character-and-stage.md \
  docs/tasks/04-attack-animations.md \
  docs/tasks/05-audio.md \
  docs/tasks/06-telegram.md \
  docs/tasks/07-responsive-accessibility.md \
  docs/tasks/08-qa-and-deployment.md
```

Each task file should contain: objective, user-visible behaviour, implementation notes, dependencies, acceptance criteria, test cases and status. Keep implementation tasks small enough to review independently.

## 10. Prioritised delivery plan


### P0 — Must work in the first playable release

- A distinct arcade visual identity with one central stage.
- Name entry before entering the room.
- Working YES and NO paths that both reach the game.
- Four excellent attacks: slap, punch, chappal and bonk.
- Distinct attack animation and synchronised audio for each move.
- Mute and volume controls, with audio activated only after user interaction.
- Cartoon character reactions and a short, funny result state.
- Telegram notification containing the visitor's chosen name and completed move.
- Server-side validation, rate limiting and duplicate protection.
- Responsive layout, keyboard-operable controls and reduced-motion handling.

### P1 — Add after the core loop feels good

- Tomato attack and one special move.
- More character reaction poses and text variations.
- Combo summary and rare critical-hit animation.
- Shareable result card.
- Carefully tested sound variation and improved touch feedback.

### P2 — Only if testing shows they add value

- Additional secret interactions.
- Optional announcer voice pack.
- More character skins or themed arcade events.
- A local-only session score or personal best.
Do not build P1/P2 before the core loop is fun. A polished slap with perfect timing is more valuable than twelve weak attack buttons.

## 11. Acceptance criteria: the release is ready when…


### Experience

- A first-time visitor understands the premise without instructions.
- A visitor can enter a display name, answer the questions and perform an attack without creating an account.
- Both YES and NO paths remain playable and amusing.
- Every initial attack has a recognisably different visual and sound identity.
- The visitor can replay without refreshing the page.
- The experience remains understandable with sound muted and with reduced motion enabled.

### Name and Telegram

- The chosen display name appears in the Telegram alert after a completed attack. A room-HUD name label remains a visual target.
- Empty, overlong and malformed values are handled safely.
- A room visit alone does not send an attack notification.
- Duplicate event IDs do not create duplicate alerts.
- A Telegram outage does not break the game.
- No bot token or secret is shipped to the browser.

### Quality

- Animations cleanly recover to idle; no stuck character or permanently disabled controls.
- Rapid taps do not create unlimited sound or notification spam.
- No full-screen flashing or gratuitous continuous shake.
- The main experience works on touch and pointer devices.
- Sound assets have documented licences or are original.
- No private visitor information is exposed in public UI or unnecessary logs.

## 12. Definition of success

Do not measure success by the number of effects, libraries or lines of code. The experience succeeds when:
- A visitor understands what to do immediately.
- The first completed attack produces a satisfying visual, sound and character reaction.
- The visitor smiles or laughs at the result and wants to try another move.
- The personalised Telegram alert is a second punchline rather than a boring system message.
- The site still feels fast, intentional and fun after several replays.
The design should be intense in presentation, harmless in content, and excellent in timing. Keep it absurd, tactile and memorable.

## 13. Reference documentation and asset sources

Use these as implementation references; verify individual asset licences before shipping.
- GSAP timelines: https://gsap.com/docs/v3/GSAP/Timeline/ — useful for tightly sequenced attack choreography.
- Motion for React: https://motion.dev/docs/react — useful for React UI transitions and gesture feedback.
- MDN Web Audio API best practices: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices — audio-context and playback guidance.
- MDN autoplay guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay — browsers may block sound until a user gesture.
- Telegram Bot API sendMessage: https://core.telegram.org/bots/api#sendmessage — message delivery endpoint and parameters.
- Telegram bot introduction: https://core.telegram.org/bots — bots cannot initiate a private conversation; the user must first start the bot or otherwise establish a chat.
- MDN reduced-motion guidance: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — adapt non-essential animation to the user's preference.
- Freesound licensing FAQ: https://freesound.org/help/faq/ — sound files can have different licence requirements; check each asset.

> Final instruction to the implementation agent: Treat this update as the latest direction for the named entry flow, visual identity, arcade intensity, attack animation, sound design and Telegram message behaviour. Before coding, inspect the current repository and existing PRD.md; preserve working functionality, reconcile conflicts explicitly, and implement the smallest complete version that meets the P0 criteria.
