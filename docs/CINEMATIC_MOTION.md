# Cinematic arcade implementation

The October 2026 redesign uses warm charcoal, burnt orange, cream typography and a structural room backdrop. The original layered SVG character remains editable. No new runtime library or externally generated artwork was introduced.

## Controls and identity

Tap a weapon once to auto-aim. Tap the character to aim the equipped move; use keys 1–8 to equip and Space to attack. Roast opens the existing 280-character composer. Its exact submitted text stays selectable on stage after the reaction. Visitor names remain in session storage, with blank names treated as anonymous.

## Motion timing

`web/src/engine/choreography.ts` owns anticipation, launch, contact, follow-through and recovery on one cancellable GSAP timeline. Times below are base timings; an active chain accelerates playback by up to 12.5 percent.

| Move | Contact | Base duration | Choreography |
|---|---:|---:|---|
| Slap | 200 ms | 950 ms | Side windup, accelerated sweep, compressed cheek, overshoot |
| Punch | 320 ms | 1100 ms | Pullback, perspective drive, body recoil, withdrawal |
| Chappal | 440 ms | 1100 ms | Spinning arc, crooked glasses, upward ricochet and exit |
| Bonk | 380 ms | 1100 ms | Overhead hold, fast drop, head squash, rebound and stars |
| Tomato | 360 ms | 950 ms | Toss, stretch, squash, seed particles and persistent splat |
| Roast | 650 ms | 2400 ms | Readable quote entrance, reading pose, embarrassed slump |
| Thunder | 640 ms | 1600 ms | Short charge, accelerated strike, stronger recoil and airborne body |
| Emotional | 850 ms | 1800 ms | Comparison text, delayed realization, slower slump |

Physical impacts hold their contact pose for 45 ms, punch for 65 ms and thunder for 75 ms before follow-through. Variants cycle across three compatible poses and recovery lines. Foley uses its existing non-repeating sample bags. Combo accents, callouts and slightly faster motion add escalation; notifications now include named combo metadata when present.

Damage, reaction, Foley playback and notification enqueue share the contact callback. Leaving before contact kills the timeline and emits no attack. Leaving after contact preserves the completed hit. A generation guard prevents stale callbacks, and one recent buffered input retains its original weapon identity. Hidden tabs pause the timeline and suspend audio.

## Accessibility and audio

Calm/reduced-motion mode uses opacity feedback with no camera displacement or particle burst. Physical feedback lasts 650 ms; text reactions last 1700 ms. Gentle mode reduces camera and lighting strength. The persistent mute control, volume slider, optional music, gesture-based audio unlock and missing-asset fallback remain in place.

The five everyday physical moves use the existing 20 edited CC0 Foley clips plus generated supporting layers. Special moves use synthesized arcade effects. Source attribution and measurements remain in `docs/audio/ASSET_CREDITS.csv` and the audio addendum. Browser playback checks verify decoding and scheduled playback; they do not establish perceived mix quality on physical speakers or headphones.

## Deployment

The existing deployment boundary remains: Vercel builds the static frontend, Render runs the API. Telegram credentials stay exclusively in backend environment variables. This visual update does not create hosted deployments or change the backend contract.
