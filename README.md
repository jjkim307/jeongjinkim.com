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
- Publications: `src/data/publications.js` (one object per paper; `stream` must match a research id; confirm venues marked `TODO`)
- Courses: `courses` array in `src/pages/teaching.astro`
- Bio / quick links: `src/components/Hero.astro`
- PhD recruitment callout: `src/pages/index.astro`
- Contact info / links: `src/pages/contact.astro`
- Replace `public/headshot.jpg` and `public/cv.pdf` with real files (keep the same names).

## Deploy

Static output in `dist/`. Deploy to Vercel or GitHub Pages (custom domain at root) — TBD.
