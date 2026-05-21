# Cycloid Drawing Tool — Design Spec

## Overview

A single HTML file that draws a cycloid (looping curve) on a canvas and lets users control it with two simple sliders: **Loop Size** and **Number of Loops**. Users can also drag a point along the curve to explore its path.

## Controls

| Control | Description | Range |
|---------|-------------|-------|
| Loop Size | Controls how big each arch is (height and width together) | 1 (tiny) – 100 (huge) |
| Number of Loops | How many arches appear in the curve | 1–12 |

Only these two controls. No math terminology. The curve auto-centers and auto-scales to fit the canvas.

## Interaction

- **Full curve displayed** statically on a `<canvas>` element
- **Draggable point** — click and drag along the curve to follow its path
- **Position readout** — shows a simple percentage (e.g., "60% along the curve") as you drag
- **Sliders update the curve in real time** — the curve and draggable point redraw immediately when a slider changes

## Rendering

- Single `<canvas>` element, fills most of the viewport
- Curve drawn as connected line segments (auto-calculated resolution)
- Draggable point rendered as a filled circle, color-contrasted against the curve
- Auto-scaling: the curve always fits within the canvas boundaries regardless of parameter values

## Layout

- Canvas takes the majority of the screen
- A horizontal control bar at the bottom or side contains:
  - "Loop Size" slider with current value
  - "Number of Loops" slider with current value
  - Position readout

## Technical

- Single `.html` file, zero dependencies
- All logic in one `<script>` block (minimal procedural style per user choice)
- Uses HTML `<input type="range">` for sliders
- Mouse events (mousedown, mousemove, mouseup) for drag interaction
- Curve computed internally as a classic cycloid; loop size maps to the radius of the virtual rolling circle, number of loops maps to how many full rotations it completes
- `.gitignore` not needed — single file
