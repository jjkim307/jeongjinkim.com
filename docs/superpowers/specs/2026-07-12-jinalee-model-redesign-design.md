# jeongjinkim.com — Redesign on the jinalee.org Model

Date: 2026-07-12
Status: implemented on branch `jinalee-redesign` (through commit 3a5e61b); pending final user review before merge

> **Amendments (2026-07-13, user decisions):** The site is **English-only** — the entire Korean mirror (`/ko/…`), the KOR/ENG language pill, Pretendard, and hreflang alternates were removed; every "Korean pages" provision below is void. The CV source is now the **July 12, 2026 PDF** (11 journal articles — the tightness–looseness meta-analysis in press at *Applied Psychology: An International Review* and the 2026 *Current Psychology* situational-strength paper moved from R&R to published; R&R section trimmed to four). Home/Research show 11 publications.
Supersedes: `2026-07-12-journal-redesign-design.md` ("The Journal")

## Goal

Rebuild jeongjinkim.com to follow https://www.jinalee.org/ as the model in template, design, tabs, text-size control, and bilingual (English/Korean) structure — with JeongJin Kim's content in every page. Decisions confirmed 2026-07-12:

- Four tabs like the model: Home, Research, Teaching, CV. The Contact page is removed; contact lives in the hero buttons (Email, CV, Google Scholar, LinkedIn) and the footer.
- Korean name: 김정진.
- Korean copy: Claude drafts all Korean text following jinalee.org's register; the user reviews and corrects before launch.
- CV tab: full HTML CV transcribed from `public/cv.pdf`, with Download/Open-PDF buttons at the top.

## The model (verified against jinalee.org, 2026-07-12)

- Next.js static site; we replicate it in the existing **Astro** project (same repo, same Vercel pipeline). The two features that need JavaScript — font scaling and nothing else — are small inline vanilla scripts; the language toggle is plain links.
- Base font size **135%** (the model uses 125%; the user asked for slightly larger type overall, 2026-07-12); a header **text-size control** (`A− / 100% / A+`) multiplies it by a scale stored in `localStorage` (model key `jl-font-scale`; ours `jk-font-scale`), clamped to roughly 0.75–1.5, applied by an inline `<head>` script before paint so there is no flash.
- **Bilingual mirror**: English at `/`, `/research/`, `/teaching/`, `/cv/`; Korean at `/ko/`, `/ko/research/`, `/ko/teaching/`, `/ko/cv/`. A KOR/ENG pill in the header links to the same page in the other language. `hreflang` alternate links in `<head>`. `<html lang>` set per language.
- **Header** (sticky, 64px): name logotype left (serif; 김정진 on Korean pages); right side: text-size control, language pill, then tabs. Active tab gets weight + accent underline. Tabs stay in English on Korean pages; "Text size" → 글자 크기.
- **Footer**: © name · Email · Google Scholar · LinkedIn (the model also lists ORCID; we include it only if the user has one to add).

### Design tokens (model structure, warmed per user revision 2026-07-12)

The model's cool gray-blue neutrals are shifted slightly warm, and the slate/navy accent is replaced by OU crimson — used sparingly and **never as a text color**. Crimson appears only on non-text elements: the active-tab underline, the primary (Email) button background, link underlines (link text stays ink), the left edge of the PhD-note panel, and hover states of those same elements. Section labels, years, and all other type stay in the neutral tones.

| Token | Value |
|---|---|
| Background | `#f8f6f3` (warm off-white) |
| Surface | `#fff` |
| Border / light border | `#e5e0d8` / `#efebe4` |
| Text | `#2b2723` |
| Secondary text | `#6b6459` |
| Muted text (section labels, captions, years) | `#8d857a` |
| Hero statement | `#4a443c` |
| Accent — OU crimson (non-text only) | `#841617` (hover `#6d1213`) |
| Content max-width | 760px (wide 1000px), nav height 64px |

Fonts: **Inter** (UI/body sans), **Source Serif 4** (name, headings, hero statement), **IBM Plex Mono** (small labels, years), **Pretendard Variable** (Korean text; loaded from the jsdelivr CDN like the model, or self-hosted if preferred at implementation time). Google Fonts for the first three, matching the model.

## Pages — content from jeongjinkim.com

Content sources: the committed pages at `8100770`, the user's revised Home copy (2026-07-12), and `public/cv.pdf` (last updated June 4, 2026). The "not admitting for Fall 2027" note supersedes the old Fall 2026 recruitment callout everywhere.

**Home (`/`)** — one long page like the model:
1. **Hero**: "JeongJin Kim, Ph.D." (serif) / "Industrial-Organizational Psychologist" / "Assistant Professor of Psychology" / "The University of Oklahoma" / one-line serif-italic statement: "I study what shapes employees' performance behavior and well-being in the workplace." / buttons, in order: Email (crimson fill), CV, Google Scholar, LinkedIn / `headshot.jpg` right, ~270×331 (settled through mockup iterations, 2026-07-12), rounded with soft shadow. LinkedIn URL: https://www.linkedin.com/in/jeongjinjjkim/ (also in the footer next to Google Scholar).
2. **About**: the "why's and how's" paragraph and the three interconnected areas as a list. The former first sentence ("I am an industrial-organizational (I-O) psychologist and an Assistant Professor of Psychology at the University of Oklahoma.") is removed — the hero title lines now carry it.
3. **Prospective PhD students** notice in a light accent panel: "I do not plan to admit a PhD student for Fall 2027."
4. **Publications**: all nine peer-reviewed publications from the CV, by recency, APA format, `Kim, J. J.` bolded, year in mono, DOI ↗ links. (This replaces the old research page's two venue-TODO entries; the CV has full citations.) **No Work in Progress and no R&R/under-review section** — published work only (user decision 2026-07-12; the R&R entries still appear inside the CV tab's transcription, since that reproduces the PDF).
5. **Teaching** teaser: one sentence + "Teaching →" link.

**Research (`/research/`)** — page title, then the committed intro sentence and the three programs as sections in the model's style (accent section labels): Person–Situation Interactions; Attitudes and Affect/Emotions at Work; Employee Performance Behavior — each with its full committed paragraph, followed by a "Related work" list of the CV publications belonging to that stream — published work only, no R&R/under-review entries (Claude maps publications to streams; user reviews the mapping).

**Teaching (`/teaching/`)** — "Courses" under a "The University of Oklahoma" heading, model style (title, description, term line in muted text): PSY 2003 Understanding Statistics (Fall 2025) and PSY 3753 Introduction to Industrial-Organizational Psychology (Fall 2025; Spring 2026), with the committed course descriptions. Terms from the CV. No teaching-philosophy section unless the user supplies one.

**CV (`/cv/`)** — "Curriculum Vitae", "Last updated June 4, 2026.", buttons "Download CV (PDF)" and "Open PDF in New Tab", then the full CV in HTML sections transcribed from the PDF: Academic Appointment, Education, Research Interests, Peer-Reviewed Publications, R&R/Under Review, Grants and Research Funding, Awards & Honors, Conference Presentations (all 29), Teaching Experience, Institutional and Professional Service, Professional Affiliations, Media Coverage. The PDF's two-column year/amount layout garbles plain-text extraction; transcription must re-pair years and amounts with entries carefully and be checked against the rendered PDF.

**Korean pages (`/ko/…`)** — full mirrors. Claude drafts the Korean prose (bio, research paragraphs, teaching descriptions, section labels: 소개, 논문, 강의 등) in the register of jinalee.org's Korean pages; the user reviews all Korean text before merge. Fixed by the user (2026-07-12):
- Hero name: **김정진** with no ", Ph.D." suffix.
- Hero title line: **산업조직심리학자 / 심리학과 조교수** (then "The University of Oklahoma" beneath, in English).
- Hero statement: **"일터에서 직장인들의 수행 행동과 웰빙을 연구합니다."**
- **Nav tabs stay in English** (Home, Research, Teaching, CV) on Korean pages; the text-size label is 글자 크기.
- Hero/footer buttons stay in English and in the same order: Email (not 이메일), CV, Google Scholar, LinkedIn.
- Also kept in English, as the model does: institution names, publication citations, course codes.

**Removed**: the Contact page. `/contact` gets a redirect to `/` (Astro redirect) so old links don't 404. The Dale Hall Tower address drops off the site (it lives in the CV PDF); the pronunciation TODO from the old contact page is dropped.

## Technical plan

- Same Astro project at `~/projects/jeongjinkim.com`, same Vercel auto-deploy (push to `main` → production; branches → preview URLs). `nvm use --lts` before any npm/astro command.
- Fresh branch off current `main`. Discard the uncommitted WIP except `public/cv.pdf` and `public/portrait.jpg`.
- Rewritten/created: `src/layouts/Layout.astro` (head scripts, fonts, hreflang), a Header component (logotype, text-size control, language pill, tabs), `src/styles/global.css` (tokens above), eight page files (`index`, `research`, `teaching`, `cv` × en/ko), footer; `src/pages/contact.astro` replaced by a redirect. Content likely factored into a shared data module so the en/ko pages don't duplicate publication lists.
- New assets/deps: Google Fonts or `@fontsource` for Inter/Source Serif 4/IBM Plex Mono, Pretendard CDN link. No framework JS; only the inline font-scale script and the header widget's few lines of vanilla JS.
- Verify on the Vercel preview URL (both languages, font-size persistence, mobile) before merging to `main`.

## Out of scope

Custom domain pointing, ORCID (unless provided), Korean proofreading beyond the user's own review, and any CV content updates beyond faithful transcription of the June 2026 PDF.
