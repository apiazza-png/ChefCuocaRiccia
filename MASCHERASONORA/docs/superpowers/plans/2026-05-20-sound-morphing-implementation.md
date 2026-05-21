# Sound-Responsive SVG Morphing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single HTML file that morphs between QUIETE and RUMORE SVG states based on microphone input.

**Architecture:** Single-file HTML with inline SVG. Web Audio API captures microphone RMS. flubber library interpolates SVG path `d` attributes per frame via requestAnimationFrame.

**Tech Stack:** Vanilla JS, Web Audio API, flubber (CDN), SVG

---

### Task 1: HTML skeleton, SVG markup, and CSS

**Files:**
- Create: `index.html`
- Reference: `QUIETE.svg` (for path data), `RUMORE.svg` (for path data)

- [ ] **Step 1: Create index.html with SVG structures from both source files**

Create `index.html` with the full skeleton. Embed the SVG from QUIETE as the base DOM, but add all path data constants from both SVGs as JS data attributes. The SVG structure should match QUIETE's DOM tree (groups, paths, lines, circles) and include all elements from both states.

The file structure:
- `<svg>` viewBox matching original (595.3 × 841.9)
- `<g id="BOCCA">` with both QUIETE and RUMORE paths as `data-quiete` / `data-rumore` attributes on each morphable path
- `<g id="CAPELLI">` same approach
- `<g id="OCCHIO">` same approach
- CSS stylesheet with classes matching both SVGs
- flubber loaded from CDN: `<script src="https://unpkg.com/flubber@0.3.0"></script>`
- Empty `<script>` block at end of body for app code

- [ ] **Step 2: Add base CSS**

```html
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #1a1a2e;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: system-ui, sans-serif;
  }
  .container { position: relative; }
  svg { display: block; width: 90vmin; height: auto; }
  .controls {
    position: absolute;
    bottom: 20px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 12px; align-items: center;
  }
  #startBtn {
    padding: 12px 24px;
    border: none; border-radius: 8px;
    background: #b8355e; color: white;
    font-size: 16px; cursor: pointer;
  }
  #startBtn:hover { background: #931c4d; }
  #startBtn:disabled { opacity: 0.5; cursor: not-allowed; }
  #levelSlider {
    width: 200px;
    accent-color: #b8355e;
  }
  #levelLabel { color: white; font-size: 14px; min-width: 60px; text-align: center; }
  #fallbackMsg {
    color: #ffd700; font-size: 14px;
    text-align: center; margin-top: 8px;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: create HTML skeleton with embedded SVG paths and CSS"
```

---

### Task 2: Audio engine (Web Audio API microphone capture)

**Files:**
- Modify: `index.html` (add JS inside the `<script>` block)

- [ ] **Step 1: Add AudioEngine class**

Add the following inside `<script>` at the end of `<body>`:

```js
class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.smoothedLevel = 0;
    this.isRunning = false;
  }

  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') await this.audioCtx.resume();

    const source = this.audioCtx.createMediaStreamSource(stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 1024;
    source.connect(this.analyser);

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.isRunning = true;
  }

  getLevel() {
    if (!this.isRunning) return 0;
    this.analyser.getByteTimeDomainData(this.dataArray);

    let sumSquares = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = this.dataArray[i] / 128 - 1;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / this.dataArray.length);

    const raw = Math.min(100, Math.max(0, (rms / 0.3) * 100));

    this.smoothedLevel = this.smoothedLevel * 0.7 + raw * 0.3;
    return this.smoothedLevel;
  }
}
```

- [ ] **Step 2: Verify syntax**

Open `index.html` in browser, open DevTools console → confirm no syntax errors on load.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add AudioEngine class for microphone capture"
```

---

### Task 3: Morph controller (flubber integration)

**Files:**
- Modify: `index.html` (add code after AudioEngine)

- [ ] **Step 1: Add MorphController class**

```js
class MorphController {
  constructor(svgEl) {
    this.svg = svgEl;
    this.interpolators = [];
    this.setupInterpolators();
  }

  setupInterpolators() {
    this.interpolators = [];
    const pairs = [
      { quiet: 'data-quiete-bocca', rumore: 'data-rumore-bocca', target: '#pathBocca' },
      { quiet: 'data-quiete-capelli', rumore: 'data-rumore-capelli', target: '#pathCapelli' },
      { quiet: 'data-quiete-occhio1', rumore: 'data-rumore-occhio1', target: '#pathOcchio1' },
      { quiet: 'data-quiete-occhio2', rumore: 'data-rumore-occhio2', target: '#pathOcchio2' },
    ];

    for (const pair of pairs) {
      const el = this.svg.querySelector(pair.target);
      const dQuiet = el.getAttribute(pair.quiet);
      const dRumore = el.getAttribute(pair.rumore);

      if (dQuiet && dRumore && dQuiet !== dRumore) {
        this.interpolators.push({
          el,
          morph: flubber.interpolate(dQuiet, dRumore, { maxSegmentLength: 2 }),
        });
      }
    }
  }

  update(t) {
    for (const { el, morph } of this.interpolators) {
      el.setAttribute('d', morph(t));
    }
  }
}
```

- [ ] **Step 2: Add data attributes to SVG paths**

For each morphable path in the SVG, add the `data-quiete-*` and `data-rumore-*` attributes with the path `d` values from the source SVGs.

For BOCCA (first path under `g#BOCCA`):
```html
<path id="pathBocca"
      data-quiete-bocca="M138.5,539.3s22.9,3.5,34.8,17.8c1,1.2,2,2.2,3,3.3,7.6,7.8,32.9,32.8,52.9,43.1.7.4,1.4.7,2.1,1.1,5.4,2.9,37.3,19.3,83.7,19.3,46.4,0,78.4-16.4,83.7-19.3s1.4-.7,2.1-1.1c20.1-10.3,45.3-35.3,52.9-43.1,1-1.1,2.1-2.2,3-3.3,11.9-14.3,34.8-17.8,34.8-17.8,0,0-25.9-6.5-67.1-47.8-41.3-41.3-79.2-62.2-109.5-36.6-30.3-25.6-68.2-4.7-109.5,36.6-41.3,41.3-67.1,47.8-67.1,47.8Z"
      data-rumore-bocca="M458.1,556.4c-.1.1-.2.3-.4.4-.7.9-1.5,1.7-2.2,2.5-6,6.2-33,33.5-54.2,44.3-.6.3-1.3.6-1.9,1-5.3,2.9-37.3,19.3-83.7,19.3s-78.4-16.4-83.7-19.3c-.6-.4-1.3-.7-1.9-1-21.2-10.8-48.2-38.1-54.2-44.3-.8-.8-1.5-1.7-2.2-2.5-.1-.1-.2-.3-.4-.4-5.5-6.2-7.6-14.1-6.5-21.6,37.1-5.1,103.7,41.1,149.5,55.4l.6.2.6-.2c20.6-7.1,47.8-23.5,70.9-32.9,26.4-10.7,56.5-25.8,76.2-22.9,1.2,7.6-.9,15.7-6.5,21.9Z"
      class="st0" d="M138.5,539.3s22.9,3.5,34.8,17.8.../>
```

For CAPELLI:
```html
<path id="pathCapelli"
      data-quiete-capelli="M522.6,425.6c0-8.6-4.4-16.4-11.5-22..."
      data-rumore-capelli="M552.1,429.8c0-8.6-34.7-20.7-41.8-26.3..."
      class="st1" d="M522.6,425.6c0-8.6-4.4-16.4-11.5-22.../>
```

For OCCHIO first path (eye socket):
```html
<path id="pathOcchio1"
      data-quiete-occhio1="M276.7,360.4s13.6,19.1,45.3,19.1,46-19.1,46-19.1"
      data-rumore-occhio1="M274.1,333.8s35.4-16.6,53.7-19.4c0,0,34.9-5.6,42.7,6.6"
      class="st2" d="M276.7,360.4s13.6,19.1,45.3,19.1,46-19.1,46-19.1"/>
```

For OCCHIO second path (eyebrow / eye contour):
```html
<path id="pathOcchio2"
      data-quiete-occhio2="M275.4,320s46.8-5.1,51.1-5.6c0,0,34.9-5.6,42.7,6.6"
      data-rumore-occhio2="M323.3,341c-31.7,0-45.3,19.4-45.3,19.4,0,0,13.6,19.1,45.3,19.1s46-19.1,46-19.1c0,0-14.3-19.4-46-19.4Z"
      class="st2" d="M275.4,320s46.8-5.1,51.1-5.6c0,0,34.9-5.6,42.7,6.6"/>
```

- [ ] **Step 3: Verify**

Open in browser, check DevTools console for errors, confirm flubber loads.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add MorphController with flubber path interpolation"
```

---

### Task 4: Animation loop, unique elements, and app orchestration

**Files:**
- Modify: `index.html` (add code after MorphController)

- [ ] **Step 1: Add app orchestrator and animation loop**

```js
const svgEl = document.querySelector('svg');
const audioEngine = new AudioEngine();
const morph = new MorphController(svgEl);
const startBtn = document.getElementById('startBtn');
const slider = document.getElementById('levelSlider');
const levelLabel = document.getElementById('levelLabel');
const fallbackMsg = document.getElementById('fallbackMsg');
let useMicrophone = false;
let manualLevel = 0;

const uniques = {
  ciglia: svgEl.querySelectorAll('#OCCHIO .st2.line, #OCCHIO line'),
  iride: svgEl.querySelector('#iride'),
  pupilla: svgEl.querySelector('#pupilla'),
};

function animate() {
  const level = useMicrophone ? audioEngine.getLevel() : parseFloat(slider.value);
  const t = Math.min(1, Math.max(0, level / 100));

  morph.update(t);

  if (uniques.ciglia.length) {
    const opacity = t < 0.5 ? 1 : Math.max(0, 1 - (t - 0.5) * 2);
    uniques.ciglia.forEach(el => el.setAttribute('opacity', opacity));
  }
  if (uniques.iride) {
    const opacity = t > 0.5 ? Math.min(1, (t - 0.5) * 2) : 0;
    uniques.iride.setAttribute('opacity', opacity);
  }
  if (uniques.pupilla) {
    const opacity = t > 0.5 ? Math.min(1, (t - 0.5) * 2) : 0;
    uniques.pupilla.setAttribute('opacity', opacity);
  }

  levelLabel.textContent = `Livello: ${Math.round(level)}`;
  requestAnimationFrame(animate);
}

startBtn.addEventListener('click', async () => {
  try {
    await audioEngine.start();
    useMicrophone = true;
    startBtn.textContent = '✓ Microfono attivo';
    startBtn.disabled = true;
    slider.style.display = 'none';
    levelLabel.style.display = 'block';
  } catch {
    fallbackMsg.textContent = 'Microfono non disponibile — usa lo slider';
    slider.style.display = 'block';
    levelLabel.style.display = 'block';
    useMicrophone = false;
  }
});

slider.addEventListener('input', () => {
  if (!useMicrophone) levelLabel.textContent = `Livello: ${Math.round(slider.value)}`;
});

animate();
```

- [ ] **Step 2: Add unique elements markup**

Add `id` attributes to the unique elements in the SVG:

Eyelashes (lines in QUIETE OCCHIO, only visible in quiet state):
```html
<g class="unique-ciglia">
  <line x1="277.8" y1="385.8" x2="291.6" y2="372.3"/>
  <line x1="299.8" y1="396.3" x2="306.6" y2="378.3"/>
  <line x1="323.4" y1="399.5" x2="323.1" y2="380.2"/>
  <line x1="344" y1="395.9" x2="337.6" y2="377.8"/>
  <line x1="365.8" y1="386.2" x2="352" y2="372.8"/>
</g>
```

Iris and pupil (only visible in rumore state):
```html
<circle id="iride" class="st0" cx="323.7" cy="360.2" r="18.7" opacity="0"/>
<circle id="pupilla" class="st4" cx="323.7" cy="360.2" r="10.6" opacity="0"/>
```

- [ ] **Step 3: Verify**

Open `index.html` in browser. Click "Avvia" → confirm audio permission prompt appears. Confirm SVG renders without errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add animation loop and unique element visibility"
```

---

### Task 5: Fallback slider, controls layout, and final polish

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update controls in the HTML body**

```html
<div class="controls">
  <button id="startBtn">🎤 Avvia microfono</button>
  <input type="range" id="levelSlider" min="0" max="100" value="0" style="display:none">
  <span id="levelLabel" style="display:none">Livello: 0</span>
</div>
<div id="fallbackMsg"></div>
```

- [ ] **Step 2: Add responsive meta tag and viewport handling**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- [ ] **Step 3: Verify end-to-end**

Open `index.html` in Chrome/Firefox/Safari:
- Confirm start button renders
- Click start → accept mic permission → confirm level reads change in real time
- Make a sound → confirm BOCCA, CAPELLI, OCCHIO morph toward RUMORE
- Go silent → confirm they return to QUIETE
- Check eyelashes fade out, iris/pupil fade in
- Block mic permission → confirm slider fallback works
- Check mobile responsive layout

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add controls, fallback slider, and final polish"
```
