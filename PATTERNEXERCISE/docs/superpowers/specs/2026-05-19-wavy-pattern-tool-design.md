# Wavy Pattern Design Tool — Design Spec

**Date:** 2026-05-19

## Overview

A single HTML page web tool for interactively designing vector patterns composed of a grid of horizontal and vertical sine wavy lines. Users tweak parameters via sliders and color pickers and see the pattern update in real time. Supports SVG and PNG export.

## Tech Stack

- Single HTML page (no build tools)
- Vanilla JS + CSS
- SVG for rendering
- Canvas (offscreen) for PNG export

## Page Layout

Full-viewport split:
- **Left**: SVG element displaying the pattern, responsive, fills available space
- **Right**: Sidebar with control parameters, scrollable if needed

On narrow screens, controls stack below the canvas.

## Parameters

All parameters are independent for vertical and horizontal lines:

| Parameter | Vertical Lines | Horizontal Lines |
|---|---|---|
| Spacing (px) | Slider + numeric label | Slider + numeric label |
| Amplitude (px) | Slider + numeric label | Slider + numeric label |
| Frequency (periods) | Slider + numeric label | Slider + numeric label |
| Thickness (px) | Slider + numeric label | Slider + numeric label |
| Color | Color picker | Color picker |

Background is white. All updates are instant (no apply button).

## Sine Wave Path Generation

Each wavy line is an SVG `<path>` element. Sine waves are approximated with cubic beziers: 4 bezier segments per period (standard sine approximation). Paths extend across the full dimension of the SVG viewport.

- Vertical lines run top-to-bottom, waving left-to-right
- Horizontal lines run left-to-right, waving up-and-down
- Same-direction lines are evenly spaced and never intersect each other

## Internal Architecture (Single File)

1. **State**: plain object with 10 parameters
2. **Path generator**: `generateSineWavePath(...)` → returns SVG `d` attribute string
3. **Renderer**: clears SVG, generates all `<path>` elements from current state, appends them
4. **Controls**: sliders and color pickers wired to update state and re-render
5. **Export**:
   - SVG: serialize SVG element to `.svg` file download
   - PNG: draw SVG onto offscreen `<canvas>`, export via `toBlob()`

## Export

- "Export SVG" button: downloads current pattern as a `.svg` file
- "Export PNG" button: downloads current pattern as a `.png` file

Both buttons are located in the control panel.
