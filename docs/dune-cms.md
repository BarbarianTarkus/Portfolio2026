# Dune CMS integration

The portfolio uses [Dune](https://getdune.org) — the flat-file CMS for Deno and
Fresh — as its content backend. Dune is mounted **headless**: it indexes
[`content/`](../content), exposes a content API and serves the `/admin` editing
panel, but it does not render the public pages. Those still come from the Fresh
routes in [`routes/`](../routes) and keep the portfolio's design.

The Dune packages are pinned in [`deno.json`](../deno.json): `@dune/core`
`0.35.0`, `@dune/plugin-admin` `3.1.3` and `@dune/plugin-inline-edit` `2.2.3`
(the last one is loaded from `config/site.yaml`). Dune is pre-1.0, so treat
upgrades as potentially breaking and read its changelog first.

## Mount

[`main.ts`](../main.ts) creates the Fresh app and boots Dune in one place:

```ts
const app = new App<State>({
  basePath: normalizeBasePath(Deno.env.get("BASE_PATH")),
});

const dune = await bootstrap(import.meta.dirname!, {
  dev: Deno.env.get("DUNE_DEV") === "1",
});

app.use(staticFiles());
await mountPlugins(app, dune);

app.use((ctx) => {
  ctx.state.contentApi = dune.contentApi;
  return ctx.next();
});

app.fsRoutes();
```

- `bootstrap()` loads [`config/site.yaml`](../config/site.yaml) and
  [`config/system.yaml`](../config/system.yaml), builds the content index and
  returns the engine, the content API and the plugin context.
- `mountPlugins()` wires Dune's plugins into the Fresh app. With
  `@dune/plugin-admin` installed, that is the admin panel at `/admin` plus
  Dune's own admin/auth routes.
- The middleware copies `dune.contentApi` onto `ctx.state` for every request.
  [`utils.ts`](../utils.ts) declares it as `State.contentApi`, so route handlers
  and loaders see it through Fresh's typed `Context<State>`.
- `app.fsRoutes()` registers the portfolio's own file-system routes after the
  Dune plugins. Headless Dune does not serve content pages, so `/`, `/about`,
  `/contact`, `/experience` and `/projects` always come from
  [`routes/`](../routes).

No database or external service is involved: Dune keeps runtime state in the
local filesystem (see the two directories below).

Dune writes its local state to two git-ignored directories:

| Directory | Contents                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `data/`   | local users and permissions (`data/users/`, `data/permissions/`) and the first-run `data/initial-password.txt` |
| `.dune/`  | admin runtime state: sessions, CSRF secret and the audit log                                                   |

## Content model

Every editable page is a Dune flat-file page: a folder under
[`content/`](../content) with a `default.md` file. The folder name is the page
(the numeric prefix controls order and is stripped from the route) and the YAML
frontmatter holds all structured copy. The Markdown body is empty for every page
in this site — the routes only read `frontmatter`, which Dune's content API
returns as typed data.

| Page                               | Route              | Frontmatter holds                                                                                         |
| ---------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| `content/01.home/default.md`       | `/`                | hero eyebrow and CTAs, section headings and links, focus blocks, stack chips, project note                |
| `content/02.about/default.md`      | `/about`           | meta, title, lede, biography paragraphs, homelab section, closing links                                   |
| `content/03.contact/default.md`    | `/contact`         | meta, title, lede, row labels and hints                                                                   |
| `content/04.experience/default.md` | `/experience`      | meta, title, lede, jobs (role/company/period/place/stack/bullets), education, closing prose               |
| `content/05.projects/default.md`   | `/projects`        | meta, title, lede, kind labels, fiche labels and the five project fiches                                  |
| `content/06.site/default.md`       | `/site` (internal) | identity, navigation, evidence strip, homelab stack, social links, footer labels, 404 copy and UI strings |

Notes on editing the files by hand:

- The home page is **the first root page by order**, so keep `01.home` first.
  The `06.site` page is not routable content in the public site; it is loaded as
  site globals by `loadSite()` on every request.
- Keep values typed: quote strings that look like numbers (e.g. years like
  `"2023"`, a 404 code like `"404"`), or YAML will turn them into numbers.
- Do not add Dune's own system fields (`published`, `visible`, `routable`,
  `template`); Dune injects them with defaults. Page-specific fields such as
  `kind`, `work`, `broke` and `next` are described by
  [`lib/content-types.ts`](../lib/content-types.ts).
- The copy is Spanish (`<html lang="es">`); labels, accents and typographic
  quotes are part of the content, not the code.

## Markdown in prose fields

Prose fields are rendered through [`lib/markdown.tsx`](../lib/markdown.tsx):
editors can use inline Markdown: bold (`**bold**`), italic (`*italic*`), inline
code (between backticks) and `[label](/route)` links. The HTML is sanitized with
Dune's allowlist (scripts, event handlers and style attributes are dropped), and
root-relative links are prefixed with the deployment `basePath`.

Markdown is supported in: the About `lede`, `paragraphs`, `homelabNote` and
`follow`; Contact `lede`; Experience `lede`, job bullets and `outro`; Projects
`lede`, each project's `summary`, `problem`, `decisions`, `broke` and `next`;
and the home hero intro, section note and focus blocks.

Field text is stored as plain YAML strings, so Markdown is written **as source**
— in the raw editor (or by hand). Inline ✎ editing stays enabled only for plain
fields (title, eyebrow, `linkedinLabel`): the inline editor writes plain text
and would flatten existing Markdown, so prose fields are intentionally not
inline-editable.

## Content API usage

[`lib/content.ts`](../lib/content.ts) is the only module that talks to Dune.
Routes call its loaders (`loadSite`, `loadHomePage`, `loadAboutPage`, …) and
receive plain frontmatter objects. No other module queries content; the only
other Dune import in the app is the `ContentApi` type in
[`utils.ts`](../utils.ts), which types `ctx.state.contentApi`.

The pattern is small enough to copy when adding a page:

```ts
import type { Context } from "fresh";
import type { State } from "../utils.ts";

async function loadPage<FM>(ctx: Context<State>, route: string) {
  const api = ctx.state.contentApi;
  if (api === undefined) {
    throw new Error("Dune content API missing from ctx.state");
  }

  // Dune routes end with a trailing slash; Fresh routes do not.
  const page = await api.page<FM>(`${route.replace(/\/+$/, "")}/`);
  if (page === null) throw new Error(`No Dune page for ${route}`);
  return page.frontmatter;
}
```

- `contentApi.page<FM>(route)` resolves one page and returns `null` when it does
  not exist. `contentApi.pages()` lists the index (route, parent path, order);
  `loadPage("/")` uses it to pick the home page.
- Read content only through this API. Importing `content/*.md` directly, or
  reading it from disk, bypasses Dune's index and diverges from the admin and
  the static export.
- The API instance belongs to the request (`ctx.state`); do not cache it at
  module level.

## Admin workflow

The admin is a Dune plugin, so there is no separate build step or cloud project.

1. Start the dev server:

   ```bash
   deno task dev   # http://localhost:5173
   ```

2. Open <http://localhost:5173/admin>. On the first run Dune creates a local
   `admin` account and writes its generated password to
   `data/initial-password.txt` — the password is never printed to the logs.
3. Log in as `admin` with that password, change it in the admin's user settings,
   then delete `data/initial-password.txt`.
4. Open **Pages → <page>**. This site ships a custom Dune content editor
   (`plugins/content-editor/` + `islands/admin/ContentEditor.tsx`) that replaces
   Dune's stock page editor:
   - the left pane says exactly what is being edited (source file + route);
   - the middle pane is the page's raw source (YAML frontmatter + body);
   - the right pane is a live preview of the real public page, open by default.

   **Save** (Ctrl/Cmd+S) validates the YAML frontmatter, writes the page's
   `content/*/default.md` file in place and rebuilds the content index; the
   preview refreshes after the save. Because the file is the unit of editing,
   changes appear as a normal git diff in [`content/`](../content) and comments
   and key order are preserved.
5. [`dev.ts`](../dev.ts) also watches `content/` and rebuilds the content index
   in place (`DuneEngine.rebuild()`), so external edits show up without
   restarting the server.

### Why a custom page editor

Dune's built-in editor focuses on the Markdown body and on _blueprint_-declared
frontmatter fields. Blueprints only support flat scalar/list fields, while the
portfolio's copy is nested YAML (jobs, project fiches, section headings, site
labels), so the built-in editor could only show it read-only as "unmanaged
frontmatter" and its preview rendered the empty Markdown body.

The plugin sets `adminServices().contentEditor`, Dune's supported extension
point for replacing the page editor, and adds two guardian-protected admin API
routes (`withGuards` from `@dune/plugin-admin/admin/guards`):

| Route                                    | Purpose                                    |
| ---------------------------------------- | ------------------------------------------ |
| GET `/admin/api/portfolio-editor/source` | Read a page's raw source                   |
| POST `/admin/api/portfolio-editor/save`  | Validate frontmatter, write file, re-index |

The editor preview uses `/admin/api/preview`; `main.ts` answers it by rendering
the page's real public route in-process, because Dune's stock preview only
renders the Markdown body (which is empty here).

No CMS credentials belong in `.env` or CI: the admin is local and the deployment
is static. Deleting `data/` resets local users, permissions and the admin
password; the next start creates a fresh admin and password file.

### Inline editing on the public site

[`@dune/plugin-inline-edit`](https://github.com/duneorg/plugin-inline-edit) is
enabled for admins: while logged in, every public page gets Dune's floating
admin bar and a ✎ Edit handle on editable regions. Clicking the handle turns the
text into an in-place editor; changes are patched into the page's frontmatter
debounced (~600 ms), and the bar's **Save** commits the revision. **✎ Edit
source** opens the custom raw-content editor from above in an overlay, which is
how nested content (jobs, project fiches, labels) is edited.

Templates opt regions in with the marker components from
[`@dune/core/ui/editable`](https://jsr.io/@dune/core/doc/ui/editable) — see the
`EditableText` wrappers in [`routes/`](../routes). The page title is annotated
automatically from the first `<h1>`; fields use the top-level frontmatter key
(`lede`, `eyebrow`, `linkedinLabel`, …). Inline editing currently covers flat
string fields, not nested objects/arrays; use the source editor for those.

Because the site mounts Dune headless (not `createDuneApp`), core does not wire
the plugin's browser bundle, admin-bar injection or WebSocket route. Those three
pieces live in [`lib/inline-edit-runtime.ts`](../lib/inline-edit-runtime.ts):

| Piece                      | What it does                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Client bundle              | Bundles plugin `clientEntries` into `.dune/client-bundles/` and serves them         |
| `transformResponse` runner | Injects the admin bar/markers for `pages.update` sessions; scrubs markers otherwise |
| `/api/inline-edit/ws`      | Y.js document socket used by the body editor (auth + `pages.update` check)          |

Markers are admin-only: Dune's own pipeline scrubs them for anonymous visitors,
and `deno task ssg` strips them from the published HTML as well (the static
export skips that pipeline).

## Static export limitation

GitHub Pages only serves static files, so the deployed site has **no `/admin`
and no content API**. `deno task ssg` builds `_fresh`, renders the public routes
against the same `content/` files with the production handler and writes
`dist/`. The `/admin` routes and the content API only exist while the Fresh
server is running.

Consequences:

- Content editing happens locally (`deno task dev`) or on a Deno server
  deployment (`deno task build` + `deno task start`, which serves the app and
  `/admin` on port 8001). Both read and write the same Markdown files.
- Content changes reach GitHub Pages only when the updated files are committed
  and pushed: the deploy workflow re-exports `dist/` from `content/`.
- The export is byte-for-byte files, so no login, database or KV store is needed
  on the host. The `BASE_PATH` prefix applies to the static site only.
- The renderer sets `DUNE_STATIC=1`, which skips mounting the admin/plugin
  routes and the inline-edit runtime during the export (no user or session
  directories are created in CI), and the export scrubs any remaining
  `data-dune-*` markers before writing `dist/`.

## Upgrading Dune (island bridge files)

Dune ships its admin panel as a JSR package, and the admin's client-side
components are [Fresh islands](https://fresh.deno.dev/docs/concepts/islands)
that live at `https://jsr.io/@dune/plugin-admin/...` URLs. Fresh's island
crawler only discovers islands from files under [`islands/`](../islands), so
each admin island has a one-line bridge file under
[`islands/dune-admin/`](../islands/dune-admin/):

```tsx
/** @jsxImportSource preact */
export { default } from "https://jsr.io/@dune/plugin-admin/3.1.3/src/admin/islands/PageTree.tsx";
```

(That is the whole file; it exists only so Fresh's bundler picks the island up.)
[`islands/Header.tsx`](../islands/Header.tsx) is the portfolio's own island and
is unrelated to the bridges.

When updating Dune:

1. Bump `@dune/core` and `@dune/plugin-admin` in [`deno.json`](../deno.json),
   the `@dune/plugin-inline-edit` specifier in
   [`config/site.yaml`](../config/site.yaml), and run `deno install` to refresh
   `deno.lock`. Delete `.dune/client-bundles/` so the editor bundle is rebuilt.
2. Update the version in every bridge file's import URL to match the new
   `@dune/plugin-admin` release.
3. Check the package's `adminIslands` export (the admin's island list) and add
   or remove bridge files so the folder matches it exactly. A missing bridge
   means that admin feature fails to hydrate; a stale one is dead weight.
   `islands/dune-admin/` is excluded from `deno check` (Deno does not type-check
   `https://` imports); the bridges are one-line re-exports, so keep them
   formatted by hand.
4. Review the custom content editor: it implements core's `ContentEditorPlugin`
   interface and calls the admin's page API, so a breaking change there needs a
   matching update in `plugins/content-editor/mod.tsx` and
   `islands/admin/ContentEditor.tsx`. The island is admin-only and pruned from
   the static export together with `islands/dune-admin/` (see
   `scripts/build.ts`).
5. Start `deno task dev`, open `/admin`, and exercise the page editor (edit,
   save, live preview) plus the media library and config before committing.
