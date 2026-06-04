# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## What this is

`jeongjinkim.com` — the personal academic website for **JeongJin Kim**, Assistant
Professor of Industrial–Organizational (I-O) Psychology at the University of
Oklahoma. It is a small, content-driven **static site** built with
[Astro](https://astro.build). There is no backend, no database, and no
client-side JS framework — just Astro components compiled to static HTML/CSS.

The site has five pages: Home, Research, Teaching, CV, and Contact.

## Commands

```bash
nvm use --lts        # ensure Node LTS is active (developed on Node 22)
npm install          # first time only — installs Astro (node_modules is gitignored)
npm run dev          # dev server at http://localhost:4321
npm run build        # static build -> dist/
npm run preview      # serve the production build locally
```

There is **no test runner, linter, or formatter** configured. The verification
model for this project is: **`npm run build` must exit 0**, and the generated
HTML in `dist/` should contain the expected content. When you change content or
markup, run `npm run build` and, if useful, grep `dist/` to confirm the change
landed.

## Project layout

```
astro.config.mjs          # site URL (https://jeongjinkim.com), output: 'static'
public/                   # served verbatim at site root
  favicon.svg
  headshot.jpg            # hero photo
  cv.pdf                  # downloadable / embedded CV
src/
  layouts/Layout.astro    # <head>, fonts, Nav, <slot/>, footer — wraps every page
  components/
    Nav.astro             # top nav; link list defined inline, highlights current page
    Hero.astro            # home hero: headshot, name, title, bio, quick links
    ResearchCard.astro    # home research teaser card
    PublicationItem.astro # one publication <li>
  pages/                  # one file per route (file-based routing)
    index.astro           # Home — Hero + research cards + PhD recruitment note
    research.astro        # Research — streams + publications grouped by stream
    teaching.astro        # Teaching — courses array (inline)
    cv.astro              # CV — embeds/links public/cv.pdf
    contact.astro         # Contact — email, office address, external links
  data/
    research.js           # `streams` array (research areas)
    publications.js       # `publications` array (one object per paper)
  styles/global.css       # all styling: CSS variables + every page/component class
docs/superpowers/         # original design spec + implementation plan (historical)
```

## How content is managed

Content lives in two places: **data files** (`src/data/`) for anything reused or
listed, and **inline in the page** for one-off page-specific content. To update
the site, edit data — you rarely need to touch markup.

| To change… | Edit |
| --- | --- |
| Research streams/areas | `src/data/research.js` (`streams`) |
| Publications | `src/data/publications.js` (`publications`) |
| Courses | `courses` array at the top of `src/pages/teaching.astro` |
| Bio, name, title, quick links | `src/components/Hero.astro` |
| PhD recruitment callout | `src/pages/index.astro` |
| Contact info, office, external links | `src/pages/contact.astro` |
| Headshot / CV | replace `public/headshot.jpg` / `public/cv.pdf` (keep filenames) |

### Research streams (`src/data/research.js`)

Each stream is `{ id, title, short, description }`:
- `id` — kebab-case slug; used as the anchor on `/research#<id>` and as the
  foreign key publications point to. **Do not rename an `id`** without updating
  every publication's `stream` field.
- `short` — one sentence, shown on the home page card.
- `description` — fuller paragraph, shown at the top of the research-page section.

Current ids: `person-situation`, `job-attitudes-affect`, `performance-wellbeing`.

### Publications (`src/data/publications.js`)

Each entry is `{ authors, year, title, venue, url, stream }`:
- `stream` **must** match an `id` in `research.js`, or the publication won't
  render anywhere (it's filtered by stream on the research page).
- `venue` may be empty; some entries are marked `// TODO(user): confirm venue` —
  these are unverified and should be confirmed before being treated as final.
- `url` may be empty; when present, the title becomes a link.
- The file is loosely grouped by stream with comment headers, but order within
  the array does not affect grouping (filtering does). Keep new entries near
  their stream's group for readability.

## Conventions

- **Astro components** use the frontmatter fence (`---`) for props/logic and
  destructure `Astro.props` with sensible defaults (see `Hero.astro`,
  `Nav.astro`). Follow this pattern.
- **Every page** imports and wraps its content in `Layout.astro`, passing a
  page-specific `title` (format: `"Page | JeongJin Kim"`; home uses a longer
  descriptive title).
- **Styling is centralized** in `src/styles/global.css` — there are no
  component-scoped `<style>` blocks. Add or reuse a class there rather than
  inlining styles. Class names are plain semantic names (`.hero`, `.stream`,
  `.pub`, `.section-label`, etc.).
- **Design system** (defined as CSS custom properties in `:root`):
  warm-neutral palette (`--ink`, `--body`, `--muted`, `--faint`, `--hair`,
  `--bg`), `--maxw: 660px` content column. Type pairing is **Newsreader**
  (serif headings) + **Source Sans 3** (sans body), loaded from Google Fonts in
  `Layout.astro`. Keep this restrained, minimal, single-column aesthetic.
  - Note: the historical design spec in `docs/` describes an OU-crimson palette
    with Inter/Public Sans. The shipped site intentionally diverged to the
    warm-neutral scheme above — **the code is the source of truth**, not the spec.
- **Navigation** links are an inline array in `Nav.astro`; add a page by adding
  a `pages/*.astro` file and a corresponding `{ href, label }` entry.
- No TypeScript in authored code (`src/env.d.ts` is generated/gitignored); data
  files are plain `.js` ES modules with named exports.

## Deployment

`output: 'static'` produces a plain `dist/` deployable to Vercel or GitHub Pages.
`astro.config.mjs` sets `site: 'https://jeongjinkim.com'` with **no `base` path**
so either host works (custom domain at root). Hosting is not yet finalized.

## Git workflow

- Default branch: `main`. Do not commit `node_modules/`, `dist/`, or `.astro/`
  (already gitignored).
- Commit/push only when asked. Don't open a pull request unless explicitly
  requested.
