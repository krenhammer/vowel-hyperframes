
# BRIEF — vowel-announcement

## Project Info
- **Slug:** vowel-announcement
- **Intent:** Launch announcement video for Vowel voice agent platform
- **Audience:** Enterprise decision makers (CTOs, VPs of Engineering, Product Leaders)
- **Tone:** Low technical / approachable — focus on business value, not implementation details
- **Duration:** 60 seconds
- **Dimensions:** 1920×1080 (16:9)
- **FPS:** 60

## Script & Voice
- **Narration:** None — music-only visual storytelling
- **Captions:** Hype style — large, energetic, animated typography
- **Music:** `assets/Lopkerjo - Come With Me EDM.mp3` (EDM track for high energy)

## Style Profile

### Aesthetic
- **Base:** MOTION_PHILOSOPHY gold standard
  - Black canvas (#000 / #0a0a0a)
  - Chrome-gradient text with halo glow
  - Perspective grid floor + vignette + grain
  - Motion-blur whip transitions
  - Kinetic typography (words scale, morph, animate)

### Fonts
- **Logo/Brand:** OCR-A Regular (monospace, tech-heritage feel)
  - "vowel" in lowercase using OCR-A
  - Source: `public/fonts/OCR-A_Regular.otf`
- **Content:** Electrolize Regular (modern, tech-forward)
  - All other text uses Electrolize
  - Source: `public/fonts/Electrolize-Regular.ttf`

### Palette (≤5 symbolic colors)
| Color | Hex | Meaning |
|-------|-----|---------|
| Black | #000 | Canvas / silence |
| Chrome white→gray | gradient | Premium / brand voice |
| Teal/Cyan | #33d4c8 | Vowel brand / solution / voice |
| Purple/Magenta | #a155ff | Speed / AI intelligence |
| Warm orange | #ff9430 | Value / cost savings |

### Pacing
- **Kinetic:** 1–2 second scenes, fast cuts, high energy
- Scene transitions every 1.5s average
- 4–6 second outro hold

## Asset Inventory

### Fonts (to copy into project)
- [ ] `public/fonts/OCR-A_Regular.otf` → `assets/OCR-A_Regular.otf`
- [ ] `public/fonts/Electrolize-Regular.ttf` → `assets/Electrolize-Regular.ttf`

### Music
- [ ] `assets/Lopkerjo - Come With Me EDM.mp3` → `assets/music.mp3`

### Registry Blocks to Install
- `grain-overlay` — film grain on all scenes
- `shimmer-sweep` — logo glint effect
- `whip-pan` or `light-leak` — transitions between beats
- `logo-outro` — final CTA card (customized)

## Story Structure (Rule of Threes)

### Act 1 — Hook (0–12s, ~20%)
**Concept:** The problem with current voice AI
- Beat 1: "Voice AI" — kinetic type reveal
- Beat 2: "is too" → "slow" — camera dolly through text
- Beat 3: "expensive" — price tag visual
- Beat 4: "complex" — messy wires/node diagram

### Act 2 — Body / Solution (12–45s, ~55%)
**Concept:** Three pillars of Vowel enterprise value

**Pillar 1: No Replatforming (12–21s)**
- "Your apps" — legacy app visual
- "No rewrite" — strikethrough animation on "rewrite"
- "Add voice" — microphone/voice icon
- "Same code" — code block with minimal change highlight
- "Zero risk" — shield/checkmark

**Pillar 2: Speed + Sovereignty (21–33s)**
- "Cloud now" — SaaS/cloud visual (fast path)
- "or self-hosted" — server/lock visual
- "Your data" — data stays on-prem
- "Your security" — compliance badge
- "Your choice" — toggle/switch animation

**Pillar 3: Better Economics (33–45s)**
- "4× less" — price comparison bars
- "than Google" — competitor logo treatment
- "than ElevenLabs" — competitor logo treatment
- "More intelligent" — brain/neural visual
- "Better conversations" — chat waveform

### Act 3 — Payoff + Outro (45–60s, ~25%)
- "vowelbot" — GitHub Action visual / automation
- "Auto-magically" — playful kinetic reveal
- uses OpenCode (logo in assets)
- even prepares Github Codespace for instant tesing
- CTA Card (4–6s hold): "vowel.to" + tagline

## Outro / CTA
- **Text:** "https://vowel.to"
- **Tagline:** "Stop typing. Start Commanding."
- **Hold:** 5 seconds

## Technical Notes
- No face-cam (pure motion graphics)
- Custom fonts via @font-face
- High-energy EDM music track
- All storytelling through typography + abstract visuals
- Callback: "vowel" wordmark appears at brand reveal and returns at outro

## Checklist Before Build
- [ ] User approves this brief
- [ ] Copy fonts to project assets
- [ ] Copy music to project assets
