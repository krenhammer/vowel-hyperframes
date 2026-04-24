# Turso RAG in the Browser — HyperFrames production script

Formal authoring document for a **30 fps, 1080×1920** vertical (9:16) video. This script maps narrative beats to HyperFrames structure (compositions, tracks, blocks, and assets). Beat rhythm and **layered scene architecture** follow `video-projects/vowel-webmcp/` (single root composition, `data-composition-src` scene layers, shared music bed, parent `script.js` timeline for cross-scene motion and wipes).

**Source copy:** `SCRIPT_DRAFT.md` (informal). **Implementation reference:** `vowel-webmcp/index.html` + `vowel-webmcp/script.js`.

---

## 1. Project constants

| Item | Value |
|------|--------|
| Frame rate | 30 fps |
| Canvas | 1080 × 1920 (9:16) |
| Master `data-composition-id` | `turso-rag-master` (suggested) |
| Root `data-duration` | Set from final `tl.duration()` / audio; draft content suggests **~90–120 s** (adjust after VO timing) |
| Music | One `<audio>` on a dedicated `data-track-index` (e.g. `2`); duck or `data-volume="0"` during dialogue per draft |

**Render contract reminders:** timed visible elements use `class="clip"`; every clip has `data-start`, `data-duration`, `data-track-index`; one paused GSAP timeline per composition registered on `window.__timelines["<id>"]`; sub-comps loaded via `data-composition-src` do not get manually `add()`-ed to the parent timeline.

---

## 2. Root composition layout (vowel-webmcp pattern)

Structure the master `index.html` like **vowel-webmcp**:

1. **Root** `#root` (or project id) with `data-composition-id`, `data-width`, `data-height`, `data-start="0"`, `data-duration="<total>"`.
2. **Music** — `<audio id="…">` with `data-start`, `data-duration`, `data-track-index` matching the comp length; optional `data-volume` keyframes from parent timeline for mute during demo.
3. **Scene stack** — one `<div class="scene-layer">` per scene sub-composition, each with:
   - `data-composition-id` (unique)
   - `data-composition-src="compositions/scene-XX-….html"`
   - `data-start="0"`, `data-duration` = master duration (same as webmcp: full-length layers; **visibility and hero timing** come from the shared parent timeline + per-scene internal timelines)
   - **Unique** `data-track-index` per layer (0, 1, 2, …) — no same-track overlap
4. **Optional transition primitives** — e.g. full-screen `cover-wipe` divs (see webmcp `#cover-wipe-a` / `#cover-wipe-b`) for staggered color wipes between major beats; animate `translateX` from parent `script.js`.

Z-order: use CSS `z-index` on scene wrappers for intentional stacking; `data-track-index` is not draw order.

---

## 3. Reusable visual grammar (from draft + registry)

| Pattern | Use |
|--------|-----|
| **Kinetic type / label zoom** | WebMCP-style: `gsap.fromTo` on headlines (scale + opacity), short holds, then handoff to next scene; white→dark or brand bg transitions. |
| **UI screen + focus** | Parent timeline: `scale` + `x`/`y` on a wrapper around `voweldocs.png` to “zoom” to a **region of interest**; second asset **crossfades in** (debug button, nav button) for the “zoom in and fade in this image” beats. **Do not** animate `width`/`height` on a raw `<video>`; wrap in a `div`. |
| **`ui-3d-reveal` block** | Install: `npx hyperframes add ui-3d-reveal` in this project. Use for `rag-files.png`, `config.png`, `voweldocs-talk.png`, `selfhost.png` (replace placeholder paths in the installed block; match project `assets/`). One block instance = one sub-composition or one clip segment. |
| **CTA** | Final card: URL `https://vowel.to` (draft had `https:///vowel.to` — normalize); optional `https://docs.vowel.to` for the “goto docs” line. |

---

## 4. Scene-by-scene script

Times below are **target ranges** for authoring; lock after narration/TTS and music edit.

### Scene A — Title card  
**File:** `compositions/scene-a-title.html`  
**`data-composition-id`:** e.g. `turso-rag-sc-a`  
**Track:** `0`  
**~0.0 – ~4.0 s**

| Time (approx) | Video / motion | On-screen / VO |
|---------------|----------------|-----------------|
| 0.0 | Big headline build (stagger or zoom-in words; webmcp scene-1 “ready” energy, adapted) | **RAG … in the Browser!** |
| 2.0 | Optional subline fade | *Turso · WASM · vector search* (optional) |

**Notes:** Ellipsis in draft = **pause in VO**, not on-screen text unless styled intentionally.

---

### Scene B — Turso + WASM + vector  
**File:** `compositions/scene-b-turso-wasm.html`  
**`data-composition-id`:** `turso-rag-sc-b`  
**Track:** `1`  
**~4.0 – ~14.0 s**

| Time (approx) | Video / motion | VO |
|---------------|----------------|-----|
| 4.0 | Label zoom (webmcp scene-2 style: scale pop, then stage reposition) | Turso is killing it lately—especially with RAG in the browser. |
| 7.0 | Bullet or type-on **WASM** / **SQLite** / **vector** | The secret? WASM—a Web Assembly-powered SQLite engine with native vector search. |
| 11.0 | Hold on keyword layout | (pause for read) |

---

### Scene C — Performance + “in the browser”  
**File:** `compositions/scene-c-perf.html`  
**`data-composition-id`:** `turso-rag-sc-c`  
**Track:** `3`  
**~14.0 – ~24.0 s**

| Time (approx) | Video / motion | VO |
|---------------|----------------|-----|
| 14.0 | Stat treatment: *hundreds of documents* + *sub-50 ms* | You can load hundreds of documents and return results in sub-50 ms. |
| 19.0 | Punch line: full-frame emphasis or color flip | And—this is in the browser. |

---

### Scene D — voweldocs + voice client hook  
**File:** `compositions/scene-d-voweldocs.html`  
**`data-composition-id`:** `turso-rag-sc-d`  
**Track:** `4`  
**~24.0 – ~38.0 s**

| Time (approx) | Video / motion | VO |
|---------------|----------------|-----|
| 24.0 | Logo/wordmark + **voweldocs** (chrome or brand style from `DESIGN.md` if present) | So you could say: pre-embed your entire docs package. |
| 28.0 | Transition: lines connect “Turso RAG” → “voice client” (simple diagram or two-card push) | That’s what we did with **voweldocs**—and we leveled up: we inject the graded results from our Turso browser RAG into our conversational **voice AI client**. |
| 34.0 | Outgoing line | So you can have an **erudite discussion** with our docs. |

**Assets:** `assets/voweldocs.png` for hero stills; optional UI zoom layers per beat.

---

### Scene E — “Sounds cool” + how to start (URL)  
**File:** `compositions/scene-e-cta-prime.html`  
**`data-composition-id`:** `turso-rag-sc-e`  
**Track:** `5`  
**~38.0 – ~48.0 s**

| Time (approx) | Video / motion | VO / supers |
|---------------|----------------|---------------|
| 38.0 | Reaction line (snappy) | Wow—sounds cool! |
| 40.0 | URL card: `docs.vowel.to` | How do I check it out? Go to **docs.vowel.to**. |

---

**Scenes F & G (removed):** RAG / Chat tab beats are now covered inside **Scene E** (stacked 3D captures + callouts) so F/G compositions are not in the project.

---

### Scene H — Conversational voice: API key + nav (same CTA layout as E)  
**File:** `compositions/scene-h-voice-setup.html`  
**`data-composition-id`:** `turso-rag-sc-h`  
**Track:** `6` (master timeline scene id **`#scene6`**)  
**~78.0 – ~98.0 s** (re-time after edit)

| Time (approx) | Video / motion | VO |
|---------------|----------------|-----|
| 78.0 | Section title: **Conversational voice** | (section bridge) |
| 79.0 | `voweldocs.png` + **zoom to nav**; fade in `assets/voweldocs-button.png` | Open the Vowel control in the nav. |
| 84.0 | `ui-3d-reveal` on `assets/config.png` | This opens the API key configuration—tabs for **SaaS** or **self-hosted** keys. |
| 90.0 | Back to `voweldocs.png`; zoom to **lower corner**; reveal `assets/turso-rag-button.png` (or `vowel-mic-button.png` if that’s the final art) | After a valid key, the Vowel entry appears—you’re ready to talk to voweldocs. |

---

### Scene I — Live dialogue (music mute + TTS)  
**File:** `compositions/scene-i-dialogue.html`  
**`data-composition-id`:** `turso-rag-sc-i`  
**Track:** `7` (master timeline scene id **`#scene7`**)  
**~98.0 – ~112.0 s** (re-time after edit)

| Time (approx) | Video / motion | Audio |
|---------------|----------------|--------|
| 98.0 | Simple **button depress** animation on `turso-rag-button` still | SFX click optional |
| 99.0 | `ui-3d-reveal` on `assets/voweldocs-talk.png` | **TTS A:** “Welcome to Vowel docs. How can I help?” |
| 102.0 | Same or cut to user line overlay | **TTS B:** “How do I self-host Vowel?” |
| 104.0 | `ui-3d-reveal` on `assets/selfhost.png` | **TTS A:** Answer per script (self-host, env vars, STT/TTS/LLM, `stack:up`, API key, offer more detail) |

**Music:** Mute or duck 98–110 s; **restart or fade up** for outro (draft: “music restarts”).

**Implementation:** TTS as separate `<audio>` clips with `data-start` / `data-duration` and distinct `data-track-index` (e.g. `10`, `11`), or `npx hyperframes tts` assets placed under `assets/`.

---

### Scene J — Outro CTA  
**File:** `compositions/scene-j-outro.html`  
**`data-composition-id`:** `turso-rag-sc-j`  
**Track:** `8` (master timeline scene id **`#scene8`**)  
**~112.0 – end**

| Time (approx) | Video / motion | VO / supers |
|---------------|----------------|-------------|
| 112.0 | Logo + chrome line | Get started today. |
| 114.0 | Hold 4–6 s (outro read) | **vowel.to** |

**URL fix:** `https://vowel.to` (verify brand link).

---

## 5. Audio map (tracks sketch)

| Track index | Role |
|------------|------|
| 2 | BGM (full length; volume automation for duck/mute) |
| 10+ | TTS or VO files in order |
| (optional) | SFX: click |

Keep **same-track** rule: no overlapping clips on one index.

---

## 6. Asset checklist (`assets/`)

| File | Usage |
|------|--------|
| `voweldocs.png` | Primary site shell; zoom/pan parent for several beats |
| `turso-debug-button.png` | Callout: open debug |
| `rag-files.png` | RAG file list / panel tab |
| `chat.png` | If distinct from RAG file view for “chat scores” |
| `voweldocs-button.png` | Nav control for Vowel / API path |
| `config.png` | API key configuration |
| `turso-rag-button.png` / `vowel-mic-button.png` | Post-config entry mic/control (confirm which is final) |
| `voweldocs-talk.png` | Conversational UI for welcome line |
| `selfhost.png` | Self-host answer screen |

---

## 7. Parent timeline (`script.js`) — webmcp-style responsibilities

Mirror **vowel-webmcp** `script.js` at project root:

- **Per-scene** `tl.from` / `tl.to` for hero lines, scene-to-scene opacity, background color, and **zoom** on shared wrappers.
- **Wipe divs** (if used): stagger `translateX` for scene changes (e.g. 3→4 in webmcp).
- **Music:** `tl.to` on `data-volume` or custom property if the pipeline supports it; else swap `audio` element volume via GSAP on a small proxy value—**verify** in HyperFrames player docs; simplest path is two BGM files (full vs ducked) on different clips—**only if** allowed without overlap on same track.

Sub-composition files only register `window.__timelines["<sub-id>"]` for **internal** motion; inter-scene beats stay in the **master** timeline.

---

## 8. Next implementation steps (checklist)

1. Add / confirm `index.html` + `script.js` + `compositions/scene-*.html` for scenes A–J (or merge scenes to hit target length).
2. `npx hyperframes lint` from `video-projects/vowel-turso-rag/`.
3. Run `npx hyperframes tts` for lines in Scene I; drop WAVs in `assets/` and time clips.
4. Replace any placeholder in `compositions/ui-3d-reveal.html` (if using installed block, follow registry merge paths from **hyperframes-registry** skill).
5. Lock **total** `data-duration` and BGM to match `tl.duration()` + **hold outro 4–6 s** for CTA readability.

---

*This document is the formal bridge between `SCRIPT_DRAFT.md` and the HTML/JS implementation; update timings after VO is recorded.*
