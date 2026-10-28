# TinaCMS integration

The portfolio is a static Deno/Fresh site. TinaCMS provides the editing UI and
the live visual preview, while the site itself keeps rendering from committed
JSON files (no database, no runtime dependency on Tina).

## Content model

All editable copy lives in [`content/`](../content):

| File              | Collection      | What it covers                                                                                                                        |
| ----------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `site.json`       | `site` (global) | identity, nav, evidence strip, homelab stack, social links, footer labels, 404 copy, UI strings (skip link, menu labels, aria labels) |
| `home.json`       | `home`          | hero eyebrow, CTAs, section headings/links, focus blocks, stack chips, project note                                                   |
| `about.json`      | `about`         | meta, title, lede, biography paragraphs, homelab section, closing links                                                               |
| `contact.json`    | `contact`       | meta, title, lede, row labels and hints                                                                                               |
| `experience.json` | `experience`    | meta, title, lede, jobs (role/company/period/place/stack/bullets), education, closing prose                                           |
| `projects.json`   | `projects`      | meta, title, lede, kind labels, fiche labels, all five project fiches                                                                 |

The schema (`tina/config.ts`) is the single source of truth for labels and
fields. `lib/content.ts` loads the JSON documents, adds Tina's `_content_source`
metadata and records each document as a form for the current request.

## Editing flow

1. The route handler loads the documents it renders (`lib/content.ts`).
2. `routes/_app.tsx` serialises every recorded form into hidden
   `[data-tina-form]` payloads and loads `static/tina-bootstrap.js`.
3. Outside the admin iframe the bootstrap does nothing. Inside it, it starts
   `@tinacms/bridge` (vendored as `static/tina-bridge.js`), which announces the
   forms to the admin and enables click-to-edit on every `data-tina-field`
   marker (`lib/tina/metadata.ts`).
4. On every keystroke the admin posts `updateData` to the iframe. The bridge
   refreshes each editable region by POSTing the form overlay to
   `/tina-island/<name>`:
   - **Server** (`routes/tina-island/[name].ts` + `lib/tina/islands.tsx`):
     re-renders the region with Preact's `renderToString` and returns HTML. Live
     preview is exact, including links and new list items.
   - **Static export** (GitHub Pages): the endpoint does not exist. The export
     sets `data-tina-static` and `static/tina-live-fallback.js` applies the
     overlay to the existing DOM (leaf text elements only) instead, so preview
     still updates live in the browser.

Saving in the admin writes the JSON file (local mode) or commits through Tina
Cloud (production). The site is rebuilt from those files.

## Commands

```bash
deno task tina:install    # install the Node tooling in tools/tina
deno task tina:dev        # Tina dev server + Fresh dev server, live preview
deno task tina:build      # production admin + generated query strings
deno task tina:documents  # only regenerate lib/tina/documents.generated.ts
deno task tina:check-cloud # validate the Tina Cloud project matches this schema
```

`deno task ssg` runs `tina:build` automatically and exports the admin to
`dist/admin/` with document-relative asset URLs, so the same build works at
`/admin/` and at a sub-path such as `/Portfolio/admin/`.

## Cloud project prerequisite

Tina Cloud binds one client id to one connected Git repository. The credentials
in `.env` / CI secrets must belong to a project created for this repository;
`deno task tina:check-cloud` fails loudly when they do not. At the time of
writing, the `.env` values exposed a different project's schema (`cocktails`,
`home`, `contact` with hero fields) and therefore cannot be used for the
portfolio admin until replaced with a project connected to this repo.

## Known limitations

- The static fallback updates text nodes; edits that add/remove markup (the
  inline `[label](/route)` links in closing prose) keep the previously rendered
  HTML until the next build. A server deployment gets the exact re-render.
- Media uploads are configured (`static/uploads`) but the current content model
  has no image fields yet.
- `tina/config.ts` is executed by Node and starts with `// @ts-nocheck` because
  Deno's type checker has no `process`/`@types/node` for it.
