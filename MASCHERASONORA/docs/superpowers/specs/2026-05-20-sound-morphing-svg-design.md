# Sound-Responsive SVG Morphing — MASCHERASONORA

## Overview
A web-based standalone page that uses the microphone (Web Audio API) to drive real-time SVG morphing between two states: **QUIETE** (sound ~0) and **RUMORE** (sound ~100). Three facial elements—BOCCA, CAPELLI, OCCHIO—interpolate their path shapes via the **flubber** library.

## File Structure
```
MASCHERASONORA/
├── index.html              # Single file: inline SVG + CSS + JS
├── QUIETE.svg              # Source data (unmodified)
├── RUMORE.svg              # Source data (unmodified)
└── docs/superpowers/specs/
    └── 2026-05-20-sound-morphing-svg-design.md
```

## Architecture

### 1. HTML/SVG Structure
- Single `index.html` with inline SVG
- One `<svg>` element in the DOM containing all paths
- QUIETE path data is the base; `d` attributes updated each frame
- Original SVG files remain as authoritative source data

### 2. Audio Engine
1. User clicks "Avvia" button → `getUserMedia({ audio: true })`
2. AudioContext + AnalyserNode (FFT size 1024)
3. Each frame: compute RMS → normalize 0–100 (with ambient noise floor)
4. Exponential smoothing: `smoothed = smoothed × 0.7 + raw × 0.3`
5. Normalized value passed to morph controller

**Fallback:** if microphone permission denied, show a manual slider (0–100) for testing/demo.

**Edge cases:**
- AudioContext suspended on load → `resume()` on user gesture
- Silence → value 0 → QUIETE state
- Sudden loud sound → smoothed response prevents jarring jumps

### 3. Morph Engine (flubber)
flubber is loaded from CDN. For each morphable path pair:

```js
const interpolate = flubber.interpolate(quietPathData, rumorePathData);
```

Returns a function `f(t)` where `t = 0` → QUIETE, `t = 1` → RUMORE.

**Morphable path pairs:**

| Element | QUIETE path | RUMORE path | Notes |
|---------|------------|-------------|-------|
| BOCCA | `<path class="st0">` (closed smile) | `<path class="st1">` (open mouth) | Single path morph |
| CAPELLI | `<path class="st1">` | `<path class="st2">` | Single path morph |
| OCCHIO-1 | First `<path>` under `g#OCCHIO` | First `<path>` under `g#OCCHIO` | Eye socket |
| OCCHIO-2 | Last `<path>` under `g#OCCHIO` (eyebrow) | Last `<path>` under `g#OCCHIO` (eye outline) | Brow / eye contour |

**Elements NOT morphed (handled by opacity):**
- Eyelashes (lines) — only in QUIETE → visible when `t < 0.5`, fade out otherwise
- Iris circle — only in RUMORE → visible when `t > 0.5`, fade in otherwise
- Pupil circle — only in RUMORE → visible when `t > 0.5`, fade in otherwise
- Inner mouth paths (RUMORE-only) — visible when `t > 0.5`

### 4. Animation Loop
```js
function animate() {
    const rawLevel = audioEngine.getLevel();       // 0–100
    const t = smoothLevel(rawLevel) / 100;         // 0→1

    boccaPath.setAttribute('d', morphBocca(t));
    capelliPath.setAttribute('d', morphCapelli(t));
    occhio1Path.setAttribute('d', morphOcchio1(t));
    occhio2Path.setAttribute('d', morphOcchio2(t));

    // Unique element visibility
    cigliaGroup.style.opacity = 1 - t > 0.5 ? 1 : (1 - t) * 2;   // fade out
    iride.style.opacity = t > 0.5 ? 1 : t * 2;                    // fade in
    pupilla.style.opacity = t > 0.5 ? 1 : t * 2;                  // fade in

    requestAnimationFrame(animate);
}
```

### 5. Colors
Colors remain fixed throughout morphing. Both SVGs already share the same palette:
- Pink `#b8355e` (BOCCA)
- Dark blue `#312783` (CAPELLI)
- Brown `#936037` (OCCHIO, strokes)
- No color interpolation needed.

### 6. Performance
- flubber `interpolate()` is called once at init (computes the morph)
- Each frame only calls the returned function (fast) and sets attribute
- requestAnimationFrame ensures smooth 60fps
- No canvas or WebGL needed — pure SVG DOM manipulation

## Dependencies
- **flubber** (MIT) — loaded from CDN (`https://unpkg.com/flubber`)
- No other external libraries

## Browser Compatibility
Modern browsers with Web Audio API support (Chrome, Firefox, Safari, Edge).
Requires HTTPS or localhost for `getUserMedia`.
