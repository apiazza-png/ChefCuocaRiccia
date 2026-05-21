# Choreography — Kinetic Typography Wave Tool

## Overview

A single-page web tool that renders the word "choreography" (lowercase) with a real-time wave distortion effect. A set of sliders controls the wave parameters, letting the user explore kinetic typography by adjusting the distortion interactively.

## Constraints

- Single `index.html` file — no build step, no external dependencies (Google Fonts via CSS `@import` is acceptable)
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)
- Word "choreography" always lowercase
- No additional pages or navigation

## Visual Layout

| Property | Value |
|---|---|
| Background | White (#fff) |
| Text color | Medium blue (#0000CD) |
| Font | Nunito (Google Fonts), weight 600–800 |
| Text | Full word "choreography", centered horizontally and vertically |
| Canvas | Full viewport width, height such that text is well-centered with room for bottom controls |
| Sliders | Overlaid at the bottom in a semi-transparent bar |

## Rendering Pipeline

1. **Initialization** — Load Nunito font. Create an offscreen canvas, render "choreography" with `ctx.fillText()`. This static snapshot is the source texture.
2. **Animation loop** (`requestAnimationFrame`) — For each animation frame:
   - Iterate every vertical column of pixels of the source texture
   - Compute displacement for each column:
     - `wave = amplitude * sin(freq * x + speed * t + phase) + noise * gaussianRandom()`
     - `offsetY = wave`
     - `offsetX = wave * 0.5`
   - Draw each displaced column from source to visible canvas
3. **Resize handling** — Re-render source texture and visible canvas when the viewport changes

## Slider Parameters

| Slider | Range | Default | Description |
|---|---|---|---|
| Amplitude | 0 – 100 px | 20 | Intensity of the wave distortion |
| Frequency | 0.001 – 0.1 | 0.02 | How many wave peaks across the text |
| Speed | 0 – 10 | 2 | How fast the wave travels |
| Phase | 0 – 2π | 0 | Offset that shifts the wave pattern |
| Noise | 0 – 100 px | 5 | Random jitter added to each column |

Each slider displays its label and current value on the left, with a range input on the right.

## Implementation

Single file: `index.html` containing:

- **HTML** — Canvas element + slider bar structure
- **CSS** — Page layout, canvas sizing, slider bar styling
- **JS** — Font loading, offscreen canvas setup, per-column displacement loop, slider event bindings

## Self-Review Notes

- No placeholders or TODOs
- Scope is a single screen with one word and five sliders — appropriately focused
- No ambiguity: wave direction (vertical + horizontal displacement), text rendering pipeline, slider behavior are all specified
