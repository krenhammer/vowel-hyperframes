# HyperFrames Sizzle Reel — Script Table

**Project:** hyperframes-sizzle  
**Location:** `video-projects/hyperframes-sizzle/`  
**Duration:** 75 seconds (2,250 frames @ 30fps)  
**Total Beats:** 12 (11 sub-compositions + 2 shader transitions)  
**Style:** Dark tech/sci-fi with Montserrat + Roboto Mono fonts

---

## Script Table

| Beat | Time Code | Text Content | HyperFrames Components Used |
|------|-----------|--------------|----------------------------|
| **00** | **0:00 - 0:04** | **"HYPERFRAMES × CLAUDE CODE"**<br/>`$ npx hyperframes render --quality high`<br/>→ rendering 75s @ 1920×1080 @ 30fps<br/>→ 2,250 frames / 11 sub-compositions | **Custom Composition** (terminal typing animation, grid background, vignette) |
| **01** | **0:04 - 0:11** | **"WRITE HTML."**<br/>**"RENDER VIDEO."**<br/>**"BUILT FOR AGENTS."** | **shimmer-sweep** (inlined component — animated highlight sweep) |
| **02** | **0:11 - 0:18** | **"EDIT TIME COMPARISON"**<br/>**"Hours to ship a 90-second video"**<br/>PREMIERE PRO — 6.5 hrs<br/>FINAL CUT — 5.5 hrs<br/>AFTER EFFECTS — 7.0 hrs<br/>HYPERFRAMES — ~13 min<br/>**"0 TIMELINE EDITS · 1 PROMPT · 1 RENDER"** | **data-chart** (bar chart with animated bars, hero highlight) |
| **03** | **0:18 - 0:25** | **"Prompt. Preview. Render."** (phone mockups showing: Claude chat → HyperFrames studio → Render complete) | **app-showcase** (3 phone mockups with chat UI, timeline UI, render UI) |
| **04** | **0:25 - 0:33** | **"BEAT SYNC ENGINE"**<br/>**"AUDIO-REACTIVE BY DEFAULT"**<br/>80 BPM · LIVE<br/>BASS → SCALE<br/>TREBLE → GLOW | **Custom Composition** (radial frequency ring, 72 bars, waveform SVG, beat pulse animations) |
| **05** | **0:33 - 0:43** | `$ npx hyperframes capture https://anthropic.com`<br/>Color palette swatches (#141413, #FAF9F5, #C6613F, #D97757)<br/>Font families (Anthropic Serif, Anthropic Sans)<br/>**"INTRODUCING Claude 4.7 Opus"**<br/>**"1 URL → 60s TRAILER"** | **Custom Composition** (terminal → browser screenshot → palette extraction → font display → trailer mockup) |
| **06a** | **0:43 - 0:46.5** | *(shader transition)* | **swirl-vortex** (WebGL shader — swirling vortex distortion) |
| **06b** | **0:46.5 - 0:50** | *(shader transition)* | **chromatic-radial-split** (WebGL shader — chromatic aberration + radial split) |
| **07** | **0:50 - 0:56** | **"EVERY OVERLAY. OUT OF THE BOX."** (stacked: Instagram post, TikTok video, X post, YouTube thumbnail) | **instagram-follow**, **tiktok-follow**, **x-post**, **yt-lower-third** (4 social media blocks) |
| **08** | **0:56 - 1:03** | **"TRANSCRIBE. SYNC. SHIP."**<br/>**"Video editing used to take hours."**<br/>**"Now it takes one prompt."** (waveform + JSON transcript panel) | **Custom Composition** (waveform visualization, karaoke-style word highlighting, JSON transcript typing) |
| **09** | **1:03 - 1:09** | **"DETERMINISTIC RENDERING"**<br/>HTML → BROWSER → FFMPEG → MP4<br/>**"SAME INPUT. IDENTICAL OUTPUT. EVERY TIME."** | **flowchart** (4 sequential nodes with animated connecting arrows) |
| **10** | **1:09 - 1:15** | **"HYPERFRAMES"**<br/>AIS × HYPERFRAMES<br/>**"Made with Claude Code + Hyperframes"**<br/>hyperframes.heygen.com<br/>75.00s · 2,250 frames · 1 prompt | **logo-outro** (logo lockup with radial rays, corner stamps) |

---

## Component Summary

### Registry Blocks Used (from 50 available)

| Block | Beat(s) Used |
|-------|--------------|
| `data-chart` | Beat 02 |
| `app-showcase` | Beat 03 |
| `swirl-vortex` | Beat 06a |
| `chromatic-radial-split` | Beat 06b |
| `instagram-follow` | Beat 07 |
| `tiktok-follow` | Beat 07 |
| `x-post` | Beat 07 |
| `yt-lower-third` | Beat 07 |
| `flowchart` | Beat 09 |
| `logo-outro` | Beat 10 |

### Registry Components Used

| Component | Beat(s) Used |
|-----------|--------------|
| `shimmer-sweep` | Beat 01 (inlined) |

### Custom Compositions (Not from Registry)

- **Beat 00:** Cold open (terminal typing, grid, vignette)
- **Beat 04:** Audio-reactive (radial frequency ring, beat sync)
- **Beat 05:** Web-to-video pipeline demo
- **Beat 08:** Caption sync (waveform + karaoke + JSON)

---

## Visual Style

- **Background:** Dark (#030812 → #0f2033 radial gradients)
- **Primary Accent:** Cyan (#37bdf8)
- **Secondary Accent:** Orange (#f09025)
- **Fonts:** Montserrat (display), Roboto Mono (code/UI)
- **Grid overlays:** Subtle cyan gridlines throughout

---

## Files Analyzed

```
video-projects/hyperframes-sizzle/
├── index.html                    # Main composition (75s timeline)
├── compositions/
│   ├── v00-cold-open.html        # Beat 00
│   ├── v01-kinetic-type.html     # Beat 01
│   ├── v02-data-chart.html       # Beat 02
│   ├── v03-app-showcase.html     # Beat 03
│   ├── v04-audio-reactive.html  # Beat 04
│   ├── v05-web-to-video.html     # Beat 05
│   ├── swirl-vortex.html         # Beat 06a (shader)
│   ├── chromatic-radial-split.html # Beat 06b (shader)
│   ├── v07-social-stack.html     # Beat 07
│   ├── v08-caption-sync.html     # Beat 08
│   ├── v09-flowchart.html       # Beat 09
│   └── v10-logo-outro.html      # Beat 10
├── assets/
│   ├── music.mp3                 # Background music
│   └── ais-logo.png              # Logo asset
└── hyperframes.json             # Project config
```

---

*Generated from analysis of hyperframes-sizzle project*