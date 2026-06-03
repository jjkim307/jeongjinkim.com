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

Closely matches justinfrake.com's visual treatment, confirmed against an approved
browser mockup, restyled in OU colors.

- **Fonts:** Inter (body) + Public Sans (headings) — the same pairing Frake uses.
  Loaded from Google Fonts.
- **Colors:**
  - Primary: OU crimson `#841617` (hover `#a51c1d`)
  - Accent: OU cream `#FDF9D8` (used for soft accents; no gold/maize)
  - Text: `#333` body, `#555` secondary, `#777` light, on white `#ffffff`
  - Borders/structure: `#eee`
- **Headings** render in crimson (Frake renders his in Michigan navy).
- **Hero:** image-left / text-right; name in crimson (`name-headline`, 2.5rem);
  quick links as **outlined buttons** that fill crimson on hover (Frake's
  `scholar-btn` pattern), not plain text links.
- **Section heading** ("Research Focus Areas") with a 2px crimson underline.
- **Research cards:** white, rounded, soft drop shadow, a crimson top accent bar
  that grows on hover, and a hover lift; "View papers" link anchored at the bottom.
- **Tone:** minimal, professional, whitespace-forward, card-based research grouping.
- **Responsive:** hero stacks and centers; cards collapse to one column on mobile.

## Site structure

Top navigation (present on every page): **Home · Research · Teaching · CV · Contact**

### Home (`/`)
- Nav
- Hero:
  - Headshot (`public/headshot.jpg`, placeholder until provided)
  - Name (H1), title line
  - Bio paragraph: research focus + the "what shapes performance behavior and
    well-being... the why's and how's" framing + education (B.A. Wisconsin–Madison,
    M.A. Yonsei, Ph.D. George Mason).
  - Quick-link buttons: Google Scholar · CV · Email · LinkedIn (real URLs).
- PhD recruitment callout (cream-accented): recruiting an I-O Ph.D. student for
  Fall 2026.
- Research Focus Areas: three cards, each linking into `/research`:
  1. Person–Situation Interactions
  2. Job Attitudes & Affect/Emotions
  3. Individual Work Performance & Well-Being

### Research (`/research`)
- The three streams expanded, each with a description and a publications list
  filtered to that stream. Publications seeded from Google Scholar (10 I-O papers;
  one off-topic 2018 paper excluded).

### Teaching (`/teaching`)
- Courses taught. Placeholder content until specifics are provided.

### CV (`/cv`)
- Links to / embeds the hosted CV PDF (`public/cv.pdf`).

### Contact (`/contact`)
- Email, office address (Dale Hall Tower, Room 737, 445 W. Lindsey St., Norman, OK
  73019), and professional links (Google Scholar, LinkedIn, OU faculty page).
- Carried over from the prior Google Sites site.

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
  of objects (`{ authors, year, title, venue, url, stream }`). The Research page
  maps over this array and groups by `stream`. Adding a paper is a one-line edit.
- Seeded with 10 publications pulled from Google Scholar
  (`user=3312EoQAAAAJ`), tagged to the three streams. Two venues are flagged
  `TODO(user)` for confirmation; the 2018 Korean-language adolescent
  smartphone-addiction paper is excluded as off-topic for an I-O site (can be
  added under an "Other" group on request).
- Other page text is authored directly in the `.astro` pages (small site, YAGNI —
  no CMS or content collections until the publication list grows large enough to
  justify it).

## Carried over from the prior site (www.jeongjinkim.com → Google Sites)

The previous site redirected to `sites.google.com/view/jeongjinkim`. Integrated:
education history, bio framing, detailed research-stream content (situational
strength; job boredom and work engagement; OCB/CWB/boundary-spanning), the Contact
page (office + links), the PhD recruitment note, and real profile URLs (Google
Scholar, LinkedIn, OU faculty page).

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
