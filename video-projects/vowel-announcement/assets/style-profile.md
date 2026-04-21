# Style Profile — vowel-announcement

## Palette

| Role | Value | Meaning |
|------|-------|---------|
| bg | #000000 | Canvas / silence |
| text-chrome | linear-gradient(180deg, #fff 0%, #999 60%, #ccc 100%) | Premium brand voice |
| accent-teal | #33d4c8 | Vowel brand / voice / solution |
| accent-purple | #a155ff | Speed / AI intelligence |
| accent-orange | #ff9430 | Value / cost savings |
| grid-lines | rgba(255,255,255,0.05) | Structural depth |

## Fonts

- **Logo/Brand:** OCR-A Regular
  - Source: `assets/OCR-A_Regular.otf`
  - Usage: "vowel" wordmark only
  - Render: lowercase "vowel"

- **Content:** Electrolize Regular
  - Source: `assets/Electrolize-Regular.ttf`
  - Usage: All other text content

## @font-face declarations

```css
@font-face {
  font-family: 'OCR-A';
  src: url('assets/OCR-A_Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Electrolize';
  src: url('assets/Electrolize-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

## Text Styles

- **Headlines:** Chrome gradient, halo glow
  ```css
  background: linear-gradient(180deg, #fff 0%, #999 60%, #ccc 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3);
  ```

- **Accent text (teal):** `#33d4c8`
- **Accent text (purple):** `#a155ff`
- **Accent text (orange):** `#ff9430`

## Source
- [x] Derived from MOTION_PHILOSOPHY with custom fonts specified by user
