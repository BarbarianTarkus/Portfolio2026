# Signal pass — Path A implemented

Date: 2026-10-28 · Baseline: `92039d3` · Decisions:
[`redesign-paths.md`](redesign-paths.md) §4 (path A "Signal"),
[`redesign/briefs.md`](redesign/briefs.md) (tokens).

Two instructions from the owner shape this pass:

1. **Work experience is the priority.** It leads the home page and owns a
   dedicated route; the CV is no longer buried under biography.
2. **Experience and GitHub projects must be visibly different things.** The
   project list is labelled as public repositories; every project carries a
   `Cliente / Académico / Propio` origin label, and the projects page says
   outright that it is not a work history.

## What changed

| Area          | Before                                     | After                                                                    |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| Routes        | `/`, `/projects`, `/about`, `/contact`     | + **`/experience`** (CV: work history + education)                       |
| Nav           | Proyectos · Sobre mí · Contacto            | **Experiencia** · Proyectos · Sobre mí · Contacto                        |
| Home order    | hero → 3 cards → footer                    | hero → evidence strip → **01 Experiencia** → 02 Proyectos → 03 Stack     |
| Projects page | 5 stacked fiches, no index                 | index table → sticky rail → fiches with numbered blocks                  |
| Project data  | one undifferentiated list                  | `kind` (cliente/académico/propio) + `year`; work history in `experience` |
| About         | bio + experience + homelab + formation     | bio + homelab (experience and formation moved to `/experience`)          |
| Stylesheet    | 1,257 lines, 54rem shell, card surfaces    | 1,436 lines, 68rem shell, rules instead of cards, print stylesheet       |
| Type          | Roboto Condensed + system sans + Fira Code | Roboto Condensed + **Inter** + Fira Code (17px body, 62ch measure)       |
| Accent        | 26 accent references, ~everything          | accent for action, active state, links; `--accent-dim` for numerals      |

### Tokens (as implemented)

`--bg #0B0E13` · `--surface #12171F` · `--surface-2 #1A212B` · `--line #232C38`
· `--text #CBD3DF` · `--text-strong #E8EDF4` · `--muted #7F8CA3` ·
`--accent
#F1C81B` · `--accent-dim #98873B` · `--brand #FB9B18` · `--radius 2px`

All pairs verified before implementation in
[`redesign/research.md`](redesign/research.md); the one failing value from the
brief (`--accent-dim`) shipped as the corrected `#98873B` (4.52:1 worst case).

### Code

- `routes/experience.tsx` — new: three jobs (every bullet) + education.
- `routes/index.tsx` — hero → evidence → experience → project index → stack.
- `routes/projects.tsx` — index table, sticky rail, `kind`-labelled fiches.
- `routes/about.tsx` — biography and homelab only.
- `routes/contact.tsx` — three rows instead of three cards.
- `components/ProjectFiche.tsx` — numbered blocks, "Qué se rompió" as a quote,
  `aria-labelledby` on each article.
- `components/Footer.tsx` — email call to action + colophon.
- `islands/Header.tsx` — unchanged behaviour, wrapped in the shared shell.
- `data/site.ts` — `Job`, `experience`, `ProjectKind`, `Project.year`.
- `static/js/enable-js.js` — 3-line blocking script: the mobile overlay is only
  enabled when JavaScript is present, so the static export keeps a working nav
  without it.
- `routes/_app.tsx` — Inter added, `theme-color`, `og:*`/`twitter:*`, jses
  class.

### Fixes carried over from the audit (feasibility.md §4)

- `ul ::marker` no longer uses the legacy blue (2.57:1) — markers are `--muted`.
- Mobile nav works without JavaScript (44px rows, no overlay dependency).
- Every interactive target is ≥44px, including desktop nav, fiche links and
  footer icons.
- Header, main and footer now share one `.shell` container (the 144px edge
  mismatch at 1440px is gone).
- The five project articles have accessible names (`h2` + `aria-labelledby`).
- `@media print` exists: white page, no nav/social, external URLs appended.

## Verification

| Check                                 | Result                                                    |
| ------------------------------------- | --------------------------------------------------------- |
| `deno task check` (fmt, lint, types)  | exit 0                                                    |
| `deno task ssg`                       | 5 pages, 76 internal URLs verified, 147 kB                |
| Horizontal overflow 390/768/1024/1440 | none measured (`scrollWidth === clientWidth`)             |
| No-JS mobile nav                      | 4 links visible at 44px, toggle hidden                    |
| Heading order (all routes)            | h1 → h2 per section, no skipped levels                    |
| Print                                 | white background, dark text, chrome hidden, URLs appended |

Page heights after the audit fixes (full page): home **3,283** at 1440 and 4,577
at 390 · experience 2,449 · projects 5,750 · about 1,629 · contact 958. For
comparison the site before the pass was 1,344 / 5,488 / 2,781 / 1,029: the home
page and `/about` grew because experience and the project index moved onto them,
and `/projects` lost 262px to the tighter fiche layout.

## Audit follow-up

An independent audit ([`redesign/impl-report.md`](redesign/impl-report.md),
written against the implementation snapshot) found **no P0** and three P1s. All
three are fixed, plus the cheap P2s:

| Finding                                                            | Resolution                                                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| P1-1 work-history prose was 15px with no measure cap (~90–100ch)   | `.job-points` is 17px and everything in a `.job` is capped at 62ch             |
| P1-2 four links were under 44px (logo, section links, email, rail) | all four now `min-height:44px` (measured: 44 / 44 / 44 / 61px)                 |
| P1-3 control borders at 1.37:1                                     | new `--line-strong` (3.01:1) for control borders and link underlines           |
| P2-1 home had no current-page indicator                            | the island receives the request path: logo is `page` on `/`, `false` elsewhere |
| P2-2 block numerals meant different things per fiche               | numerals removed; only the labels remain                                       |
| P2-3 project links had 185–224-character names                     | `aria-label="<name> — <kind>"` on every index row                              |
| P2-4 active item lost its colour inside the mobile overlay         | overlay rule scoped with `:not([aria-current="page"])`                         |
| P2-5 Open Graph was home-only                                      | per-route `og:title`/`og:description` on all six documents                     |
| P2-7 print printed the logo and forced a first-fiche page break    | logo hidden in print; break only between fiches                                |
| P2-8 dead `.meta`, unused `Inter 500`, unclear `--surface-2`       | removed / narrowed to 400;600 / documented as inset                            |
| P2-9 duplicated `highlights` and homelab list                      | both live in `data/site.ts` now                                                |
| P2-10 "Active Directory" in the 3iPunt stack                       | removed — it belongs to the UPC role                                           |
| P2-11 unbreakable email strings                                    | `overflow-wrap:anywhere` on `.contact-value` and `.footer-mail`                |
| P2-12 docs claimed nothing had been implemented                    | §10 of `redesign-paths.md` reworded                                            |

The most consequential audit finding was not in the list: **the header island
dropped `aria-current` during hydration**, so the active nav state disappeared
on the client even though the SSR HTML had it. The island now owns the state
(`aria-current` + `data-current` from the request path), which is where it has
to live.

Not fixed, deliberately: no canonical URL or `og:image` (needs the final domain
and artwork); the SSG verifier still ignores `#fragment` targets; the mobile
overlay is not announced as a modal dialog.

## Known limitations

- No Open Graph image and no canonical URL — `og:title`/`og:description` are set
  but a shared link still has no artwork, and a canonical needs the final
  domain.
- `/projects` stays long (5,779px): the index fixes scanning, but the fiches
  themselves are unchanged prose. Collapsing detail per project is a separate
  decision.
- The 404 route is unchanged apart from inheriting the new stylesheet.
- The print stylesheet is verified in emulation, not on a physical printer.
