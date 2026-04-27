
# Hyperframes Reusable Components 

These are reusable components animated by hyperframes 
with appropriate config params

## Portrait (9:16) vs landscape (16:9)

- **Landscape mocks** (`comp-inbox`, `comp-voweldocs`, etc.) are authored at **1920×1080**. Dropped straight into a **1080×1920** master, they must be **letterboxed** with a scale that does **not** rely on `transform: scale()` alone on the flex child — the child still lays out at **1920px wide** and will overflow a **1080px** canvas, clipping content (e.g. a word-stack hero cut off mid-word).
- **Pattern** (see `video-projects/vowel-onboarding/style.css`): wrap the composition in `.scene-scale-viewport` sized to **`--vf-mock-landscape-w`** × **`--vf-mock-landscape-w` × 1080/1920**, with the 1920×1080 comp **absolutely positioned** and **`transform-origin: 0 0; scale(calc(var(--vf-mock-landscape-w) / 1920))`**. For a vertical master, set `#root { --vf-mock-landscape-w: 1080; }`; for a horizontal master that fills the mock, use **`1920`** (scale **1**).
- **`comp-wordstack-intro`** fills its host with **`width/height: 100%`** and uses **container query units** (`cqi` / `cqh`) so typography tracks narrow **or** short frames without clipping.


Global Animations
- Quarter-screen zoom: `compositions/components/mock-quadrant-tour.js` defines **`window.hfMockQuadrant`**: `getState`, `addSegment` (tween from one named corner to the next: `full` | `nw` | `ne` | `se` | `sw`), `setState` (instant), `addTour` (one-shot loop), `fabTrackSelectors` for global FABs. Put zoom-related attributes on the **transform target** (e.g. `.vd-zoom-canvas` or `.viewport`): `data-mock-qz-scale` (e.g. `2`), `data-mock-qz-hold` (tour: pause after NW), `data-mock-qz-pan` (tour: pan leg duration). **Holding a zoom** while other GSAP anims run: use `addSegment` / return times — advance a `t` variable only when you add the *next* zoom leg; in between, schedule `tl.to(...)` at the same or overlapping times so the mock stays in `ne` (etc.) for that window.
- (Legacy) `window.hfAddMockQuadrantTour` = `hfMockQuadrant.addTour` — same one-shot path as before.

## Mock "Abstract" Webapp Pages 

General Inspiration (abstract text represented by rectangles):
-video-projects/vowel-components/assets/abstract-webapp2.png
-video-projects/vowel-components/assets/abstract2.png

### Email Inbox 
All text can be abstract except email titles

Inspration
-video-projects/vowel-components/assets/inbox.png

Animations
- suppoirt emails fil inbox 
- large red $ counter in pink rounded box overlays upper middle left of scrrenadding rand $50-75 support cost per email  
- reverse animation (clear emails back out .. and reduce $ counter to zero)

### Github Repo
All text can be abstract except Repo and source titles

Inspiration 
- video-projects/vowel-components/assets/github.png

Animations
- Open source file in github - Title s/b readable


### VS Code IDE / Codespace
All text can be abstract

Inspiration 
video-projects/vowel-components/assets/codespace.png

Animations 
- Change files in file tree
- Type indented multicolored code lines 
- ability to pout mock webapp page in content area  (previewing website, scroll site, etc)
- Type in vowel api key in .env file (can be abstract)


### voweldocs

Inspiration 
video-projects/vowel-components/assets/vowel-docs.png

All fields can be abstract except 

Page Title
Section Titles

Animations:
- **Caption / transcript (inside voweldocs mock):** `#vd-caption` in `compositions/comp-voweldocs.html` — first child of `.main`, **centered under the global topbar**, ~**1/5 mock width** (`min(384px, calc(100% - 96px))`). **Do not show while the API config modal (`#scene-api`) is visible** — the main timeline dismisses the modal **before** the voice FAB turns green and before any further FAB / caption color beats; captions start shortly after green. “Text” is **abstract horizontal bars** only (`.abs-bar`, **white** fill for contrast) — no title row, no readable strings. Call `window.vdCaptionSet({ speaker, lines }, state)`: `lines` = width keys `100` \| `92` \| `88` \| `80` \| `72` \| `60`; `speaker` = optional token for `data-vd-speaker` (logic / FAB, not rendered). Caption chrome stays **neutral gray**; `state` drives **`#vd-fab`** only. Main timeline in `index.html` steps caption + `#vd-fab` after the config modal is gone.
- Blue voweldocs button in nav bar with click animation
- Need be able to change Main Section (readable text)
- Need to be able to mock scroll to appropriate Sub Section (readable text)
- Global FAB voice button square in lower right changes colors 
    - Gray - AI Voice Inactive
    - Green - Voice Session Active
    - Blue - User Talking
    - Yellow - AI Thinking
    - Purple - AI Talking

#### RAG Debug Modal
This non bolocking modal that displays over blue FAB button on left lower side of voweldocs 
default hidden

Modal title in mock matches inspiration screenshots: **Turso Browser RAG** (see assets below).

RAG debug FAB: circular, lower-left, inset from bottom edge (not flush).

All text can be abstract

Inspiration 
video-projects/vowel-components/assets/rag-debug-chat.png
video-projects/vowel-components/assets/rag-debug-docs.png

Animations
- Enter chat and  graded results return from rag 
- RAG results return when user speaks
- Open / Close Modal

### API Config Modal
This blocking modal centers on voweldocs when blue voweldocs button in clicked in navbar
default hidden

Inspiration 
video-projects/vowel-components/assets/api-config.png

Animations
- Save and enable button click
- Open / Close Modal


