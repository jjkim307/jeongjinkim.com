# jeongjinkim.com — Redesign on the jinalee.org Model

Date: 2026-07-12
Status: pending user approval
Supersedes: `2026-07-12-journal-redesign-design.md` ("The Journal")

## Goal

Rebuild jeongjinkim.com to follow https://www.jinalee.org/ as the model in template, design, tabs, text-size control, and bilingual (English/Korean) structure — with JeongJin Kim's content in every page. Decisions confirmed 2026-07-12:

- Four tabs like the model: Home, Research, Teaching, CV. The Contact page is removed; contact lives in the hero buttons (CV, Google Scholar, Email) and the footer.
- Korean name: 김정진.
- Korean copy: Claude drafts all Korean text following jinalee.org's register; the user reviews and corrects before launch.
- CV tab: full HTML CV transcribed from `public/cv.pdf`, with Download/Open-PDF buttons at the top.

## The model (verified against jinalee.org, 2026-07-12)

- Next.js static site; we replicate it in the existing **Astro** project (same repo, same Vercel pipeline). The two features that need JavaScript — font scaling and nothing else — are small inline vanilla scripts; the language toggle is plain links.
- Base font size 125%; a header **text-size control** (`A− / 100% / A+`) multiplies it by a scale stored in `localStorage` (model key `jl-font-scale`; ours `jk-font-scale`), clamped to roughly 0.75–1.5, applied by an inline `<head>` script before paint so there is no flash.
- **Bilingual mirror**: English at `/`, `/research/`, `/teaching/`, `/cv/`; Korean at `/ko/`, `/ko/research/`, `/ko/teaching/`, `/ko/cv/`. A KOR/ENG pill in the header links to the same page in the other language. `hreflang` alternate links in `<head>`. `<html lang>` set per language.
- **Header** (sticky, 64px): name logotype left (serif; 김정진 on Korean pages); right side: text-size control, language pill, then tabs. Active tab gets weight + accent underline. Korean tab labels: 홈 · 연구 · 강의 · CV; "Text size" → 글자 크기.
- **Footer**: © name · Google Scholar · Email (the model also lists ORCID; we include it only if the user has one to add).

### Design tokens (copied from the model's CSS)

| Token | Value |
|---|---|
| Background | `#f5f7f8` |
| Surface | `#fff` |
| Border / light border | `#dfe5e9` / `#edf1f3` |
| Text | `#252b30` |
| Secondary text | `#59636b` |
| Muted text | `#7f8a92` |
| Accent | `#526b7d` (hover `#3e5566`) |
| Navy (primary buttons) | `#3e536d` (hover `#2d4058`) |
| Accent light (tint panels) | `#eef2f4` |
| Content max-width | 760px (wide 1000px), nav height 64px |

Fonts: **Inter** (UI/body sans), **Source Serif 4** (name, headings, hero statement), **IBM Plex Mono** (small labels, years), **Pretendard Variable** (Korean text; loaded from the jsdelivr CDN like the model, or self-hosted if preferred at implementation time). Google Fonts for the first three, matching the model.

**Palette note:** the accent stays the model's slate blue for an exact copy. Swapping to OU crimson `#841617` is a one-variable change if the user later wants the palette localized.

## Pages — content from jeongjinkim.com

Content sources: the committed pages at `8100770`, the user's revised Home copy (2026-07-12), and `public/cv.pdf` (last updated June 4, 2026). The "not admitting for Fall 2027" note supersedes the old Fall 2026 recruitment callout everywhere.

**Home (`/`)** — one long page like the model:
1. **Hero**: "JeongJin Kim, Ph.D." (serif) / "Assistant Professor of Psychology" / "The University of Oklahoma" / one-line serif-italic statement: "I study what shapes employees' performance behavior and well-being in the workplace." / buttons: CV (navy), Google Scholar, Email / `headshot.jpg` right, ~150×184, rounded with soft shadow.
2. **About**: the user's verbatim bio copy — the I-O psychologist paragraph, the "why's and how's" paragraph, and the three interconnected areas as a list.
3. **Prospective PhD students** notice in a light accent panel: "I do not plan to admit a PhD student for Fall 2027."
4. **Publications**: "Journal Articles" — all nine peer-reviewed publications from the CV, by recency, APA format, `Kim, J. J.` bolded, year in mono, DOI ↗ links. (This replaces the old research page's two venue-TODO entries; the CV has full citations.)
5. **Work in Progress**: the six R&R/under-review entries from the CV, with status tags (R&R3 under review, etc.).
6. **Teaching** teaser: one sentence + "Teaching →" link.

**Research (`/research/`)** — page title, then the committed intro sentence and the three programs as sections in the model's style (accent section labels): Person–Situation Interactions; Attitudes and Affect/Emotions at Work; Employee Performance Behavior — each with its full committed paragraph, followed by a "Related work" list of the CV publications belonging to that stream (Claude maps publications to streams; user reviews the mapping).

**Teaching (`/teaching/`)** — "Courses" under a "The University of Oklahoma" heading, model style (title, description, term line in muted text): PSY 2003 Understanding Statistics (Fall 2025) and PSY 3753 Introduction to Industrial-Organizational Psychology (Fall 2025; Spring 2026), with the committed course descriptions. Terms from the CV. No teaching-philosophy section unless the user supplies one.

**CV (`/cv/`)** — "Curriculum Vitae", "Last updated June 4, 2026.", buttons "Download CV (PDF)" and "Open PDF in New Tab", then the full CV in HTML sections transcribed from the PDF: Academic Appointment, Education, Research Interests, Peer-Reviewed Publications, R&R/Under Review, Grants and Research Funding, Awards & Honors, Conference Presentations (all 29), Teaching Experience, Institutional and Professional Service, Professional Affiliations, Media Coverage. The PDF's two-column year/amount layout garbles plain-text extraction; transcription must re-pair years and amounts with entries carefully and be checked against the rendered PDF.

**Korean pages (`/ko/…`)** — full mirrors. Claude drafts the Korean prose (bio, statement, research paragraphs, teaching descriptions, UI labels: 소개, 논문, 진행 중인 연구, 강의, 예비 대학원생 등) in the register of jinalee.org's Korean pages. Kept in English on Korean pages, as the model does: institution names, publication citations, course codes, "CV", "Google Scholar". Name renders as 김정진. The user reviews all Korean text before merge.

**Removed**: the Contact page. `/contact` gets a redirect to `/` (Astro redirect) so old links don't 404. The Dale Hall Tower address drops off the site (it lives in the CV PDF); the pronunciation TODO from the old contact page is dropped.

## Technical plan

- Same Astro project at `~/projects/jeongjinkim.com`, same Vercel auto-deploy (push to `main` → production; branches → preview URLs). `nvm use --lts` before any npm/astro command.
- Fresh branch off current `main`. Discard the uncommitted WIP except `public/cv.pdf` and `public/portrait.jpg`.
- Rewritten/created: `src/layouts/Layout.astro` (head scripts, fonts, hreflang), a Header component (logotype, text-size control, language pill, tabs), `src/styles/global.css` (tokens above), eight page files (`index`, `research`, `teaching`, `cv` × en/ko), footer; `src/pages/contact.astro` replaced by a redirect. Content likely factored into a shared data module so the en/ko pages don't duplicate publication lists.
- New assets/deps: Google Fonts or `@fontsource` for Inter/Source Serif 4/IBM Plex Mono, Pretendard CDN link. No framework JS; only the inline font-scale script and the header widget's few lines of vanilla JS.
- Verify on the Vercel preview URL (both languages, font-size persistence, mobile) before merging to `main`.

## Out of scope

Custom domain pointing, ORCID (unless provided), Korean proofreading beyond the user's own review, and any CV content updates beyond faithful transcription of the June 2026 PDF.
