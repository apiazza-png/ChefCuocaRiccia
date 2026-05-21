# Cycloid Drawing Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single HTML file that draws a cycloid with two sliders (Loop Size, Number of Loops) and a draggable point.

**Architecture:** Single `.html` file with embedded CSS and JS. Canvas fills most of the viewport. A bottom control bar holds sliders and position readout. All logic in one procedural script block.

**Tech Stack:** Vanilla HTML5 + CSS3 + Canvas API, zero dependencies.

---

### Task 1: HTML structure and CSS layout

**Files:**
- Create: `MANIONETTE/index.html`

- [ ] **Step 1: Write the HTML skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cycloid Drawing Tool</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; overflow: hidden; background: #1a1a2e; color: #eee; font-family: system-ui, sans-serif; }
  #container { display: flex; flex-direction: column; height: 100%; }
  #canvas-wrap { flex: 1; position: relative; min-height: 0; }
  #canvas-wrap canvas { display: block; width: 100%; height: 100%; background: #16213e; }
  #controls { padding: 12px 20px; background: #0f3460; display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
  #controls label { display: flex; align-items: center; gap: 8px; font-size: 14px; white-space: nowrap; }
  #controls input[type="range"] { width: 140px; accent-color: #e94560; }
  #controls .value { min-width: 32px; text-align: center; font-variant-numeric: tabular-nums; }
  #pos-readout { margin-left: auto; font-size: 14px; color: #aaa; }
</style>
</head>
<body>
<div id="container">
  <div id="canvas-wrap">
    <canvas id="canvas"></canvas>
  </div>
  <div id="controls">
    <label>Loop Size <input type="range" id="sizeSlider" min="5" max="100" value="40"><span class="value" id="sizeVal">40</span></label>
    <label>Number of Loops <input type="range" id="loopsSlider" min="1" max="12" value="3"><span class="value" id="loopsVal">3</span></label>
    <span id="pos-readout">Drag the dot along the curve</span>
  </div>
</div>
<script>
// --- all JS goes here ---
</script>
</body>
</html>
```

- [ ] **Step 2: Verify it opens in browser**

Open `index.html` in a browser. Expected: dark-themed page with a canvas area and two labeled sliders at the bottom. No errors in console.

---

### Task 2: Canvas sizing + cycloid curve computation

**Files:**
- Modify: `MANIONETTE/index.html` (JS section)

- [ ] **Step 1: Add Canvas sizing and curve computation function**

Replace the `<script>` comment with:

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const sizeSlider = document.getElementById('sizeSlider');
const loopsSlider = document.getElementById('loopsSlider');
const sizeVal = document.getElementById('sizeVal');
const loopsVal = document.getElementById('loopsVal');
const posReadout = document.getElementById('pos-readout');

function resizeCanvas() {
  const wrap = document.getElementById('canvas-wrap');
  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
}

function computeCycloid(loopSize, numLoops, numPoints) {
  const r = loopSize;
  const points = [];
  const totalT = 2 * Math.PI * numLoops;
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * totalT;
    const x = r * (t - Math.sin(t));
    const y = r * (1 - Math.cos(t));
    points.push({ x, y, t });
  }
  return points;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

- [ ] **Step 2: Verify in browser**

Open `index.html`, check dev console. No errors. Resize window — canvas resizes to fill the container.

---

### Task 3: Auto-scaling and rendering the curve

**Files:**
- Modify: `MANIONETTE/index.html` (JS section, after computeCycloid)

- [ ] **Step 1: Add auto-scale function and drawCurve**

```javascript
function getBounds(points) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

function drawCurve() {
  const loopSize = parseFloat(sizeSlider.value);
  const numLoops = parseInt(loopsSlider.value);
  const numPoints = numLoops * 200;
  const points = computeCycloid(loopSize, numLoops, numPoints);
  const bounds = getBounds(points);
  const padding = 40;
  const scaleX = (canvas.width - padding * 2) / bounds.width;
  const scaleY = (canvas.height - padding * 2) / bounds.height;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = padding + (canvas.width - padding * 2 - bounds.width * scale) / 2 - bounds.minX * scale;
  const offsetY = padding + (canvas.height - padding * 2 - bounds.height * scale) / 2 - bounds.minY * scale;

  function toScreen(p) {
    return { x: p.x * scale + offsetX, y: p.y * scale + offsetY };
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw curve
  ctx.beginPath();
  const first = toScreen(points[0]);
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < points.length; i++) {
    const p = toScreen(points[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  return { points, toScreen };
}
```

- [ ] **Step 2: Wire slider changes to redraw**

```javascript
function redraw() {
  sizeVal.textContent = sizeSlider.value;
  loopsVal.textContent = loopsSlider.value;
  drawCurve();
}

sizeSlider.addEventListener('input', redraw);
loopsSlider.addEventListener('input', redraw);
redraw();
```

- [ ] **Step 3: Verify in browser**

Adjust sliders. Expected: cycloid curve redraws immediately, always centered and fully visible inside the canvas with padding. Curve color is reddish (#e94560). No console errors.

---

### Task 4: Draggable point along the curve

**Files:**
- Modify: `MANIONETTE/index.html` (JS section, after drawCurve)

- [ ] **Step 1: Add drag state and nearest-point lookup**

Replace the `redraw` function and event listeners from Task 3 with:

```javascript
let dragIndex = 0;
let isDragging = false;
let currentPoints = [];
let currentToScreen = null;

function findNearestIndex(screenX, screenY, points, toScreen) {
  let minDist = Infinity;
  let nearest = 0;
  for (let i = 0; i < points.length; i++) {
    const sp = toScreen(points[i]);
    const dx = sp.x - screenX;
    const dy = sp.y - screenY;
    const dist = dx * dx + dy * dy;
    if (dist < minDist) { minDist = dist; nearest = i; }
  }
  return nearest;
}

function redraw() {
  sizeVal.textContent = sizeSlider.value;
  loopsVal.textContent = loopsSlider.value;
  const loopSize = parseFloat(sizeSlider.value);
  const numLoops = parseInt(loopsSlider.value);
  const numPoints = numLoops * 200;
  currentPoints = computeCycloid(loopSize, numLoops, numPoints);
  const result = drawCurve();
  currentToScreen = result.toScreen;
  drawDragPoint();
}

function drawDragPoint() {
  if (!currentToScreen || currentPoints.length === 0) return;
  const sp = currentToScreen(currentPoints[dragIndex]);
  ctx.beginPath();
  ctx.arc(sp.x, sp.y, 7, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 2;
  ctx.stroke();
  const pct = Math.round((dragIndex / (currentPoints.length - 1)) * 100);
  posReadout.textContent = `${pct}% along the curve`;
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  dragIndex = findNearestIndex(mx * scaleX, my * scaleY, currentPoints, currentToScreen);
  isDragging = true;
  drawDragPoint();
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  dragIndex = findNearestIndex(mx * scaleX, my * scaleY, currentPoints, currentToScreen);
  // Redraw curve + point
  const result = drawCurve();
  currentToScreen = result.toScreen;
  drawDragPoint();
});

canvas.addEventListener('mouseup', () => { isDragging = false; });
canvas.addEventListener('mouseleave', () => { isDragging = false; });
```

- [ ] **Step 2: Verify in browser**

Click and drag along the curve. Expected: a white dot with red outline snaps to the nearest point on the curve. The percentage readout updates as you drag. Releasing stops dragging.

---

### Task 5: Touch support for mobile

**Files:**
- Modify: `MANIONETTE/index.html`

- [ ] **Step 1: Add touch event handlers alongside mouse handlers**

After the mouse event handlers, add:

```javascript
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const mx = touch.clientX - rect.left;
  const my = touch.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  dragIndex = findNearestIndex(mx * scaleX, my * scaleY, currentPoints, currentToScreen);
  isDragging = true;
  drawDragPoint();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const mx = touch.clientX - rect.left;
  const my = touch.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  dragIndex = findNearestIndex(mx * scaleX, my * scaleY, currentPoints, currentToScreen);
  const result = drawCurve();
  currentToScreen = result.toScreen;
  drawDragPoint();
}, { passive: false });

canvas.addEventListener('touchend', () => { isDragging = false; });
```

- [ ] **Step 2: Verify in browser (mobile/emulation)**

Open in browser dev tools mobile emulation or on a touch device. Expected: dragging with touch works the same as with mouse.

---

### Task 6: Final polish

**Files:**
- Modify: `MANIONETTE/index.html`

- [ ] **Step 1: Add cursor styling for better UX**

In the CSS, add:
```css
#canvas-wrap canvas { cursor: pointer; }
```

- [ ] **Step 2: Verify everything works end-to-end**

Open `index.html`. Test:
1. Sliders update curve and values in real time
2. Curve stays centered and fits canvas at all slider values
3. Click/drag on curve moves the white dot
4. Percentage updates correctly (0% at start, 100% at end)
5. Resize browser — canvas and curve reflow
6. No console errors at any step
