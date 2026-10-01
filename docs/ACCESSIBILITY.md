<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

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


