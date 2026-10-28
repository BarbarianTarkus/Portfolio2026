# Portfolio redesign plan (light touch)

Status: **phase 1 implemented** · Scope: keep the existing identity, fix the
accent-colour drift between pages, and tighten interaction/accessibility
quality.

## Goals and constraints

- Keep the portfolio's identity: deep navy (`#0e1217`), yellow accent
  (`#f1c81b`), Fira Code + Roboto Condensed, 54rem content column, fullscreen
  mobile menu.
- Do **not** introduce a new palette, font system or layout language.
- Remove the colour inconsistency between the home page and the About/Contact
  pages: every accent heading must use `var(--text-accent)`.
- Improve measurable UX/accessibility quality (focus, touch targets, active
  states) without visual disruption.

## Audit — what was inconsistent

| Element                                           | Before                        | After                       |
| ------------------------------------------------- | ----------------------------- | --------------------------- |
| Home “Hi, my name is”                             | `--text-accent` (yellow)      | `--heading-accent` → yellow |
| About section titles (“Projects”, “Get in touch”) | `--darker` (orange `#fb9b18`) | `--heading-accent` → yellow |
| Project card titles                               | `--darker` (orange)           | `--heading-accent` → yellow |
| Contact card titles                               | `--darker` (orange)           | `--heading-accent` → yellow |
| Global `h1–h6` default                            | `--darker` (orange)           | `--heading-accent` → yellow |
| Hero name / page titles                           | `--lightest-slate`            | unchanged (hierarchy)       |
| Brand “R” logo                                    | `--darker`                    | unchanged (brand mark)      |

Root cause: headings inherited the legacy `--darker` orange from the SvelteKit
theme while the home page overrode its accent text with `--text-accent`, so the
two accents coexisted. Fix: a single semantic role token,
`--heading-accent: var(--text-accent)`, used by every heading accent. Page
titles deliberately stay high-emphasis white so the “yellow accent, white title”
hierarchy from the original design is preserved.

## Guidance used (`ui-ux-pro-max` skill)

- **Design system** (`personal portfolio … dark minimal`, variance 3 /
  density 4) → _Minimalism & Swiss Style_: whitespace, grid, high contrast,
  essential elements. We adopt the **structure**, not the suggested light
  palette or Archivo/Space Grotesk fonts, because the user explicitly asked to
  keep the style. The existing type system already plays that role.
- **Navigation → Active State** (severity medium): highlight the current item
  with colour/underline. Implemented by marking the matching link with
  `aria-current="page"` in the header island and styling it with an accent
  underline. (Fresh's SSR-injected `aria-current` is removed during hydration,
  so the island owns this state; the path is passed down from
  `routes/_app.tsx`.)
- **Interaction → Focus States** (severity high): every keyboard-focusable
  control needs a visible ring. Focus ring now uses `--focus-ring` (`#f1c81b`)
  instead of the low-contrast blue.
- **Touch targets**: interactive controls should be ≥ 44×44 px. The hamburger
  and footer social links now have 44 px hit areas while their icons stay 24 px.
- **Hover states**: 150–300 ms transitions. Nav/footer links now transition
  colour over `--transition` (200 ms).
- **Reduced motion**: already covered by the global
  `prefers-reduced-motion: reduce` rule; kept as-is.

## Implemented (phase 1)

1. **Colour tokens** — added `--heading-accent` and `--focus-ring`; documented
   `--darker` as the brand-mark orange.
2. **Accent unification** — all heading accents now resolve to
   `var(--text-accent)`; no orange-on-About remains.
3. **Active navigation** — `header .main-nav a[aria-current="page"]` gets bold
   white text plus a 2 px accent underline (yellow page number kept);
   hover/focus tints links accent.
4. **Focus visibility** — accent focus ring on all focusables; skip link now
   accent-on-navy.
5. **Touch targets** — 44 px minimum for the menu toggle and footer links.
6. **Consistency cleanup** — project-card title hover uses white text + accent
   underline (previously accent-on-accent, invisible).

## Proposed backlog (phase 2 — not implemented, needs content decisions)

- Hero: optional availability badge (“Open to internships”) — needs real copy.
- Projects page: filter chips by tag once there are more than ~6 projects.
- Contact: a real `mailto:` or form once an address is provided (`data/site.ts`
  `email` is intentionally empty).
- Social sharing: Open Graph/Twitter images (needs artwork).
- Light theme: only if explicitly requested; the brand is dark-first.

## Code health (SonarQube project `Portfolio`)

Baseline was measured right after the project was created, before the refactor;
“after” is the final analysis.

| Metric                      |                  Before |                         After |
| --------------------------- | ----------------------: | ----------------------------: |
| Open issues                 | 2 (1 critical, 1 major) |                         **0** |
| Cyclomatic complexity       |                     113 |                       **107** |
| Cognitive complexity        |                      67 |                        **46** |
| Highest per-file complexity |   52 (`scripts/ssg.ts`) | **15** (`islands/Header.tsx`) |
| Code smells                 |                       1 |                         **0** |
| Technical debt              |                  20 min |                     **0 min** |
| Reliability rating          |                   D (4) |                     **A (1)** |
| Security hotspots           |                       0 |                         **0** |

The refactor split the 318-line SSG entry point into
`scripts/lib/{files,routes,render,verify}.ts`, replaced the hand-rolled preview
server with `@std/http/file-server` plus a thin prefix/404 wrapper, removed a
hand-rolled trailing-slash regex (S8786), fixed the `Array#sort` comparator
(S2871) and let `aria-current` replace custom active-link logic.

## Verification checklist

- [x] `deno task check` (fmt, lint, type-check) — exit 0.
- [x] `deno task ssg` — 3 pages + 404, 30 internal URLs verified.
- [x] SonarQube project `Portfolio` — 0 open issues, 0 code smells,
      reliability/security/maintainability A, 0 hotspots; complexity 107,
      cognitive 46.
- [x] Responsive check at 375 / 768 / 1024 / 1440 px, no horizontal scroll.
- [x] Active nav state and `aria-current` correct on `/`, `/about`, `/contact`.
- [x] Focus ring visible on skip link, menu, nav, footer links.
- [x] Mobile overlay: opens, traps page scroll, closes on Escape and on link
      click.
- [x] Colour contrast: accent `#f1c81b`, body `#8892b0` and titles `#ccd6f6` on
      `#0e1217` all pass WCAG AA for their size.
