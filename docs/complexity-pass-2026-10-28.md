# Complexity pass — 2026-10-28

Cyclomatic complexity measured by SonarQube for project `Portfolio`, and the
refactor that lowered it. The numbers in this document come from the SonarQube
MCP server (`get_component_measures`), queried per component key
(`Portfolio:<path>`), not from a local approximation.

## Result

| Metric                    |                   Before |                    After |           Δ |
| ------------------------- | -----------------------: | -----------------------: | ----------: |
| Cyclomatic complexity     |                      117 |                   **99** | −18 (−15 %) |
| Cognitive complexity      |                       46 |                   **41** |          −5 |
| Functions                 |                       69 |                   **60** |          −9 |
| Lines of code (ncloc)     |                     2181 |                 **2160** |         −21 |
| Open issues / code smells |                        0 |                    **0** |           — |
| Quality gate              | ERROR (new coverage 0 %) | ERROR (new coverage 0 %) |   unchanged |

The quality gate still fails on `new_coverage` because the repository has no
automated tests yet; that condition is unchanged by this pass and is not a
complexity problem.

### Per file

SonarQube counts cyclomatic complexity as `1 + decision points` per function
(`if`, loops, `&&`, `||`, `??`, ternaries, `catch`, …), summed over the file.
That is why extraction and duplication removal are the two levers that move the
number.

| File                                            | Before |  After | Why                                                                                                                                                      |
| ----------------------------------------------- | -----: | -----: | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes/projects.tsx`                           |      8 |  **2** | Fiche markup moved to `components/ProjectFiche.tsx`. The page keeps only the head, lede and the list.                                                    |
| `components/ProjectFiche.tsx`                   |      — |  **8** | New presentational component (5 functions, 3 optional-field decisions).                                                                                  |
| `islands/Header.tsx`                            |     17 | **15** | Removed the hand-written active-link `aria-current` logic: Fresh already annotates anchors (`setActiveUrl`), which also removes duplicated branch logic. |
| `routes/_app.tsx`                               |      2 |  **1** | No longer computes/passes `currentPath`.                                                                                                                 |
| `config.ts`                                     |      4 |  **5** | Absorbs the shared `isUnderBasePath` helper (deduplicates two copies).                                                                                   |
| `scripts/lib/routes.ts`                         |     14 |  **8** | One `toRoutePath` with three regexes instead of `isPageSegment`/`isPageFile`; `outputFileForRoute` inlined.                                              |
| `scripts/lib/files.ts`                          |     13 | **11** | Single-use default `skip` callback removed; `removeDir` uses `try/catch`.                                                                                |
| `scripts/lib/verify.ts`                         |     13 | **10** | Duplicate `isUnderBasePath` removed; `indexDistFiles` folded into `verifyOutput`.                                                                        |
| `scripts/lib/render.ts`                         |      8 |  **7** | Single-use `fetchPage` folded into `renderRoute`.                                                                                                        |
| `scripts/preview.ts`                            |     13 | **10** | Shared `isUnderBasePath`; dead `displayBase` removed.                                                                                                    |
| `scripts/ssg.ts`                                |     10 |  **7** | `printBanner`/`writeNoJekyll`/`renderAll` folded into `main`.                                                                                            |
| other files (routes, components, data, configs) |     42 | **41** | Unchanged, except the new component above.                                                                                                               |

Highest per-file complexity is now `islands/Header.tsx` at **15** (was 17); no
function is anywhere near SonarQube's default threshold of 10 for a single
function.

## What changed, in behaviour terms

- `/projects` renders the same HTML: same ids, classes, attributes and order.
  The only additions are Fresh's own `<!--frsh:key:…-->` list markers around
  each fiche, because the route now maps a component (which requires a `key`).
- The header no longer computes active-link state. Fresh annotates matching
  anchors with `aria-current` while rendering (`setActiveUrl`) and also emits
  `data-current`/`data-ancestor`; the island keeps its mobile-menu state, Escape
  handling and scroll lock.
- Build tooling behaviour is unchanged: same route discovery, same output paths,
  same verification messages, same preview server responses (prefix redirect,
  directory redirects, branded 404, traversal protection).

## Verification

- `DENO_DIR=… deno check` — exit 0.
- `deno fmt --check .` and `deno lint .` — exit 0.
- `deno task ssg` — exit 0, 4 pages + 404, 58 internal URLs verified.
- **HTML regression**: the generated `dist/` was compared against a build taken
  before the pass. After normalizing asset hashes, the island boot payload and
  Fresh's own `data-current`/`frsh:key` markers, all five documents
  (`index.html`, `about/`, `contact/`, `projects/`, `404.html`) are identical,
  and each page still carries `aria-current="page"` on its nav link.
- **Preview smoke test**: `/` → 302 to `/Portfolio/`; `/Portfolio/` → 200;
  directory → 301 with trailing slash; unknown path → branded 404; CSS served as
  `text/css`; `../../etc/passwd` → 404.
- **SonarQube re-scan** (`./scripts/sonar-scan.sh`) plus MCP measures: 0 issues,
  0 code smells, project complexity **99** (was 117), cognitive **41** (was 46).

## Notes for the next pass

- If the fiche list ever grows enough to need client-side reordering, the key on
  `ProjectFiche` is already there.
- The last easy win would be flattening `scripts/lib/verify.ts` loops, but it
  would trade readability for 1–2 points; not worth it today.
- Writing tests would fix the quality gate (coverage) — the only remaining red
  condition.
