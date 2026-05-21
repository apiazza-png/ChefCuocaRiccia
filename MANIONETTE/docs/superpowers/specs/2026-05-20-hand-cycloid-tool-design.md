# Hand-Driven Cycloid Tool — Design Spec

## Overview

A single HTML file that uses MediaPipe hand tracking via TensorFlow.js to track up to 2 hands and generates a colored cycloid curve from each finger base along the finger direction. Global sliders control all curves. Loop size is normalized to finger length for visual consistency. White dynamic energy arcs connect nearby fingertips with particle bursts.

## Hand Tracking

- Uses `@tensorflow-models/hand-pose-detection` with the MediaPipe runtime
- Loaded via CDN script tags, no build step
- Webcam runs invisibly — no `<video>` element shown to the user
- Up to 2 hands tracked simultaneously (`maxHands: 2`)
- Each frame produces 21 landmarks with pixel (x,y) coordinates per hand
- Solution path set to CDN for correct asset loading
- Front camera x-coordinates flipped to un-mirror the view (left hand on left)

## Finger Configuration

One cycloid per finger using these MediaPipe landmarks:

| Finger | Base (origin) | Tip (length) | Dir (angle) | Color |
|--------|--------------|--------------|-------------|-------|
| Thumb | CMC(1) | Tip(4) | MCP(2) | Yellow #f9c74f |
| Index | MCP(5) | Tip(8) | PIP(6) | Red #f94144 |
| Middle | MCP(9) | Tip(12) | PIP(10) | Green #43aa8b |
| Ring | MCP(13) | Tip(16) | PIP(14) | Blue #577590 |
| Pinky | MCP(17) | Tip(20) | PIP(18) | Purple #9b5de5 |

- **Base**: origin point of the cycloid
- **Tip**: used to compute finger length for size normalization
- **Dir**: next joint after base, defines cycloid direction angle

## Cycloid Generation

For each finger:
- Finger length = distance from base to tip
- Rolling circle radius r = fingerLength × LoopSize
- Total angular range t = Loops × 2π
- Standard cycloid: x = r×t - d×sin(t), y = r - d×cos(t)
- d (tracing distance) = r × (TracingDistance / 100)
- Cycloid rotated to align with finger direction and translated to finger base

## Global Controls

| Control | Range | Default | Description |
|---------|-------|---------|-------------|
| Loop Size | 0.05 – 2.0 | 0.50 | Multiplier of finger length for rolling circle radius |
| Loops | 1 – 10 | 3 | Number of arches per finger |
| Tracing Distance | 0 – 200 | 100 | Distance of tracing point from circle center (%) |

## Normalization

- Loop size is relative to finger length, so shorter fingers (pinky) get proportionally smaller cycloids than longer fingers (middle)
- All curves scale automatically with hand distance from camera
- The cycloid's rolling circle radius = fingerLength × LoopSize ensures visual consistency across hand positions

## Fingertip Energy Effect

When any two fingertips come close together, a dynamic white energy arc appears between them with glowing particle bursts.

**Fingertip landmarks monitored:** Tip(4), Tip(8), Tip(12), Tip(16), Tip(20)

**Arc rendering:**
- All 10 fingertip pairs per hand evaluated each frame
- Quadratic bezier curve between two fingertip positions
- White color with `shadowBlur` glow
- Control point at midpoint with time-varying sine/cosine offset (different frequency per pair for organic feel)
- Line width and glow intensity scale with proximity

**Intensity formula:**
- Proximity = 1 − (distance / threshold), clamped [0, 1]
- Per-fingertip speed tracked via previous frame position delta
- Speed factor = average speed of the two fingertips / 15, clamped [0, 1]
- Final intensity = min(proximity + speedFactor × 0.4, 1)

**Particle system:**
- Small white glowing dots spawn at midpoint between close fingertips
- Burst outward with random velocity (0.5–2.5 px/frame)
- Fade and shrink over ~20–30 frames
- Spawn rate proportional to intensity
- Capped at 500 particles total

**Drawing order:** cycloids → arcs → particles (brightest on top)

## Layout

- **Canvas:** Full-width dark canvas taking most of the viewport
- **Controls:** Single row at the bottom with 3 labeled sliders
- **Status:** "Show your hand to the camera" when no hands detected
- No video, no hand skeleton overlay — only cycloid curves and energy arcs

## Edge Cases

- **No hands detected:** Display centered message on the canvas
- **Partial detection** (one hand only): Render curves for whichever hand is detected
- **Low FPS:** Render last detected hand state on every animation frame; slider changes trigger immediate re-render

## Technical

- Single `.html` file
- CDN dependencies:
  - `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core`
  - `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl`
  - `https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection`
  - `https://cdn.jsdelivr.net/npm/@mediapipe/hands`
- Canvas 2D API for rendering
- `requestAnimationFrame` render loop decoupled from detection frame rate
- Previous-frame fingertip positions stored keyed by handedness for speed tracking
