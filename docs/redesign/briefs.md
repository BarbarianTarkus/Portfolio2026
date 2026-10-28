# Redesign paths — brief (source of truth for this proposal)

Status: proposal input, not implemented. Written 2026-10-28.

This file is the shared brief for the redesign proposal. It was written first;
where [`feasibility.md`](feasibility.md) later costed a path more precisely, the
feasibility figures win (A 3.5 d, B 6 d, C 6.5 d, D 7.5 d). Four distinct paths
are defined here. The **tokens in this file are locked for the mockups**:
mockups must render exactly these values so the four directions are comparable.
Reviewers may argue that a token is wrong, but they must not silently change it.

Site facts that every path must respect:

- Deno Fresh + Preact, static-site generated (`deno task ssg` → `dist/`).
- Plain CSS, no preprocessor, no build step for styles
  (`static/styles/main.css`).
- `basePath` is `/Portfolio` in the built output — every asset/link is prefixed.
- No image assets exist. Previews must work with CSS/SVG only.
- Copy is Spanish. Do not invent new claims; reuse the real copy below.
- SSG verifier fails the build on broken internal links and missing pages.
- Only 5 project fiches exist; the catalogue is small on purpose.

## Current state (baseline, measured)

| Aspect   | Value                                                                                      |
| -------- | ------------------------------------------------------------------------------------------ |
| Palette  | bg `#0e1217`, accent `#f1c81b`, brand orange `#fb9b18`, body `#8892b0`, emphasis `#ccd6f6` |
| Type     | Roboto Condensed 700 (headings), system sans (body), Fira Code (labels)                    |
| Shell    | 54rem (864px) single centred column; on a 1440px viewport ~576px is empty                  |
| Routes   | `/`, `/projects`, `/about`, `/contact`, 404                                                |
| Home     | hero + one `h2` + three equal `.archetype-card` links                                      |
| Projects | five full fiches stacked; ~5,500px tall at 1440px, no index, no summary layer              |
| Motion   | hover colour only; global `prefers-reduced-motion` rule                                    |
| Lineage  | ported from a Brittany-Chiang-style SvelteKit theme — reads as a known template            |

Audit conclusions that drive the paths:

1. **Identity is borrowed.** Navy + yellow + condensed caps + code labels is a
   well-known template lineage; nothing in the visual layer says _this_ person.
2. **No evidence layer.** No screenshots, no metrics, no homelab diagram, no
   logos. Every claim is prose.
3. **Projects page is a wall.** Five fiches, equal weight, no index or scanning
   layer; a recruiter cannot find the strongest project in 10 seconds.
4. **Accent inflation.** Yellow is used for h2, links, tags, buttons, numbers
   and the logo; the accent stops meaning anything.
5. **Wasted canvas.** A 2019-era centred column on a modern desktop.
6. **No print story.** The content is CV-adjacent but there is no print
   stylesheet.

## Path A — "Signal" (same brand, sharper craft)

**Idea:** keep the navy/yellow/code DNA that already exists and spend the effort
on craft instead of identity. The site stops looking like a template because
every decisions is made deliberately: one accent used rarely, a real grid, an
evidence strip, and a project index that leads somewhere.

**Choose it when:** the goal is interviews in the next few weeks and the risk
budget is low. It is the cheapest path that fixes the audit's real problems.

**What changes:** token layer only in spirit — the identity survives, but the
shell widens, the accent shrinks to ~8% of the surface, cards lose their "tile"
quality, and both the home and projects pages gain a scanning layer.

### Tokens (locked)

```
--bg:        #0B0E13   page
--surface:   #12171F   raised block (no shadow)
--surface-2: #1A212B   hover / inset
--line:      #232C38   1px rules and borders
--text:      #CBD3DF   body
--muted:     #7F8CA3   meta, secondary prose
--accent:    #F1C81B   the only accent: links, active state, CTA, index numbers
--accent-dim:#8A7620   accent at rest for large numerals
--brand:     #FB9B18   logo "R" only, as today
--radius:    2px       near-square; the old 8px reads "webapp"
```

Rules: accent text never smaller than 15px; no accent-tinted card backgrounds;
rules are always 1px `--line`, never filled boxes.

### Type (locked)

- Display: **Roboto Condensed 700** (kept) at 64/56/40px,
  `letter-spacing:-0.01em`.
- Body: **Inter 400/500** (new, replaces the system stack) at 17px/1.65.
- Meta/labels/mono: **Fira Code 400** (kept) at 13px, uppercase,
  `letter-spacing:0.08em`.
- Measure: prose capped at 62ch; page shell 68rem; grid 12 columns, content 1–8.

### Structure (locked)

- **Home:** hero (eyebrow, name 64px, role, one-paragraph intro, 2 actions) →
  evidence strip (3 inline metrics separated by 1px rules, no cards) → "Trabajo
  seleccionado" as a **numbered index list** (year / name / stack / one-line
  outcome / arrow), 3 rows, rules between → "Qué hago" compressed to two columns
  of prose + a stack list, no cards → footer CTA.
- **Projects:** short index table at the top (name · stack · period · link),
  then fiches with a sticky left rail (`01–05` anchor links). "Qué se rompió"
  becomes a pull-quote with a 2px accent rule.
- **About:** two-column: 4ch margin column with section numbers, 8ch prose.
- **Contact:** three rows, not cards: label · handle · arrow.

### Motion (locked)

120–180ms `opacity`/`translateY(4px)` on hover and in-view reveal; no parallax,
no scroll-jacking. Reduced-motion: opacity only.

**Effort:** M (2–3 days). **Risk:** low. **Fixes audit items:** 2, 4, 5, 6
partial.

## Path B — "Operator" (the site as a well-configured console)

**Idea:** the differentiator is the dev + sysadmin hybrid, so the interface
behaves like the environment he runs: monospace chrome, status line, paths as
breadcrumbs, `man`-page fiches, keyboard-first navigation. The fiction is honest
— the content already reads like engineering notes.

**Choose it when:** the goal is memorability with engineering managers and the
budget tolerates a week of careful work plus an island.

**What changes:** near-black palette, phosphor green accent, mono chrome
everywhere except prose, a persistent status bar, a command palette, and a
project page organised as man pages.

### Tokens (locked)

```
--bg:        #06080A
--panel:     #0C1014
--panel-2:   #12171C
--line:      #1E262E
--text:      #D3DAE1
--muted:     #8A96A3
--accent:    #7CE38B   phosphor green: prompts, active path, success
--warn:      #F0B25E   secondary accent: status, dates
--danger:    #F2555A   "qué se rompió"
--radius:    0         square, terminal-like
```

Rules: mono is chrome, never long prose — body paragraphs are IBM Plex Sans; the
two accents are semantic (green = live/ok, amber = meta), not decorative.

### Type (locked)

- Chrome / headings / labels: **JetBrains Mono 400/700**, 13–40px.
- Body prose: **IBM Plex Sans 400/500**, 17px/1.6.
- Display: JetBrains Mono 700, `letter-spacing:-0.03em`, 56px max.

### Structure (locked)

- **Status bar** (top, 32px, always visible): `~/ricardo` · `main` · `200 OK` ·
  `CET 03:41` · `⌘K`.
- **Home:** prompt line (`$ whoami`), name as output, role, intro, then a
  `ls -l` style list of three areas with sizes/permissions as metadata, then
  `git log --oneline`-style recent work.
- **Projects:** man-page layout: `NAME`, `SYNOPSIS` (summary + tags), `DETAILS`
  (decisions), `BUGS` ("qué se rompió"), `TODO` ("qué haría distinto"). Anchors
  as `/projects#petsalut`.
- **Command palette** (island): `⌘K` → go to page, copy email, open GitHub.
- **Contact:** `ssh`-style: `ricardo@portfolio:~$ contact --email`.

### Motion (locked)

80–120ms, `steps`-free but snappy; caret blink on the prompt; no easing longer
than 150ms. Reduced-motion kills the caret and the typing effect.

**Effort:** L (4–6 days; needs one island for the palette + a lot of type
discipline). **Risk:** medium — mono prose would hurt reading, and the aesthetic
fails if the copy is not terse. **Fixes:** 1, 2 partial, 3.

## Path C — "Dossier" (editorial, light, print-first)

**Idea:** the writing is the product; treat the site as a technical broadsheet.
Warm paper, one vermilion accent, an asymmetric editorial grid with marginalia,
and case studies instead of fiches. Light theme is the differentiator: almost
every dev portfolio is dark.

**Choose it when:** the goal is credibility and readability — recruiters who
read, people who print, and humans who are tired of dark templates.

**What changes:** whole visual identity; same information architecture with a
much stronger typographic hierarchy and a real print stylesheet.

### Tokens (locked)

```
--paper:    #F5F2EA   page
--paper-2:  #EDE8DC   inset / table rows
--ink:      #14161B   headings and body
--muted:    #5C6270   meta
--rule:     #D6CFBF   hairlines
--accent:   #B4340F   vermilion: section numbers, links, rules
--accent-2: #1F4E79   inline links inside prose
--night:    #14161B   code/mono blocks invert to dark
```

Rules: no shadows, no radii, no gradients; the only "effects" are rules, indents
and type size; accent is used for numbers and navigational marks, not for body
text.

### Type (locked)

- Display: **Playfair Display 700/900** (serif), 56–72px, tight leading.
- Body: **Source Serif 4 400/600**, 19px/1.65 — reading-optimised.
- Meta/mono: **JetBrains Mono 400**, 12px uppercase `letter-spacing:0.12em`.
- Measure 66ch; grid 12 columns with a 3-column margin for labels/numbers.

### Structure (locked)

- **Home:** masthead (name in 72px serif, role as a rule-separated subtitle,
  date/edition line) → lede paragraph at 24px → "Selected work" as three
  **case-study blocks** with a title block (role, period, stack) and 2-column
  body text → closing "currently" note → colophon footer.
- **Projects:** each project opens as a case study: title block across the full
  measure, `Problem / Decisions / What broke / Next` as numbered sections in the
  8-column body, stack and links in the 3-column margin.
- **About:** CV as a printed table (role · company · period) with prose margins.
- **Print CSS:** `@media print` — paper white, no nav, projects as a CV
  appendix.

### Motion (locked)

Almost none: 150ms underline draw on links, 200ms fade for images. This path is
about stillness; anything more fights the print metaphor.

**Effort:** M (3 days; 3 font files, print CSS, and the most demanding grid).
**Risk:** medium — leaves the "dark hacker" identity and needs the light theme
to be genuinely well tuned. **Fixes:** 1, 2 partial, 3, 5, 6.

## Path D — "Homelab" (bento dashboard, show don't tell)

**Idea:** sell the systems half visually. A bento grid of artifacts: live-ish
status tile, homelab topology diagram, selected work with screenshots, stack
chips. Modern product-site language, contained to stop short of SaaS slop.

**Choose it when:** the goal is visual impact and he can produce (or accept
CSS-only) artwork: a topology diagram, 3 project screenshots, an avatar.

**What changes:** palette to a cooler dark, a genuine grid system, and — the
expensive part — an artwork layer that does not exist today.

### Tokens (locked)

```
--bg:      #080B0F
--tile:    #0F141A
--tile-2:  #151C24
--line:    #1D2731
--text:    #E6EBF1
--muted:   #8C99A8
--accent:  #6E8BFF   periwinkle: primary action, links
--ok:      #4FD1A5   status/success
--warn:    #FFB454   attention
--radius:  16px      tiles
```

Rules: tile borders always 1px `--line`; one gradient max per view; no glass
blur; illustrations are flat SVG, never stock photos.

### Type (locked)

- Display: **Space Grotesk 600/700**, 52–60px, `letter-spacing:-0.02em`.
- Body: **DM Sans 400/500**, 16px/1.6.
- Mono (data, chips): **JetBrains Mono 400**, 12px.

### Structure (locked)

- **Home bento (12-col):** hero tile 7×2 → status tile 5×1 (uptime, last deploy)
  → stack tile 5×1 → homelab diagram tile 7×2 → selected work 3 tiles → CTA tile
  full width.
- **Projects:** card grid with 16:10 media, hover lift 2px, then detail pages
  reusing the fiche blocks.
- **About:** timeline as a vertical rail with tiles; homelab as a diagram, not a
  paragraph.
- **Contact:** one wide tile + two small.

### Motion (locked)

200–280ms `cubic-bezier(.2,.8,.2,1)`: tile hover lift + border brighten,
staggered 40ms entrance on first scroll. Reduced-motion: no transform, fade
only.

**Effort:** L (5–7 days including artwork). **Risk:** high — needs real imagery
and a homelab diagram; without them it reads as an empty AI-generated SaaS page.
**Fixes:** 2, 3, 5.

## Corrections after contrast verification (2026-10-28, authoritative)

[`research.md`](research.md) computed WCAG ratios for every locked pair. Three
corrections apply and **override the token tables above**. Nothing else changed.

| Path | Problem                                                                  | Correction                                                                                                                                                                    |
| ---- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | `--accent-dim #8A7620` = 4.32 on bg, 3.62 on surface-2 — fails 4.5:1     | `--accent-dim: #98873B` (worst pair 4.52)                                                                                                                                     |
| C    | inverted `--night` blocks: accent 2.96, accent-2 2.09, muted 2.96 — fail | add context tokens: `--accent-on-night: #C56346` (4.52), `--accent-2-on-night: #6283A1` (4.55), `--muted-on-night: #7A7F8A` (4.51); paper-context accent stays for paper only |
| D    | tile/bg separation 1.07:1, line/tile 1.22:1 — grouping nearly invisible  | keep the shadow ban; add a visible `--tile` step plus `1px --line`, and `#575E66` for any border that bounds an interactive control (3:1)                                     |

Decorative hairlines below 3:1 remain WCAG-exempt (1.4.11) — but a border that
is the only affordance of a control must reach 3:1 (`#595F69` on A's bg,
`#575D63` on B's, `#8A857B` on C's paper).

## Copy to reuse in the mockups

From `data/site.ts` / `routes/index.tsx` — do not rewrite:

- Eyebrow: `Hola, me llamo`
- Name: `Ricardo Verduguez.`
- Role: `Desarrollador full-stack con base en sistemas`
- Intro:
  `Construyo aplicaciones web en producción y mantengo la infraestructura
  que las sostiene: un homelab con NAS, VPN, servidor Git propio y servicios
  publicados por túnel de Cloudflare.`
- Highlights: `2 años y 8 meses en producción` ·
  `Ingeniería Informática (UPC, 2026)` · `Badalona, Barcelona`
- CTA: `Ver proyectos`
- Section: `Qué hago` with the three archetypes (Infraestructura y seguridad /
  Desarrollo full-stack / Experiencia real) and their bodies.
- Projects: `Herramientas para Moodle` (Python, PHP, Moodle, PyInstaller,
  oct–nov 2023), `PetSalut` (C++, PostgreSQL, GitHub Actions, Azure Functions,
  mar–jun 2024), `Password-Manager` (PostgreSQL, PostgREST, Svelte, Docker,
  2022–2025), `rebost-api` (Deno, TypeScript, Deno KV, Oak, abril 2025),
  `Mixology-Luismi` (Astro, TinaCMS, Cloudflare, GitHub Actions, ene–oct 2026).
- Nav: `01. Proyectos` / `02. Sobre mí` / `03. Contacto`.

## Hard constraints for the previews

1. Static HTML + inline `<style>`, no build step, no external CSS files.
2. System-safe fallbacks in every `font-family` stack; the Google Fonts `<link>`
   may be included but the mock must not collapse without it.
3. Must be legible and non-overflowing at 390px and 1440px.
4. Only real content from this brief. No lorem ipsum, no invented employers, no
   fake metrics beyond the ones already listed.
5. Every interactive element ≥44px on touch targets; visible focus styles.
6. No emoji as icons. Inline SVG or CSS glyphs only.
