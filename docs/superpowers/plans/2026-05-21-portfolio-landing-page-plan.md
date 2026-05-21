# Portfolio Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a landing page at `SITO/index.html` with an orbital ring carousel linking to 5 project pages, plus a shared header injected into each project page.

**Architecture:** Single-page landing with vanilla JS for carousel animations + iframe previews. Shared header injected via a reusable JS script. Existing project pages are modified only to include the header and shared styles.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+), Google Fonts API (Plus Jakarta Sans + IBM Plex Sans)

**File Structure:**

```
SITO/
├── index.html              ← CREATE: Landing page (orbital ring)
├── css/
│   └── style.css           ← CREATE: Shared styles (typography, header, carousel, cards)
├── js/
│   ├── header.js           ← CREATE: Injects header into any page
│   └── landing.js          ← CREATE: Orbital ring, animations, interactions
├── RICETTA UOVA STRAPAZZATE 1/
│   └── index.html          ← MODIFY: Add header + shared CSS
├── PATTERNEXERCISE 1/
│   └── index.html          ← MODIFY: Add header + shared CSS
├── TIPOGRAFIACINETICA 1/
│   └── index.html          ← MODIFY: Add header + shared CSS
├── MASCHERASONORA 1/
│   └── index.html          ← MODIFY: Add header + shared CSS
└── MANIONETTE 1/
    └── index.html          ← MODIFY: Add header + shared CSS
```

---

### Task 1: Create shared stylesheet (`css/style.css`)

**Files:**
- Create: `SITO/css/style.css`

- [ ] **Step 1: Write the complete stylesheet**

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500&family=Plus+Jakarta+Sans:wght@500&display=swap');

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  min-height: 100vh;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: #FEFDF8;
  background: #0A0A3A;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(10,10,58,0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(254,253,248,0.08);
}

.site-header .site-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.1;
  color: #FEFDF8;
  text-decoration: none;
  letter-spacing: -0.02em;
}

.site-header .nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #FEFDF8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.dropdown-trigger:hover {
  opacity: 1;
}

.dropdown-trigger::after {
  content: '▾';
  display: inline-block;
  margin-left: 6px;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.dropdown-trigger.open::after {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 220px;
  margin-top: 8px;
  background: rgba(10,10,58,0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(254,253,248,0.12);
  border-radius: 12px;
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
}

.dropdown-menu.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu a {
  display: block;
  padding: 10px 20px;
  color: rgba(254,253,248,0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.dropdown-menu a:hover {
  background: rgba(10,77,219,0.3);
  color: #FEFDF8;
}

/* Home link */
.home-link {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(254,253,248,0.8);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid rgba(254,253,248,0.16);
  border-radius: 999px;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.home-link:hover {
  background: #05308C;
  color: #FEFDF8;
  border-color: #05308C;
}

/* Landing specific */
.landing-page {
  background: #0A0A3A;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.landing-main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Orbital ring canvas */
#orbital-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Cursor follower */
.cursor-halo {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(254,253,248,0.04);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 99;
  mix-blend-mode: screen;
  transition: width 0.4s ease, height 0.4s ease, background 0.4s ease;
}

.cursor-halo.expanded {
  width: 60px;
  height: 60px;
  background: rgba(254,253,248,0.08);
}

/* Card styles */
.project-card {
  position: absolute;
  width: 240px;
  height: 180px;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  will-change: transform;
  transition: border-color 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  overflow: hidden;
}

.project-card:hover {
  border-color: rgba(255,255,255,0.16);
}

.project-card .card-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.1;
  color: #FEFDF8;
  position: relative;
  z-index: 2;
}

.project-card .card-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.project-card .card-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  z-index: 1;
}

.project-card .card-preview iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.project-card:hover .card-preview {
  opacity: 1;
}

/* Bobbing animation */
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Orbital track */
.orbital-track {
  position: absolute;
  border: 1px dashed rgba(254,253,248,0.08);
  border-radius: 50%;
  pointer-events: none;
}

/* Page transition overlay */
.page-transition {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0A0A3A;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.page-transition.active {
  opacity: 1;
}
```

- [ ] **Step 2: Verify file exists**

Run: `Test-Path -LiteralPath "C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\SITO\css\style.css"`
Expected: True

---

### Task 2: Create header injection script (`js/header.js`)

**Files:**
- Create: `SITO/js/header.js`

- [ ] **Step 1: Write header.js**

```javascript
(function() {
  // Determine if we're on a project page (not landing)
  var isLanding = window.location.pathname.endsWith('/SITO/') || 
                  window.location.pathname.endsWith('/SITO/index.html') ||
                  window.location.pathname === '/' ||
                  window.location.pathname.endsWith('index.html') && 
                  window.location.pathname.split('/').filter(Boolean).length <= 2;

  var header = document.createElement('header');
  header.className = 'site-header';

  // Left: site name
  var nameLink = document.createElement('a');
  nameLink.className = 'site-name';
  nameLink.href = '../index.html';
  nameLink.textContent = 'AURORA PIAZZA';
  header.appendChild(nameLink);

  // Right navigation
  var navRight = document.createElement('div');
  navRight.className = 'nav-right';

  if (isLanding) {
    // Projects dropdown
    var dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    var trigger = document.createElement('button');
    trigger.className = 'dropdown-trigger';
    trigger.textContent = 'Projects';
    dropdown.appendChild(trigger);

    var menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    var projects = [
      { name: 'Uova Strapazzate', path: '../RICETTA UOVA STRAPAZZATE 1/index.html' },
      { name: 'Generazione di Pattern', path: '../PATTERNEXERCISE 1/index.html' },
      { name: 'Tipografia Cinetica', path: '../TIPOGRAFIACINETICA 1/index.html' },
      { name: 'Maschera Sonora', path: '../MASCHERASONORA 1/index.html' },
      { name: 'Manionette', path: '../MANIONETTE 1/index.html' }
    ];

    projects.forEach(function(p) {
      var link = document.createElement('a');
      link.href = p.path;
      link.textContent = p.name;
      menu.appendChild(link);
    });

    dropdown.appendChild(menu);
    navRight.appendChild(dropdown);

    // Toggle dropdown
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
    });

    document.addEventListener('click', function() {
      menu.classList.remove('open');
      trigger.classList.remove('open');
    });
  } else {
    // Home link
    var homeLink = document.createElement('a');
    homeLink.className = 'home-link';
    homeLink.href = '../index.html';
    homeLink.textContent = 'Home';
    navRight.appendChild(homeLink);
  }

  header.appendChild(navRight);
  document.body.prepend(header);
})();
```

- [ ] **Step 2: Verify file exists**

Run: `Test-Path -LiteralPath "C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\SITO\js\header.js"`
Expected: True

---

### Task 3: Create the orbital ring landing page (`index.html`)

**Files:**
- Create: `SITO/index.html`

- [ ] **Step 1: Write the landing page HTML**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURORA PIAZZA — Portfolio</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="landing-page">
  <script src="js/header.js"></script>

  <main class="landing-main">
    <div class="cursor-halo" id="cursorHalo"></div>
    <canvas id="orbital-canvas"></canvas>
    <div class="page-transition" id="pageTransition"></div>
  </main>

  <script src="js/landing.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify file exists**

Run: `Test-Path -LiteralPath "C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\SITO\index.html"`
Expected: True

---

### Task 4: Create the orbital ring logic (`js/landing.js`)

**Files:**
- Create: `SITO/js/landing.js`

- [ ] **Step 1: Write landing.js — project data and card setup**

```javascript
(function() {
  'use strict';

  var projects = [
    { name: 'Uova Strapazzate', icon: '🍳', path: 'RICETTA UOVA STRAPAZZATE 1/index.html' },
    { name: 'Generazione di Pattern', icon: '〰️', path: 'PATTERNEXERCISE 1/index.html' },
    { name: 'Tipografia Cinetica', icon: '✍️', path: 'TIPOGRAFIACINETICA 1/index.html' },
    { name: 'Maschera Sonora', icon: '🎵', path: 'MASCHERASONORA 1/index.html' },
    { name: 'Manionette', icon: '🖐️', path: 'MANIONETTE 1/index.html' }
  ];

  var canvas = document.getElementById('orbital-canvas');
  var ctx = canvas.getContext('2d');
  var halo = document.getElementById('cursorHalo');
  var transition = document.getElementById('pageTransition');

  var cards = [];
  var angle = 0;
  var currentAngle = 0;
  var isHovering = false;
  var hoveredIndex = -1;
  var mouseX = 0;
  var mouseY = 0;
  var cursorX = 0;
  var cursorY = 0;
  var centerX = 0;
  var centerY = 0;
  var radiusX = 0;
  var radiusY = 0;
  var animId = null;
  var cardData = [];

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    centerX = w / 2;
    centerY = h / 2;
    radiusX = Math.min(w, h) * 0.35;
    radiusY = radiusX * 0.6;
  }

  function getCardAngle(index, totalSlots) {
    // 7 slots: 5 projects + 2 empty for balance
    var spacing = (Math.PI * 2) / totalSlots;
    return -Math.PI / 2 + index * spacing; // start from top
  }
```

- [ ] **Step 2: Write landing.js — card DOM elements**

```javascript
  function buildCards() {
    var totalSlots = 7;
    // Remove any existing card elements
    document.querySelectorAll('.project-card').forEach(function(el) { el.remove(); });

    cardData = [];

    for (var i = 0; i < totalSlots; i++) {
      var isFilled = i < projects.length;

      var card = document.createElement('div');
      card.className = 'project-card';
      card.style.display = isFilled ? 'flex' : 'none';

      if (isFilled) {
        var p = projects[i];

        var iconEl = document.createElement('div');
        iconEl.className = 'card-icon';
        iconEl.textContent = p.icon;
        card.appendChild(iconEl);

        var titleEl = document.createElement('div');
        titleEl.className = 'card-title';
        titleEl.textContent = p.name;
        card.appendChild(titleEl);

        // Preview iframe (loaded on hover)
        var preview = document.createElement('div');
        preview.className = 'card-preview';
        card.appendChild(preview);

        // Bobbing animation with random delay
        var delay = (Math.random() * 4).toFixed(2);
        card.style.animation = 'bob 4s ease-in-out infinite';
        card.style.animationDelay = delay + 's';

        // Events
        card.addEventListener('mouseenter', function(idx, el) {
          return function() {
            isHovering = true;
            hoveredIndex = idx;
            // Load iframe preview
            var previewEl = el.querySelector('.card-preview');
            if (previewEl && !previewEl.querySelector('iframe')) {
              var iframe = document.createElement('iframe');
              iframe.src = p.path;
              iframe.loading = 'lazy';
              previewEl.appendChild(iframe);
            }
          };
        }(i, card));

        card.addEventListener('mouseleave', function() {
          isHovering = false;
          hoveredIndex = -1;
        });

        card.addEventListener('click', function(path) {
          return function() {
            transition.classList.add('active');
            setTimeout(function() {
              window.location.href = path;
            }, 400);
          };
        }(p.path));
      }

      document.querySelector('.landing-main').appendChild(card);
      cardData.push({ el: card, filled: isFilled });
    }
  }
```

- [ ] **Step 3: Write landing.js — orbital positions update**

```javascript
  function updatePositions(progress) {
    var totalSlots = cardData.length;
    // Add a slight ease for smooth stop/start
    currentAngle = angle + progress;

    for (var i = 0; i < totalSlots; i++) {
      var data = cardData[i];
      if (!data.filled) continue;

      var cardAngle = getCardAngle(i, totalSlots) + currentAngle;
      var x = centerX + Math.cos(cardAngle) * radiusX;
      var y = centerY + Math.sin(cardAngle) * radiusY;

      var el = data.el;

      if (isHovering && hoveredIndex === i) {
        // Hovered card lifts toward center
        var scale = 1.2;
        var towardX = (centerX - x) * 0.15;
        var towardY = (centerY - y) * 0.15;
        el.style.transform = 'translate(' + (x - el.offsetWidth / 2 + towardX) + 'px, ' + (y - el.offsetHeight / 2 + towardY) + 'px) scale(' + scale + ')';
        el.style.zIndex = 10;
        el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
      } else if (isHovering) {
        // Side cards nudge outward slightly
        el.style.transform = 'translate(' + (x - el.offsetWidth / 2) + 'px, ' + (y - el.offsetHeight / 2) + 'px) scale(0.92)';
        el.style.zIndex = 1;
        el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
      } else {
        el.style.transform = 'translate(' + (x - el.offsetWidth / 2) + 'px, ' + (y - el.offsetHeight / 2) + 'px)';
        el.style.zIndex = 1;
        el.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
      }

      // Subtle parallax nudge from mouse
      if (!isHovering) {
        var nudgeX = (mouseX / window.innerWidth - 0.5) * 4;
        var nudgeY = (mouseY / window.innerHeight - 0.5) * 4;
        var currentTransform = el.style.transform;
        el.style.transform = currentTransform + ' translate(' + nudgeX + 'px, ' + nudgeY + 'px)';
      }
    }
  }
```

- [ ] **Step 4: Write landing.js — orbital track drawing on canvas**

```javascript
  function drawTrack(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw orbital ellipse track
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(254,253,248,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 12]);
    ctx.lineDashOffset = -progress * 100;
    ctx.stroke();

    // If hovering, draw connecting line to hovered card
    if (isHovering && hoveredIndex >= 0) {
      var totalSlots = cardData.length;
      var cardAngle = getCardAngle(hoveredIndex, totalSlots) + currentAngle;
      var hx = centerX + Math.cos(cardAngle) * radiusX;
      var hy = centerY + Math.sin(cardAngle) * radiusY;

      // Solid line segment toward hovered card
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(254,253,248,0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      // Draw a partial arc around the hovered area
      var arcStart = cardAngle - 0.4;
      var arcEnd = cardAngle + 0.4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, arcStart, arcEnd);
      ctx.stroke();
    }
  }
```

- [ ] **Step 5: Write landing.js — animation loop and cursor**

```javascript
  var lastTime = 0;

  function animate(time) {
    if (!lastTime) lastTime = time;
    var dt = (time - lastTime) / 1000;
    lastTime = time;

    if (!isHovering) {
      angle += dt * 0.105; // ~60s per full rotation
    }

    var progress = angle / (Math.PI * 2);

    drawTrack(progress);
    updatePositions(progress);

    // Smooth cursor follower
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    halo.style.left = cursorX + 'px';
    halo.style.top = cursorY + 'px';

    animId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Check proximity to hovered card for halo expansion
    if (hoveredIndex >= 0) {
      halo.classList.add('expanded');
    } else {
      halo.classList.remove('expanded');
    }
  });

  // Magnetic nudge on cards via mousemove on cards
  document.addEventListener('mouseover', function(e) {
    var card = e.target.closest('.project-card');
    if (card) {
      halo.classList.add('expanded');
    }
  });

  document.addEventListener('mouseout', function(e) {
    var card = e.target.closest('.project-card');
    if (card) {
      halo.classList.remove('expanded');
    }
  });

  // Init
  window.addEventListener('resize', resize);
  resize();
  buildCards();
  animId = requestAnimationFrame(animate);
})();
```

- [ ] **Step 6: Verify landing.js is syntactically valid**

Run: `node --check "C:\Users\piazz\Desktop\WorkshopDesign_Maggio2026\SITO\js\landing.js"`
Expected: No error output (syntax OK)

---

### Task 5: Modify project pages — RICETTA UOVA STRAPAZZATE 1

**Files:**
- Modify: `SITO/RICETTA UOVA STRAPAZZATE 1/index.html`

- [ ] **Step 1: Add stylesheet link and header script**

Open the file and add `<link rel="stylesheet" href="../css/style.css">` inside `<head>` and `<script src="../js/header.js"></script>` just before `</body>`.

The existing file content is:

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uova Strapazzate — Ricetta di Cuoca Riccia</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- existing content -->
  <script src="../js/header.js"></script>
</body>
</html>
```

Specifically, after `<link rel="stylesheet" href="style.css">` add a new line: `<link rel="stylesheet" href="../css/style.css">`

- [ ] **Step 2: Open file in browser to verify**

Open `SITO/RICETTA UOVA STRAPAZZATE 1/index.html` in browser and confirm header appears.

---

### Task 6: Modify project pages — PATTERNEXERCISE 1

**Files:**
- Modify: `SITO/PATTERNEXERCISE 1/index.html`

- [ ] **Step 1: Add stylesheet link and header script**

Open file, add `<link rel="stylesheet" href="../css/style.css">` inside `<head>`, and `<script src="../js/header.js"></script>` before `</body>`.

- [ ] **Step 2: Verify file can be served**

---

### Task 7: Modify project pages — TIPOGRAFIACINETICA 1

**Files:**
- Modify: `SITO/TIPOGRAFIACINETICA 1/index.html`

- [ ] **Step 1: Add stylesheet link and header script**

Open file, add `<link rel="stylesheet" href="../css/style.css">` inside `<head>`, and `<script src="../js/header.js"></script>` before `</body>`.

- [ ] **Step 2: Verify file can be served**

---

### Task 8: Modify project pages — MASCHERASONORA 1

**Files:**
- Modify: `SITO/MASCHERASONORA 1/index.html`

- [ ] **Step 1: Add stylesheet link and header script**

Open file, add `<link rel="stylesheet" href="../css/style.css">` inside `<head>`, and `<script src="../js/header.js"></script>` before `</body>`.

- [ ] **Step 2: Verify file can be served**

---

### Task 9: Modify project pages — MANIONETTE 1

**Files:**
- Modify: `SITO/MANIONETTE 1/index.html`

- [ ] **Step 1: Add stylesheet link and header script**

Open file, add `<link rel="stylesheet" href="../css/style.css">` inside `<head>`, and `<script src="../js/header.js"></script>` before `</body>`.

- [ ] **Step 2: Verify file can be served**

---

### Task 10: Integration verification

**Files:** None

- [ ] **Step 1: Open SITO/index.html in browser**

Open the landing page in a browser. Verify:
- Header shows "AURORA PIAZZA" on the left and "Projects" dropdown on the right
- 5 cards are visible on the orbital ring
- Cards slowly auto-rotate
- Hovering a card pauses rotation and shows an iframe preview
- The dropdown menu lists all 5 projects with correct links
- Clicking a card navigates to the project page after a fade transition

- [ ] **Step 2: Open a project page directly**

Open e.g. `SITO/MANIONETTE 1/index.html`. Verify:
- Header shows "AURORA PIAZZA" on the left and "Home" link on the right
- The project's original content/functionality is intact
- Clicking "Home" navigates back to the landing page
