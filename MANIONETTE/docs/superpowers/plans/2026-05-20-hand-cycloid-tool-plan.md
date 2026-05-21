# Hand-Driven Cycloid Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single HTML file using MediaPipe hand tracking to generate 5 colored cycloid curves emanating from hand anchor points in real-time.

**Architecture:** Single `.html` file. CDN scripts load TensorFlow.js + hand-pose-detection + MediaPipe runtime. Webcam runs invisibly. Canvas renders 5 cycloids with per-anchor sliders. Decoupled render loop via requestAnimationFrame.

**Tech Stack:** Vanilla HTML5/CSS3/Canvas2D, @tensorflow-models/hand-pose-detection (MediaPipe runtime), @mediapipe/hands, @tensorflow/tfjs-core, @tensorflow/tfjs-backend-webgl.

---

### Task 1: HTML structure and CSS layout

**Files:**
- Create: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Write the HTML skeleton with CDN scripts, canvas, and 5-row control panel**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hand Cycloid Tool</title>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; overflow: hidden; background: #1a1a2e; color: #eee; font-family: system-ui, sans-serif; }
  #container { display: flex; flex-direction: column; height: 100%; }
  #canvas-wrap { flex: 1; position: relative; min-height: 0; }
  #canvas-wrap canvas { display: block; width: 100%; height: 100%; background: #16213e; }
  #controls { padding: 8px 16px; background: #0f3460; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 240px; }
  .finger-row { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
  .finger-label { min-width: 60px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .color-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  .finger-row label { display: flex; align-items: center; gap: 4px; font-size: 12px; white-space: nowrap; }
  .finger-row input[type="range"] { width: 80px; accent-color: #e94560; }
  .finger-row .val { min-width: 24px; text-align: center; font-size: 12px; font-variant-numeric: tabular-nums; }
  #status { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #556; font-size: 20px; pointer-events: none; }
</style>
</head>
<body>
<div id="container">
  <div id="canvas-wrap">
    <canvas id="canvas"></canvas>
    <div id="status">Loading hand model...</div>
  </div>
  <div id="controls"></div>
</div>
<script>
// --- all JS here ---
</script>
</body>
</html>
```

- [ ] **Step 2: Verify it opens in browser**

Open `hand-cycloid.html`. Expected: dark page with "Loading hand model..." centered text. Empty controls panel at bottom. No console errors (model loading warnings are OK as scripts load asynchronously).

---

### Task 2: Canvas sizing + cycloid math functions

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html` (JS section)

- [ ] **Step 1: Add canvas resize and cycloid computation functions**

Replace the script comment with:

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controlsEl = document.getElementById('controls');
const statusEl = document.getElementById('status');

function resizeCanvas() {
  const wrap = document.getElementById('canvas-wrap');
  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
}

function computeCycloid(loopSize, numLoops, numPoints, tracingDist) {
  const r = loopSize;
  const d = tracingDist;
  const points = [];
  const totalT = 2 * Math.PI * numLoops;
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * totalT;
    const x = r * t - d * Math.sin(t);
    const y = r - d * Math.cos(t);
    points.push({ x, y });
  }
  return points;
}

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

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```

- [ ] **Step 2: Verify in browser**

Console no errors. Canvas resizes with window.

---

### Task 3: Generate the 5-row control panel dynamically

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Add finger config array and control panel builder**

```javascript
const FINGERS = [
  { id: 'thumb',  label: 'Thumb',  color: '#f9c74f', mpAnchor: 1,  mpDir: 2  },
  { id: 'index',  label: 'Index',  color: '#f94144', mpAnchor: 5,  mpDir: 6  },
  { id: 'middle', label: 'Middle', color: '#43aa8b', mpAnchor: 9,  mpDir: 10 },
  { id: 'ring',   label: 'Ring',   color: '#577590', mpAnchor: 13, mpDir: 14 },
  { id: 'pinky',  label: 'Pinky',  color: '#9b5de5', mpAnchor: 17, mpDir: 18 },
];

const sliders = {};

function buildControls() {
  for (const f of FINGERS) {
    const row = document.createElement('div');
    row.className = 'finger-row';
    row.innerHTML = `
      <span class="finger-label"><span class="color-dot" style="background:${f.color}"></span>${f.label}</span>
      <label>Size <input type="range" min="5" max="100" value="30"><span class="val">30</span></label>
      <label>Loops <input type="range" min="1" max="12" value="3"><span class="val">3</span></label>
      <label>Dist <input type="range" min="0" max="200" value="100"><span class="val">100</span></label>
    `;
    controlsEl.appendChild(row);
    const inputs = row.querySelectorAll('input');
    const vals = row.querySelectorAll('.val');
    sliders[f.id] = {
      size: inputs[0], sizeVal: vals[0],
      loops: inputs[1], loopsVal: vals[1],
      dist: inputs[2], distVal: vals[2],
    };
    for (const inp of inputs) {
      inp.addEventListener('input', renderCurves);
    }
  }
}

buildControls();
```

- [ ] **Step 2: Verify in browser**

Expected: 5 rows appear at the bottom, each with a colored dot, finger name, and 3 sliders (Size, Loops, Dist). Sliders don't do anything yet.

---

### Task 4: Initialize MediaPipe hand tracking

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Add hand detector initialization after buildControls**

```javascript
let detector = null;
let lastHand = null;

async function initHandDetection() {
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    detector = await handPoseDetection.createDetector(model, {
      runtime: 'mediapipe',
      modelType: 'full',
      maxHands: 1,
    });
    statusEl.textContent = 'Show your hand to the camera';
    startWebcam();
  } catch (err) {
    statusEl.textContent = 'Failed to load hand model: ' + err.message;
    console.error(err);
  }
}

initHandDetection();
```

- [ ] **Step 2: Verify in browser**

Wait for model to load. Console should show no errors related to hand-pose-detection. Status should change from "Loading hand model..." to "Show your hand to the camera" once loaded.

---

### Task 5: Webcam + detection loop

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Add webcam access and frame detection loop**

```javascript
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.setAttribute('playsinline', '');
    video.play();
    detectLoop(video);
  } catch (err) {
    statusEl.textContent = 'Camera access denied: ' + err.message;
  }
}

async function detectLoop(video) {
  if (video.readyState < 2) { requestAnimationFrame(() => detectLoop(video)); return; }
  try {
    const hands = await detector.estimateHands(video);
    if (hands.length > 0) {
      lastHand = hands[0];
      statusEl.style.display = 'none';
    } else {
      statusEl.style.display = '';
      statusEl.textContent = 'Show your hand to the camera';
    }
  } catch (err) {
    // detection error on some frames is normal
  }
  requestAnimationFrame(() => detectLoop(video));
}
```

- [ ] **Step 2: Verify in browser**

Allow camera access. Status should show "Show your hand to the camera" when no hand is visible, and disappear when a hand appears. No visual output on canvas yet.

---

### Task 6: Render 5 rotated cycloids on canvas

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Add the render function that reads sliders, computes cycloids, positions and rotates them at each anchor**

Replace the placeholder `renderCurves` function with:

```javascript
function getFingerParams(fid) {
  const s = sliders[fid];
  return {
    size: parseFloat(s.size.value),
    loops: parseInt(s.loops.value),
    dist: parseFloat(s.dist.value),
  };
}

function renderCurves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!lastHand) return;

  const kp = lastHand.keypoints;
  const allCurvePts = [];
  const fingerCurves = [];

  for (const f of FINGERS) {
    const anchor = kp[f.mpAnchor];
    const dirPt = kp[f.mpDir];
    if (!anchor || !dirPt) continue;

    const p = getFingerParams(f.id);
    const tracingDist = p.size * (p.dist / 100);
    const numPoints = p.loops * 200;
    const rawPts = computeCycloid(p.size, p.loops, numPoints, tracingDist);

    const dx = dirPt.x - anchor.x;
    const dy = dirPt.y - anchor.y;
    const angle = Math.atan2(dy, dx);

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const transformed = rawPts.map(pt => ({
      x: anchor.x + pt.x * cosA - pt.y * sinA,
      y: anchor.y + pt.x * sinA + pt.y * cosA,
    }));

    for (const pt of transformed) {
      allCurvePts.push(pt);
    }
    fingerCurves.push({ points: transformed, color: f.color });
  }

  if (allCurvePts.length === 0) return;

  const bounds = getBounds(allCurvePts);
  const padding = 40;
  const scaleX = (canvas.width - padding * 2) / bounds.width;
  const scaleY = (canvas.height - padding * 2) / bounds.height;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = padding + (canvas.width - padding * 2 - bounds.width * scale) / 2 - bounds.minX * scale;
  const offsetY = padding + (canvas.height - padding * 2 - bounds.height * scale) / 2 - bounds.minY * scale;

  for (const fc of fingerCurves) {
    ctx.beginPath();
    const first = fc.points[0];
    ctx.moveTo(first.x * scale + offsetX, first.y * scale + offsetY);
    for (let i = 1; i < fc.points.length; i++) {
      const p = fc.points[i];
      ctx.lineTo(p.x * scale + offsetX, p.y * scale + offsetY);
    }
    ctx.strokeStyle = fc.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
}
```

- [ ] **Step 2: Add the render loop (decoupled from detection)**

```javascript
function animationLoop() {
  renderCurves();
  requestAnimationFrame(animationLoop);
}
animationLoop();
```

- [ ] **Step 3: Verify in browser**

Show your hand to the camera. Expected: 5 colored cycloid curves appear, each emanating from a finger base in that finger's direction. Curves update as hand moves. Sliders change curves in real time.

---

### Task 7: Update slider value displays

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Wire slider values to update on input (update the buildControls event listeners)**

Replace the slider event listener in `buildControls`:

```javascript
    for (const inp of inputs) {
      inp.addEventListener('input', () => {
        const rowVals = inp.parentElement.parentElement.querySelectorAll('.val');
        const rowInputs = inp.parentElement.parentElement.querySelectorAll('input');
        for (let i = 0; i < rowInputs.length; i++) {
          rowVals[i].textContent = rowInputs[i].value;
        }
        renderCurves();
      });
    }
```

- [ ] **Step 2: Verify in browser**

Move sliders. Expected: the displayed numeric values next to each slider update immediately, and the curves redraw.

---

### Task 8: Final polish

**Files:**
- Modify: `MANIONETTE/hand-cycloid.html`

- [ ] **Step 1: Resize canvas + re-render on window resize**

Replace the existing resize listener:

```javascript
window.addEventListener('resize', () => { resizeCanvas(); renderCurves(); });
```

- [ ] **Step 2: Verify everything end-to-end**

Open `hand-cycloid.html`. Test:
1. "Loading hand model..." appears on load
2. After model loads, status changes to "Show your hand to the camera"
3. Allow camera access
4. Show hand — 5 colored cycloids appear from finger bases
5. Move hand — curves follow in real time
6. Adjust sliders — each finger's curve changes independently
7. Hide hand — status message reappears
8. Resize window — curves re-center and re-scale
9. No console errors
