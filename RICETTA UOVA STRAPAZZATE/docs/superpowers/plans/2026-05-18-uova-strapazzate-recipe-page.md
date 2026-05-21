# Uova Strapazzate Recipe Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a retro/Italian-style single recipe page for "Uova Strapazzate" by chef Cuoca Riccia.

**Architecture:** Two files in the existing `codebase/` directory: `index.html` (semantic markup) and `style.css` (all styling). The page is a local file meant to be shared.

**Tech Stack:** HTML5, CSS3, Google Fonts (Playfair Display via `@import`)

---

### Task 1: Create `style.css`

**Files:**
- Create: `codebase/style.css`

- [ ] **Step 1: Write the full stylesheet**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #faf3e0;
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #3a2a1a;
  line-height: 1.8;
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-card {
  max-width: 680px;
  width: 100%;
  background: #fefcf5;
  border: 2px solid #c45a3c;
  border-radius: 4px;
  padding: 3rem 2.5rem;
  box-shadow: 8px 8px 0 rgba(196, 90, 60, 0.15);
  position: relative;
}

.recipe-card::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border: 1px dashed #c45a3c;
  pointer-events: none;
  border-radius: 2px;
}

.chef-name {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-style: italic;
  font-size: 0.95rem;
  color: #5a7a4a;
  text-align: center;
  margin-bottom: 0.25rem;
  letter-spacing: 1px;
}

h1 {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #c45a3c;
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.tagline {
  text-align: center;
  font-style: italic;
  color: #5a7a4a;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
  border-top: 1px solid #c45a3c;
  border-bottom: 1px solid #c45a3c;
  padding: 0.75rem 0;
}

h2 {
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.5rem;
  color: #c45a3c;
  margin-bottom: 1rem;
  margin-top: 2rem;
  position: relative;
  padding-left: 1.25rem;
}

h2::before {
  content: '—';
  position: absolute;
  left: 0;
  color: #5a7a4a;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredients-list li {
  padding: 0.4rem 0 0.4rem 1.5rem;
  position: relative;
  font-size: 1.05rem;
}

.ingredients-list li::before {
  content: '◆';
  position: absolute;
  left: 0;
  color: #c45a3c;
  font-size: 0.7rem;
  top: 0.55rem;
}

.steps-list {
  list-style: none;
  padding: 0;
  counter-reset: step;
}

.steps-list li {
  counter-increment: step;
  padding: 0.6rem 0 0.6rem 2.5rem;
  position: relative;
  font-size: 1.05rem;
}

.steps-list li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 0.6rem;
  width: 1.6rem;
  height: 1.6rem;
  background: #c45a3c;
  color: #fefcf5;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-family: 'Playfair Display', 'Georgia', serif;
}

footer {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #c45a3c;
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #5a7a4a;
}

footer::after {
  content: ' ★ ★ ★';
  display: block;
  font-size: 0.8rem;
  color: #c45a3c;
  margin-top: 0.5rem;
  letter-spacing: 4px;
}
```

- [ ] **Step 2: Verify file was created**

Run: `Test-Path -LiteralPath "codebase/style.css"`
Expected: `True`

---

### Task 2: Create `index.html`

**Files:**
- Create: `codebase/index.html`

- [ ] **Step 1: Write the HTML page**

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
  <div class="recipe-card">
    <p class="chef-name">Cuoca Riccia</p>
    <h1>Uova Strapazzate</h1>
    <p class="tagline">La ricetta della nonna, semplice e genuina</p>

    <h2>Ingredienti</h2>
    <ul class="ingredients-list">
      <li>2 uova</li>
      <li>1 sottiletta</li>
      <li>Sale q.b.</li>
      <li>Pepe q.b.</li>
      <li>Olio EVO q.b.</li>
    </ul>

    <h2>Preparazione</h2>
    <ol class="steps-list">
      <li>Prendi una padella, mettila sul fornello, versa un filo d'olio EVO nella padella.</li>
      <li>Accendi il fornello a fuoco alto, fai riscaldare la padella insieme all'olio.</li>
      <li>Una volta che la padella e l'olio si siano riscaldati, prendi un uovo dal frigo, rompilo, versalo dentro la padella riscaldata. Ripeti lo stesso procedimento per il secondo uovo.</li>
      <li>Abbassa il fuoco.</li>
      <li>Prendi una paletta in legno, inizia a mischiare le due uova nella padella.</li>
      <li>Prendi il sale e il pepe. Aggiungili dentro le uova già mischiate, continua a mescolare.</li>
      <li>Prendi una sottiletta dal frigo, dividila in pezzi, aggiungila alle uova in padella e continua a mescolare.</li>
      <li>Appena ottieni un composto morbido e non secco, spegni il fuoco del fornello.</li>
      <li>Prendi un piatto, prendi la padella, toglila dal fornello, inclina la padella verso il piatto e versa il composto dentro al piatto.</li>
    </ol>

    <footer>Buon appetito!</footer>
  </div>
</body>
</html>
```

- [ ] **Step 2: Verify file was created**

Run: `Test-Path -LiteralPath "codebase/index.html"`
Expected: `True`

---

### Task 3: Verify the page renders correctly

- [ ] **Step 1: Confirm both files exist**

Run: `Get-ChildItem -LiteralPath "codebase"`
Expected: Both `index.html` and `style.css` listed

- [ ] **Step 2: Validate HTML structure**

Run: `Get-Content -LiteralPath "codebase\index.html" | Select-String -Pattern "<!DOCTYPE html>"`
Expected: Match found
