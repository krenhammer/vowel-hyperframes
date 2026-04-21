# STORYBOARD — vowel-announcement

**Total duration:** 60s · 60fps · 1920×1080
**Style profile:** see `assets/style-profile.md`
**Script / brief:** see `BRIEF.md`

## Act structure

- **Act 1 (0 → 12s):** Hook — Voice AI is broken
- **Act 2 (12 → 45s):** Body — Three enterprise pillars
  - Pillar 1: No Replatforming (12–21s)
  - Pillar 2: Speed + Sovereignty (21–33s)
  - Pillar 3: Better Economics (33–45s)
- **Act 3 (45 → 60s):** Payoff + Outro — vowelbot automation + CTA

## Timing table

| # | Start | Dur | Scene file | Concept |
|---|-------|-----|------------|---------|
| 0 | 0.0 | 60.0 | `ambient-bg.html` | Persistent grid + vignette + grain |
| 1 | 0.0 | 2.0 | `01-hook-voice-ai.html` | "Voice AI" kinetic reveal |
| 2 | 2.0 | 2.0 | `02-hook-broken.html` | "is still broken" — problem statement |
| 3 | 4.0 | 2.0 | `03-hook-expensive.html` | Price tag visual — cost pain |
| 4 | 6.0 | 2.0 | `04-hook-complex.html` | "Rewrite everything?" — complexity pain |
| 5 | 8.0 | 1.5 | `05-transition-whip.html` | Light streak to solution |
| 6 | 9.5 | 2.5 | `06-brand-reveal.html` | "Meet vowel" — brand reveal |
| 7 | 12.0 | 3.0 | `07-pillar-1-no-replatform.html` | "Your apps. No rewrite." |
| 8 | 15.0 | 3.0 | `08-pillar-1-zero-risk.html` | "Add voice. Zero risk." |
| 9 | 18.0 | 1.5 | `09-transition-whip.html` | Light streak transition |
| 10 | 19.5 | 3.5 | `10-pillar-2-speed.html` | "Cloud now" — fast path |
| 11 | 23.0 | 4.0 | `11-pillar-2-sovereignty.html` | "or self-hosted" — control |
| 12 | 27.0 | 1.5 | `12-transition-whip.html` | Light streak transition |
| 13 | 28.5 | 4.0 | `13-pillar-3-economics.html` | "4× less expensive" |
| 14 | 32.5 | 4.0 | `14-pillar-3-intelligent.html` | "More intelligent" — quality |
| 15 | 36.5 | 1.5 | `15-transition-whip.html` | Light streak transition |
| 16 | 38.0 | 3.5 | `16-payoff-vowelbot.html` | "vowelbot" — GitHub Action magic |
| 17 | 41.5 | 3.5 | `17-payoff-automation.html` | "Auto-magically" — automation |
| 18 | 45.0 | 15.0 | `18-outro-cta.html` | CTA hold: vowel.to + tagline |

---

## Beat 1 — Hook: Voice AI (0.0–2.0s, 2.0s)
**Concept:** Open with the topic — kinetic type reveal

**Visual elements:**
- "Voice" — Electrolize, 120px, chrome gradient, center
- "AI" — follows with 0.3s stagger
- Subtle scale pulse on each word
- Perspective grid receding beneath

**Motion language:** Clean kinetic reveal, establishing the space

**Eases used:**
- Entry: `power3.out` 0.5s, stagger 0.3s
- Subtle hold: `sine.inOut` breathe on scale

**Exit transition:** Light streak whip at 1.8s

---

## Beat 2 — Hook: Is Still Broken (2.0–4.0s, 2.0s)
**Concept:** Problem statement — current solutions fail

**Visual elements:**
- "is" / "still" / "broken" — sequential reveal
- "broken" scales 1× → 3× with red glitch overlay (#e10b1f at 20% opacity)
- Shaking effect on "broken"

**Motion language:** Distress, failure, problem

**Eases used:**
- Entry: `power2.out` 0.4s per word
- "broken" shake: rapid x/y jitter via keyframes
- Scale: `power2.in` for aggressive growth

**Exit transition:** Hard cut at 3.8s → whip fires

---

## Beat 3 — Hook: Expensive (4.0–6.0s, 2.0s)
**Concept:** Cost pain — burning money visual

**Visual elements:**
- Price tag icon or "$" symbols
- "Too expensive" — orange (#ff9430) accent
- Numbers counting up rapidly (cost increasing)
- Small flame/particle effects

**Motion language:** Financial waste, urgency

**Eases used:**
- Entry: `back.out(1.2)` for overshoot
- Count-up: linear rapid
- Exit: `power2.in` blur out

**Exit transition:** Whip streak at 5.8s

---

## Beat 4 — Hook: Complex (6.0–8.0s, 2.0s)
**Concept:** Complexity pain — "rewrite everything"

**Visual elements:**
- "Rewrite" with strikethrough animation
- "everything?" with question mark
- Messy wire/node diagram behind (faint)
- Shaking head "no" motion on text

**Motion language:** Rejection of status quo

**Eases used:**
- Strikethrough: `power2.inOut` width 0→100%
- Text shake: `sine` rapid oscillation
- Exit: `expo.in` fast blur out

**Exit transition:** Major whip streak at 7.8s → into brand reveal

---

## Beat 5 — Transition (8.0–9.5s, 1.5s)
**Concept:** Clean break to solution space

**Visual elements:**
- Horizontal light streak (white→transparent gradient)
- Grid floor tilts/reorients
- Teal (#33d4c8) color wash fades in

**Motion language:** Reset, solution arriving

**Eases used:**
- Streak: `power3.in` across frame
- Grid: `power2.inOut` rotation

**Exit transition:** N/A (is the transition)

---

## Beat 6 — Brand Reveal (9.5–12.0s, 2.5s)
**Concept:** "Meet vowel" — brand introduction

**Visual elements:**
- "Meet" — Electrolize, quick reveal
- "vowel" — OCR-A font, lowercase, 160px
- Teal (#33d4c8) halo glow on "vowel"
- Terminal cursor blink after "vowel"
- Subtle shimmer sweep across logo

**Motion language:** Introduction, arrival, brand

**Eases used:**
- "Meet": `power2.out` 0.4s
- "vowel": `back.out(1.4)` character stagger
- Cursor: `steps(1)` blink

**Exit transition:** Soft whip at 11.5s

**Callback:** "vowel" wordmark returns at outro

---

## Beat 7 — Pillar 1: No Replatform (12.0–15.0s, 3.0s)
**Concept:** Your existing apps — no rewrite needed

**Visual elements:**
- "Your apps" — shows generic app interface outline
- "No rewrite" — strikethrough on "rewrite"
- Code snippet visual with minimal highlight
- Legacy → modern transition effect

**Motion language:** Compatibility, ease

**Eases used:**
- App reveal: `power3.out` slide up
- Strikethrough: `power2.inOut`
- Code highlight: `sine` pulse

**Exit transition:** Whip at 14.5s

---

## Beat 8 — Pillar 1: Zero Risk (15.0–18.0s, 3.0s)
**Concept:** Safe adoption — business continuity

**Visual elements:**
- "Add voice" — microphone icon
- "Zero risk" — shield with checkmark
- Green/teal safety color
- Shield "locks into place" animation

**Motion language:** Security, confidence

**Eases used:**
- Shield: `back.out(1.5)` settle
- Checkmark: `power2.out` draw-in

**Exit transition:** Whip at 17.5s

---

## Beat 9 — Transition (18.0–19.5s, 1.5s)
**Concept:** Speed transition

**Visual elements:**
- Fast horizontal streak
- Purple (#a155ff) energy flash

**Motion language:** Velocity

**Eases used:**
- Streak: `power4.in` (aggressive)

---

## Beat 10 — Pillar 2: Cloud Now (19.5–23.0s, 3.5s)
**Concept:** Fast cloud deployment

**Visual elements:**
- "Cloud" — cloud icon, fast upward motion
- "now" — urgent, kinetic
- "Launch fast" — rocket/ship visual
- SaaS dashboard glimpse (abstract)

**Motion language:** Speed, momentum, launch

**Eases used:**
- Cloud: `power2.out` float up
- "now": `expo.out` slam in
- Rocket: `back.out(1.3)` overshoot

**Exit transition:** Overlap into sovereignty

---

## Beat 11 — Pillar 2: Self-Hosted (23.0–27.0s, 4.0s)
**Concept:** Control and sovereignty

**Visual elements:**
- "or self-hosted" — server rack visual
- Lock icon — security
- "Your data" — data stays local
- "Your compliance" — checkmark/badge flow
- Toggle switch: cloud ↔ self-hosted

**Motion language:** Control, security, choice

**Eases used:**
- Server: `power2.out` rise
- Lock: `elastic.out(1, 0.4)` secure
- Toggle: `power2.inOut` switch

**Exit transition:** Whip at 26.5s

---

## Beat 12 — Transition (27.0–28.5s, 1.5s)
**Concept:** Economics transition

**Visual elements:**
- Orange (#ff9430) price tag flash
- Bar chart rising

**Motion language:** Value, savings

---

## Beat 13 — Pillar 3: Better Economics (28.5–32.5s, 4.0s)
**Concept:** 4× cost savings vs competitors

**Visual elements:**
- "4× less" — large, orange
- Price comparison bars (Google vs ElevenLabs vs Vowel)
- Vowel bar shortest (cheapest)
- "expensive" strikethrough

**Motion language:** Value, savings, advantage

**Eases used:**
- Bars: `power2.out` grow up
- "4×": `back.out(1.4)` slam
- Strikethrough: `power2.inOut`

**Exit transition:** Overlap into intelligence

---

## Beat 14 — Pillar 3: More Intelligent (32.5–36.5s, 4.0s)
**Concept:** Better quality, not just cheaper

**Visual elements:**
- "More intelligent" — neural network visualization
- Brain/neural pathways (glowing)
- "Better conversations" — chat bubbles with waveforms
- Quality metrics "off the charts"

**Motion language:** Intelligence, quality, sophistication

**Eases used:**
- Neural: `sine` pulse along paths
- Waveform: `power2.out` draw in
- Metrics: `back.out(1.2)` pop

**Exit transition:** Whip at 36.0s

---

## Beat 15 — Transition (36.5–38.0s, 1.5s)
**Concept:** Automation magic transition

**Visual elements:**
- GitHub logo/octocat silhouette
- Magic spark effect

**Motion language:** Magic, automation

---

## Beat 16 — Payoff: vowelbot (38.0–41.5s, 3.5s)
**Concept:** The automation solution — vowelbot

**Visual elements:**
- "vowelbot" — OCR-A lowercase
- GitHub Action visual (workflow file)
- Code blocks auto-writing
- Octocat + voice wave merging

**Motion language:** Automation, development, magic

**Eases used:**
- Code: `power2.out` typewriter effect
- Merge: `power2.inOut` blend
- "vowelbot": `back.out(1.3)` reveal

**Exit transition:** Overlap into "auto-magically"

---

## Beat 17 — Payoff: Auto-magically (41.5–45.0s, 3.5s)
**Concept:** The magic — it just works

**Visual elements:**
- "Auto-magically" — playful, animated
- Sparkle/spark effects
- Magic wand cursor
- App getting voice overlay

**Motion language:** Magic, wonder, delight

**Eases used:**
- Wand: `sine` wave path
- Sparks: `power2.out` burst
- Text: `elastic.out(1, 0.3)` bouncy

**Exit transition:** Fade to CTA at 44.5s

---

## Beat 18 — Outro CTA (45.0–60.0s, 15.0s)
**Concept:** Final hold — brand + CTA

**Visual elements:**
- "vowel" — OCR-A, 200px, centered
- Teal (#33d4c8) glow, shimmer sweep
- "Stop typing. Start Commanding." — tagline below
- "vowel.to" — URL
- 6 second hold on hero shot

**Motion language:** Stillness, confidence, finality

**Eases used:**
- Logo crystallize: `power2.out` fade in
- Shimmer: continuous loop
- URL: `sine` subtle pulse

**Exit transition:** N/A (final frame)

---

## Summary of Motion Patterns

- **12 whip transitions** — consistent energy throughout
- **3 pillar sections** — enterprise value props
- **1 brand callback** — "vowel" returns at outro
- **6s outro hold** — breathing room after kinetic density

## Registry Blocks to Install

- `grain-overlay` — grain on all scenes
- `shimmer-sweep` — logo glint (outro)
- `whip-pan` — transitions
- `logo-outro` — CTA card base (customize heavily)
