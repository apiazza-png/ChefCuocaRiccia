# Uova Strapazzate Recipe Page — Design Spec

**Date:** 2026-05-18
**Status:** Approved

## Overview

A single retro/Italian-style recipe page for "Uova Strapazzate" (scrambled eggs) by chef Cuoca Riccia. The page is a local HTML file meant to be shared on social media. It uses two files: `index.html` and `style.css` inside the `codebase/` directory.

## File Structure

```
codebase/
├── index.html      — recipe page markup
└── style.css       — all styling
```

## Visual Style

- **Colors:** Warm cream/ivory background (#faf3e0), terracotta/rust accents (#c45a3c), deep olive green (#5a7a4a), dark brown text (#3a2a1a)
- **Typography:** Serif font (Playfair Display or Georgia) for headings, sans-serif (Lato or system font) for body
- **Vintage accents:** Decorative borders/dividers reminiscent of old Italian cookbooks, subtle vintage paper feel via CSS

## Content Layout

1. **Header** — Chef name "Cuoca Riccia" in small italics, followed by the title "Uova Strapazzate"
2. **Tagline** — A short intro line (e.g., "La ricetta della nonna")
3. **Ingredients** — Bullet list with a rustic divider above
4. **Preparation** — Numbered steps, clear and readable
5. **Footer** — "Buon appetito!" with a decorative element

The page uses a centered card-like container with generous whitespace.

## Tech Stack

- HTML5
- CSS3 (external file)
- Google Fonts (optional, loaded via CSS `@import`)

## Constraints

- Local file only (no server, no hosting)
- Must be shareable as a pair of files
- Only one recipe displayed
