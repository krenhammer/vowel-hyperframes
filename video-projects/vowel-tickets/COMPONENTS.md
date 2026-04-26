
# Hyperframes Reusable Components 

These are reusable components animated by hyperframes 
with appropriate config params


Global Animations
- Zoom in to NW, NE, SE, SW regions

## Mock "Abstract" Webapp Pages 

General Inspiration (abstract text represented by rectangles):
-video-projects/vowel-tickets/assets/abstract-webapp2.png
-video-projects/vowel-tickets/assets/abstract2.png

### Email Inbox 
All text can be abstract except email titles

Inspration
-video-projects/vowel-tickets/assets/inbox.png

Animations
- suppoirt emails fil inbox 
- red $ counter pink rounded box overlays upper left  adding rand $50 -75 per email  

### Github Repo
All text can be abstract except Repo and source titles

Inspiration 
- video-projects/vowel-tickets/assets/github.png

Animations
- Open source file in github - Title s/b readable


### VS Code IDE / Codespace
All text can be abstract

Inspiration 
video-projects/vowel-tickets/assets/codespace.png

Animations 
- Change files in file tree
- Type indented multicolored code lines 
- ability to pout mock webapp page in content area  (previewing website, scroll site, etc)
- Type in vowel api key in .env file (can be abstract)


### voweldocs

Inspiration 
video-projects/vowel-tickets/assets/vowel-docs.png

All fields can be abstract except 

Page Title
Section Titles

Animations:
- **Caption / transcript (top center; in vowel-tickets):** root `#vd-caption` in `index.html` (fixed, **~1/5 viewport width**). **Do not show while the API config modal (`#scene-api`) is visible** — the main timeline dismisses the modal **before** the voice FAB turns green and before any further FAB / caption color beats; captions start shortly after green. “Text” is **abstract horizontal bars** only (`.abs-bar`, **white** fill for contrast) — no title row, no readable strings. Call `window.vdCaptionSet({ speaker, lines }, state)`: `lines` = width keys `100` \| `92` \| `88` \| `80` \| `72` \| `60`; `speaker` = optional token for `data-vd-speaker` (logic / FAB, not rendered). Caption chrome stays **neutral gray**; `state` drives **`#vd-fab`** only. Main timeline steps caption + `#vd-fab` after the config modal is gone.
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
video-projects/vowel-tickets/assets/rag-debug-chat.png
video-projects/vowel-tickets/assets/rag-debug-docs.png

Animations
- Enter chat and  graded results return from rag 
- RAG results return when user speaks
- Open / Close Modal

### API Config Modal
This blocking modal centers on voweldocs when blue voweldocs button in clicked in navbar
default hidden

Inspiration 
video-projects/vowel-tickets/assets/api-config.png

Animations
- Save and enable button click
- Open / Close Modal


