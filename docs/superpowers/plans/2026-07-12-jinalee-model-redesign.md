# jinalee.org-Model Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild jeongjinkim.com as a bilingual (EN/KO) academic site that follows jinalee.org's template — sticky header with text-size control and language pill, four tabs, long Home page, full HTML CV — styled with a warm palette and OU crimson non-text accents.

**Architecture:** Astro 4 static site (existing project). One shared `Layout.astro` (head scripts, fonts, hreflang) wrapping `Header`/`Footer` components; content pages at `/`, `/research/`, `/teaching/`, `/cv/` mirrored under `/ko/`. Publications and CV content live in `src/data/` modules consumed by both languages. Only client-side JS: an inline font-scale snippet in `<head>` plus the header's text-size widget.

**Tech Stack:** Astro ^4.15 (`output: 'static'`), vanilla JS, Google Fonts (Inter, Source Serif 4, IBM Plex Mono) + Pretendard CDN. Deploy: Vercel via GitHub push (branch → preview URL).

**Spec:** `docs/superpowers/specs/2026-07-12-jinalee-model-redesign-design.md` — read it before starting.

## Global Constraints

- Node is installed via nvm: run `source ~/.nvm/nvm.sh && nvm use --lts` in any shell that runs `npm`/`astro`.
- Base font size **135%** on `html`; the A−/A+ widget multiplies it by a scale in `localStorage` key **`jk-font-scale`**, clamped to **0.75–1.5**.
- OU crimson `#841617` (hover `#6d1213`) appears ONLY on non-text elements: active-tab underline, Email button fill, link underlines, PhD-panel left edge. Never as a text/word color.
- Palette tokens (verbatim from spec): bg `#f8f6f3`; surface `#fff`; borders `#e5e0d8`/`#efebe4`; text `#2b2723`; secondary `#6b6459`; muted `#8d857a`; hero statement `#4a443c`. Content max-width 760px; nav height 64px.
- Tabs, in order: Home, Research, Teaching, CV — **English labels on both languages**.
- Hero/footer buttons, in order: **Email (crimson fill), CV, Google Scholar, LinkedIn** — English labels on both languages.
- Links: Email `mailto:jjkim@ou.edu`; Scholar `https://scholar.google.com/citations?user=3312EoQAAAAJ&hl=en`; LinkedIn `https://www.linkedin.com/in/jeongjinjjkim/`; CV PDF `/cv.pdf`.
- Korean name **김정진** (no ", Ph.D."). All drafted Korean copy is subject to user review before merge — do not merge to `main` without it.
- Citations are APA style. No emojis anywhere. No new npm dependencies. No `try/catch` that hides build errors (the two tiny localStorage try/catches in this plan are the model's own pattern and are allowed).
- The PhD note everywhere is: "I do not plan to admit a PhD student for Fall 2027." (Fall 2026 recruitment text must not survive anywhere.)
- Home shows **published work only** — no Work in Progress / R&R section (R&R entries appear only inside the CV page).

## File Structure

```
astro.config.mjs                 modify: add /contact redirect
src/styles/global.css            rewrite: tokens, header/footer, hero, sections, CV rows, responsive
src/layouts/Layout.astro         rewrite: head (fonts, hreflang, font-scale script), Header/Footer, slot
src/components/Header.astro      create: logotype, text-size widget, lang pill, tabs (+ widget JS)
src/components/Footer.astro      create: copyright + Email/Scholar/LinkedIn
src/components/PubList.astro     create: renders a publications array
src/components/CvBody.astro      create: renders cvSections rows (lang-aware headings)
src/components/Nav.astro         delete (replaced by Header)
src/data/site.js                 create: EMAIL, SCHOLAR_URL, LINKEDIN_URL constants
src/data/publications.js         create: 9 APA citations with DOIs + stream tags
src/data/cv.js                   create: full CV sections transcribed from public/cv.pdf
src/pages/index.astro            rewrite: EN Home (hero, About, PhD note, Publications, Teaching teaser)
src/pages/research.astro         rewrite: EN Research (3 streams + Related work)
src/pages/teaching.astro         rewrite: EN Teaching (2 OU courses)
src/pages/cv.astro               rewrite: EN CV (buttons + CvBody)
src/pages/ko/index.astro         create: KO Home
src/pages/ko/research.astro      create: KO Research
src/pages/ko/teaching.astro      create: KO Teaching
src/pages/ko/cv.astro            create: KO CV
src/pages/contact.astro          delete (redirect via astro.config)
```

There is no JS test framework in this repo and the site is pure static content; the test cycle for every task is `npm run build` plus `grep` assertions against `dist/` output, run before and after each change.

---

### Task 1: Branch, working-tree cleanup, CV re-extraction

**Files:**
- No source edits. Git state + `.superpowers/cv-layout.txt` (gitignored scratch).

**Interfaces:**
- Produces: branch `jinalee-redesign` off `main`; committed real `public/cv.pdf` + `public/portrait.jpg`; `.superpowers/cv-layout.txt` — the column-faithful CV text every later task uses to verify year/amount pairings.

- [ ] **Step 1: Verify starting state**

Run: `cd ~/projects/jeongjinkim.com && git status --short && git log --oneline -1`
Expected: modified `src/…` files (abandoned WIP), modified `public/cv.pdf`, untracked `public/portrait.jpg`. Current branch `main`.

- [ ] **Step 2: Create branch and discard the WIP (keep cv.pdf and portrait.jpg)**

```bash
git checkout -b jinalee-redesign
git checkout -- src/
git status --short
```
Expected after: only ` M public/cv.pdf` and `?? public/portrait.jpg` remain. (`git checkout -- src/` discards ONLY the abandoned hero-redesign WIP per spec; do not touch `public/`.)

- [ ] **Step 3: Commit the kept assets**

```bash
git add public/cv.pdf public/portrait.jpg
git commit -m "Add real CV PDF (June 2026) and portrait asset"
```

- [ ] **Step 4: Install poppler and re-extract the CV with layout preserved**

The PDF's right-hand year/amount columns garble naive extraction; `pdftotext -layout` preserves them.

```bash
brew install poppler
pdftotext -layout public/cv.pdf .superpowers/cv-layout.txt
wc -l .superpowers/cv-layout.txt
```
Expected: file created, roughly 300–450 lines. `.superpowers/` is already gitignored.

- [ ] **Step 5: Sanity-check the extraction**

Run: `grep -n "1,871,692\|Assistant Professor of Psychology\|Dean" .superpowers/cv-layout.txt | head`
Expected: hits for the NSF award amount, the OU appointment, and the Dean's List entry, with years/amounts visually aligned to their rows. If `brew install poppler` fails (no network/permissions), STOP and tell the user — Task 8's pairing verification depends on this file.

- [ ] **Step 6: Verify the site still builds**

```bash
source ~/.nvm/nvm.sh && nvm use --lts
npm run build
```
Expected: `Complete!` with 5 pages built (old design — that's fine for now).

---

### Task 2: Data modules — site links and publications

**Files:**
- Create: `src/data/site.js`
- Create: `src/data/publications.js`

**Interfaces:**
- Produces: `EMAIL`, `SCHOLAR_URL`, `LINKEDIN_URL` (strings) from `site.js`; `publications` (array, newest first) from `publications.js`, each item `{ year: number, streams: string[], doi: string|null, html: string, note?: string }`. `html` is a complete APA citation with `<strong>Kim, J. J.</strong>` and `<i>Journal, vol</i>` markup, ending in a period, WITHOUT the DOI (rendered separately). `streams` values: `'i' | 'ii' | 'iii'`.

- [ ] **Step 1: Write `src/data/site.js`**

```js
export const EMAIL = 'jjkim@ou.edu';
export const SCHOLAR_URL = 'https://scholar.google.com/citations?user=3312EoQAAAAJ&hl=en';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/jeongjinjjkim/';
```

- [ ] **Step 2: Write `src/data/publications.js`**

All nine peer-reviewed publications from the CV, by recency. Stream tags drive the Research page's Related work lists (user reviews the mapping): i = person–situation, ii = attitudes/affect, iii = performance behavior.

```js
export const publications = [
  {
    year: 2025, streams: ['ii'],
    doi: 'https://doi.org/10.1007/s41542-025-00232-3',
    html: 'Aitken, J. A., Zhu, Z., Baines, J. I., <strong>Kim, J. J.</strong>, Kaplan, S. A., Dalal, R. S., Hassani, J., &amp; Gibson, J. L. (2025). Emotion regulation at work: A micro-randomized trial comparing three cognitive reappraisal interventions. <i>Occupational Health Science, 9</i>, 991&ndash;1021.',
  },
  {
    year: 2025, streams: ['iii'],
    doi: 'https://doi.org/10.1007/s12144-025-08136-9',
    html: 'Aitken, J. A., Dalal, R. S., <strong>Kim, J. J.</strong>, &amp; Zhu, Z. (2025). The self-regulation of counterproductive work behavior: A conceptual replication of Aitken et al. (2024). <i>Current Psychology, 44</i>, 15510&ndash;15514.',
  },
  {
    year: 2025, streams: ['ii'],
    doi: 'https://doi.org/10.1007/s12144-025-07788-x',
    html: '<strong>Kim, J. J.</strong>, Kaplan, S. A., Aitken, J. A., &amp; Ponce, L. P. (2025). An examination of the daily relationship between job boredom and later burnout and turnover intentions along with mitigating strategies. <i>Current Psychology, 44</i>, 8807&ndash;8822.',
  },
  {
    year: 2025, streams: ['ii'],
    doi: 'http://dx.doi.org/10.1111/joop.70020',
    html: 'Zhu, Z., Aitken, J. A., <strong>Kim, J. J.</strong>, Baines, J. I., Kaplan, S. A., Dalal, R. S., &amp; Hassani, J. (2025). The emotion regulation intervention in the workplace: An ecological momentary approach and its impact on employee job performance. <i>Journal of Occupational and Organizational Psychology, 98</i>, e70020.',
  },
  {
    year: 2024, streams: ['i'],
    doi: 'https://doi.org/10.1093/obo/9780199828340-0327',
    html: '<strong>Kim, J. J.</strong>, Son, M., &amp; Dalal, R. S. (2024). Situational strength. <i>Oxford Bibliographies in Psychology</i>. New York: Oxford University Press.',
  },
  {
    year: 2024, streams: ['ii', 'iii'],
    doi: 'https://doi.org/10.1007/s42761-024-00256-y',
    html: '<strong>Kim, J. J.</strong>, Kaplan, S. A., Aitken, J. A., &amp; Ponce, L. P. (2024). Within-person dynamics of job boredom and counterproductive work behavior: A latent change score modeling approach. <i>Affective Science, 5</i>, 273&ndash;279.',
  },
  {
    year: 2024, streams: ['ii'],
    doi: 'https://doi.org/10.1111/joop.12502',
    note: 'Top 10 most-cited paper published by the journal in 2024',
    html: 'Park, J., Woo, S. E., &amp; <strong>Kim, J. J.</strong> (2024). Attitudes toward artificial intelligence application at work: Scale development and validation. <i>Journal of Occupational and Organizational Psychology, 97</i>(3), 920&ndash;951.',
  },
  {
    year: 2021, streams: ['ii', 'iii'],
    doi: 'https://doi.org/10.1177/0894845319853879',
    html: '<strong>Kim, J. J.</strong>, Park, J., Sohn, Y. W., &amp; Lim, J. I. (2021). Perceived overqualification, boredom, and extra-role behaviors: Testing a moderated mediation model. <i>Journal of Career Development, 48</i>(4), 400&ndash;414.',
  },
  {
    year: 2018, streams: [],
    doi: 'https://doi.org/10.17315/kjhp.2018.23.2.003',
    html: 'Shin, S. M., Song, Y. S., <strong>Kim, J. J.</strong>, &amp; Oh, J. S. (2018). The relationship between impulsiveness and smartphone addiction among adolescents: Focused on the possible application of delay discounting task. <i>The Korean Journal of Health Psychology, 23</i>(2), 345&ndash;363.',
  },
];
```

- [ ] **Step 3: Verify the modules parse and the build still passes**

```bash
node --input-type=module -e "import('./src/data/publications.js').then(m => console.log(m.publications.length))"
npm run build
```
Expected: `9`, then `Complete!`.

- [ ] **Step 4: Commit**

```bash
git add src/data/site.js src/data/publications.js
git commit -m "Add site links and publications data modules"
```

---

### Task 3: Global styles, Layout, Header, Footer

**Files:**
- Rewrite: `src/styles/global.css`
- Rewrite: `src/layouts/Layout.astro`
- Create: `src/components/Header.astro`, `src/components/Footer.astro`
- Delete: `src/components/Nav.astro`

**Interfaces:**
- Consumes: `EMAIL`, `SCHOLAR_URL`, `LINKEDIN_URL` from Task 2.
- Produces: `Layout.astro` props `{ title: string, description?: string, lang?: 'en'|'ko' (default 'en'), active?: 'home'|'research'|'teaching'|'cv' (default 'home'), enPath?: string (default '/') }`. `enPath` is the English route of the page ('/', '/research/', '/teaching/', '/cv/'); Layout derives the KO route as `'/ko' + enPath` (KO home `'/ko/'`) for hreflang and the language pill. CSS classes later tasks rely on: `hero`, `hero-text`, `hero-role`, `hero-affil`, `hero-statement`, `hero-links`, `hero-headshot`, `btn`, `btn primary`, `sec-label`, `phd-note`, `pub`, `pub-note`, `doi`, `arrow-link`, `stream`, `course`, `cv-actions`, `cv-row`, `cv-label`, `cv-body`, `cv-note`, `serif`, `mono`.

- [ ] **Step 1: Rewrite `src/styles/global.css`**

```css
:root {
  --bg: #f8f6f3;
  --surface: #fff;
  --border: #e5e0d8;
  --border-light: #efebe4;
  --text: #2b2723;
  --text-secondary: #6b6459;
  --text-muted: #8d857a;
  --text-statement: #4a443c;
  --crimson: #841617;
  --crimson-hover: #6d1213;
  --max-width: 760px;
  --nav-height: 64px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace;
}

* { box-sizing: border-box; }

html { font-size: 135%; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  line-height: 1.75;
}

body.ko { font-family: 'Pretendard Variable', var(--font-sans); }

.serif { font-family: var(--font-serif); }
body.ko .serif { font-family: 'Pretendard Variable', var(--font-serif); }
.mono { font-family: var(--font-mono); }

a { color: inherit; }
main a:not(.btn):not(.tab):not(.lang-pill) {
  text-decoration: none;
  border-bottom: 1.5px solid var(--crimson);
  padding-bottom: 1px;
}
main a:not(.btn):not(.tab):not(.lang-pill):hover { border-bottom-color: var(--crimson-hover); }

h1, h2, h3 { font-weight: 600; line-height: 1.25; }

/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  max-width: calc(var(--max-width) + 3rem);
  margin: 0 auto;
  min-height: var(--nav-height);
  padding: 0.35rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.logotype {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
body.ko .logotype { font-family: 'Pretendard Variable', var(--font-serif); font-weight: 700; }
.header-right { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
.fs-ctl {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  padding: 0.1rem 0.3rem;
}
.fs-label { font-size: 0.55rem; color: var(--text-muted); padding-right: 0.2rem; }
.fs-ctl button {
  font: inherit;
  font-size: 0.6rem;
  background: none;
  border: 0;
  padding: 0.15rem 0.3rem;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 4px;
}
.fs-ctl button:hover { background: var(--border-light); color: var(--text); }
#fs-value { font-family: var(--font-mono); font-size: 0.55rem; }
.lang-pill {
  font-size: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
}
.lang-pill:hover { color: var(--text); border-color: var(--text-muted); }
.site-header nav { display: flex; gap: 1rem; }
.tab {
  font-size: 0.65rem;
  text-decoration: none;
  color: var(--text-secondary);
  padding: 0.35rem 0;
  border-bottom: 2px solid transparent;
}
.tab:hover { color: var(--text); }
.tab.on { color: var(--text); font-weight: 600; border-bottom-color: var(--crimson); }

/* Layout */
main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2.2rem 1.5rem 3rem;
}
main section + section { margin-top: 2.4rem; }
.sec-label {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 0.9rem;
}

/* Hero */
.hero { display: flex; gap: 2rem; align-items: flex-start; }
.hero-text { flex: 1; min-width: 0; }
.hero h1 { font-size: 1.6rem; margin: 0 0 0.4rem; }
.hero h1 .phd { font-weight: 400; color: var(--text-secondary); }
.hero-role { font-size: 0.75rem; margin: 0 0 0.1rem; }
.hero-affil { font-size: 0.7rem; color: var(--text-secondary); margin: 0 0 0.9rem; }
.hero-statement {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--text-statement);
  margin: 0 0 1.1rem;
}
body.ko .hero-statement { font-style: normal; }
.hero-links { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.btn {
  font-size: 0.62rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
}
.btn:hover { border-color: var(--text-muted); }
.btn.primary { background: var(--crimson); border-color: var(--crimson); color: #fff; }
.btn.primary:hover { background: var(--crimson-hover); border-color: var(--crimson-hover); }
.hero-headshot {
  width: 270px;
  max-width: 38vw;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(43, 39, 35, 0.14);
}

/* Home sections */
.phd-note {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--crimson);
  border-radius: 0 6px 6px 0;
  padding: 0.55rem 0.8rem;
  margin-top: 1rem;
}
.phd-note p { margin: 0; font-size: 0.68rem; color: var(--text-statement); }

.pub { font-size: 0.68rem; line-height: 1.7; padding: 0.6rem 0; border-bottom: 1px solid var(--border-light); }
.pub:last-child { border-bottom: 0; }
.pub p { margin: 0; display: inline; }
.doi { font-size: 0.62rem; white-space: nowrap; margin-left: 0.3rem; }
.pub-note { display: block; font-size: 0.6rem; color: var(--text-muted); margin-top: 0.15rem; }
.arrow-link { font-weight: 500; }

/* Research */
.stream { margin-top: 1.6rem; }
.stream h2 { font-size: 0.95rem; margin: 0 0 0.5rem; }
.stream p { font-size: 0.72rem; }
.related-label {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0.9rem 0 0.2rem;
}

/* Teaching */
.course { margin-top: 1.4rem; }
.course h2 { font-size: 0.85rem; margin: 0 0 0.3rem; }
.course .term { font-size: 0.62rem; color: var(--text-muted); font-style: italic; margin: 0 0 0.4rem; }
.course p { font-size: 0.72rem; margin: 0; }

/* CV */
.cv-actions { display: flex; gap: 0.45rem; flex-wrap: wrap; margin: 0.8rem 0 0.4rem; }
.cv-updated { font-size: 0.65rem; color: var(--text-secondary); margin: 0; }
.cv-section { margin-top: 2rem; }
.cv-note { font-size: 0.62rem; color: var(--text-muted); font-style: italic; margin: 0 0 0.5rem; }
.cv-row { display: flex; gap: 1rem; padding: 0.45rem 0; border-bottom: 1px solid var(--border-light); }
.cv-row:last-child { border-bottom: 0; }
.cv-label { flex: 0 0 4.2rem; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-muted); padding-top: 0.1rem; }
.cv-body { flex: 1; font-size: 0.68rem; line-height: 1.7; min-width: 0; }
.cv-body p { margin: 0 0 0.3rem; }
.cv-body ul { margin: 0.2rem 0 0; padding-left: 1rem; }

/* Page titles */
.page-title { font-size: 1.25rem; margin: 0 0 0.6rem; }
.page-intro { font-size: 0.75rem; color: var(--text-statement); }

/* Footer */
.site-footer { border-top: 1px solid var(--border); margin-top: 1rem; }
.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0.9rem 1.5rem 1.4rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.6rem;
  color: var(--text-muted);
}
.footer-links { display: flex; gap: 0.9rem; }
.footer-links a { text-decoration: none; border-bottom: 1.5px solid var(--crimson); padding-bottom: 1px; }

/* Mobile */
@media (max-width: 720px) {
  .header-inner { flex-direction: column; align-items: center; padding: 0.6rem 1rem; }
  .hero { flex-direction: column-reverse; align-items: center; text-align: center; }
  .hero-links { justify-content: center; }
  .hero-headshot { max-width: 60vw; }
  .cv-row { flex-direction: column; gap: 0.1rem; }
  .cv-label { flex: none; }
}
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
import { EMAIL, SCHOLAR_URL, LINKEDIN_URL } from '../data/site.js';
const { lang = 'en' } = Astro.props;
---
<footer class="site-footer">
  <div class="footer-inner">
    <span>&copy; 2026 {lang === 'ko' ? '김정진' : 'JeongJin Kim'}</span>
    <span class="footer-links">
      <a href={`mailto:${EMAIL}`}>Email</a>
      <a href={SCHOLAR_URL} target="_blank" rel="noopener">Google Scholar</a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn</a>
    </span>
  </div>
</footer>
```

- [ ] **Step 3: Create `src/components/Header.astro`**

Button order and English tab labels are fixed by the spec. The widget script is inline vanilla JS (no framework).

```astro
---
const { lang = 'en', active = 'home', altPath = '/ko/' } = Astro.props;
const prefix = lang === 'ko' ? '/ko' : '';
const tabs = [
  { key: 'home', label: 'Home', href: lang === 'ko' ? '/ko/' : '/' },
  { key: 'research', label: 'Research', href: `${prefix}/research/` },
  { key: 'teaching', label: 'Teaching', href: `${prefix}/teaching/` },
  { key: 'cv', label: 'CV', href: `${prefix}/cv/` },
];
---
<header class="site-header">
  <div class="header-inner">
    <a class="logotype" href={lang === 'ko' ? '/ko/' : '/'}>{lang === 'ko' ? '김정진' : 'JeongJin Kim'}</a>
    <div class="header-right">
      <div class="fs-ctl" role="group" aria-label={lang === 'ko' ? '글자 크기' : 'Text size'}>
        <span class="fs-label">{lang === 'ko' ? '글자 크기' : 'Text size'}</span>
        <button id="fs-dec" type="button" aria-label="Decrease text size">A&minus;</button>
        <button id="fs-reset" type="button" aria-label="Reset text size"><span id="fs-value">100%</span></button>
        <button id="fs-inc" type="button" aria-label="Increase text size">A+</button>
      </div>
      <a class="lang-pill" href={altPath} rel="alternate" hreflang={lang === 'ko' ? 'en' : 'ko'}>{lang === 'ko' ? 'ENG' : 'KOR'}</a>
      <nav aria-label="Main">
        {tabs.map((t) => (
          <a class:list={['tab', { on: active === t.key }]} href={t.href} aria-current={active === t.key ? 'page' : undefined}>{t.label}</a>
        ))}
      </nav>
    </div>
  </div>
</header>
<script is:inline>
  (function () {
    var KEY = 'jk-font-scale';
    var BASE = 135, MIN = 0.75, MAX = 1.5, STEP = 0.1;
    function get() {
      try {
        var s = parseFloat(localStorage.getItem(KEY));
        return s >= MIN && s <= MAX ? s : 1;
      } catch (e) { return 1; }
    }
    function apply(s) {
      document.documentElement.style.fontSize = BASE * s + '%';
      document.getElementById('fs-value').textContent = Math.round(s * 100) + '%';
      try { localStorage.setItem(KEY, String(s)); } catch (e) {}
    }
    function nudge(d) {
      var s = Math.round((get() + d * STEP) * 100) / 100;
      apply(Math.min(MAX, Math.max(MIN, s)));
    }
    document.getElementById('fs-dec').addEventListener('click', function () { nudge(-1); });
    document.getElementById('fs-inc').addEventListener('click', function () { nudge(1); });
    document.getElementById('fs-reset').addEventListener('click', function () { apply(1); });
    document.getElementById('fs-value').textContent = Math.round(get() * 100) + '%';
  })();
</script>
```

- [ ] **Step 4: Rewrite `src/layouts/Layout.astro`**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

const { title, description = '', lang = 'en', active = 'home', enPath = '/' } = Astro.props;
const koPath = enPath === '/' ? '/ko/' : `/ko${enPath}`;
const currentPath = lang === 'en' ? enPath : koPath;
const altPath = lang === 'en' ? koPath : enPath;
const site = 'https://jeongjinkim.com';
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <meta name="author" content="JeongJin Kim" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={site + currentPath} />
    <link rel="alternate" hreflang="en" href={site + enPath} />
    <link rel="alternate" hreflang="ko" href={site + koPath} />
    <script is:inline>
      try {
        var s = parseFloat(localStorage.getItem('jk-font-scale'));
        if (s && s > 0.5 && s < 2 && s !== 1) {
          document.documentElement.style.fontSize = 135 * s + '%';
        }
      } catch (e) {}
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
    {lang === 'ko' && <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" rel="stylesheet" />}
  </head>
  <body class:list={[{ ko: lang === 'ko' }]}>
    <Header lang={lang} active={active} altPath={altPath} />
    <main>
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 5: Delete the old Nav component**

```bash
git rm src/components/Nav.astro
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
grep -c 'jk-font-scale' dist/index.html
grep -o 'hreflang="ko" href="[^"]*"' dist/index.html
grep -c 'fonts.googleapis.com' dist/index.html
```
Expected: build `Complete!`; `jk-font-scale` count ≥ 2 (head script + widget); `hreflang="ko" href="https://jeongjinkim.com/ko/"`; fonts link present. The old pages render inside the new chrome with unstyled-but-valid content — full page rewrites come next.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "New layout: warm tokens, sticky header with text-size control and language pill, footer"
```

---

### Task 4: PubList component + Home page (EN)

**Files:**
- Create: `src/components/PubList.astro`
- Rewrite: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Layout` props from Task 3; `publications`, `EMAIL`, `SCHOLAR_URL`, `LINKEDIN_URL` from Task 2.
- Produces: `PubList.astro` with props `{ pubs: array }` — renders each pub as `.pub` div with citation html, DOI link, optional note. Used again by Research (Task 5) and the KO pages (Task 7).

- [ ] **Step 1: Create `src/components/PubList.astro`**

```astro
---
const { pubs } = Astro.props;
---
<div class="pub-list">
  {pubs.map((p) => (
    <div class="pub">
      <p set:html={p.html} />
      {p.doi && <a class="doi" href={p.doi} target="_blank" rel="noopener">DOI &nearr;</a>}
      {p.note && <span class="pub-note">[{p.note}]</span>}
    </div>
  ))}
</div>
```

- [ ] **Step 2: Rewrite `src/pages/index.astro`**

Hero title lines, button order, About text (verbatim, first sentence removed), PhD note, publications only, teaching teaser — all fixed by the spec.

```astro
---
import Layout from '../layouts/Layout.astro';
import PubList from '../components/PubList.astro';
import { publications } from '../data/publications.js';
import { EMAIL, SCHOLAR_URL, LINKEDIN_URL } from '../data/site.js';
---
<Layout
  title="JeongJin Kim | Industrial-Organizational Psychologist"
  description="Industrial-Organizational Psychologist and Assistant Professor of Psychology at the University of Oklahoma. Research on person-situation interactions, job attitudes and affect, and work performance behavior."
  lang="en"
  active="home"
  enPath="/"
>
  <section class="hero">
    <div class="hero-text">
      <h1 class="serif">JeongJin Kim<span class="phd">, Ph.D.</span></h1>
      <p class="hero-role">Industrial-Organizational Psychologist</p>
      <p class="hero-role">Assistant Professor of Psychology</p>
      <p class="hero-affil">The University of Oklahoma</p>
      <p class="hero-statement serif">I study what shapes employees&rsquo; performance behavior and well-being in the workplace.</p>
      <div class="hero-links">
        <a class="btn primary" href={`mailto:${EMAIL}`}>Email</a>
        <a class="btn" href="/cv/">CV</a>
        <a class="btn" href={SCHOLAR_URL} target="_blank" rel="noopener">Google Scholar</a>
        <a class="btn" href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
    <img class="hero-headshot" src="/headshot.jpg" alt="JeongJin Kim" width="270" height="331" />
  </section>

  <section>
    <h2 class="sec-label">About</h2>
    <p>
      I am interested in what shapes employees&rsquo; performance behavior and well-being, as well
      as the why&rsquo;s and how&rsquo;s. Specifically, my work primarily focuses on these three
      interconnected areas:
    </p>
    <ul>
      <li>Person&ndash;situation interactions, with a particular emphasis on situation (e.g., situational strength, substance characteristics),</li>
      <li>Job attitudes and affect/emotions (e.g., work engagement, job boredom), and</li>
      <li>Individual work performance behavior (e.g., counterproductive work behavior, organizational citizenship behavior)</li>
    </ul>
    <div class="phd-note">
      <p><strong>Prospective PhD students:</strong> I do not plan to admit a PhD student for Fall 2027.</p>
    </div>
  </section>

  <section>
    <h2 class="sec-label">Publications</h2>
    <PubList pubs={publications} />
  </section>

  <section>
    <h2 class="sec-label">Teaching</h2>
    <p>I teach undergraduate courses in statistics and industrial-organizational psychology at the University of Oklahoma.</p>
    <p><a class="arrow-link" href="/teaching/">Teaching &rarr;</a></p>
  </section>
</Layout>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
grep -c 'DOI &#8599;\|DOI ↗' dist/index.html
grep -c 'Industrial-Organizational Psychologist' dist/index.html
grep -c 'Fall 2027' dist/index.html
grep -ci 'work in progress\|R&amp;R\|Fall 2026' dist/index.html
grep -c 'width="270"' dist/index.html
```
Expected: build `Complete!`; DOI count 9; psychologist line ≥ 1; Fall 2027 = 1; the third grep returns 0 (no WIP/R&R/Fall 2026 on Home); headshot width present. Also verify button order: `grep -o '<a class="btn[^>]*>[^<]*</a>' dist/index.html | head -4` → Email, CV, Google Scholar, LinkedIn with `primary` on Email.

- [ ] **Step 4: Commit**

```bash
git add src/components/PubList.astro src/pages/index.astro
git commit -m "Rebuild Home: hero, About, PhD note, publications, teaching teaser"
```

---

### Task 5: Research page (EN)

**Files:**
- Rewrite: `src/pages/research.astro`

**Interfaces:**
- Consumes: `Layout`, `PubList`, `publications` (filtered by `streams`).

- [ ] **Step 1: Rewrite `src/pages/research.astro`**

Stream paragraphs are the committed text from `git show 8100770:src/pages/research.astro`, reproduced verbatim below. Related work = publications tagged with each stream id.

```astro
---
import Layout from '../layouts/Layout.astro';
import PubList from '../components/PubList.astro';
import { publications } from '../data/publications.js';

const streams = [
  {
    id: 'i',
    title: 'Person–Situation Interactions',
    body: `The first area of my interest is the interplay between personal and situational characteristics, hence person–situation interactions (aka. interactionism). I study person–situation interactions as they pertain to workplace settings, with an emphasis on the situation side. Specifically, I am interested in situational strength (i.e., strong versus weak situations) and its impact on individual work performance. Through multiple studies, I examined situational strength both as a traditional moderator of personality–job performance relationships and as a novel antecedent that directly influences employee outcomes. Some of my ongoing projects in this area include an integrative conceptual review aimed at synthesizing situational and personality strength literatures and a short measure development of situational strength for experience sampling contexts.`,
  },
  {
    id: 'ii',
    title: 'Attitudes and Affect/Emotions at Work',
    body: `My work in this topic broadly involves job attitudes and affect, but more specifically job boredom and work engagement. I am interested in why and how boredom is experienced at work and the underlying mechanisms that explain its relationships with employee performance outcomes and well-being outcomes. Additionally, my colleagues and I developed and tested ecological momentary interventions for emotion regulation, specifically cognitive reappraisal interventions that help employees manage workplace emotions and improve job performance through enhanced positive affect and reduced negative affect. In current projects, I study within-person associations between personality and work engagement, psychosocial effects of boredom and its implications in organizations, and relationships between job boredom and extra-role behaviors.`,
  },
  {
    id: 'iii',
    title: 'Employee Performance Behavior',
    body: `This last area of interest is closely related to the above two areas. The construct of job performance is complex and multifaceted, but here, my interest largely revolves around extra-role performance behavior such as organizational citizenship behavior and counterproductive work behavior. Specifically, I primarily focus on cognitive, affective, and social factors that influence, or are influenced by, employee performance, as well as boundary conditions that can help or harm performance. A current project in this realm revisits the criterion space and whether (and if so, to what extent) it has changed over time, given the increasingly changing nature of work today. In another project, my colleagues and I examine antecedents and outcomes of individuals' boundary-spanning behavior.`,
  },
];
---
<Layout
  title="Research | JeongJin Kim"
  description="Research programs: person-situation interactions, job attitudes and affect/emotions, and employee performance behavior."
  lang="en"
  active="research"
  enPath="/research/"
>
  <h1 class="page-title serif">Research</h1>
  <p class="page-intro">Below, I summarize my key programs of research that are interconnected.</p>

  {streams.map((s) => (
    <section class="stream">
      <h2 class="serif">{s.title}</h2>
      <p>{s.body}</p>
      {publications.some((p) => p.streams.includes(s.id)) && (
        <>
          <p class="related-label">Related work</p>
          <PubList pubs={publications.filter((p) => p.streams.includes(s.id))} />
        </>
      )}
    </section>
  ))}
</Layout>
```

Note: the committed paragraphs cited in-progress work as "(Kim et al., under review)" etc.; those parentheticals are removed above because the site no longer lists under-review work (spec: published work only). Everything else is verbatim.

- [ ] **Step 2: Build and verify**

```bash
npm run build
grep -c 'Related work' dist/research/index.html
grep -c 'class="pub"' dist/research/index.html
grep -ci 'under review' dist/research/index.html
```
Expected: `Related work` = 3; pub count = 8 (1 + 4 + 3 across streams; the Shin 2018 adolescent paper is untagged by design); `under review` = 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/research.astro
git commit -m "Rebuild Research: three streams with related-work lists"
```

---

### Task 6: Teaching page (EN)

**Files:**
- Rewrite: `src/pages/teaching.astro`

**Interfaces:**
- Consumes: `Layout`. Course descriptions are the committed text; terms from the CV (PSY 2003: Fall 2025; PSY 3753: Fall 2025, Spring 2026).

- [ ] **Step 1: Rewrite `src/pages/teaching.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout
  title="Teaching | JeongJin Kim"
  description="Undergraduate courses in statistics and industrial-organizational psychology at the University of Oklahoma."
  lang="en"
  active="teaching"
  enPath="/teaching/"
>
  <h1 class="page-title serif">Teaching</h1>
  <p class="sec-label" style="margin-top:1.4rem;">The University of Oklahoma</p>

  <div class="course">
    <h2 class="serif">PSY 2003 &mdash; Understanding Statistics</h2>
    <p class="term">Fall 2025</p>
    <p>
      This course is an introductory applied statistics course that focuses on two aspects of
      one's statistics journey: (a) fostering one's statistical literacy (i.e., making sense of
      data and the statistics used to interpret them) and (b) learning about descriptive and
      inferential statistical methods. Topics include, but are not limited to, research design,
      measurement, sampling procedures, standard normal distribution, correlation, regression,
      probability, sampling distributions, and hypothesis testing/error/power.
    </p>
  </div>

  <div class="course">
    <h2 class="serif">PSY 3753 &mdash; Introduction to Industrial-Organizational Psychology</h2>
    <p class="term">Fall 2025; Spring 2026</p>
    <p>
      This course covers psychological theories and their practical applications to the
      workplace. The course covers issues of critical relevance to the well-being of individuals
      and organizational performance. Topics include, but are not limited to, history of I-O,
      research methods in I-O, criteria &amp; job analysis, predictors (psychological assessments),
      personnel decisions, organizational learning/development, performance management,
      leadership, teams &amp; teamwork, organizational change, affect, attitudes, and behavior at
      work, work motivation, and workplace psychological health.
    </p>
  </div>
</Layout>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
grep -c 'class="course"' dist/teaching/index.html
grep -c 'Spring 2026' dist/teaching/index.html
```
Expected: 2 courses; Spring 2026 present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/teaching.astro
git commit -m "Rebuild Teaching: OU courses with terms"
```

---

### Task 7: CV data + CV page (EN)

**Files:**
- Create: `src/data/cv.js`
- Create: `src/components/CvBody.astro`
- Rewrite: `src/pages/cv.astro`

**Interfaces:**
- Consumes: `publications` from Task 2 (reused inside `cv.js` for the publications section).
- Produces: `cv.js` exports `cvUpdated = { en: 'June 4, 2026', ko: '2026년 6월 4일' }` and `cvSections` — array of `{ id, en, ko, note?, items: [{ label, html }] }`. `CvBody.astro` props `{ lang: 'en'|'ko' }` renders all sections. Used again by the KO CV page (Task 8).

**IMPORTANT — pairing verification:** The PDF sets years and dollar amounts in a right-hand column; the pairings for Grants, Awards & Honors, and Service below were drafted from a garbled extraction. Before committing, verify EVERY year and amount in those three sections against `.superpowers/cv-layout.txt` (from Task 1), which preserves the columns, and correct any mismatch. Do not invent or leave a wrong number: if a pairing is still ambiguous in the layout extraction, put the string `[VERIFY]` next to it and list it for the user at the end of the task. Other sections (education, publications, presentations, teaching, affiliations) extracted cleanly.

- [ ] **Step 1: Write `src/data/cv.js`**

```js
import { publications } from './publications.js';

export const cvUpdated = { en: 'June 4, 2026', ko: '2026년 6월 4일' };

const p = (s) => s; // readability no-op for long strings

export const cvSections = [
  {
    id: 'appointment', en: 'Academic Appointment', ko: '재직',
    items: [
      { label: '2025–', html: p('<strong>Assistant Professor of Psychology</strong><br>The University of Oklahoma (Norman, OK)<br>August 2025 – present') },
    ],
  },
  {
    id: 'education', en: 'Education', ko: '학력',
    items: [
      { label: '2025', html: p('<strong>Ph.D. Industrial-Organizational Psychology</strong>, George Mason University<br>Advisors: Reeshad S. Dalal, Ph.D. (Chair), Seth A. Kaplan, Ph.D., and Sarah M. Wittman, Ph.D.<br>Dissertation: <i>Conditions under which the behavior of employees with attention-deficit/hyperactivity disorder is misperceived as low job performance</i>') },
      { label: '2022', html: p('<strong>M.A. Industrial-Organizational Psychology</strong> (concurrent degree with Ph.D.), George Mason University') },
      { label: '2019', html: p('<strong>M.A. Psychology</strong> (Industrial-Organizational Psychology emphasis), Yonsei University<br>Advisors: Young Woo Sohn, Ph.D. (Chair), Kwanghee Han, Ph.D., and Suran Lee, Ph.D.<br>Thesis: <i>Examining when and why overqualified workers engage in extra-role behaviors: Testing a moderated mediation model</i>') },
      { label: '2016', html: p('<strong>B.A. Psychology</strong>, University of Wisconsin–Madison<br>Advisors: Judy M. Harackiewicz, Ph.D. and Cameron A. Hecht, Ph.D.<br>Thesis: <i>Effects of utility-value intervention variations differ by student ethnicity and self-construal</i>') },
    ],
  },
  {
    id: 'interests', en: 'Research Interests', ko: '연구 관심사',
    items: [
      { label: '', html: p('I am interested in the cognitive, affective, and social processes that shape individuals’ job performance and well-being in the workplace. My work generally falls into one or more of the following areas:<ul><li>Person–situation interactions, with a particular emphasis on situational factors (e.g., situational strength and content),</li><li>Job affect/emotion and attitudes such as job boredom and work engagement, and</li><li>Individual work performance behavior such as counterproductive work behavior and organizational citizenship behavior.</li></ul>') },
    ],
  },
  {
    id: 'pubs', en: 'Peer-Reviewed Publications', ko: '학술지 논문',
    note: 'Boldface denotes my initials. Publications are listed by recency.',
    items: publications.map((pub, i) => ({
      label: `${publications.length - i}.`,
      html: pub.html
        + (pub.doi ? ` <a href="${pub.doi}" target="_blank" rel="noopener">${pub.doi.replace('https://', '').replace('http://', '')}</a>` : '')
        + (pub.note ? ` [${pub.note}]` : ''),
    })),
  },
  {
    id: 'underreview', en: 'Revise and Resubmit (R&R) or Under Review', ko: '심사 중 논문',
    items: [
      { label: '', html: p('<strong>Kim, J. J.</strong>, Son, M., Dalal, R. S., Baines, J. I., Bui, T. N., Tsai, H., Aranda, N., &amp; Kaplan, S. A. (R&amp;R3 under review). Research on situational strength, personality, and job performance. <i>Applied Psychology: An International Review</i>.') },
      { label: '', html: p('Baines, J. I., Dalal, R. S., <strong>Kim, J. J.</strong>, Aitken, J. A., Kaplan, S. A., Zhu, Z., Hassani, J. (R&amp;R2 under review). Research on remote work and counterproductive work behavior. <i>Human Performance</i>.') },
      { label: '', html: p('<strong>Kim, J. J.</strong>, Dalal, R. S., Aitken, J. A., Kaplan, S., Baines, J. I., Zhu, Z., &amp; Hassani, J. (R&amp;R2 under review). Research on situational strength, affect, and job performance. <i>Current Psychology</i>.') },
      { label: '', html: p('Ponce, L. P., <strong>Kim, J. J.</strong>, Kaplan, S. A., &amp; Fyffe, S. (R&amp;R2 under review). Research on personality and measure-related techniques in experience-sampling methods. <i>International Journal of Social Research Methodology</i>.') },
      { label: '', html: p('Ponce, L. P., Kaplan, S. A., Dalal, R. S., <strong>Kim, J. J.</strong>, Moon, N. A., &amp; Aitken, J. A. (Invited for R&amp;R2). Research on personality and work engagement. <i>Journal of Business and Psychology</i>.') },
      { label: '', html: p('Son, M., <strong>Kim, J. J.</strong>, Dalal, R. S., Sohn, J., Nguyen, L. K., &amp; Maguire, L. (Invited for R&amp;R1). Research on situational strength and substance. <i>European Journal of Personality</i>.') },
    ],
  },
  {
    id: 'grants', en: 'Grants and Research Funding', ko: '연구비 수혜',
    items: [
      { label: '', html: p('<strong>Awarded External Funding</strong>') },
      { label: '2024', html: p('Fostering Neurodiverse Individuals’ Work Success via an Assistive Wearable Technology (Award #2326270), $1,871,692. Granter: National Science Foundation. PI: Vivian G. Motti; Co-PI: Sarah M. Wittman. Role: Graduate Research Assistant (January 2024 – May 2025).') },
      { label: '2021', html: p('Just-in-Time Adaptive Interventions for Emotion Regulation (Award #2052190), $400,000. Granter: National Science Foundation. PI: Reeshad S. Dalal; Co-PI: Seth A. Kaplan. Role: Graduate Research Assistant (June 2021 – August 2023).') },
      { label: '2018', html: p('Jang Hoon Research Grant, $1,060. Granter: Consumer Insight &amp; Invight (South Korea). Role: PI.') },
      { label: '', html: p('<strong>Awarded Internal Funding</strong>') },
      { label: '2025', html: p('Research on attention-deficit/hyperactivity disorder and job performance, $5,628. Granter: George Mason University I-O Graduate Student Fund. Role: PI.') },
      { label: '2023', html: p('CARMA workshop in Polynomial Regression and Response Surface Analysis [Attendee], $400. Granter: George Mason University I-O Graduate Student Fund.') },
      { label: '2021', html: p('Research on job boredom, $3,000. Granter: George Mason University I-O Graduate Student Fund. Role: PI.') },
      { label: '2021', html: p('CenterStat workshop in Multilevel Modeling [Attendee], $600. Granter: George Mason University I-O Graduate Student Fund.') },
    ],
  },
  {
    id: 'awards', en: 'Awards & Honors', ko: '수상',
    items: [
      { label: '2025', html: p('SIOP Travel Award, Society for Industrial and Organizational Psychology, $829.') },
      { label: '2025', html: p('Graduate Student Travel Fund, Office of the Provost, George Mason University, $500.') },
      { label: '2024', html: p('SIOP Travel Award, Society for Industrial and Organizational Psychology, $1,000.') },
      { label: '2024', html: p('Graduate Student Travel Fund, Department of Psychology, George Mason University, $450.') },
      { label: '2023', html: p('Top 10 Poster Recognition at the Annual Conference of the Society for Industrial and Organizational Psychology. Poster entitled <i>Do tight cultures act as strong situations? A meta-analytic test</i>.') },
      { label: '2023', html: p('Graduate Student Travel Fund, Department of Psychology, George Mason University, $450.') },
      { label: '2022', html: p('Graduate Student Travel Fund, Department of Psychology, George Mason University, $328.') },
      { label: '2018', html: p('Travel Award for 2019 International Convention of Psychological Science, Association for Psychological Science, $500.') },
      { label: '2017', html: p('Graduate Student Research Fellowship, Brain Korea 21, Yonsei University, $1,590.') },
      { label: '2015–16', html: p('Dean’s List, College of Letters and Science, University of Wisconsin–Madison.') },
    ],
  },
  {
    id: 'presentations', en: 'Conference Presentations', ko: '학술대회 발표',
    note: 'Boldface denotes my initials. An asterisk denotes the presenter.',
    items: [
      { label: '29.', html: p('<strong>Kim, J. J.</strong>*, Son, M., Jang, H., &amp; Dalal, R. S. (2026, April 29–May 2). Apples and oranges? How ADHD behavior is confused with low job performance [Poster]. Society for Industrial and Organizational Psychology 2026 Conference, New Orleans, LA, USA.') },
      { label: '28.', html: p('Freire, J. (Co-Chair), Keegan, Q. (Co-Chair), Blocker, C., <strong>Kim, J. J.</strong>, Kuykendall, L. E., Sutphin, D. J., &amp; Vincent, C. (2026, April 29–May 2). Fake it ’til you... Wait, am I actually making it? A discussion on imposter syndrome [Panel]. Society for Industrial and Organizational Psychology 2026 Conference, New Orleans, LA, USA.') },
      { label: '27.', html: p('<strong>Kim, J. J.</strong>* (Co-Chair), Dalal, R. S. (Co-Chair), &amp; Green, J. P.* (Discussant). (2025, April 2–5). Decoding work situations: The nomological network of situational content and strength [Symposium]. Society for Industrial and Organizational Psychology 2025 Conference, Denver, CO, USA.') },
      { label: '26.', html: p('Son, M.*, <strong>Kim, J. J.</strong>, Sohn, J., Nguyen, L. K., Maguire, L., &amp; Dalal, R. S. (2025, April 2–5). Connecting the dots: Reviewing the current status of situational strength theory and its disconnection from situation content. In <strong>Kim, J. J.</strong> (Co-Chair), Dalal, R. S. (Co-Chair), &amp; Green, J. P. (Discussant), Decoding work situations: The nomological network of situational content and strength [Symposium]. Society for Industrial and Organizational Psychology 2025 Conference, Denver, CO, USA.') },
      { label: '25.', html: p('Kalantari, N., <strong>Kim, J. J.</strong>*, Wittman, S. M., &amp; Motti, V. G. (2025, April 2–5). Exploring neurodivergent individuals’ workplace challenges and strategies through AI-assisted analysis [Symposium]. In Ponce, L. P. (Co-Chair), Mintz, R. M. (Co-Chair), &amp; Wittman, S. (Co-Chair), Understanding neurodiversity in the workplace: Perceptions, intersectionality, and interventions. Society for Industrial and Organizational Psychology 2025 Conference, Denver, CO, USA.') },
      { label: '24.', html: p('Kalantari, N.*, <strong>Kim, J. J.</strong>, Wittman, S. M., &amp; Motti, V. G. (2024, May 30–31). Bridging human insight and AI: A comparative study of neurodivergent workplace experiences through large language models and manual coding [Paper]. Neurodiversity at Work Research Conference 2024, College Park, MD, USA.') },
      { label: '23.', html: p('Kalantari, N.*, <strong>Kim, J. J.</strong>, Wittman, S. M., &amp; Motti, V. G. (2024, May 30–31). Including neurodivergent voices through probing interviews: A methodological approach to enhance hiring practices [Paper]. Neurodiversity at Work Research Conference 2024, College Park, MD, USA.') },
      { label: '22.', html: p('<strong>Kim, J. J.</strong>*, &amp; Kaplan, S. A. (2024, April 17–20). Within-person changes in job boredom and counterproductive work behavior [Symposium]. In Bowling, N. A. (Co-Chair) &amp; Dye, K. (Co-Chair), Measurement, causes, and consequences of job boredom. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '21.', html: p('Park, J., Woo, S. E., &amp; <strong>Kim, J. J.</strong>* (2024, April 17–20). A multidimensional measure of attitudes towards artificial intelligence applications at work [Symposium]. In Samo, A. (Chair) &amp; Jayatilleke, B. (Discussant), Human-centered, ethical, and responsible artificial intelligence (HCER-AI) at work: Insights from psychological research. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '20.', html: p('<strong>Kim, J. J.</strong>*, Aitken, J. A., Baines, J. I., Zhu, Z., Hassani, J., Dalal, R. S., &amp; Kaplan, S. A. (2024, April 17–20). Good versus bad situational strength? Within-person effects on affect and performance [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '19.', html: p('Aitken, J. A.*, <strong>Kim, J. J.</strong>, Baines, J. I., Zhu, Z., Hassani, J., Dalal, R. S., &amp; Kaplan, S. A. (2024, April 17–20). A moral perspective on the self-regulation of counterproductive work behavior [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '18.', html: p('Aitken, J. A.*, Baines, J. I., Wonders, M. E., Kaplan, S. A., Clark, J. E., &amp; <strong>Kim, J. J.</strong> (2024, April 17–20). A meta-analysis of the within-person relationship between affect and job performance [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '17.', html: p('Zhu, Z.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Baines, J. I., Kaplan, S. A., Dalal, R. S., &amp; Hassani, J. (2024, April 17–20). Ecological momentary emotion regulation intervention in the workplace [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '16.', html: p('Kalantari, N.*, <strong>Kim, J. J.</strong>, Wittman, S. M., &amp; Motti, V. G. (2024, March 18–19). Including neurodivergent voices through probing interviews: A methodological approach to enhance hiring practices [Poster]. Access to Research and Inclusive Excellence 2024 National Conference, Fairfax, VA, USA.') },
      { label: '15.', html: p('Park, J., Woo, S. E., <strong>Kim, J. J.</strong>, &amp; Kim, S.* (2023, August 17–19). Attitudes toward artificial intelligence application at work: Scale development and validation [Symposium]. Korean Society for Industrial and Organizational Psychology 2023 Conference, Suwon, South Korea.') },
      { label: '14.', html: p('<strong>Kim, J. J.</strong>*, Son, M., Baines, J. I., Bui, T. N., Tsai, H.-C., Aranda, N., Dalal, R. S., &amp; Kaplan, S. A. (2023, April 19–22). Do tight cultures act as strong situations? A meta-analytic test [Poster; Top 10 Award]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '13.', html: p('<strong>Kim, J. J.</strong>*, Ponce, L. P., Aitken, J. A., Farrar, S., &amp; Kaplan, S. (2023, April 19–22). Within-person dynamics of workplace boredom and its coping mechanisms [Poster]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '12.', html: p('Aitken, J. A.*, <strong>Kim, J. J.</strong>, Ponce, L. P., Farrar, S., Kaplan, S., &amp; Merlo, K. (2023, April 19–22). Delineating the performance consequences of affective states versus emotion episodes [Poster]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '11.', html: p('Ponce, L. P.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Farrar, S., &amp; Kaplan, S. A. (2023, April 19–22). The incremental advantage of personality facets in predicting state work engagement [Poster]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '10.', html: p('Ponce, L. P.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Kim, H., Farrar, S., &amp; Kaplan, S. A. (2022, August 4–6). Who will make the cut? Comparing scale shortening techniques [Poster]. American Psychological Association 2022 Convention, Minneapolis, MN, USA.') },
      { label: '9.', html: p('Aitken, J. A., Baines, J. I.*, <strong>Kim, J. J.</strong>, Zhu, Z., Hassani, J., Kaplan, S. A., Dalal, R. S., Gibson, J. L., &amp; Merlo, K. L. (2022, May 26–29). Just-in-time adaptive interventions for cognitive reappraisal: Improvements in workplace affect [Poster]. Association for Psychological Science 2022 Convention, Chicago, IL, USA.') },
      { label: '8.', html: p('Baines, J. I.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Hassani, J., Zhu, Z., Kaplan, S. A., &amp; Dalal, R. S. (2022, May 26–29). The relationship between telework and counterproductive work behavior [Poster]. Association for Psychological Science 2022 Convention, Chicago, IL, USA.') },
      { label: '7.', html: p('Hecht, C. A.*, <strong>Kim, J. J.</strong>, Harackiewicz, J. M. (2021, February 9–13). What’s good for you is good for me: The role of other-oriented utility value in interdependent students’ interest development [Poster]. Society for Personality and Social Psychology 2021 Convention (virtual).') },
      { label: '6.', html: p('<strong>Kim, J. J.</strong>*, Lim, J. I., &amp; Sohn, Y. W. (2019, March 7–9). Perceived overqualification, job boredom, and counterproductive work behavior: A moderating role of meaning in life [Poster]. International Convention of Psychological Science 2019 Convention, Paris, France.') },
      { label: '5.', html: p('<strong>Kim, J. J.</strong>*, Park, S. Y., Koo, R. H., &amp; Sohn, Y. W. (2018, May 24–27). The relations of work identity with job satisfaction and life satisfaction: A moderating role of family identity [Poster]. Association for Psychological Science 2018 Convention, San Francisco, CA, USA.') },
      { label: '4.', html: p('<strong>Kim, J. J.</strong>*, Min, J. H., Piao, M., &amp; Sohn, Y. W. (2018, May 19). The relationship between occupational self-efficacy and organizational citizenship behavior: A moderating role of perceived overqualification [Poster]. Korean Society for Industrial and Organizational Psychology 2018 Spring Conference, Cheonan, South Korea.') },
      { label: '3.', html: p('Shin, S. M., Song, Y. S.*, <strong>Kim, J. J.</strong>, &amp; Kim, T. J. (2017, August 3–6). The relationship between smartphone addiction and impulsiveness: Focused on delay discounting [Poster]. American Psychological Association 2017 Convention, Washington, DC, USA.') },
      { label: '2.', html: p('Hecht, C. A.*, <strong>Kim, J. J.</strong>, Tibbetts, Y., &amp; Harackiewicz, J. M. (2017, April 27–May 1). Finding value for the self versus close others: Implications for culturally-tailored utility-value interventions [Symposium]. In the Developments in Expectancy Value Intervention Research symposium, American Educational Research Association 2017 Convention, San Antonio, TX, USA.') },
      { label: '1.', html: p('Hecht, C. A.*, <strong>Kim, J. J.</strong>, Tibbetts, Y., &amp; Harackiewicz, J. M. (2017, January 19–21). Finding value for the self versus close others: Implications for culturally-tailored utility-value interventions [Poster]. Society for Personality and Social Psychology 2017 Convention, San Antonio, TX, USA.') },
    ],
  },
  {
    id: 'teaching', en: 'Teaching Experience', ko: '강의 경력',
    items: [
      { label: '', html: p('<strong>The University of Oklahoma</strong>') },
      { label: 'Spring 2026', html: p('Introduction to Industrial-Organizational Psychology (PSY 3753-996) — Instructor') },
      { label: 'Fall 2025', html: p('Understanding Statistics (PSY 2003-001) — Instructor') },
      { label: 'Fall 2025', html: p('Introduction to Industrial-Organizational Psychology (PSY 3753-001) — Instructor') },
      { label: '', html: p('<strong>George Mason University</strong>') },
      { label: 'Fall 2023', html: p('General Linear Modeling I (PSYC 642) — Lab Teaching Assistant') },
      { label: 'Spring 2023', html: p('Research Methods in Psychology (PSYC 301) — Lab Teaching Assistant') },
      { label: 'Summer 2022', html: p('Organizational Behavior (MGMT 313) — Teaching Assistant') },
      { label: 'Spring 2021', html: p('Statistics in Psychology (PSYC 300) — Lab Teaching Assistant') },
      { label: 'Fall 2020', html: p('Statistics in Psychology (PSYC 300) — Lab Teaching Assistant') },
      { label: '', html: p('<strong>Yonsei University</strong>') },
      { label: 'Spring 2019', html: p('Understanding on Cinema (UCL1105) — Teaching Assistant') },
      { label: 'Spring 2018', html: p('Modern Society and Psychological Health (UCL1205) — Teaching Assistant') },
      { label: 'Winter 2017', html: p('Psychology of Talent and Skill (PSY4141) — Teaching Assistant') },
      { label: 'Fall 2017', html: p('Science of Stress &amp; Adaptive Life (YCE1607) — Teaching Assistant') },
      { label: 'Spring 2017', html: p('Psychology of Language: Theories &amp; Practice (PSY3125) — Teaching Assistant') },
    ],
  },
  {
    id: 'service', en: 'Institutional and Professional Service', ko: '학내외 봉사',
    items: [
      { label: '2025–', html: p('Diversity, Equity, and Inclusion (Helen Riddle Award) Committee, The University of Oklahoma (Aug. 2025 – present)') },
      { label: '2025–', html: p('Social Media and Web Committee, The University of Oklahoma (Aug. 2025 – present)') },
      { label: '2023–25', html: p('Conference Reviewer, Annual Conference for the Society for Industrial and Organizational Psychology (SIOP)') },
      { label: '2022–23', html: p('Assistant Editor, <i>Journal of Business and Psychology</i> (Dec. 2022 – Dec. 2023)') },
      { label: '2021–22', html: p('Vice President, Industrial-Organizational Psychology Student Association (IOPSA), George Mason University (Aug. 2021 – July 2022)') },
      { label: '2021–25', html: p('Research Coordinator for the Undergraduate Subject Pool (SONA), Department of Psychology, George Mason University (May 2021 – May 2025)') },
      { label: '2018–19', html: p('Research Coordinator for the Undergraduate Subject Pool (SONA), Department of Psychology, Yonsei University (Mar. 2018 – Mar. 2019)') },
    ],
  },
  {
    id: 'affiliations', en: 'Professional Affiliations', ko: '학회 활동',
    items: [
      { label: '2025–', html: p('Member, Society for Industrial and Organizational Psychology (SIOP)') },
      { label: '2025–', html: p('Member, Data Institute for Societal Challenges, The University of Oklahoma') },
      { label: '2025–', html: p('Affiliate, Institute for Community and Society Transformation, The University of Oklahoma') },
      { label: '2023–', html: p('Student Member, Academy of Management') },
      { label: '2020–25', html: p('Student Affiliate, Society for Industrial and Organizational Psychology') },
    ],
  },
  {
    id: 'media', en: 'Media Coverage', ko: '언론 보도',
    items: [
      { label: '2019', html: p('Association for Psychological Science. (2019, July 10). Dedication buffers employees against boredom, study suggests.') },
    ],
  },
];
```

- [ ] **Step 2: Verify pairings against the layout extraction**

Open `.superpowers/cv-layout.txt` and check every year and dollar amount in the `grants`, `awards`, and `service` sections above against the aligned columns. The PDF shows these amounts in this order (verify, don't trust): internal $5,628 / $400 / $3,000 / $600; external $1,871,692 / $400,000 / $1,060; awards $829 / $1,000 / $750 / $500 / $500 / $450 / $450 / $328 / N/A / $500 / $1,590 / N/A. If the layout file shows a different pairing (e.g., the $750 or a second $500 belongs to an entry not listed above, or an awards year differs), correct `cv.js` to match the PDF. Any remaining ambiguity: tag `[VERIFY]` in the html and report it in the task summary. Note the PDF itself has a typo "Fall 20217" for the YCE1607 entry — transcribed as Fall 2017; flag this to the user.

- [ ] **Step 3: Create `src/components/CvBody.astro`**

```astro
---
import { cvSections } from '../data/cv.js';
const { lang = 'en' } = Astro.props;
---
{cvSections.map((s) => (
  <section class="cv-section">
    <h2 class="sec-label">{lang === 'ko' ? s.ko : s.en}</h2>
    {s.note && <p class="cv-note">{s.note}</p>}
    {s.items.map((it) => (
      <div class="cv-row">
        <div class="cv-label">{it.label}</div>
        <div class="cv-body" set:html={it.html} />
      </div>
    ))}
  </section>
))}
```

- [ ] **Step 4: Rewrite `src/pages/cv.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import CvBody from '../components/CvBody.astro';
import { cvUpdated } from '../data/cv.js';
---
<Layout
  title="CV | JeongJin Kim"
  description="Curriculum vitae of JeongJin Kim, Assistant Professor of Psychology at the University of Oklahoma."
  lang="en"
  active="cv"
  enPath="/cv/"
>
  <h1 class="page-title serif">Curriculum Vitae</h1>
  <p class="cv-updated">Last updated {cvUpdated.en}.</p>
  <div class="cv-actions">
    <a class="btn primary" href="/cv.pdf" download>Download CV (PDF)</a>
    <a class="btn" href="/cv.pdf" target="_blank" rel="noopener">Open PDF in New Tab</a>
  </div>
  <CvBody lang="en" />
</Layout>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
grep -c 'class="cv-section"' dist/cv/index.html
grep -c 'class="cv-row"' dist/cv/index.html
grep -c '1,871,692' dist/cv/index.html
grep -c 'VERIFY' dist/cv/index.html
```
Expected: 12 sections; row count ≥ 70 (4+1+... including 9 pubs, 6 R&R, 29 presentations); NSF amount present; `VERIFY` count 0 (or list each remaining one for the user).

- [ ] **Step 6: Commit**

```bash
git add src/data/cv.js src/components/CvBody.astro src/pages/cv.astro
git commit -m "Full HTML CV transcribed from cv.pdf with PDF download buttons"
```

---

### Task 8: Korean pages

**Files:**
- Create: `src/pages/ko/index.astro`, `src/pages/ko/research.astro`, `src/pages/ko/teaching.astro`, `src/pages/ko/cv.astro`

**Interfaces:**
- Consumes: everything above. Layout handles `lang="ko"` (Pretendard, `body.ko`, hreflang, pill to ENG).
- All Korean prose below is a DRAFT for the user's review — implement it verbatim, then it gets corrected during user review (Task 10 checkpoint). Fixed by the user and NOT draftable: hero name 김정진 (no Ph.D.), title line 산업조직심리학자 / 심리학과 조교수, statement 일터에서 직장인들의 수행 행동과 웰빙을 연구합니다., English tabs/buttons.

- [ ] **Step 1: Create `src/pages/ko/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import PubList from '../../components/PubList.astro';
import { publications } from '../../data/publications.js';
import { EMAIL, SCHOLAR_URL, LINKEDIN_URL } from '../../data/site.js';
---
<Layout
  title="김정진 | 산업조직심리학자"
  description="오클라호마 대학교 심리학과 조교수 김정진입니다. 개인-상황 상호작용, 직무 태도와 정서, 개인 수행 행동을 연구합니다."
  lang="ko"
  active="home"
  enPath="/"
>
  <section class="hero">
    <div class="hero-text">
      <h1 class="serif">김정진</h1>
      <p class="hero-role">산업조직심리학자 / 심리학과 조교수</p>
      <p class="hero-affil">The University of Oklahoma</p>
      <p class="hero-statement serif">일터에서 직장인들의 수행 행동과 웰빙을 연구합니다.</p>
      <div class="hero-links">
        <a class="btn primary" href={`mailto:${EMAIL}`}>Email</a>
        <a class="btn" href="/ko/cv/">CV</a>
        <a class="btn" href={SCHOLAR_URL} target="_blank" rel="noopener">Google Scholar</a>
        <a class="btn" href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
    <img class="hero-headshot" src="/headshot.jpg" alt="김정진" width="270" height="331" />
  </section>

  <section>
    <h2 class="sec-label">소개</h2>
    <p>
      일터에서 직장인들의 수행 행동과 웰빙이 어떻게, 그리고 왜 형성되는지에 관심을 가지고
      있습니다. 구체적으로는 서로 연결된 다음 세 영역을 중심으로 연구합니다.
    </p>
    <ul>
      <li>개인&ndash;상황 상호작용, 특히 상황 측면(예: 상황 강도, 상황 내용 특성)</li>
      <li>직무 태도와 정서(예: 직무 열의, 직무 지루함)</li>
      <li>개인 수행 행동(예: 반생산적 업무 행동, 조직시민행동)</li>
    </ul>
    <div class="phd-note">
      <p><strong>박사과정 지원자 안내:</strong> 2027년 가을학기에는 박사과정 학생을 선발하지 않을 예정입니다.</p>
    </div>
  </section>

  <section>
    <h2 class="sec-label">논문</h2>
    <PubList pubs={publications} />
  </section>

  <section>
    <h2 class="sec-label">강의</h2>
    <p>오클라호마 대학교에서 통계학과 산업조직심리학 학부 과목을 가르치고 있습니다.</p>
    <p><a class="arrow-link" href="/ko/teaching/">Teaching &rarr;</a></p>
  </section>
</Layout>
```

- [ ] **Step 2: Create `src/pages/ko/research.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import PubList from '../../components/PubList.astro';
import { publications } from '../../data/publications.js';

const streams = [
  {
    id: 'i',
    title: '개인–상황 상호작용',
    body: `첫 번째 관심 영역은 개인 특성과 상황 특성의 상호작용, 즉 개인–상황 상호작용(상호작용주의)입니다. 저는 일터 맥락에서의 개인–상황 상호작용을 상황 측면에 초점을 두고 연구합니다. 특히 상황 강도(강한 상황 대 약한 상황)가 개인의 직무 수행에 미치는 영향에 관심이 있습니다. 여러 연구를 통해 상황 강도를 성격–수행 관계의 전통적인 조절변수로서, 그리고 직원 성과에 직접 영향을 미치는 새로운 선행변수로서 검토해 왔습니다. 현재는 상황 강도와 성격 강도 문헌을 통합하는 개념적 리뷰, 그리고 경험표집 연구를 위한 상황 강도 단축 척도 개발을 진행하고 있습니다.`,
  },
  {
    id: 'ii',
    title: '직무 태도와 정서',
    body: `두 번째 영역은 직무 태도와 정서로, 특히 직무 지루함과 직무 열의를 다룹니다. 일터에서 지루함이 왜, 어떻게 경험되는지, 그리고 지루함이 수행 및 웰빙과 맺는 관계를 설명하는 기제를 연구합니다. 또한 동료들과 함께 직장인의 정서 조절을 돕는 생태순간개입, 특히 인지 재평가 개입을 개발하고 검증해 왔습니다. 현재는 성격과 직무 열의의 개인 내 관계, 지루함의 심리사회적 효과와 조직에서의 함의, 직무 지루함과 역할 외 행동의 관계를 연구하고 있습니다.`,
  },
  {
    id: 'iii',
    title: '직원 수행 행동',
    body: `세 번째 영역은 앞의 두 영역과 밀접하게 연결됩니다. 직무 수행은 복잡하고 다면적인 구성개념이지만, 저의 관심은 주로 조직시민행동과 반생산적 업무 행동 같은 역할 외 수행 행동에 있습니다. 특히 직원 수행에 영향을 미치거나 수행으로부터 영향을 받는 인지적·정서적·사회적 요인, 그리고 수행을 돕거나 해치는 경계 조건에 초점을 둡니다. 현재는 변화하는 일의 특성을 고려하여 수행 준거 공간이 시간에 따라 변화했는지 재검토하는 프로젝트와, 경계확장행동의 선행요인과 결과를 살펴보는 프로젝트를 진행하고 있습니다.`,
  },
];
---
<Layout
  title="연구 | 김정진"
  description="연구 프로그램: 개인-상황 상호작용, 직무 태도와 정서, 직원 수행 행동."
  lang="ko"
  active="research"
  enPath="/research/"
>
  <h1 class="page-title serif">연구</h1>
  <p class="page-intro">서로 연결된 세 가지 연구 프로그램을 소개합니다.</p>

  {streams.map((s) => (
    <section class="stream">
      <h2 class="serif">{s.title}</h2>
      <p>{s.body}</p>
      {publications.some((p) => p.streams.includes(s.id)) && (
        <>
          <p class="related-label">관련 연구</p>
          <PubList pubs={publications.filter((p) => p.streams.includes(s.id))} />
        </>
      )}
    </section>
  ))}
</Layout>
```

- [ ] **Step 3: Create `src/pages/ko/teaching.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
---
<Layout
  title="강의 | 김정진"
  description="오클라호마 대학교 학부 과목: 통계학 입문, 산업조직심리학 개론."
  lang="ko"
  active="teaching"
  enPath="/teaching/"
>
  <h1 class="page-title serif">강의</h1>
  <p class="sec-label" style="margin-top:1.4rem;">The University of Oklahoma</p>

  <div class="course">
    <h2 class="serif">PSY 2003 &mdash; Understanding Statistics</h2>
    <p class="term">Fall 2025</p>
    <p>
      통계적 문해력(데이터와 이를 해석하는 통계를 이해하는 능력)을 기르고 기술통계와
      추론통계 방법을 배우는 응용 통계학 입문 과목입니다. 연구 설계, 측정, 표집 절차,
      표준정규분포, 상관, 회귀, 확률, 표집분포, 가설검정과 오류 및 검정력 등을 다룹니다.
    </p>
  </div>

  <div class="course">
    <h2 class="serif">PSY 3753 &mdash; Introduction to Industrial-Organizational Psychology</h2>
    <p class="term">Fall 2025; Spring 2026</p>
    <p>
      심리학 이론과 그 일터 적용을 다루는 과목으로, 개인의 웰빙과 조직 성과에 중요한
      주제들을 포괄합니다. 산업조직심리학의 역사, 연구 방법, 준거와 직무분석, 예측변수(심리
      평가), 인사 결정, 조직 학습과 개발, 수행 관리, 리더십, 팀과 팀워크, 조직 변화,
      일터에서의 정서·태도·행동, 직무 동기, 직장 심리 건강 등을 다룹니다.
    </p>
  </div>
</Layout>
```

- [ ] **Step 4: Create `src/pages/ko/cv.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import CvBody from '../../components/CvBody.astro';
import { cvUpdated } from '../../data/cv.js';
---
<Layout
  title="CV | 김정진"
  description="김정진의 이력서(CV)."
  lang="ko"
  active="cv"
  enPath="/cv/"
>
  <h1 class="page-title serif">Curriculum Vitae</h1>
  <p class="cv-updated">마지막 업데이트: {cvUpdated.ko}.</p>
  <div class="cv-actions">
    <a class="btn primary" href="/cv.pdf" download>Download CV (PDF)</a>
    <a class="btn" href="/cv.pdf" target="_blank" rel="noopener">Open PDF in New Tab</a>
  </div>
  <CvBody lang="ko" />
</Layout>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
ls dist/ko dist/ko/research dist/ko/teaching dist/ko/cv
grep -c '김정진' dist/ko/index.html
grep -c '산업조직심리학자 / 심리학과 조교수' dist/ko/index.html
grep -c 'Ph.D.' dist/ko/index.html
grep -o '<a class="btn[^>]*>[^<]*</a>' dist/ko/index.html | head -4
grep -c 'lang="ko"' dist/ko/index.html
grep -c 'pretendard' dist/ko/index.html
grep -c '>Home<\|>Research<\|>Teaching<' dist/ko/index.html
```
Expected: all four KO pages exist; 김정진 ≥ 3 (logotype, h1, footer); title line = 1; `Ph.D.` = 0 on the KO home (no suffix by the name — note "Ph.D." may legitimately appear inside publication citations on the page, so check the hero specifically if the count is nonzero: `grep -A2 '<h1' dist/ko/index.html`); buttons Email/CV/Google Scholar/LinkedIn in order with `primary` on Email; `lang="ko"`; Pretendard loaded; English tab labels present.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ko/
git commit -m "Korean mirror pages with drafted copy (user review pending)"
```

---

### Task 9: Contact redirect

**Files:**
- Modify: `astro.config.mjs`
- Delete: `src/pages/contact.astro`

- [ ] **Step 1: Add the redirect and remove the page**

`astro.config.mjs` becomes:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jeongjinkim.com',
  output: 'static',
  redirects: {
    '/contact': '/',
  },
});
```

```bash
git rm src/pages/contact.astro
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
cat dist/contact/index.html | head -5
```
Expected: build succeeds; `dist/contact/index.html` is a meta-refresh stub pointing to `/`.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "Redirect /contact to Home; remove Contact page"
```

---

### Task 10: Full verification, push, preview, user-review checkpoint

**Files:** none (verification + git push only).

- [ ] **Step 1: Whole-site assertion sweep**

```bash
npm run build
# No stale content anywhere:
grep -ril 'Fall 2026\|Lato\|Dale Hall\|pronunciation' dist/ | grep -v cv.pdf
# Crimson never used as a text color (spot-check: crimson appears only in the expected CSS rules):
grep -o '[^;{]*#841617' dist/_astro/*.css 2>/dev/null || grep -o '[^;{]*#841617' dist/**/*.html | sort -u
# Both languages, all eight pages present:
for f in index research/index teaching/index cv/index ko/index ko/research/index ko/teaching/index ko/cv/index; do test -f "dist/$f.html" && echo "OK $f"; done
```
Expected: first grep returns nothing (the string "Fall 2026" legitimately appears ONLY inside CV teaching/presentation entries — inspect any hits: `Spring 2026`/`Fall 2025` are fine, a Fall 2026 *recruitment* sentence is not); crimson rules limited to `.tab.on`, `.btn.primary`, link underline `border-bottom`, and `.phd-note` border; 8 OK lines.

- [ ] **Step 2: Visual smoke test in the dev server**

```bash
npm run dev
```
Open http://localhost:4321/ and check: sticky header; A− / A+ changes size and persists on reload; % resets on click; KOR pill goes to `/ko/`, ENG comes back to the same page; tab underline follows the active page; hero shows two role lines and the 270px headshot; mobile width (narrow the window) stacks header and hero. Then Ctrl-C.

- [ ] **Step 3: Push the branch for a Vercel preview**

```bash
git push -u origin jinalee-redesign
```
Expected: push succeeds; Vercel builds a preview deployment for the branch (check the Vercel dashboard or the GitHub commit status for the preview URL).

- [ ] **Step 4: STOP — user review checkpoint**

Report to the user: the preview URL, any `[VERIFY]` leftovers from Task 7, the "Fall 20217" PDF typo, and a request to review (a) all Korean copy, (b) the CV year/amount pairings against the PDF, (c) the publication-to-stream mapping on Research. **Do not merge to `main` until the user approves.** Merging afterwards is handled by superpowers:finishing-a-development-branch.

---

## Self-Review (done at plan time)

- Spec coverage: palette/tokens (T3), 135% base + `jk-font-scale` widget (T3), four English tabs + language pill (T3), hero lines/statement/buttons/270px portrait (T4), About minus first sentence + Fall 2027 note (T4), publications only on Home (T4), Research streams + published-only related work (T5), Teaching courses + terms (T6), full HTML CV + buttons + pairing verification (T7), Korean mirrors with fixed hero strings and drafted copy (T8), /contact redirect + Contact removal (T9), Vercel preview + review gate before merge (T10). WIP discard + kept assets (T1).
- Placeholder scan: no TBDs; all code complete. The only deliberately deferred item is correcting garbled year/amount pairings, which has a concrete verification procedure and a `[VERIFY]` escape hatch (T7 Step 2).
- Type consistency: `Layout` props (`title/description/lang/active/enPath`) used identically in all 8 pages; `publications` shape consumed by `PubList` (html/doi/note) and `cv.js` (html/doi/note) matches Task 2's definition; `cvSections` shape matches `CvBody`.
