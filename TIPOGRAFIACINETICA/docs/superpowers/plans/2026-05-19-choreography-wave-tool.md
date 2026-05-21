# Choreography Wave Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-file HTML page that renders "choreography" with real-time per-column wave distortion controlled by 5 sliders.

**Architecture:** Single `index.html` with inline CSS and JS. Canvas 2D per-column pixel displacement reads from an offscreen canvas (static text snapshot) each frame. No frameworks, no build step.

**Tech Stack:** HTML5 Canvas, Google Fonts (Nunito), vanilla JS

---

### Task 1: HTML skeleton + CSS layout

**Files:**
- Create: `C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\TIPOGRAFIACINETICA\index.html`

- [ ] **Step 1: Write the HTML skeleton and CSS**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>choreography</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%; height: 100%;
      background: #fff;
      overflow: hidden;
      font-family: 'Nunito', sans-serif;
    }
    canvas {
      display: block;
      position: absolute;
      top: 0; left: 0;
    }
    .controls {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(8px);
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
    }
    .control-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .control-row label {
      width: 100px;
      font-size: 13px;
      color: #333;
      font-weight: 700;
    }
    .control-row .value {
      width: 40px;
      font-size: 13px;
      color: #666;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .control-row input[type="range"] {
      flex: 1;
      accent-color: #0000CD;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <div class="controls" id="controls"></div>
  <script>
    // JS will be added in subsequent tasks
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify the page loads**

Run: Open `index.html` in a browser. Expected: blank white page with empty slider bar at bottom.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML skeleton and CSS layout"
```

---

### Task 2: Font loading + text rendering to offscreen canvas

**Files:**
- Modify: `C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\TIPOGRAFIACINETICA\index.html`

- [ ] **Step 1: Add canvas sizing and text rendering JS**

Replace the `<script>` block with:

```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const text = 'choreography';
const textColor = '#0000CD';
let W, H;
let offscreen, offCtx;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  setupOffscreen();
  draw();
}

function setupOffscreen() {
  offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  offCtx = offscreen.getContext('2d');
  offCtx.clearRect(0, 0, W, H);
  offCtx.fillStyle = textColor;
  const fontSize = Math.min(W * 0.12, 120);
  offCtx.font = `800 ${fontSize}px 'Nunito', sans-serif`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillText(text, W / 2, H / 2);
}

function draw() {
  ctx.drawImage(offscreen, 0, 0);
}

document.fonts.ready.then(() => {
  resize();
  window.addEventListener('resize', resize);
});
```

- [ ] **Step 2: Verify text renders**

Open `index.html`. Expected: "choreography" in medium blue #0000CD, centered, using Nunito font. Slider bar at bottom.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: render choreography text to offscreen canvas"
```

---

### Task 3: Per-column wave displacement loop

**Files:**
- Modify: `C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\TIPOGRAFIACINETICA\index.html`

- [ ] **Step 1: Add wave parameters and displacement animation loop**

Replace the `<script>` block entirely:

```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const text = 'choreography';
const textColor = '#0000CD';
let W, H;
let offscreen, offCtx, imageData;
let time = 0;

const params = {
  amplitude: 20,
  frequency: 0.02,
  speed: 2,
  phase: 0,
  noise: 5,
};

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  setupOffscreen();
}

function setupOffscreen() {
  offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  offCtx = offscreen.getContext('2d');
  offCtx.clearRect(0, 0, W, H);
  offCtx.fillStyle = textColor;
  const fontSize = Math.min(W * 0.12, 120);
  offCtx.font = `800 ${fontSize}px 'Nunito', sans-serif`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillText(text, W / 2, H / 2);
  imageData = offCtx.getImageData(0, 0, W, H);
}

function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function animate() {
  const src = imageData.data;
  const dst = ctx.createImageData(W, H);
  const d = dst.data;

  time += 0.016;

  for (let x = 0; x < W; x++) {
    const wave = params.amplitude * Math.sin(
      params.frequency * x + params.speed * time + params.phase
    ) + params.noise * gaussianRandom();

    const offsetY = Math.round(wave);
    const offsetX = Math.round(wave * 0.5);

    for (let y = 0; y < H; y++) {
      const srcY = y + offsetY;
      const srcX = x + offsetX;

      if (srcX < 0 || srcX >= W || srcY < 0 || srcY >= H) continue;

      const si = (srcY * W + srcX) * 4;
      const di = (y * W + x) * 4;
      d[di] = src[si];
      d[di + 1] = src[si + 1];
      d[di + 2] = src[si + 2];
      d[di + 3] = src[si + 3];
    }
  }

  ctx.putImageData(dst, 0, 0);
  requestAnimationFrame(animate);
}

document.fonts.ready.then(() => {
  resize();
  window.addEventListener('resize', resize);
  animate();
});
```

- [ ] **Step 2: Verify wave animation**

Open `index.html`. Expected: "choreography" distorts with a continuous wave moving across it (no sliders yet, uses defaults — amplitude 20, freq 0.02, speed 2, phase 0, noise 5).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add per-column wave displacement animation"
```

---

### Task 4: Slider controls bound to wave parameters

**Files:**
- Modify: `C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\TIPOGRAFIACINETICA\index.html`

- [ ] **Step 1: Add slider generation and binding code**

Add this after `const params = { ... }`:

```js
const sliderConfigs = [
  { key: 'amplitude', label: 'Amplitude', min: 0, max: 100, step: 1 },
  { key: 'frequency', label: 'Frequency', min: 0.001, max: 0.1, step: 0.001 },
  { key: 'speed',     label: 'Speed',     min: 0,    max: 10,   step: 0.1 },
  { key: 'phase',     label: 'Phase',     min: 0,    max: 6.28, step: 0.01 },
  { key: 'noise',     label: 'Noise',     min: 0,    max: 100,  step: 1 },
];
```

Add this function after `gaussianRandom()`:

```js
function buildSliders() {
  const container = document.getElementById('controls');
  container.innerHTML = '';
  for (const cfg of sliderConfigs) {
    const row = document.createElement('div');
    row.className = 'control-row';

    const label = document.createElement('label');
    label.textContent = cfg.label;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'value';
    valueSpan.textContent = params[cfg.key];

    const input = document.createElement('input');
    input.type = 'range';
    input.min = cfg.min;
    input.max = cfg.max;
    input.step = cfg.step;
    input.value = params[cfg.key];

    input.addEventListener('input', () => {
      params[cfg.key] = parseFloat(input.value);
      valueSpan.textContent = params[cfg.key];
    });

    row.appendChild(label);
    row.appendChild(valueSpan);
    row.appendChild(input);
    container.appendChild(row);
  }
}
```

Add `buildSliders();` inside the `document.fonts.ready` callback, before `animate()`.

- [ ] **Step 2: Verify sliders work**

Open `index.html`. Expected: 5 sliders at the bottom (Amplitude, Frequency, Speed, Phase, Noise). Moving each slider changes the wave distortion in real time.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add 5 sliders bound to wave parameters"
```

---

### Task 5: Polish — resize handling and edge cases

**Files:**
- Modify: `C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\TIPOGRAFIACINETICA\index.html`

- [ ] **Step 1: Add debounced resize and re-render on resize**

Replace the `resize` function and `window.addEventListener('resize', resize)` with:

```js
let resizeTimeout;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  setupOffscreen();
  imageData = offCtx.getImageData(0, 0, W, H);
}

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resize, 150);
});
```

Also add after `buildSliders()`:

```js
// Prevent slider input from selecting text
document.querySelectorAll('input[type="range"]').forEach(el => {
  el.addEventListener('mousedown', (e) => e.preventDefault());
});
```

- [ ] **Step 2: Verify resize behavior**

Open `index.html` and resize the window. Expected: text re-centers, slider bar stays at bottom, wave animation continues smoothly.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add debounced resize handler and polish"
```
