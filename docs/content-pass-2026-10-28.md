# Content pass — 2026-10-28

What this pass changed in the site, which facts are verified, and what is still
blocked on the owner. Written so the next session does not have to re-derive it.

## Scope

- Rewrote the four pages in Spanish and added `/projects` with five fiches.
- Copied the one-page CV to `static/cv.pdf` and linked it from the header, the
  home hero, the footer and `/contact` (it is served at `/Portfolio/cv.pdf`).
- Unchanged: design tokens, layout, fonts, colour palette, header island, build
  pipeline. This was a content pass, not a redesign.

## Decisions

- **Spanish first.** The CV, LinkedIn and the target market (Barcelona,
  InfoJobs, consultoras) are Spanish; the handoff recommended ES by default.
  `routes/_app.tsx` sets `<html lang="es">`. There is **no EN version yet**:
  adding a `/en` branch would duplicate every page, so it was left for later.
- **One fiche per repository**, not per umbrella project. `moodle_langer-script`
  and `mod_jokeofday` are grouped under one fiche ("Herramientas para Moodle")
  because they are two halves of the same Moodle story; both repo links are
  listed at the bottom.
- **`broke` and `next` are optional in `Project`.** `broke` is filled only when
  a real failure is documented somewhere (PetSalut and Mixology-Luismi: their
  own READMEs; rebost-api: the `--unstable-kv` churn documented in its README).
  Inventing an incident would be worse than leaving the field out — do not add
  one without the owner's input.
- **No `/homelab` page yet.** The home card links to `/about#homelab`, which
  holds the CV's homelab paragraph. A dedicated page needs three real incidents
  (symptom → hypothesis → diagnosis → fix → prevention), and those are still
  pending from the owner.

## Where the data comes from

| Source                                                  | Used for                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `career-ops/output/cv-ricardo-verduguez-2026-10-27.pdf` | Experience, dates, studies, homelab description, email           |
| `career-ops/output/portfolio-handoff-2026-10-27.md`     | Home copy, page structure, fiche template, "what not to publish" |
| GitHub API (2026-10-27/28)                              | Commit counts, date ranges, primary language, repo URLs          |
| Repo READMEs                                            | Fiche narrative: `problem`, `decisions`, `broke`                 |

Verified numbers now on the site: 3iPunt 2 years 8 months (CV), Password-Manager
23 commits, rebost-api 8, `moodle_langer-script` 7 + `mod_jokeofday` 22,
PetSalut 12 merged PRs, Mixology-Luismi 69 commits.

## Still blocked on the owner

1. **The 3iPunt bullets.** `/about` still uses the CV's four literal lines
   ("Desarrollo full-stack…", "Control de versiones…"). They are not evidence
   yet: they need what was built, for whom, and with what outcome. Answers to
   the five questions in the handoff (§13) turn them into the strongest block of
   the page.
2. **Three homelab incidents** for a future `/homelab` page.
3. **Hobbies line** for `/about` — deliberately omitted, it has to be real.
4. **English version** if a remote-European application needs one.

## Next technical steps (not done here)

- `sitemap.xml` and an OG image (1200×630) — the handoff's §8 checklist.
- Lighthouse pass on mobile once the site is deployed.
- `/homelab` route when the incidents arrive.

## Adding a project

Append to `projects` in `data/site.ts`:

```ts
{
  slug: "name",              // anchor id, also used for in-page links
  name: "Readable name",
  summary: "One sentence, no adjectives.",
  tags: ["Tech"],            // rendered as chips
  period: "month year — month year",
  work: "N commits",         // only if verified; omit otherwise
  links: [{ label: "owner/repo", href: "https://github.com/..." }],
  problem: "What did not exist or was broken.",
  decisions: ["Chose X because Y, at the cost of Z."],
  broke: "Symptom → diagnosis → fix. Omit if unknown.",
  next: "What you would do differently today.",
}
```

The route renders every fiche automatically; no markup changes needed.
