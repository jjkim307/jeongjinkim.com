# jeongjinkim.com Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-page Astro static site for JeongJin Kim's academic homepage, closely modeled on justinfrake.com and restyled in OU crimson.

**Architecture:** Astro static-site generator. A single `Layout.astro` wraps every page with shared `<head>`, fonts, nav, and footer. Reusable components (`Nav`, `Hero`, `ResearchCard`, `PublicationItem`) keep pages small. Content that is reused across pages (research streams, publications) lives in plain-JS data files under `src/data/`. The build emits static files to `dist/`, deployable to either Vercel or GitHub Pages later.

**Tech Stack:** Node.js (LTS via nvm), Astro 4, plain CSS with custom properties, Google Fonts (Inter + Public Sans).

**Verification model:** This is a static content site, so each task is verified by building (`npm run build`) and asserting the generated HTML in `dist/` contains the expected content (via `grep`). A build that exits non-zero or missing expected content is a failure.

---

## File Structure

```
jeongjinkim.com/
  package.json              # Astro scripts + deps
  astro.config.mjs          # site URL, static output
  .gitignore                # add node_modules/, dist/, .astro/
  public/
    favicon.svg             # site icon
    headshot.jpg            # hero photo (placeholder until provided)
    cv.pdf                  # CV (placeholder until provided)
  src/
    styles/global.css       # CSS variables, base type, layout, nav, cards
    layouts/Layout.astro    # head + fonts + nav + footer wrapper
    components/
      Nav.astro             # top navigation
      Hero.astro            # home hero (photo, name, bio, quick links)
      ResearchCard.astro    # one research-area card
      PublicationItem.astro # one publication entry
    data/
      research.js           # 3 research streams (shared: home cards + research page)
      publications.js       # publications array (grouped by stream on research page)
    pages/
      index.astro           # Home
      research.astro        # Research
      teaching.astro        # Teaching
      cv.astro              # CV
```

Existing repo files: `index.html` (placeholder — to be deleted), `README.md` (updated), `.gitignore` (updated), `docs/` (specs + this plan).

---

## Task 0: Install Node.js via nvm

**Files:** none (environment setup). nvm appends its loader to `~/.zshrc`.

- [ ] **Step 1: Install nvm**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Expected: clones nvm into `~/.nvm` and appends loader lines to `~/.zshrc`.

- [ ] **Step 2: Load nvm into the current shell**

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

- [ ] **Step 3: Install Node LTS**

```bash
nvm install --lts
```

Expected: downloads and installs current LTS (Node 20+).

- [ ] **Step 4: Verify Node and npm**

```bash
node -v && npm -v
```

Expected: prints a Node version `v20.x` or newer and an npm version. If `node` is still MISSING, re-run Step 2 in a fresh shell.

> Note for later steps: every bash step that runs `node`/`npm`/`npx` must first ensure nvm is loaded. Prefix with:
> `export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";`

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Modify: `.gitignore`
- Delete: `index.html`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "jeongjinkim-com",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.15.0"
  }
}
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jeongjinkim.com',
  output: 'static',
});
```

- [ ] **Step 3: Replace `.gitignore`**

```gitignore
# macOS
.DS_Store

# Editor
.vscode/
.idea/

# Node / Astro
node_modules/
dist/
.astro/
```

- [ ] **Step 4: Delete the placeholder home page**

```bash
git rm index.html
```

Expected: removes the old static `index.html`; Astro will generate the home page from `src/pages/index.astro`.

- [ ] **Step 5: Install dependencies**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
npm install
```

Expected: creates `node_modules/` and `package-lock.json`, installs Astro with no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json astro.config.mjs .gitignore package-lock.json
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Global styles, Layout, and Nav

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/Nav.astro`
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Write `src/styles/global.css`**

```css
:root {
  --primary: #841617;            /* OU crimson */
  --primary-hover: #a51c1d;
  --primary-light: rgba(132, 22, 23, 0.05);
  --accent: #FDF9D8;             /* OU cream */
  --accent-line: #e7cf83;
  --text-color: #333333;
  --text-secondary: #555555;
  --text-light: #777777;
  --border-color: #eeeeee;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  --card-shadow-hover: 0 3px 10px rgba(0, 0, 0, 0.08);
  --radius: 8px;
  --maxw: 960px;
}

* { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: #fff;
  color: var(--text-color);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 17px;
  line-height: 1.7;
}

h1, h2, h3, h4 {
  font-family: 'Public Sans', 'Inter', sans-serif;
  font-weight: 600;
  color: var(--primary);
  line-height: 1.2;
}

a { color: var(--primary); text-decoration: none; }
a:hover { color: var(--primary-hover); }

.container { max-width: var(--maxw); margin: 0 auto; padding: 0 1.5rem; }

/* Nav */
.navbar {
  background: #fff;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  padding: 12px 0;
}
.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.navbar-brand {
  font-family: 'Public Sans', sans-serif;
  font-weight: 600;
  font-size: 1.3rem;
  color: var(--primary);
}
.navbar-nav { display: flex; gap: 0.25rem; }
.nav-link {
  color: var(--text-color);
  font-weight: 500;
  padding: 8px 18px;
  position: relative;
}
.nav-link:hover { color: var(--primary); }
.nav-link[aria-current="page"] { color: var(--primary); font-weight: 600; }
.nav-link[aria-current="page"]::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 18px; right: 18px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
  padding: 2rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Page headings + sections */
h1 { font-size: 2.2rem; }
.section { padding: 24px 0 8px; }
.section-heading {
  display: inline-block;
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--primary);
  padding-bottom: 0.5rem;
  margin: 0 0 2rem;
  border-bottom: 2px solid var(--primary);
}

/* Research cards */
.interest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.interest-card {
  position: relative;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 2rem 1.75rem 3.5rem;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.3s ease;
}
.interest-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: var(--primary);
  transition: height 0.3s ease;
}
.interest-card:hover { transform: translateY(-5px); box-shadow: var(--card-shadow-hover); }
.interest-card:hover::before { height: 5px; }
.interest-title { font-size: 1.25rem; font-weight: 600; color: var(--primary); margin: 0 0 0.75rem; }
.interest-text { font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); margin: 0; }
.view-papers-link {
  position: absolute;
  bottom: 1.75rem; left: 1.75rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.view-papers-link:hover { color: var(--primary-hover); }

@media (max-width: 760px) {
  .interest-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Write `src/components/Nav.astro`**

```astro
---
const { path = '' } = Astro.props;
const links = [
  { href: '/', label: 'Home' },
  { href: '/research', label: 'Research' },
  { href: '/teaching', label: 'Teaching' },
  { href: '/cv', label: 'CV' },
];
const norm = (p) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);
const current = norm(path);
---
<nav class="navbar">
  <div class="container">
    <a class="navbar-brand" href="/">JeongJin Kim</a>
    <div class="navbar-nav">
      {links.map((l) => (
        <a class="nav-link" href={l.href} aria-current={norm(l.href) === current ? 'page' : undefined}>{l.label}</a>
      ))}
    </div>
  </div>
</nav>
```

- [ ] **Step 3: Write `src/layouts/Layout.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import '../styles/global.css';
const { title = 'JeongJin Kim', description = 'JeongJin Kim, Assistant Professor of Psychology (I-O), University of Oklahoma.' } = Astro.props;
const path = Astro.url.pathname;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <Nav path={path} />
    <main class="container">
      <slot />
    </main>
    <footer class="site-footer">
      <div class="container">&copy; {new Date().getFullYear()} JeongJin Kim</div>
    </footer>
  </body>
</html>
```

- [ ] **Step 4: Add a temporary home page so the build has an entry**

Create `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout>
  <p>Placeholder home — replaced in Task 3.</p>
</Layout>
```

- [ ] **Step 5: Build and verify nav renders**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
npm run build
grep -q 'class="navbar"' dist/index.html && grep -q 'JeongJin Kim' dist/index.html && echo "NAV OK"
```

Expected: build exits 0 and prints `NAV OK`.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/Nav.astro src/layouts/Layout.astro src/pages/index.astro
git commit -m "feat: add global styles, layout, and nav"
```

---

## Task 3: Home page (research data, ResearchCard, Hero)

**Files:**
- Create: `src/data/research.js`
- Create: `src/components/ResearchCard.astro`
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/data/research.js`**

```js
export const streams = [
  {
    id: 'person-situation',
    title: 'Person–Situation Interactions',
    short:
      'How individual differences and situational features jointly shape behavior and well-being at work.',
    description:
      'This stream examines how personal characteristics and situational features combine — rather than act in isolation — to shape employees’ behavior, attitudes, and well-being.',
  },
  {
    id: 'job-attitudes-affect',
    title: 'Job Attitudes & Affect/Emotions',
    short: 'How job attitudes, moods, and emotions form and unfold over time.',
    description:
      'This stream investigates the formation and consequences of job attitudes and the dynamic role of affect and emotions in the workplace.',
  },
  {
    id: 'performance-wellbeing',
    title: 'Individual Work Performance & Well-Being',
    short: 'The processes linking individual work behavior to performance and well-being.',
    description:
      'This stream focuses on the cognitive, affective, and social processes that drive individual job performance behavior and employee well-being.',
  },
];
```

- [ ] **Step 2: Write `src/components/ResearchCard.astro`**

```astro
---
const { id, title, short } = Astro.props;
---
<article class="interest-card">
  <h3 class="interest-title">{title}</h3>
  <p class="interest-text">{short}</p>
  <a class="view-papers-link" href={`/research#${id}`}>View papers &rarr;</a>
</article>
```

- [ ] **Step 3: Write `src/components/Hero.astro`**

```astro
---
const {
  scholarUrl = '#',
  cvUrl = '/cv.pdf',
  email = 'jjkim@ou.edu',
} = Astro.props;
---
<section class="hero">
  <img class="profile-image" src="/headshot.jpg" alt="JeongJin Kim" width="230" height="230" />
  <div class="hero-body">
    <h1 class="name-headline">JeongJin Kim</h1>
    <div class="title-headline">Assistant Professor, Department of Psychology &middot; University of Oklahoma</div>
    <p class="bio-text">
      I study the cognitive, affective, and social processes that shape individuals’
      job performance and well-being at work, with an emphasis on person–situation
      interactions, job attitudes and emotions, and individual work performance behavior.
      My research uses surveys, vignette experiments, and experience sampling and
      longitudinal methods to understand how employees think, feel, and act in the workplace.
    </p>
    <div class="btn-row">
      <a class="scholar-btn" href={scholarUrl}>Google Scholar</a>
      <a class="scholar-btn" href={cvUrl}>CV</a>
      <a class="scholar-btn" href={`mailto:${email}`}>Email</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Append hero styles to `src/styles/global.css`**

Add to the end of `src/styles/global.css`:

```css
/* Hero */
.hero {
  display: flex;
  gap: 2.5rem;
  align-items: center;
  padding: 48px 0 24px;
}
.profile-image {
  width: 230px;
  height: 230px;
  flex-shrink: 0;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}
.profile-image:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
.name-headline { font-size: 2.5rem; font-weight: 600; color: var(--primary); letter-spacing: -0.01em; margin: 0 0 0.5rem; }
.title-headline { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 500; color: var(--text-secondary); margin: 0 0 1.25rem; }
.bio-text { font-size: 1rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 1.5rem; }
.btn-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.scholar-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  padding: 6px 14px;
  border: 1px solid var(--primary);
  border-radius: 4px;
  transition: all 0.25s ease;
}
.scholar-btn:hover { background: var(--primary); color: #fff; }

@media (max-width: 760px) {
  .hero { flex-direction: column; text-align: center; }
  .btn-row { justify-content: center; }
}
```

- [ ] **Step 5: Replace `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import ResearchCard from '../components/ResearchCard.astro';
import { streams } from '../data/research.js';

// TODO(user): replace with real Google Scholar profile URL.
const scholarUrl = 'https://scholar.google.com/';
---
<Layout title="JeongJin Kim | I-O Psychology, University of Oklahoma">
  <Hero scholarUrl={scholarUrl} />
  <section class="section">
    <h2 class="section-heading">Research Focus Areas</h2>
    <div class="interest-grid">
      {streams.map((s) => <ResearchCard id={s.id} title={s.title} short={s.short} />)}
    </div>
  </section>
</Layout>
```

- [ ] **Step 6: Build and verify the home page**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
npm run build
grep -q 'Person' dist/index.html \
  && grep -q 'Research Focus Areas' dist/index.html \
  && grep -q 'mailto:jjkim@ou.edu' dist/index.html \
  && echo "HOME OK"
```

Expected: build exits 0 and prints `HOME OK`.

- [ ] **Step 7: Commit**

```bash
git add src/data/research.js src/components/ResearchCard.astro src/components/Hero.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: add home page with hero and research cards"
```

---

## Task 4: Research page (publications data, PublicationItem)

**Files:**
- Create: `src/data/publications.js`
- Create: `src/components/PublicationItem.astro`
- Create: `src/pages/research.astro`

- [ ] **Step 1: Write `src/data/publications.js`**

Start empty (user supplies real entries later). The shape is documented so adding a paper is a one-line edit.

```js
// Add one object per publication. `stream` must match an `id` in research.js:
// 'person-situation' | 'job-attitudes-affect' | 'performance-wellbeing'
// Example:
// { authors: 'Kim, J.', year: 2025, title: 'Paper title.', venue: 'Journal of Applied Psychology', url: '', stream: 'job-attitudes-affect' }
export const publications = [];
```

- [ ] **Step 2: Write `src/components/PublicationItem.astro`**

```astro
---
const { authors, year, title, venue, url } = Astro.props;
---
<li class="pub">
  <span class="pub-authors">{authors}</span> ({year}).
  {url ? <a href={url}>{title}</a> : <span class="pub-title">{title}</span>}
  <span class="pub-venue">{venue}.</span>
</li>
```

- [ ] **Step 3: Append publication styles to `src/styles/global.css`**

Add to the end of `src/styles/global.css`:

```css
/* Research page */
.stream { margin: 2.5rem 0; }
.stream h2 { font-size: 1.35rem; margin: 0 0 0.5rem; color: var(--primary); }
.stream > p { color: var(--text-secondary); margin: 0 0 1rem; }
.pub-list { list-style: none; padding: 0; margin: 0; }
.pub { padding: 0.6rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.97rem; }
.pub-authors { font-weight: 500; }
.pub-venue { font-style: italic; color: var(--text-secondary); }
.pub-empty { color: var(--text-light); font-style: italic; }
```

- [ ] **Step 4: Write `src/pages/research.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import PublicationItem from '../components/PublicationItem.astro';
import { streams } from '../data/research.js';
import { publications } from '../data/publications.js';

const byStream = (id) => publications.filter((p) => p.stream === id);
---
<Layout title="Research | JeongJin Kim">
  <h1>Research</h1>
  {streams.map((s) => {
    const pubs = byStream(s.id);
    return (
      <div class="stream" id={s.id}>
        <h2>{s.title}</h2>
        <p>{s.description}</p>
        {pubs.length > 0 ? (
          <ul class="pub-list">
            {pubs.map((p) => (
              <PublicationItem authors={p.authors} year={p.year} title={p.title} venue={p.venue} url={p.url} />
            ))}
          </ul>
        ) : (
          <p class="pub-empty">Publications coming soon.</p>
        )}
      </div>
    );
  })}
</Layout>
```

- [ ] **Step 5: Build and verify the research page**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
npm run build
grep -q 'id="person-situation"' dist/research/index.html \
  && grep -q 'id="job-attitudes-affect"' dist/research/index.html \
  && grep -q 'id="performance-wellbeing"' dist/research/index.html \
  && echo "RESEARCH OK"
```

Expected: build exits 0 and prints `RESEARCH OK`.

- [ ] **Step 6: Commit**

```bash
git add src/data/publications.js src/components/PublicationItem.astro src/pages/research.astro src/styles/global.css
git commit -m "feat: add research page with publication list"
```

---

## Task 5: Teaching page

**Files:**
- Create: `src/pages/teaching.astro`

- [ ] **Step 1: Write `src/pages/teaching.astro`**

Uses a local `courses` array so the user can edit one place. Seeded with a clearly-marked placeholder course.

```astro
---
import Layout from '../layouts/Layout.astro';

// TODO(user): replace with real courses (number, title, level, term).
const courses = [
  { number: 'PSY 0000', title: 'Course title', level: 'Undergraduate', term: '' },
];
---
<Layout title="Teaching | JeongJin Kim">
  <h1>Teaching</h1>
  <p>Courses I teach at the University of Oklahoma.</p>
  <ul class="pub-list">
    {courses.map((c) => (
      <li class="pub">
        <span class="pub-authors">{c.number}</span> — {c.title}
        <span class="pub-venue">{c.level}{c.term ? `, ${c.term}` : ''}</span>
      </li>
    ))}
  </ul>
</Layout>
```

- [ ] **Step 2: Build and verify the teaching page**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
npm run build
grep -q 'Teaching' dist/teaching/index.html && echo "TEACHING OK"
```

Expected: build exits 0 and prints `TEACHING OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/teaching.astro
git commit -m "feat: add teaching page"
```

---

## Task 6: CV page and placeholder assets

**Files:**
- Create: `src/pages/cv.astro`
- Create: `public/favicon.svg`
- Create: `public/headshot.jpg` (placeholder)
- Create: `public/cv.pdf` (placeholder)

- [ ] **Step 1: Write `src/pages/cv.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="CV | JeongJin Kim">
  <h1>Curriculum Vitae</h1>
  <p>
    My full CV is available as a PDF:
    <a href="/cv.pdf">Download CV (PDF)</a>.
  </p>
  <p>
    <object data="/cv.pdf" type="application/pdf" width="100%" height="900">
      <a href="/cv.pdf">View the CV PDF</a>.
    </object>
  </p>
</Layout>
```

- [ ] **Step 2: Write `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#841617"/>
  <text x="32" y="44" font-family="Public Sans, Arial, sans-serif" font-size="34" font-weight="700" fill="#FDF9D8" text-anchor="middle">JK</text>
</svg>
```

- [ ] **Step 3: Create placeholder headshot and CV**

```bash
# 1x1 transparent PNG saved as headshot.jpg placeholder (replace with a real photo later)
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82' > public/headshot.jpg
# Minimal valid one-page PDF placeholder (replace with the real CV later)
cat > public/cv.pdf <<'PDF'
%PDF-1.1
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 56>>stream
BT /F1 24 Tf 72 700 Td (CV placeholder) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF
PDF
echo "assets created"
```

Expected: prints `assets created`; `public/headshot.jpg` and `public/cv.pdf` exist.

- [ ] **Step 4: Build and verify CV page + assets copied**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
npm run build
grep -q 'Curriculum Vitae' dist/cv/index.html \
  && test -f dist/cv.pdf \
  && test -f dist/headshot.jpg \
  && test -f dist/favicon.svg \
  && echo "CV+ASSETS OK"
```

Expected: build exits 0 and prints `CV+ASSETS OK`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/cv.astro public/favicon.svg public/headshot.jpg public/cv.pdf
git commit -m "feat: add CV page and placeholder assets"
```

---

## Task 7: README update and full-site verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md`**

```markdown
# jeongjinkim.com

Personal academic website for JeongJin Kim, Assistant Professor of Psychology (I-O)
at the University of Oklahoma. Built with [Astro](https://astro.build).

## Develop

```bash
nvm use --lts        # ensure Node LTS is active
npm install          # first time only
npm run dev          # http://localhost:4321
```

## Build

```bash
npm run build        # outputs static site to dist/
npm run preview      # preview the production build
```

## Editing content

- Research streams: `src/data/research.js`
- Publications: `src/data/publications.js` (one object per paper; `stream` must match a research id)
- Courses: `courses` array in `src/pages/teaching.astro`
- Bio / quick links: `src/components/Hero.astro` and `src/pages/index.astro`
- Replace `public/headshot.jpg` and `public/cv.pdf` with real files (keep the same names).

## Deploy

Static output in `dist/`. Deploy to Vercel or GitHub Pages (custom domain at root) — TBD.
```

- [ ] **Step 2: Full clean build and verify all four pages**

```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh";
rm -rf dist && npm run build
for f in index research/index teaching/index cv/index; do
  test -f "dist/$f.html" && echo "OK dist/$f.html" || echo "MISSING dist/$f.html"
done
```

Expected: build exits 0 and prints four `OK` lines, no `MISSING`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README with Astro workflow and editing guide"
```

- [ ] **Step 4: Push to GitHub**

```bash
git push
```

Expected: pushes all commits to `origin/main`.

---

## Done criteria

- `npm run build` succeeds from a clean tree.
- All four pages (`/`, `/research`, `/teaching`, `/cv`) build and contain expected content.
- Site styled in OU crimson, Inter + Public Sans, hero + three research cards on home.
- Placeholders in place for headshot, CV PDF, Google Scholar URL, and teaching courses, each marked with a `TODO(user)` or documented in the README.
- All work committed and pushed to `origin/main`.
