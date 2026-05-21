# Portfolio Landing Page — Design Spec

## Overview

A portfolio landing page at `SITO/index.html` that presents 5 workshop projects in an orbital ring carousel. Each project page gets a shared header. All pages follow the project's existing style guide.

## File Architecture

```
SITO/
├── index.html                  ← Landing page (orbital ring)
├── css/
│   └── style.css               ← Shared styles (typography, header, carousel)
├── js/
│   ├── landing.js              ← Orbital ring + interactions
│   └── header.js               ← Shared header injection
├── RICETTA UOVA STRAPAZZATE 1/
│   └── index.html              ← Original + injected shared header
├── PATTERNEXERCISE 1/
│   └── index.html              ← Original + injected shared header
├── TIPOGRAFIACINETICA 1/
│   └── index.html              ← Original + injected shared header
├── MASCHERASONORA 1/
│   └── index.html              ← Original + injected shared header
└── MANIONETTE 1/
    └── index.html              ← Original + injected shared header
```

## Shared Header (injected by `header.js`)

- Fixed, `z-index: 100`, glass-morphism background (`rgba(10,10,58,0.6)` + `backdrop-filter: blur(12px)`)
- **Left:** "AURORA PIAZZA" — `Plus Jakarta Sans`, H3 style (1.25rem, 500 weight), `#FEFDF8`
- **Right (landing):** "Projects" dropdown menu listing the 5 display names
- **Right (project pages):** "Home" link (no Projects dropdown)
- Dropdown: clean vertical list, glass background, subtle hover states per style guide (hover: `#0A4DDB`)

## Project Mapping

| Display Name            | Folder                   |
|-------------------------|--------------------------|
| Uova Strapazzate        | RICETTA UOVA STRAPAZZATE 1 |
| Generazione di Pattern  | PATTERNEXERCISE 1        |
| Tipografia Cinetica     | TIPOGRAFIACINETICA 1     |
| Maschera Sonora         | MASCHERASONORA 1         |
| Manionette              | MANIONETTE 1             |

## Orbital Ring Layout

- **7 positions on an elliptical orbit** — 5 project cards + 2 empty slots for visual balance
- Orbit centered in viewport, covers ~70% of viewport width, ~50% of viewport height
- Cards: 240×180px, glass-morphism styling per style guide (`background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.08)`)
- Each card shows the project display name (H3) and a thematic emoji/icon
- On hover: card scales to 1.2×, translates toward center, loads live iframe preview inside the card
- **Auto-rotation:** ~60s per full revolution, eased with `cubic-bezier(0.25, 0.1, 0.25, 1)`
- **On hover:** rotation pauses, hovered card zooms forward, highest z-index
- **On mouse leave:** orbit resumes with gentle ease-out, iframe fades out, card returns
- Faint orbital track line (`rgba(254,253,248,0.08)`, dashed, with slowly scrolling dash pattern)

## Interactions

- **Fluid transitions:** All transforms use CSS `transition` with `cubic-bezier(0.25, 0.1, 0.25, 1)`
- **Floating/bobbing:** Each card has individual Y-axis drift via CSS `@keyframes bob` (±6px, 4s period, randomized delay)
- **Magnetic cursor:** Soft 30px halo following mouse (`mix-blend-mode: screen`), expands near cards; nearest card nudges 2-3px toward cursor
- **Subtle parallax:** Entire ring shifts ~1% of mouse position from center on `mousemove`
- **Animated connections:** Dashed SVG ellipse track, scrolls slowly; on hover, dashes briefly solidify toward hovered card
- **Page transitions:** Card click navigates to project page; "Home" link fades back to landing

## Color Scheme

| Role              | Value        |
|-------------------|-------------|
| Page background   | `#0A0A3A`   |
| Text              | `#FEFDF8`   |
| Primary           | `#05308C`   |
| Accent            | `#AD1F23`   |
| Card bg           | `rgba(255,255,255,0.03)` |
| Card border       | `rgba(255,255,255,0.08)` |
| Hover border      | `rgba(255,255,255,0.16)` |
| Cursor halo       | `rgba(254,253,248,0.04)` |

## Typography

- Titles: `Plus Jakarta Sans`, 500 weight
- Body: `IBM Plex Sans`, 400 weight
- Fonts loaded via Google Fonts API

## Project Page Adaptation

Each project's `index.html` will:
1. Include a `<script src="../js/header.js"></script>` before closing `</body>`
2. Link `../css/style.css` in `<head>`
3. `header.js` injects the shared header with "AURORA PIAZZA" (left) and "Home" link (right)

No changes to existing project functionality or styling.
