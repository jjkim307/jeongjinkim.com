# jeongjinkim.com — "The Journal" Redesign

Date: 2026-07-12
Status: SUPERSEDED by `2026-07-12-jinalee-model-redesign-design.md` — the user redirected the redesign to follow jinalee.org as the model before implementation began.

## Goal

Replace the current site design (the June 2026 "old-site clone": Lato, charcoal banner) with a distinctive, polished, editorial design — "The Journal." The prior designs read as generic and underdesigned. The new design should feel like a beautifully set scholarly journal: erudite, established, calm. Information architecture is unchanged: the same five pages (Home/Bio, CV, Research, Teaching, Contact), same routes, same content text.

Primary audiences: prospective PhD students and academic peers (editors, reviewers, colleagues).

## Visual system

**Palette**

| Role | Value |
|---|---|
| Paper ground | `#f9f7f3` (cooled from the mockups' original `#f7f3ec` at the user's request) |
| Ink (headings, masthead, strong rules) | `#26221c` |
| Body text | `#3a362f` |
| Secondary text (nav idle, captions) | `#6b6357` |
| Hairline rules | `#d3cec3` |
| Accent — OU crimson | `#841617` |

Crimson is used sparingly and only for: the dateline, the active nav tab, links, small-caps section labels, the drop cap, and Roman-numeral stream labels. No other color anywhere; images provide the only additional color.

**Typography**

- One family for everything: **Source Serif 4**, self-hosted via `@fontsource/source-serif-4` (no Google Fonts CDN). Weights: 400, 600, plus italic 400.
- Fallback stack: `'Source Serif 4', Georgia, 'Iowan Old Style', 'Times New Roman', serif`.
- No sans-serif anywhere. "Small caps" effects are letter-spaced uppercase (`text-transform: uppercase` + `letter-spacing: .12em–.2em`), not font small caps.
- Body ~17px (1.0625rem) with line-height ~1.8. Headlines regular weight (400), sized ~1.7–2em. Content column max-width ~780px.

**Institution naming.** "The University of Oklahoma" with capital T in standalone/label contexts (dateline, address block); lowercase "the University of Oklahoma" in running prose.

## Masthead and footer (every page)

- Masthead row: site name "JEONGJIN KIM" in letter-spaced caps at left; the five nav tabs in smaller letter-spaced caps at right (Bio, CV, Research, Teaching, Contact). The row sits on a **2px ink rule**.
- Beneath it, a **dateline strip**: centered, small letter-spaced caps in crimson — "Industrial-Organizational Psychology · The University of Oklahoma" — closed by a hairline rule.
- Active tab: crimson with a thin underline. Idle tabs: secondary text color; crimson on hover.
- Footer mirrors the masthead: hairline rule, then a small-caps copyright line ("© 2026 JeongJin Kim").
- Mobile (~<720px): masthead stacks — name centered above centered, wrapping tabs; dateline remains beneath. Two-column page layouts collapse to one column with the portrait above the text.

## Pages

**Home (`/`, tab label "Bio")**
- No headline. The page opens directly with the bio, first paragraph carrying a crimson **drop cap**.
- Body text verbatim from the user (2026-07-12), replacing the committed copy:
  - "I am an industrial-organizational (I-O) psychologist and an Assistant Professor of Psychology at the University of Oklahoma."
  - "I am interested in what shapes employees' performance behavior and well-being, as well as the why's and how's. Specifically, my work primarily focuses on these three interconnected areas:"
  - The three areas, set as a list with crimson Roman numerals (matching the Research page): I. "Person–situation interactions, with a particular emphasis on situation (e.g., situational strength, substance characteristics)," II. "Job attitudes and affect/emotions (e.g., work engagement, job boredom), and" III. "Individual work performance behavior (e.g., counterproductive work behavior, organizational citizenship behavior)"
- Small-caps crimson links: "Research →" and "Google Scholar →".
- Prospective-students note under a crimson small-caps label "Prospective PhD Students": "I do not plan to admit a PhD student for Fall 2027." Set as a quiet single-line note (no box needed given its brevity).
- Right column: portrait `headshot.jpg` at ~230px, subtle `grayscale(25%)` filter; italic caption beneath reading "Norman, Oklahoma" only (no PhD callout in the caption).

**Research (`/research`)**
- Page title + one-sentence intro (existing text).
- Three streams under crimson small-caps labels numbered with Roman numerals: I. Person–Situation Interactions; II. Job Attitudes and Affect/Emotions; III. Individual Work Performance Behavior. Existing stream descriptions.
- "Selected Publications" under a **double rule** (2px ink rule + hairline): the existing publication list, APA format, hanging indents (~22px), journal names italic. Ends with a small-caps "Full list on Google Scholar →" link. The two venue-TODO entries remain marked TODO in content (unchanged by this redesign).

**CV (`/cv`)**
- Short intro line plus a prominent small-caps crimson link/button to `/cv.pdf` (the real 225 KB PDF already in the working tree — keep it).

**Teaching (`/teaching`)**
- Courses grouped under small-caps institution labels; term and level in italic after an em dash ("Course Title — Fall 2026, undergraduate"). Optional short teaching-philosophy paragraph under its own small-caps label. Existing content text.

**Contact (`/contact`)**
- Set like a colophon: address block (Department of Psychology, The University of Oklahoma, Norman, OK), "Email" small-caps label + jjkim@ou.edu, "Elsewhere" small-caps label + profile links (Google Scholar, etc. — whatever the current page lists).

## Technical plan

- Same Astro project at `~/projects/jeongjinkim.com`; same five routes; same Vercel auto-deploy pipeline (push to `main` → production; branches → preview URLs).
- Work happens on a fresh branch off `main` (off commit `8100770`).
- **Discard the current uncommitted WIP** (the abandoned hero redesign) **except**: `public/cv.pdf` (real CV) and `public/portrait.jpg` (new asset; keep in repo even though the design uses `headshot.jpg`).
- Files rewritten: `src/layouts/Layout.astro`, `src/components/Nav.astro` (becomes the masthead + dateline), `src/styles/global.css`, and the five files in `src/pages/`. Content text is preserved as-is from the committed versions (plus the "the University of Oklahoma" article fix), except the Home page, whose text is replaced with the user-supplied copy above — including the new "not admitting for Fall 2027" note, which supersedes the Fall 2026 recruitment callout everywhere it appears.
- Add dependency `@fontsource/source-serif-4`; import weights 400/600 + italic in the layout. No other new dependencies. No client-side JavaScript.
- Verify on the Vercel preview URL before merging to `main`.

## Out of scope

Unchanged by this redesign (tracked separately on the launch checklist): teaching course content, the two publication venue TODOs, office building confirmation, and pointing the custom domain jeongjinkim.com at Vercel.
