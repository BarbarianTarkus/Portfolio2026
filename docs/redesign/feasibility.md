# Feasibility — codebase impact, effort and a11y baseline per path

Measured 2026-10-28 from the working tree (`git 92039d3`). No
`deno task build/check/ssg` was run: the deno cache is not writable in this
sandbox. Contrast ratios are computed WCAG 2.x from the real hex values (python,
sRGB); pixel sizes are derived from CSS
(`font-size × line-height + padding + border`), not from a browser.
Rendered-markup evidence (`aria-current`, island boot, heading order) is read
from the checked-in `dist/` of the last build — that is output, not a live run.

## 0. What the code actually is

| File                                                   | Lines                                                                | Role in a redesign                                                                  |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `static/styles/main.css`                               | 1257 (28.3 kB, 149 rules, 162 blocks, 11 `@media`, 0 `@media print`) | ~85% of the visual work; 71 of 149 rules (48%) contain a colour-related declaration |
| `routes/index.tsx`                                     | 68                                                                   | hero + one `h2` + 3 card links                                                      |
| `routes/projects.tsx`                                  | 34                                                                   | page chrome only; fiches come from the component                                    |
| `routes/about.tsx`                                     | 149                                                                  | 4 prose paragraphs, 3 jobs, homelab tags, education                                 |
| `routes/contact.tsx`                                   | 62                                                                   | 3 card links (email/GitHub/LinkedIn)                                                |
| `routes/_app.tsx`                                      | 49                                                                   | `<html>`, fonts link, `theme-color`, CSS link, layout                               |
| `components/ProjectFiche.tsx`                          | 95                                                                   | the 5 stacked fiches: h2 + 4 h3 blocks + tags + links                               |
| `components/Footer.tsx`                                | 38                                                                   | 2 icon links, no text                                                               |
| `islands/Header.tsx`                                   | 180                                                                  | the only island: overlay menu, focus trap, scroll lock                              |
| `data/site.ts`                                         | 216                                                                  | identity, nav (3 items), 5 projects (prose only, no images)                         |
| `scripts/ssg.ts` + `scripts/lib/*`                     | 122 + 279                                                            | build gate: routes, render, link verification                                       |
| `components/Icons.tsx`, `_404.tsx`, `NotFoundPage.tsx` | 63 / 19 / 41                                                         | unchanged by all four paths except via CSS tokens                                   |

## 1. Migration map

### 1.1 File ledger (current → estimated after, net delta)

| File                  | Now  | A Signal            | B Operator                            | C Dossier              | D Homelab                   |
| --------------------- | ---- | ------------------- | ------------------------------------- | ---------------------- | --------------------------- |
| `main.css`            | 1257 | 1385 (+130)         | 1440 (+180)                           | 1455 (+200, ~90 print) | 1515 (+260)                 |
| `routes/index.tsx`    | 68   | 150                 | 130                                   | 170                    | 150                         |
| `routes/projects.tsx` | 34   | 60                  | 55                                    | 55                     | 70                          |
| `routes/about.tsx`    | 149  | 170                 | 160                                   | 190                    | 180                         |
| `routes/contact.tsx`  | 62   | 80                  | 90                                    | 110                    | 100                         |
| `routes/_app.tsx`     | 49   | 51                  | 55                                    | 57                     | 53                          |
| `ProjectFiche.tsx`    | 95   | 150                 | 150                                   | 160                    | 110                         |
| `Footer.tsx`          | 38   | 42                  | 44                                    | 60 (colophon)          | 55                          |
| `Header.tsx`          | 180  | 180                 | 220                                   | 185                    | 190                         |
| new TSX               | 0    | 0–1 component (~40) | `StatusBar` 70 + `CommandPalette` 200 | 0                      | `Tile` 50 + art SVGs ~250   |
| build scripts         | 401  | —                   | —                                     | —                      | `routes.ts`+`render.ts` +40 |
| `data/site.ts`        | 216  | +10                 | +15                                   | +20                    | +25                         |
| **Net**               | —    | **≈ +225**          | **≈ +440**                            | **≈ +355**             | **≈ +700 + 3–5 binaries**   |

No path touches `_404.tsx`, `NotFoundPage.tsx` or `Icons.tsx` structurally. All
four edit `_app.tsx` only for the Google Fonts URL (line 34), `theme-color`
(line 22) and `<title>`/meta.

### 1.2 CSS sections — replaced (R) vs extended (E) vs untouched (·)

| §  | Lines    | Content                                                                     | A                | B              | C                  | D               |
| -- | -------- | --------------------------------------------------------------------------- | ---------------- | -------------- | ------------------ | --------------- |
| 1  | 15–68    | tokens                                                                      | R                | R              | R                  | R               |
| 2  | 70–124   | base/reset, `color-scheme: dark` (67)                                       | E                | E              | R (light)          | E               |
| 3  | 126–222  | type scale + link colours                                                   | E                | R              | R                  | E               |
| 4  | 224–239  | `.sr-only`                                                                  | ·                | ·              | E (focus on paper) | ·               |
| 5  | 241–264  | 54rem shell, `main` margins                                                 | R (68rem, 12col) | E              | R (asym. grid)     | R (bento)       |
| 6  | 266–580  | header, overlay nav, skip link                                              | E                | R (status bar) | R                  | E               |
| 7  | 582–639  | footer                                                                      | E                | R              | R (colophon)       | E               |
| 8  | 641–726  | hero                                                                        | R                | R (prompt)     | R (masthead)       | R (hero tile)   |
| 9  | 728–774  | page headings, lede, measure                                                | E                | R              | R                  | E               |
| 10 | 776–812  | about prose + tags                                                          | E                | R              | R (CV table)       | R (timeline)    |
| 11 | 814–897  | contact cards                                                               | R (rows)         | R (ssh rows)   | R                  | R (tiles)       |
| 12 | 899–924  | 404                                                                         | ·                | E              | E                  | E               |
| 13 | 926–961  | animations + reduced-motion                                                 | E                | R (steps)      | E                  | R (stagger)     |
| 14 | 963–1257 | 2026 pass: nav stack, highlights, cards, experience, fiches, contact widths | R                | R (man pages)  | R (case studies)   | R (media cards) |

Consequence: C is not "a light theme" — because every section's colour comes
from tokens _and_ 71/149 rules contain colour, the inversion is a file-wide
pass, and 10 of 14 sections are structurally rewritten anyway.

### 1.3 Token mapping (old → new)

| Old token (line)                                    | Value                                 | refs          | A                                    | B                                            | C                                                            | D                                        |
| --------------------------------------------------- | ------------------------------------- | ------------- | ------------------------------------ | -------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `--text-accent` (17)                                | `#f1c81b`                             | 26            | `--accent` #F1C81B                   | drop → `--accent` #7CE38B + `--warn` #F0B25E | `--accent` #B4340F                                           | `--accent` #6E8BFF                       |
| `--accent` (18)                                     | `#324eb2` blue                        | 1 (markers)   | delete                               | delete (→ `--danger`)                        | `--accent-2` #1F4E79                                         | delete                                   |
| `--background` (19)                                 | `#0e1217`                             | 8             | `--bg` #0B0E13                       | `--bg` #06080A                               | `--paper` #F5F2EA                                            | `--bg` #080B0F                           |
| `--lightAccent` (20)                                | `#1f1e1e`                             | 3             | `--surface` #12171F                  | `--panel` #0C1014                            | `--paper-2` #EDE8DC                                          | `--tile` #0F141A                         |
| `--dark` (21)                                       | `#e5e7eb`                             | 1 (underline) | `--text`/`--line`                    | `--text` #D3DAE1                             | `--rule` #D6CFBF                                             | `--text` #E6EBF1                         |
| `--darker` (22)                                     | `#fb9b18`                             | 1 (header)    | `--brand` #FB9B18                    | drop                                         | drop                                                         | drop                                     |
| `--slate` (23)                                      | `#8892b0`                             | 16            | `--muted` #7F8CA3 + `--text` #CBD3DF | `--muted` #8A96A3 + `--text` #D3DAE1         | `--muted` #5C6270 + `--ink` #14161B                          | `--muted` #8C99A8 + `--text` #E6EBF1     |
| `--lightest-slate` (24)                             | `#ccd6f6`                             | 8             | `--text` #CBD3DF                     | `--text` #D3DAE1                             | `--ink` #14161B                                              | `--text` #E6EBF1                         |
| `--heading-accent` (30)                             | alias of accent                       | 4             | collapse to `--text`                 | `--text`                                     | `--accent` (numbers only)                                    | `--text`                                 |
| `--focus-ring` (31)                                 | accent                                | 1             | #F1C81B                              | #7CE38B                                      | #B4340F on paper — verify                                    | #6E8BFF                                  |
| `--ink`/`--paper` (34–35)                           | aliases of slate/bg                   | 4             | rename                               | rename                                       | **redefine in place** — body/footer/overlay inherit the flip | rename                                   |
| `--radius` (59)                                     | 0.5rem                                | 3             | 2px                                  | 0                                            | 0                                                            | 16px                                     |
| `--page-width` (49)                                 | 54rem                                 | 1             | 68rem                                | ~72rem                                       | ~74rem, 12-col asym.                                         | ~80rem bento                             |
| `--measure` (54)                                    | 64ch                                  | 7             | 62ch                                 | unspecified → add                            | 66ch                                                         | unspecified → add                        |
| `--accentFont`/`--primaryFont`/`--codeFont` (38–41) | Roboto Condensed / system / Fira Code | 28            | same / Inter / Fira Code             | JetBrains Mono / IBM Plex Sans               | Playfair / Source Serif 4 / JetBrains Mono                   | Space Grotesk / DM Sans / JetBrains Mono |
| `--text-meta`/`--text-compact` (45–46)              | 0.9/1rem                              | 7             | 13px/17px                            | 13px/17px                                    | 12px/19px                                                    | 12px/16px                                |
| `color-scheme` (67) + `theme-color` (`_app.tsx:22`) | dark / `#0e1217`                      | 2             | keep                                 | keep                                         | **must flip to `light`**                                     | keep                                     |

New tokens with no ancestor (must be created, not renamed): `--surface-2`,
`--line`, `--warn`, `--danger`, `--ok`, `--tile-2`, `--paper-2`, `--accent-dim`.
Trap: `--accent` already means _blue_ today and is the only colour used for list
markers; a naive 1:1 rename paints markers with the new accent.

### 1.4 Islands — needed, and why

Boot script in `dist/index.html`: `boot({Header}, …)` imports exactly one island
chunk (`fresh-island__Header-*.js`, 3.4 kB) on every page, plus `client-entry`
(24.9 kB) and `signals.module` (20.9 kB). Hydration is eager; a second island
adds imports + chunk to all 5 pages.

| Path | New island                                                          | Why / constraint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | **none**                                                            | In-view reveal must stay CSS (`animation-timeline: view()` behind `prefers-reduced-motion`), otherwise A loses its "cheapest path" property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| B    | `CommandPalette` (~200 LOC)                                         | Must take `basePath` **as a prop**: `Header.tsx:124` does `${basePath}${route}`, and `config.ts:26` reads `Deno.env`, which does not exist in the browser bundle. It must also SSR its destination anchors as `<a href="/Portfolio/...">` so `verify.ts` sees them — client-only `href`s are invisible to the verifier, so a missing prefix ships broken. Do **not** hardcode `aria-current`: the client router skips anchors that carry `aria-current` without `data-current`/`data-ancestor` (obfuscated bundle, `dist/assets/client-entry-*.js`), so a hardcoded value goes stale after navigation — render plain anchors and let Fresh annotate, as it already does inside this island. Its Escape/Tab handler must compose with `Header.tsx:24–49`, whose `keydown` listener is global and always mounted. The status-bar clock cannot be SSG output: it is a build timestamp, stale forever. |
| C    | **none**                                                            | Print, grid and type are declarative. The "edition date" line has the same build-time problem as B's clock.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| D    | **none for the grid**; "live" status needs data that does not exist | `data/site.ts` holds no uptime, deploy or metrics, and all five project links are GitHub repos (no live URL). A status tile is either a literal (fine) or an island with no source of truth. Screenshots are binary assets + `img` with `width`/`height` (CLS), and per-project detail pages need the SSG script work in 1.5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### 1.5 How SSG verification constrains new links

- `verify.ts:19` matches `href=`, `src=`, `from` and `import` values beginning
  with `/` in every emitted HTML file; each must start with `basePath` (`:54`)
  and resolve to a file in `dist/`, directories becoming `index.html` (`:22–25`,
  `:62`). So every new internal link needs a real route file, and a page moved
  without a redirect breaks the build.
- **Fragment-only links are not checked**: the pattern is `"(\/[^"?#]*)`, so
  `href="#homelab"` never matches. A's sticky rail and B's `#petsalut` anchors
  have no safety net; a wrong id ships silently.
- **Dynamic routes are unsupported**: `routes.ts:26–40` maps file paths
  literally, so `routes/projects/[slug].tsx` becomes the route
  `/projects/[slug]`, and `render.ts:49,59` would fetch and write that literal
  path — either a 500 or a bogus `dist/projects/[slug]/index.html`, plus a
  failed link check for every real slug. D's "detail pages" therefore cost ~40
  LOC in `scripts/lib/routes.ts` + `render.ts` before any page exists.
- Island chunk URLs _are_ verified (the boot script's
  `import … from "/Portfolio/assets/…"` matches), which is why a new island must
  prefix its own `href`s, not just its chunk.
- CI runs `deno task check` (`fmt --check`, `lint` with Fresh tags, `check`)
  then `deno task ssg` (`.github/workflows/ci.yml`), and `deploy.yml` runs `ssg`
  on every push to `master`; new islands must be `deno fmt`-clean and
  Fresh-lint-clean before anything can be previewed.

## 2. Effort and risk

| Path  | Days (breakdown)                                                                                                                                                                                    | Risk            | Top 3 failure modes                                                                                                                                                                                                                                                                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | **3.5** = 0.25 tokens + 0.5 shell/grid + 0.75 home (evidence strip + index) + 1.0 projects index/rail + 0.5 about/contact + 0.5 responsive+a11y                                                     | **Low**         | ① 68rem shell > 1024px viewport → horizontal scroll unless `min(68rem, 100% − 2·gutter)`; ② numbered index rows at 390px become 3-line rows and kill the "scan in 10 s" premise; ③ sticky rail vs `[id] { scroll-margin-top: 2rem }` (CSS:262) and any `overflow` ancestor → anchors land under the rail                                                                      |
| **B** | **6.0** = 0.5 tokens/motion + 0.5 status bar + 0.75 home + 1.0 man-page fiches + 1.5 palette island + 0.75 keyboard/a11y + 0.25 contact + 0.75 QA/responsive                                        | **High**        | ① build-time clock/status in a static export (stale or hydration flash); ② palette links client-generated → verifier blind spot, broken `basePath` found only after deploy; ③ `deno lint`/`sonar` complexity + a second keyboard trap composed with `Header.tsx:24–49`                                                                                                        |
| **C** | **6.5** = 1.5 palette inversion (71/149 rules) + 0.5 type + 1.0 asymmetric grid + 0.75 masthead + 1.25 case studies + 0.5 CV table/contact + 0.75 print + 0.25 meta (`color-scheme`, `theme-color`) | **Medium-high** | ① missed colour declarations (`--dark` is used for nothing but link underlines, CSS:199) vanish on paper; ② `color-scheme: dark` + old `theme-color` leak dark UA chrome/controls; ③ 19px serif at 1024px sits between the 48rem and 80rem breakpoints → masthead/table reflow not covered by either                                                                          |
| **D** | **7.5** = 0.75 tokens + 1.25 bento grid + 1.5 SVG artwork + 1.0 screenshot asset pipeline + 1.25 SSG detail routes + 0.75 about/contact + 0.75 motion/responsive + 0.25 QA                          | **High**        | ① detail links break `ssg` until `routes.ts`/`render.ts` support params; ② no image assets exist and all five project links are GitHub repos (`data/site.ts`), so "real screenshots" can only be re-captured from repos — the evidence tile risks becoming a fabricated one; ③ bento collapses to 12 stacked tiles at 768 and the 16px radius + lift + gradient reads as SaaS |

**Best effort-to-impact: A (3.5 days for 4 of 6 audit items).** It is the only
path whose estimate is under the brief's own "2–3 days" plus a day of QA, and it
is the only one that changes no build script, adds no island and no binary asset
— the three structural risks (SSG routes, hydration, verifier blind spots) stay
untouched. It fixes the wasted canvas, accent inflation, the project wall and
half the print story with about 225 net lines, whereas B and D spend 2× the
effort mainly on JavaScript and artwork that _add_ failure modes, and C's whole
cost is a file-wide palette inversion that still leaves the projects page as
five equal-weight case studies. A's weak point is the brief's own audit item 1
(identity stays borrowed), and that is a strategic bet, not a technical one: A
buys the strongest technical return per day, B is the only path that fixes
identity, and D has the worst ratio because its decisive ingredient (evidence
imagery) does not exist in the repo.

## 3. Measured baseline of the current site

### 3.1 Contrast (computed, WCAG 2.x)

| Pair (source)                                                    | Ratio         | Verdict                                 |
| ---------------------------------------------------------------- | ------------- | --------------------------------------- |
| body/labels `#8892b0` on `#0e1217` (CSS:19,23,88)                | **6.07:1**    | pass 4.5                                |
| body on card surface `#8892b0` on `#1f1e1e` (CSS:20,1058)        | **5.37:1**    | pass                                    |
| titles `#ccd6f6` on bg (CSS:24,668)                              | **12.99:1**   | pass                                    |
| accent `#f1c81b` on bg (26 refs, e.g. 145,767)                   | **11.65:1**   | pass                                    |
| accent on surface (CSS:1091,881)                                 | **10.31:1**   | pass                                    |
| brand orange `#fb9b18` on bg (CSS:22,281)                        | **8.77:1**    | pass                                    |
| bg on accent — skip link, primary button (CSS:569–570,1024–1027) | **11.65:1**   | pass                                    |
| link underline `#e5e7eb` (CSS:21,199)                            | **15.18:1**   | pass (non-text)                         |
| **list markers `#324eb2` on bg (CSS:18,216–218)**                | **2.57:1**    | **fail** — below 3:1 and text-level 4.5 |
| tag border composite `#393b42` on surface (CSS:805)              | **1.49:1**    | chip boundary invisible                 |
| focus ring `#f1c81b` on bg / surface (CSS:31,116–118)            | 11.65 / 10.31 | pass 3:1                                |

### 3.2 Type, measure, targets

| Metric                  | Measured value                                                                                                                                                                                                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Body size / line-height | 16px/1.6 → 18px/1.6 (≥48rem) → 20px/1.6 (≥80rem) — CSS:65–66,90–91,173–175,187–189                                                                                                                                                                                                                    |
| h1 / page title         | `2.8rem` → `3rem` → `3.2rem` (CSS:144,178,192); `.page-title` `clamp(2.25rem, 2.5vw + 1rem, 3rem)` (738)                                                                                                                                                                                              |
| Hero                    | name `clamp(2.5rem, 7vw, 4rem)` (996), role `clamp(1.6rem, 3.2vw, 2.2rem)` (1000), intro fixed `1.5rem` (683)                                                                                                                                                                                         |
| Prose measure           | `--measure: 64ch` (54) → ≈569/640/712 px at 16/18/20px ≈ **70 characters** per line; content column 832px, so prose is ~120px narrower than the column at 1440                                                                                                                                        |
| Shell                   | `--page-width: 54rem` = 864px (49) with 832px content (255–256): **~576px empty at 1440** ✅ matches the brief                                                                                                                                                                                        |
| Header gutter           | 1.25rem → 2.5rem (≥48rem) → **10rem/160px (≥80rem)** (58,287–291,293–297)                                                                                                                                                                                                                             |
| Touch targets           | skip link 48px ✅; logo 64/48px ✅; menu button 44×44 ✅ (357–362); overlay row ~51px ✅ (469–473); primary button ~52×163px ✅; footer links 44×44 ✅ (611–616); **desktop nav links 25.6px tall, 0 padding (536–541 + body lh 1.6)** ✗ brief constraint 5; **fiche links ~23px tall (1229–1236)** ✗ |

### 3.3 Heading order (from `dist/`)

| Route    | Sequence                                                                                                                     | Note                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Home     | h1 name → h2 "Qué hago" → 3× h3                                                                                              | valid                                                                                                                                   |
| Projects | h1 → 5× (h2 project → 3–4× h3: "El problema" / "Decisiones técnicas" / "Qué se rompió" / "Qué haría distinto") = 24 headings | valid order, but 20 h3s with 4 repeated labels and 5 unnamed `<article>` landmarks → the heading list is unscannable for screen readers |
| About    | h1 → h2 Experiencia → 3× h3 → h2 Homelab → h2 Formación → h3                                                                 | valid; `#experiencia` / `#homelab` ids exist (95,110) and are linked from home (index.tsx:11,23)                                        |
| Contact  | h1 → 3× h2 (inside the card anchors)                                                                                         | valid order; card link name = heading + body + handle (100+ chars)                                                                      |
| 404      | h1 only; "404" is `aria-hidden` decoration (25)                                                                              | valid                                                                                                                                   |

### 3.4 Provable defects (current code)

| Defect                                       | Proof                                                                                                                                                                                         | Impact                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Nav is unusable without JS below 768px       | overlay hidden by default `transform: translateX(-100vw); visibility: hidden` (382–404), only `.open` reveals it; state starts `false` (Header.tsx:121)                                       | static export ships a nav that depends on hydration for every phone; no-JS users can't reach other pages |
| Header/content edges disagree                | logo at 160px vs content at 304px at 1440 (293–297 vs 254–255); 40 vs 96 at 1024; footer centred (588)                                                                                        | the strongest "template" tell at ≥1024px                                                                 |
| Accent text below the brief's own 15px floor | 13.6px `.fiche-block h3` (1195–1203), 14.4px `.archetype-more` (1086–1092), `.fiche-links a` (1229), `.contact-handle` (876–883)                                                              | accent inflation relocated from colour to size                                                           |
| Only hard contrast failure                   | `ul ::marker` blue #324eb2 on #0e1217 = 2.57:1 (18, 216–218)                                                                                                                                  | square markers are hard to see on every list                                                             |
| 5 anonymous articles                         | `ProjectFiche.tsx:42` has `id` but no `aria-labelledby`; h2 at 44 has no id                                                                                                                   | landmark list shows "article" ×5                                                                         |
| Dead CSS                                     | 5 of 8 nav stagger rules (425–455, only 3 nav items), `footer p` (635–639, footer renders no `<p>`), `.contact-card a` (885–892, no anchors inside cards), h4–h6 (156–166), `ul ul` (212–214) | ~55 lines; every path pays for them twice                                                                |
| No print story                               | 0 occurrences of `@media print` in 1257 lines                                                                                                                                                 | audit item 6 confirmed; content is CV-adjacent                                                           |
| Metadata gaps                                | no `og:title`, `og:description`, `og:url`, `og:image`, canonical or sitemap; `theme-color` hardcoded `#0e1217` (_app.tsx:22); `color-scheme: dark` (67)                                       | shared link previews are blank; blocks any light path                                                    |
| Fonts                                        | 2 preconnects + 1 Google CSS (26–35); no self-host, no fallback metric override; `display=swap`                                                                                               | FOUT/CLS on slow networks; 3 of 4 paths add families                                                     |
| Logo announces "current" on inner pages      | `dist/about/index.html`: `aria-current="true" data-ancestor="true"` on `.site-title`; CSS only styles `main-nav a[aria-current="page"]` (305–306)                                             | minor SR noise; styles and semantics diverge                                                             |

## 4. Path-independent quick wins

| # | Change                                                                                                                    | File / LOC                                         | Why it pays off in any path                                                           |
| - | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1 | Repoint list markers from `--accent` (blue) to `--muted`/`--line`                                                         | `main.css:216–218` (2)                             | removes the only hard contrast failure                                                |
| 2 | Delete the dead CSS above                                                                                                 | `main.css` ~5 rules (~55)                          | −4% of the file, and every path rewrites less noise                                   |
| 3 | Replace `--header-padding-x` with one shared shell container used by header, main and footer                              | `main.css:287–297,254–255,588` (12–15)             | fixes the 56–144px edge mismatch; prerequisite for A/B/D grids anyway                 |
| 4 | Make the nav JS-independent: render it visible, let the island add `js` to `<html>` and hide the overlay only under `.js` | `main.css:382–404` + `Header.tsx` (~15 CSS, 3 TS)  | static site currently needs JS to navigate on mobile                                  |
| 5 | Give desktop nav and fiche links ≥44px hit areas                                                                          | `main.css:536–541,1229–1236` (8)                   | meets the brief's own hard constraint 5                                               |
| 6 | Name the project landmarks (`h2 id` + `aria-labelledby` on the article)                                                   | `ProjectFiche.tsx:42–44` (3)                       | 5 navigable articles instead of 5 anonymous ones                                      |
| 7 | Split `--slate` into text/muted roles before anything else                                                                | `main.css:23` + its 16 refs (~10)                  | all four paths need the split; doing it once avoids a second pass over the same rules |
| 8 | Complete metadata: `og:title/description/url`, `twitter:card`, canonical, sitemap in `ssg.ts`                             | `_app.tsx:18–36` + route `<Head>` + `ssg.ts` (~35) | the recruiter's first impression is a link preview, not the page                      |

## 5. Responsive risk by breakpoint

CSS breakpoints today are 48rem (768) and 80rem (1280); 1024 falls in the
18px-body zone, and 390px has no nav without JS.

| Path  | 390                                                                                                                               | 768                                                                                     | 1024                                                                                                               | 1440                                                                                                                   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **A** | index rows must fold to 2 lines (year+arrow / name+outcome); 62ch is not a width constraint at this size, the 16px gutter is      | 12-col grid: content 1–8 leaves dead margins unless the grid is 6-col here              | 68rem shell > viewport → scroll unless clamped; sticky rail + `scroll-margin-top` collisions                       | 68rem = 1088px, ~176px empty per side: better than 576 but not full-bleed; rail needs `top` offset                     |
| **B** | status bar with 5 segments ≈ 325px of 12px mono + gaps → overflows; `⌘K` has no keyboard on touch → needs a visible ≥44px trigger | man-page label column stacks; mono headings at 40px wrap mid-path                       | prose + label column fits, but the 32px status bar and long `ricardo@portfolio:~$` prompts dominate the first fold | palette full-width vs modal — decide, and don't let the status bar scroll away (brief says always visible)             |
| **C** | Playfair 72px name must clamp to ~44–48px; 3-col margin must collapse inline; 19px serif ok                                       | margin column at 25% squeezes body below 45ch                                           | body 8/12 ≈ 682px at 19px ≈ 66ch — the one breakpoint where the locked measure actually lands                      | print-like column at 1440 needs max-width or it reads as a wide newspaper; rules/dinks must not disappear at 2× DPR    |
| **D** | 16:10 media tiles need `aspect-ratio`, not fixed height; 16px radius + 1px rules hold                                             | 12-col bento becomes 12 stacked tiles (~2.5k px) — the idea dies; consider 2-col at 768 | 7/12 hero tile ≈ 560px and 5/12 status ≈ 400px: works, but mixed heights need explicit `grid-auto-rows`            | needs a max-width or tiles stretch to 1440 and read as SaaS; one gradient max per view is easy to violate across tiles |
