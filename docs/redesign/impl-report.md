# Path A · Signal — independent implementation audit

**Snapshot audited.** Working tree on top of `92039d3`;
`git diff HEAD | sha256sum` = `7caf251ba…` (2026-10-28 04:41 UTC). The Lead was
editing during the audit (Header.tsx 04:39, main.css 04:40); two defects from
the earlier state (logo `aria-current="true"` on inner routes, `.button-ghost`
1.37:1 border) are fixed here and not reported. All findings re-verified against
`7caf251ba…`; this audit wrote only this file.

## 1. Verification I ran

| Check                 | Command / method                       | Result                                                                                                             |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Format + lint + types | `deno task check`                      | **exit 0** (fmt 43 files, lint 25, check 25)                                                                       |
| Static export         | `deno task ssg`                        | **exit 0** — 5 pages, 147.6 kB, `.nojekyll`, **76 internal URLs verified**; no warnings                            |
| Fragments + HTML      | script/parser over the 6 `dist/*.html` | all 8 fragments resolve (`#main`, `/about#homelab`, `/projects#{5 slugs}`); no unclosed elements, no duplicate ids |

## 2. Accessibility (built HTML + computed CSS)

### 2.1 Heading order — valid on every route, no skipped levels

| Route              | Sequence                                                |
| ------------------ | ------------------------------------------------------- |
| `/`                | h1 name → h2 ×3 (Experiencia, Proyectos, Stack) → h3 ×7 |
| `/experience`      | h1 → h2 ×3 → h3 ×4 (3 roles + formación)                |
| `/projects`        | h1 → h2 ×5 (fiche titles) → h3 ×18 (block labels)       |
| `/about`           | h1 → h2 ×2                                              |
| `/contact`, `/404` | h1 only                                                 |

### 2.2 Landmarks, aria-current, articles

- Landmarks: one `header`/`main`/`footer`; `main#main[tabindex=-1]`; navs
  uniquely labelled (2 per page — `Navegación principal`, `Redes`; 3 on
  `/projects`).
- Articles: 5 `<article aria-labelledby="<slug>-title">` → named by the 5
  project names; fixes the "5 anonymous articles" baseline defect from
  `feasibility.md`.

| Route          | `aria-current="page"`                                | Logo    |
| -------------- | ---------------------------------------------------- | ------- |
| `/`            | none — **home has no current-page indicator** (P2-1) | `false` |
| 4 inner routes | own nav item ✓                                       | `false` |
| `/404`         | none (home button forced `false`) ✓                  | `false` |

### 2.3 Contrast — computed (sRGB relative luminance), every pair actually rendered

| Pair                                                                |                      Ratio | Verdict                          |
| ------------------------------------------------------------------- | -------------------------: | -------------------------------- |
| `--text` on `--bg`                                                  |                      12.81 | pass                             |
| `--text-strong` on `--bg`                                           |                      16.43 | pass                             |
| `--muted` on `--bg` (incl. 10–11px `.kind`/`.tag`/`.work-stack`)    |                       5.69 | pass                             |
| `--accent` on `--bg`                                                |                      11.98 | pass                             |
| `--accent-dim` on `--bg` (12px numerals)                            |                       5.40 | pass                             |
| `--brand` on `--bg` (logo, 24px bold)                               |                       9.02 | pass                             |
| `--bg` on `--accent` / `--accent-bright` (button, skip link, hover) |              11.98 / 13.97 | pass                             |
| `--text-strong` on `--surface` (inline `code`)                      |                      15.28 | pass                             |
| `--line` on `--bg` (hairlines, resting link borders)                |                   **1.37** | decorative OK; see P1-3          |
| `--line-strong` on `--bg` (new control-border token, used once)     |                       3.01 | pass 3:1                         |
| print: `--text`/`--muted`/`--line`/`--surface-2` on white           | 17.40 / 8.86 / 1.98 / 1.25 | text passes; last two decorative |

No contrast failure in the shipped dark theme. `main.css:30` still says
"accent-dim 4.52:1 … against `--bg`" — 4.52 is the _surface-2_ worst pair, 5.40
is the bg pair (P2-12).

### 2.4 Touch targets — computed from CSS, at 390px unless noted

| Control                                                                 | Where                                  | Size            | ≥44? |
| ----------------------------------------------------------------------- | -------------------------------------- | --------------- | ---- |
| nav links                                                               | `main.css:309-316`                     | 44 × ~120       | ✓    |
| menu / close buttons                                                    | `340-352`                              | 44 × 44         | ✓    |
| buttons, skip link, `.text-link`, fiche links                           | `505-509, 133-138, 548-552, 1146-1150` | ≥44 tall        | ✓    |
| work rows, contact rows                                                 | `770-786`, `1172-1190`                 | ≥100 / 48+ tall | ✓    |
| footer icons                                                            | `1290-1297`                            | 44 × 44         | ✓    |
| **logo "R"**                                                            | `284-292` (24px/1, no padding)         | **~13 × 24**    | ✗    |
| **`.section-link`** ("Ver el detalle", "Los 5 proyectos", "El homelab") | `661-671`                              | **~90 × 20**    | ✗    |
| **`.footer-mail`**                                                      | `1269-1280`                            | **~250 × 27**   | ✗    |
| **`.fiche-rail a`** (≥64rem, touch tablets too)                         | `998-1008`                             | **~200 × 36**   | ✗    |

### 2.5 Focus and skip link

`:focus-visible` = 2px `--accent` outline, offset 3px (`main.css:116-119`,
11.98:1 on bg). Skip link: first tab stop, 44px, revealed on focus, target
`#main[tabindex=-1]` (`main.css:133-151`, `routes/_app.tsx:57`). Overlay moves
focus to the close button, traps Tab between first/last item, returns focus to
the toggle — no trap gap found.

## 3. No-JS mobile navigation — reachable, with one residual hydration gap

Proof from source: the built page ships `<html lang="es">` with **no** `js`
class; `static/js/enable-js.js` adds it before paint (`routes/_app.tsx:40`).
`html:not(.js) .menu-button { display:none }` (`main.css:363`) hides both
buttons and every overlay rule is scoped `html.js` (`376-421`); otherwise
`.main-nav` is just `flex-basis:100%` with a wrapping `ul` of 44px links
(`279-316`). **With JS disabled the nav is a plain visible list — the baseline
defect is fixed.** Residual: the `js` class comes from a separate 4-line file,
not the island; if `enable-js.js` loads but the Header bundle does not (404,
CSP, parse error) the mobile nav is `visibility:hidden` (`376-394`) and the
toggle has no handler → unopenable below 48rem (P2-6).

## 4. Responsive fragility (no horizontal overflow assumed; looking for traps)

| Width | Observation                                                                                                                                                                                                                                  |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 390   | `.work-row` 2-col (3.5rem + 1fr): longest stack line ≈264px of 278px available — tight. `.contact-value` email ≈250px at 22px display font in a 1fr track with **no `overflow-wrap`** → overflows below ~320px (P2-11).                      |
| 768   | 4-col `.work-row`; `.job` = 13.5rem + 1fr. `.job-period` is `nowrap` (`755-758`): longest string (`noviembre 2020 — enero 2022`) computes to ~215px in a 216px track — 1px headroom, one font-metric change from spilling into the 2rem gap. |
| 1024  | `.fiche-rail` appears at 64rem (13rem + 4rem gap + 1fr); sticky `top:2rem` with no `max-height`/`overflow` — on very short viewports the last rail item can sit below the fold (low risk).                                                   |
| 1440  | content 1008px, `--shell:68rem` correctly clamped (border-box + padding-inline), no overflow. `.job-points` is **not** measure-capped → 760px ≈ 90–100 characters (P1-1); `.work-summary` ≈76ch.                                             |

Fixed columns/nowrap that matter: `.job-period` (above), `.contact-arrow`
(decorative), `.work-year` (short). No unbreakable string is wrapped defensively
anywhere.

## 5. Content and consistency

| Question                           | Answer                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does experience lead?              | Yes: primary hero CTA, nav item 01, home section 01 before projects, `/projects` and `/about` both link to it. Gap: `/contact` points to it only via the nav.                                                                                                                                                                                                                    |
| Work vs GitHub projects separated? | Yes: own route, explicit lede ("Repositorios públicos, no historial laboral"), home note, `kind` labels, separate data source. 4/5 kind labels are clearly correct (`moodle`/`rebost-api` propio, `petsalut`/`password-manager` académico); the soft point is `kind:"cliente"` on Mixology, whose copy says "un amigo … presupuesto casi nulo" (`data/site.ts:236,250`) — P2-10. |
| Invented claims / broken Spanish   | No broken Spanish found. No new invented claim, but two soft claims survive from the old copy: **Rust** (`routes/index.tsx:25,37`) appears in no project or job; **Active Directory** is in the 3iPunt `stack` (`data/site.ts:315`) but in none of its bullets, contradicting that field's own doc comment (`data/site.ts:49`) — P2-10.                                          |
| Duplication                        | `site.highlights` (`data/site.ts:99-104`) is now dead and duplicates the home `evidence` array (`routes/index.tsx:6-10`); the homelab stack is copy-pasted in two routes (`routes/index.tsx:46-55`, `routes/about.tsx:5-16`) — P2-9.                                                                                                                                             |
| Dead CSS / tokens                  | Only `.meta` (`main.css:256`) targets nothing. `--surface-2` is documented "hover / inset" but only colours the decorative 404 numeral (`1341`); `--surface` only styles inline `code`. `Inter 500` is downloaded but no rule uses it (`routes/_app.tsx:50`) — P2-8.                                                                                                             |

## 6. Print — what a PDF actually shows

`@media print` (`main.css:1394-1467`) resets tokens to paper, hides nav, skip
link, hero CTAs, social icons, rail and section links, sets `@page margin 14mm`
and 11pt body, restores the `.job` two-column grid with wrapping periods, keeps
jobs/fiches/rows unbroken, forces every fiche onto a new page and appends
external URLs.

- `/experience` → 1–2 page CV, LinkedIn URL printed. `/projects` → page 1 =
  5-row index, pages 2–6 = one fiche each with GitHub URLs printed. `/` → ~3
  pages.
- Nits: header prints a lone "R" on page 1; every fiche breaks, including the
  first (index alone on its page); the 404 numeral is invisible (1.25:1,
  decorative).
- At 14mm margins the A4/Letter page box is ~688/739px (<48rem), so every
  `min-width:48rem` rule is inert: only `.job` was re-added, so the evidence
  strip and work index print in the 390px layout (P2-7).

## 7. Ranked defects

**P0 — must fix: none.** Build, routes, links, fragments, landmarks, contrast
and the print sheet all hold; nothing in this snapshot blocks shipping.

### P1 — should fix

| #    | Finding                                                                                                                                                                                                                                                                                        | File:line                                                                       | One-line fix                                                                                                             |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| P1-1 | Work-history prose — the site's stated priority — is the least readable text on the page: 15px and no measure cap (~760px ≈ 90–100ch at 1440), while secondary prose is capped at 62ch.                                                                                                        | `static/styles/main.css:726-734, 749-756`                                       | `.job > div { max-width: var(--measure) }` and `.job-points { font-size: var(--text-body) }`.                            |
| P1-2 | Four links miss the brief's hard "every interactive element ≥44px" rule: logo ~13×24, section links ~20px tall, footer email ~27px tall, rail links ~36px tall.                                                                                                                                | `main.css:284-292, 661-671, 1269-1280, 998-1008`; `docs/redesign/briefs.md:334` | Add `min-height:44px; display:inline-flex; align-items:center` to the first three; `padding-block:.75rem` to rail links. |
| P1-3 | Control-affordance contrast: `--line-strong` (3.01:1) was added for control borders but only `.button-ghost` uses it; in-prose link underlines, `.text-link`, `.footer-mail` and `.contact-row` resting borders still use `--line` at 1.37:1 — including the `/projects` → `/experience` link. | `main.css:213-220, 548-560, 1269-1280, 1172-1182, 23`                           | Swap those borders/`text-decoration-color` to `var(--line-strong)`.                                                      |

### P2 — nice to have

| #     | Finding                                                                                                                                                                                                                           | File:line                                                                                         | One-line fix                                                                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| P2-1  | `aria-current="false"` is now forced on the logo on every route, so `/` has no current-page indicator at all.                                                                                                                     | `islands/Header.tsx:141`                                                                          | Pass the request path to the island and emit `"page"` on `/`, `"false"` elsewhere.                                            |
| P2-2  | Fiche block numbers are positional, so "03" means "Qué se rompió" in three fiches and "Qué haría distinto" in two.                                                                                                                | `components/ProjectFiche.tsx:46-83`                                                               | Reserve fixed slots (01 problema, 02 decisiones, 03 roto, 04 distinto) or drop the numerals.                                  |
| P2-3  | Project index links have 185–224-character accessible names (year + name + kind + summary + tags).                                                                                                                                | `routes/projects.tsx:36-48`, `routes/index.tsx:142-156`                                           | `aria-label={project.name}` on `.work-row` or `aria-labelledby` the name/kind only.                                           |
| P2-4  | In the mobile overlay the active nav item loses `--text-strong`: `html.js .main-nav a` (0,2,2) beats `.main-nav a[aria-current="page"]` (0,2,1); only the underline distinguishes it.                                             | `main.css:333-341` vs `409-413`                                                                   | Scope the overlay colour to `:not([aria-current="page"])`.                                                                    |
| P2-5  | Metadata is home-only and incomplete: `og:title`/`og:description` are the home values on all routes; no `og:url`, `og:image`, canonical or sitemap, although quick win 8 promises them.                                           | `routes/_app.tsx:26-30`; `docs/redesign-paths.md:492`                                             | Emit per-route `og:*` from each `<Head>` and add canonical + `sitemap.xml` in `scripts/ssg.ts`.                               |
| P2-6  | No-JS works, but a failed island hydration after `enable-js.js` runs leaves the mobile nav hidden and unopenable.                                                                                                                 | `routes/_app.tsx:40`, `main.css:363, 376`                                                         | Add the `js` class from the island after mount (or `data-hydrated`), not from a separate script.                              |
| P2-7  | Print falls back to the <48rem layout except `.job`; header prints a lone "R"; the first fiche also starts a new page.                                                                                                            | `main.css:1394-1467`                                                                              | Add print rules for `.evidence`/`.work-row` (or a print breakpoint) and hide `.site-title`; use `.fiche:not(:first-of-type)`. |
| P2-8  | Dead/underused: `.meta` selector, `--surface-2` documented "hover/inset" but only colours the 404 numeral, `Inter 500` loaded but unused.                                                                                         | `main.css:256, 21, 1341`; `routes/_app.tsx:50`                                                    | Delete `.meta`; document/use `--surface-2`; drop `500` from the Inter request.                                                |
| P2-9  | Duplicated sources of truth: dead `site.highlights` vs the home `evidence` array; homelab stack copy-pasted in two routes.                                                                                                        | `data/site.ts:99-104`, `routes/index.tsx:6-10`; `routes/index.tsx:46-55`, `routes/about.tsx:5-16` | Move both lists into `data/site.ts` and delete `highlights`.                                                                  |
| P2-10 | Data nits: password-manager `year:"2022–25"` vs `period:"2022 — 2025"`; "Active Directory" in the 3iPunt stack but in no bullet; `kind:"cliente"` for the friend's landing page.                                                  | `data/site.ts:183,187,315,319-324,236,250`                                                        | Normalise the year format, drop AD or add it to a bullet, and consider "Encargo"/"Propio".                                    |
| P2-11 | No `overflow-wrap` on the long unbreakable strings (email in `.contact-value`/`.footer-mail`); `.job-period` nowrap has ~1px of headroom in its 13.5rem track.                                                                    | `main.css:1199-1206, 1269-1280, 755-758`                                                          | `overflow-wrap:anywhere` on the two email rules; give the period track ~14rem or allow wrapping.                              |
| P2-12 | Docs drift: `paths.md` still says "No implementation. No source file … was touched" while its §8 says Path A "was chosen and implemented on 2026-10-28"; `main.css:30` cites accent-dim 4.52:1 as a bg pair (actual 5.40).        | `docs/redesign-paths.md:596,503`; `static/styles/main.css:30`                                     | Reword §10 as "not yet reviewed/shipped"; fix the ratio comment.                                                              |
| P2-13 | The SSG verifier strips `#fragment`, so no anchor target is ever verified (`/projects#moodle` etc. happen to resolve today).                                                                                                      | `scripts/lib/verify.ts:19`                                                                        | Extend `verifyOutput` to assert each `#id` exists in the target document.                                                     |
| P2-14 | Mobile menu semantics: one static label "Abrir o cerrar…" with only `aria-expanded` as state, and the overlay is not announced as a modal (no `role="dialog"`/`aria-modal`); header logo/toggle stay in the a11y tree while open. | `islands/Header.tsx:98-110`; `main.css:376-400`                                                   | Label it "Menú", add `role="dialog" aria-modal="true"` + a heading, and `inert` the header brand/toggle.                      |
