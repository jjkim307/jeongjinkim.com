# Design Spec: jeongjinkim.com Personal Academic Website

**Date:** 2026-06-03
**Owner:** JeongJin Kim (Assistant Professor, I-O Psychology, University of Oklahoma)
**Repo:** https://github.com/jjkim307/jeongjinkim.com (private)

## Purpose

A personal academic website for JeongJin Kim, closely modeled on the design of
justinfrake.com (a clean, university-branded, Astro-based academic site), restyled
in University of Oklahoma colors with Kim's own content.

## Benchmark reference

justinfrake.com design features being matched:

- Multi-page static site with top navigation: Home / Research / Teaching / CV
- Hero with name, title, dense bio paragraph (journal names called out inline),
  and a row of quick links (Google Scholar / CV / Email)
- "Research Focus Areas" section: three side-by-side cards, each with a topic
  heading, one-sentence description, and a link into the Research page
- Clean sans-serif typography (Inter + Public Sans, Google Fonts)
- University-branded color scheme (his: Michigan navy + maize)
- Minimal, professional tone with generous whitespace

## Technology

- **Astro** static site generator, `output: static` (matches Frake's stack).
- No client-side JS framework; Astro components only.
- Builds to plain static files in `dist/`, keeping deployment portable.
- **Hosting: deferred.** The static build must work on either Vercel or GitHub
  Pages (with custom domain at root). `astro.config.mjs` sets
  `site: 'https://jeongjinkim.com'` with no `base` path so both targets work.

## Visual design

- **Fonts:** Inter (body) + Public Sans, loaded from Google Fonts.
- **Colors:**
  - Primary: OU crimson `#841617`
  - Accent: OU cream `#FDF9D8`
  - Text: `#1a1a1a` on white `#ffffff`
  - Structure grays: `#555`, `#777`, `#eee`
- **Tone:** minimal, professional, whitespace-forward, card-based research grouping.
- **Responsive:** cards stack on mobile; nav remains usable on small screens.

## Site structure

Top navigation (present on every page): **Home · Research · Teaching · CV**

### Home (`/`)
- Nav
- Hero:
  - Headshot (`public/headshot.jpg`, placeholder until provided)
  - Name (H1), title line (H2)
  - Bio paragraph with journal names called out inline
  - Quick-link row: Google Scholar · CV · Email (`mailto:jjkim@ou.edu`)
- Research Focus Areas: three cards, each linking into `/research`:
  1. Person–Situation Interactions
  2. Job Attitudes & Affect/Emotions
  3. Individual Work Performance & Well-Being

### Research (`/research`)
- The three streams expanded, each with a short paragraph and a publications
  list filtered to that stream.

### Teaching (`/teaching`)
- Courses taught. Placeholder content until specifics are provided.

### CV (`/cv`)
- Links to / embeds the hosted CV PDF (`public/cv.pdf`).

## Components

Kept small and single-purpose so pages stay readable and reusable:

- `src/layouts/Layout.astro` — `<head>`, font loading, nav, footer; wraps all pages.
- `src/components/Nav.astro` — top navigation.
- `src/components/Hero.astro` — home hero block.
- `src/components/ResearchCard.astro` — one research-area card (props: title,
  description, link).
- `src/components/PublicationItem.astro` — one publication entry on the Research page.

## Content model

- Publications stored in a single data file `src/data/publications.js` as an array
  of objects (e.g. `{ authors, year, title, venue, url, stream }`). The Research
  page maps over this array and groups by `stream`. Adding a paper is a one-line edit.
- Other page text is authored directly in the `.astro` pages (small site, YAGNI —
  no CMS or content collections until the publication list grows large enough to
  justify it).

## Assets

- `public/headshot.jpg` — hero photo (placeholder until provided).
- `public/cv.pdf` — CV (placeholder until provided).
- `public/favicon.svg` — site favicon.

## Repo changes

- Astro project scaffolded at repo root.
- The existing placeholder `index.html` is removed (Astro generates the home page).
- `README.md` updated with Astro dev/build/preview instructions.
- `.gitignore` updated to add `node_modules/`, `dist/`, `.astro/`.

## Out of scope (YAGNI)

- CMS / content collections (revisit if publication list grows large).
- Blog, news feed, or dynamic content.
- Client-side interactivity beyond static navigation.
- Hosting/deployment configuration (deferred to a later decision).

## Open items to be filled by user later

- Real headshot image and CV PDF.
- Google Scholar profile URL.
- Teaching course details.
- Final bio paragraph wording and per-stream descriptions/publications.
