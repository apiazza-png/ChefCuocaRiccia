# Wavy Pattern Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single HTML page interactive tool for designing vector patterns with wavy sine line grids.

**Approach:** Pure SVG rendering with controls in a sidebar. PNG export via offscreen canvas. Single-file architecture.

**Tech Stack:** Vanilla HTML, CSS, JS. No build tools, no frameworks.

---

### Task 1: HTML Structure and CSS Layout

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML skeleton and CSS layout**

Write the initial `index.html` with:
- A full-viewport flex layout: SVG canvas on the left, control sidebar on the right
- A responsive `<svg>` element with `viewBox` attribute
- An empty `<div id="controls">` for the sidebar
- Two export buttons at the bottom of the sidebar
- Base CSS: reset, flex layout, sidebar styling, slider styling

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wavy Pattern Tool</title>
<style>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
  font-family: system-ui, -apple-system, sans-serif;
  background: #fff;
}
body {
  display: flex;
}
#canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  overflow: hidden;
}
#canvas-area svg {
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
}
#sidebar {
  width: 320px;
  min-width: 320px;
  height: 100vh;
  overflow-y: auto;
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
#sidebar h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}
#sidebar h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}
.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.control-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.control-row label {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
}
.control-row input[type="range"] {
  width: 100%;
  cursor: pointer;
}
.control-row input[type="color"] {
  width: 100%;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}
.columns {
  display: flex;
  gap: 16px;
}
.columns > div {
  flex: 1;
}
.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn-group button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}
.btn-svg {
  background: #4a90d9;
  color: #fff;
}
.btn-svg:hover {
  background: #357abd;
}
.btn-png {
  background: #34a853;
  color: #fff;
}
.btn-png:hover {
  background: #2d8f47;
}
.value-label {
  font-variant-numeric: tabular-nums;
}
</style>
</head>
<body>
<div id="canvas-area">
  <svg id="pattern-svg" xmlns="http://www.w3.org/2000/svg">
  </svg>
</div>
<div id="sidebar">
  <div>
    <h2>Wavy Pattern Controls</h2>
  </div>
  <div class="columns">
    <div>
      <h3>Vertical</h3>
      <div class="control-group" id="vert-controls"></div>
    </div>
    <div>
      <h3>Horizontal</h3>
      <div class="control-group" id="horiz-controls"></div>
    </div>
  </div>
  <div class="btn-group">
    <button class="btn-svg" id="export-svg">Export SVG</button>
    <button class="btn-png" id="export-png">Export PNG</button>
  </div>
</div>
<script>
// All JS goes here in subsequent tasks
</script>
</body>
</html>
```

- [ ] **Step 2: Verify page renders**

Open `index.html` in a browser. Confirm: empty white canvas on left, sidebar on right with placeholder buttons and column headers.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML scaffold and CSS layout"
```

---

### Task 2: State, Controls, and Control Bindings

**Files:**
- Modify: `index.html` (add JS in the script tag)

- [ ] **Step 1: Add state object and control creation logic**

Inside the `<script>` tag, add:

```js
const DEFAULT_VALS = {
  vert: {
    spacing: 60,
    amplitude: 20,
    frequency: 3,
    thickness: 2,
    color: '#000000'
  },
  horiz: {
    spacing: 60,
    amplitude: 20,
    frequency: 3,
    thickness: 2,
    color: '#000000'
  }
};

function createRow(id, label, type, min, max, step, value, onChange) {
  const row = document.createElement('div');
  row.className = 'control-row';
  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  const valueSpan = document.createElement('span');
  valueSpan.className = 'value-label';
  valueSpan.textContent = value;
  labelEl.append(label, valueSpan);
  row.appendChild(labelEl);
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  if (type === 'range') {
    input.min = min; input.max = max; input.step = step;
  }
  input.value = value;
  input.addEventListener('input', () => {
    const v = type === 'color' ? input.value : parseFloat(input.value);
    if (type !== 'color') valueSpan.textContent = v;
    onChange(v);
  });
  row.appendChild(input);
  return row;
}
```

- [ ] **Step 2: Wire controls for both columns**

```js
const svg = document.getElementById('pattern-svg');

const state = {
  vert: { ...DEFAULT_VALS.vert },
  horiz: { ...DEFAULT_VALS.horiz }
};

const SLIDER_CONFIGS = [
  { key: 'spacing', label: 'Spacing', min: 10, max: 200, step: 1 },
  { key: 'amplitude', label: 'Amplitude', min: 0, max: 100, step: 1 },
  { key: 'frequency', label: 'Frequency', min: 0.5, max: 10, step: 0.5 },
  { key: 'thickness', label: 'Thickness', min: 0.5, max: 20, step: 0.5 },
];

function buildControls() {
  ['vert', 'horiz'].forEach(side => {
    const container = document.getElementById(`${side}-controls`);
    SLIDER_CONFIGS.forEach(cfg => {
      const row = createRow(
        `${side}-${cfg.key}`,
        cfg.label, 'range',
        cfg.min, cfg.max, cfg.step,
        state[side][cfg.key],
        (v) => {
          state[side][cfg.key] = v;
          renderGrid();
        }
      );
      container.appendChild(row);
    });
    const colorRow = createRow(
      `${side}-color`,
      'Color', 'color', null, null, null,
      state[side].color,
      (v) => {
        state[side].color = v;
        renderGrid();
      }
    );
    container.appendChild(colorRow);
  });
}

buildControls();
```

- [ ] **Step 3: Add placeholder renderGrid function**

Add after buildControls() — this will be fully implemented in Task 4:

```js
function renderGrid() {
  // Will be implemented in Task 4
}
```

Trigger initial render:

```js
renderGrid();
```

- [ ] **Step 4: Verify controls render**

Open the page. Confirm: two columns (Vertical/Horizontal) each with Spacing, Amplitude, Frequency, Thickness sliders and a Color picker. Sliders show current values. Moving sliders doesn't crash — shows nothing on canvas yet.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add state management and all control bindings"
```

---

### Task 3: Sine Wave Path Generator

**Files:**
- Modify: `index.html` (add function before `renderGrid`)

- [ ] **Step 1: Add the sine wave path generator function**

Add this function before `renderGrid`:

```js
function sineWavePath(offset, length, amplitude, frequency, isVertical) {
  const periods = frequency;
  const totalAngle = periods * 2 * Math.PI;
  const steps = Math.max(2, Math.round(periods * 40));
  const angleStep = totalAngle / steps;
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pos = t * length;
    const angle = i * angleStep;
    const wave = Math.sin(angle) * amplitude;

    if (isVertical) {
      points.push(`${offset + wave},${pos}`);
    } else {
      points.push(`${pos},${offset + wave}`);
    }
  }
  return `M ${points.join(' L ')}`;
}
```

- [ ] **Step 2: Manual verification of path output**

Test mentally or by adding a console.log:
```js
console.log(sineWavePath(100, 500, 20, 2, false));
// Expected output: "M 0,100 L ..." (a sine wave path starting at (0,100))
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add sine wave SVG path generator"
```

---

### Task 4: SVG Renderer

**Files:**
- Modify: `index.html` (implement `renderGrid`)

- [ ] **Step 1: Implement the renderGrid function**

Replace the placeholder `renderGrid` with:

```js
function renderGrid() {
  const w = svg.clientWidth || 800;
  const h = svg.clientHeight || 600;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  let html = '';

  // Vertical lines
  for (let x = state.vert.spacing / 2; x < w; x += state.vert.spacing) {
    const d = sineWavePath(x, h, state.vert.amplitude, state.vert.frequency, true);
    html += `<path d="${d}" stroke="${state.vert.color}" stroke-width="${state.vert.thickness}" fill="none" />`;
  }

  // Horizontal lines
  for (let y = state.horiz.spacing / 2; y < h; y += state.horiz.spacing) {
    const d = sineWavePath(y, w, state.horiz.amplitude, state.horiz.frequency, false);
    html += `<path d="${d}" stroke="${state.horiz.color}" stroke-width="${state.horiz.thickness}" fill="none" />`;
  }

  svg.innerHTML = html;
}
```

- [ ] **Step 2: Verify the pattern renders**

Open the page. Confirm: a grid of black wavy lines appears on the canvas. Moving any slider/color picker updates the pattern in real time.

- [ ] **Step 3: Handle edge case — zero spacing**

If spacing is too small, the grid could generate thousands of paths and freeze. Add a minimum of 2px but our slider min of 10 already prevents this. No extra action needed.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: implement SVG renderer with real-time updates"
```

---

### Task 5: Export SVG and PNG

**Files:**
- Modify: `index.html` (add export logic after `renderGrid`)

- [ ] **Step 1: Add shared download helper**

Add this before the export logic:

```js
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: Implement SVG export**

```js
document.getElementById('export-svg').addEventListener('click', () => {
  const serializer = new XMLSerializer();
  const svgClone = svg.cloneNode(true);
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgContent = serializer.serializeToString(svgClone);
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  downloadBlob(blob, 'pattern.svg');
});
```

- [ ] **Step 3: Implement PNG export**

```js
document.getElementById('export-png').addEventListener('click', () => {
  const serializer = new XMLSerializer();
  const svgClone = svg.cloneNode(true);
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgContent = serializer.serializeToString(svgClone);

  const canvas = document.createElement('canvas');
  const w = svg.clientWidth || 800;
  const h = svg.clientHeight || 600;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  const img = new Image();
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(pngBlob => {
      downloadBlob(pngBlob, 'pattern.png');
    });
  };
  img.src = url;
});
```

- [ ] **Step 4: Verify exports work**

Open the page. Click "Export SVG" — file downloads as `pattern.svg`. Open it in a browser/SVG viewer — same pattern. Click "Export PNG" — file downloads as `pattern.png`. Same pattern, rasterized.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add SVG and PNG export"
```

---

### Task 6: Final Polish and Edge Cases

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Handle resize — re-render on window resize**

```js
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(renderGrid, 100);
});
```

- [ ] **Step 2: SVG namespace fix for export**

Ensure exported SVG is valid standalone XML. The serializer step handles this with `xmlns` attribute, but also add `xmlns` to the inline SVG element in the HTML:

In the HTML, change:
```html
<svg id="pattern-svg" xmlns="http://www.w3.org/2000/svg">
```
(already has xmlns — good.)

- [ ] **Step 3: Open and verify everything works end-to-end**

Open `index.html`. Test all controls produce smooth real-time updates. Test extreme values (max spacing, min spacing, max amplitude, max frequency). Export SVG — opens correctly. Export PNG — renders correctly. Resize window — pattern reflows.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add window resize handler and polish"
```
