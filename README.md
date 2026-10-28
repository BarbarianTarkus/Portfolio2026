# Ricardo Verduguez — portfolio

A static portfolio site built with **[Deno](https://deno.com)** and
**[Fresh 2](https://fresh.deno.dev)**, with the site copy edited through
**[Dune](https://getdune.org)** — the flat-file CMS for Deno and Fresh — mounted
headless inside the app. Every page is rendered on the server by Fresh and then
exported to plain HTML, CSS and (a tiny amount of) JavaScript, so it can be
hosted for free on GitHub Pages.

This repository replaces the previous SvelteKit version of the portfolio. The
visual identity (dark navy background, yellow accent, Fira Code / Roboto
Condensed typography, hamburger menu) was kept, while the implementation moved
from client-side Svelte to server-rendered Preact.

## How it works

```
main.ts          Fresh app + Dune bootstrap: headless CMS mount, /admin
dev.ts           Dev server: Fresh Builder + Dune content-index watcher
routes/          Fresh file-system routes (pages + _app shell + _404)
islands/         Client-side JS: the header/menu island, one thin bridge file
                 per Dune admin island (islands/dune-admin/) and the custom admin
                 content editor (islands/admin/)
plugins/         Dune plugins: content-editor (raw page editor + live preview)
components/      Static Preact components (footer, icons, page pieces)
content/         Dune pages: one folder per page, copy in default.md frontmatter
lib/content.ts   Typed loaders over Dune's content API (the only CMS client)
lib/content-types.ts  TypeScript shapes for each page's frontmatter
config/          Dune configuration (site.yaml, system.yaml)
static/          Static assets copied as-is (styles, favicon, robots.txt)
scripts/build.ts Production build → _fresh/ (server.js + static/)
scripts/ssg.ts   Static export: build, render, verify links → dist/
scripts/preview.ts  Local server that mimics GitHub Pages
scripts/sonar-scan.sh  Local SonarQube analysis (reads .env)
config.ts        BASE_PATH handling shared by app, SSG and preview
docs/dune-cms.md Dune integration: mount, content model, admin, upgrades
docs/redesign.md Light-touch redesign plan and design-token rationale
docs/content-pass-2026-10-28.md  Content pass: scope, provenance, pending items
docs/ui-ux-pass-2026-10-28.md    Interaction, accessibility and hierarchy fixes
data/            Dune runtime state (git-ignored): users, permissions, password
.dune/           Dune admin state (git-ignored): sessions, CSRF secret, audit log
```

- **Server rendering:** [`routes/_app.tsx`](routes/_app.tsx) renders the
  document shell and wraps every page with the header (an island) and the
  footer.
- **Partial hydration:** only [`islands/Header.tsx`](islands/Header.tsx) ships
  JavaScript to public pages (mobile menu state, Escape key, focus trap/inert
  handling and scroll lock). The files in
  [`islands/dune-admin/`](islands/dune-admin/) are Dune admin island bridges:
  thin re-exports bundled into the `/admin` entry and never loaded on the public
  site.
- **Headless CMS:** [`main.ts`](main.ts) calls Dune's `bootstrap()` and
  `mountPlugins()`, exposes the content API on `ctx.state.contentApi` and mounts
  the admin at `/admin`. The public pages still come from [`routes/`](routes/);
  [`lib/content.ts`](lib/content.ts) is the only module that reads content. See
  [`docs/dune-cms.md`](docs/dune-cms.md).
- **Static export:** `deno task ssg` builds the app with Fresh's Builder,
  renders each route through the production server handler, copies the bundled
  assets into `dist/`, writes `404.html` and `.nojekyll`, and finally verifies
  that every URL referenced by the HTML — including the island module imports —
  exists on disk (CSS `url()` references are not inspected; the stylesheet has
  none today).

## Requirements

- [Deno](https://docs.deno.com/runtime/getting_started/installation) 2.x.
- Nothing else. There is no Node.js toolchain, no database and no external
  service: Fresh 2 bundles with its own Builder and Dune is a JSR package.

## Setup

```bash
deno install
```

This populates the locked dependencies Fresh bundles in `node_modules/`.

## Development

```bash
deno task dev
```

The dev server runs at <http://localhost:5173/> with live reload (set `PORT` to
use another port). Editing a route or island rebuilds the browser bundle;
editing a content page rebuilds Dune's content index in place, so changes show
up without restarting the process. No `BASE_PATH` is needed in development: the
site is served from the domain root.

## Editing content

The copy is stored as [Dune](https://getdune.org) pages: one folder per page
under [`content/`](content/), each with a `default.md` whose YAML frontmatter
holds the structured text the route renders. Start the dev server and open
<http://localhost:5173/admin>. On the first run Dune creates an `admin` account
and writes its generated password to `data/initial-password.txt` (both `data/`
and `.dune/` are git-ignored). Log in, change the password, delete that file,
then edit pages in the admin. Dune's stock page editor is replaced by a
portfolio-specific one: it edits the page's raw source (YAML frontmatter plus
body), clearly labels the file and route it is editing, and previews the real
public page next to it (open by default). Saving (Ctrl/Cmd+S) writes straight
into `content/*/default.md` and rebuilds the site, so the result is a normal
content diff that is committed with the rest of the site.

The GitHub Pages deployment is static only: `/admin` and the content API do not
exist there. The admin runs locally, or on a Deno server deployment of the same
app. The content model, route mapping and upgrade notes are documented in
[`docs/dune-cms.md`](docs/dune-cms.md).

## Build the static site

```bash
deno task ssg      # → dist/
deno task preview  # → http://127.0.0.1:8787/Portfolio2026/
```

`deno task ssg` always writes a deployable site. By default it targets the
GitHub Pages sub-path `/Portfolio2026`; override it with the `BASE_PATH`
environment variable:

```bash
BASE_PATH="" deno task ssg          # serve from a root domain
BASE_PATH="/my-repo" deno task ssg  # different project site
BASE_PATH="" deno task preview      # preview a root-domain build
```

The generator fails if any generated `href`/`src`/island import points at a
missing file or forgets the base path, so a green run means the deployment links
are sound.

`deno task start` builds the Fresh server into `_fresh/` and serves it at
<http://localhost:8001/> — including `/admin`. It runs `deno task build` first,
so a static export never leaves a pruned server bundle behind:

```bash
deno task start
```

`deno task start` always binds port 8001. To use another port, call the server
directly: `deno serve -A --port 8803 _fresh/server.js` (extra arguments passed
to a Deno task land after the script path, where `deno serve` ignores them).

## Deployment

`.github/workflows/deploy.yml` runs the checks, exports `dist/` with Deno and
publishes it with GitHub Pages' official actions whenever `master` is pushed.
`.github/workflows/ci.yml` runs the same checks on pull requests. Both workflows
only set up Deno: no CMS secrets or cloud project need configuring.

One-time repository setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The site is then available at
<https://barbariantarkus.github.io/Portfolio2026/>.

To use a custom domain instead, add a `CNAME` file to `static/` (it is copied
into `dist/`) and set the `BASE_PATH` repository variable to `/` so the site is
built for the domain root (GitHub Actions variables cannot be empty, and `/` is
normalized to root by `config.ts`).

The deployed site is static, so content changes require a rebuild: edit and
commit `content/`, and the push republishes the export. Editing through the
admin against a Deno server deployment does not update GitHub Pages on its own;
its content changes still have to be committed and pushed.

## Customizing content

Each page in [`content/`](content/) is a Dune folder with a `default.md` file.
The numeric prefix controls order and is stripped from the route:

- `content/01.home/default.md` — home page (`/`): hero, CTAs, section headings,
  focus blocks, stack chips, project note.
- `content/02.about/default.md` — About page (`/about`).
- `content/03.contact/default.md` — Contact page (`/contact`).
- `content/04.experience/default.md` — Experience page (`/experience`).
- `content/05.projects/default.md` — Projects page (`/projects`): one fiche per
  project, with `problem`, `decisions` and optional verified `broke`/`next`
  lines.
- `content/06.site/default.md` — site globals shared by every page: identity,
  navigation, social links, footer labels, 404 copy and UI strings.

The frontmatter is typed in [`lib/content-types.ts`](lib/content-types.ts) and
loaded by [`lib/content.ts`](lib/content.ts), which passes it to the routes;
routes only see plain data. Edit the frontmatter by hand or through the
[admin](#editing-content). The site copy is written in Spanish
(`<html lang="es">`); there is no English translation yet. Colours, typography
and layout are defined with CSS custom properties at the top of
[`static/styles/main.css`](static/styles/main.css).

## Design notes

The visual identity (palette, type, layout) is intentionally unchanged. A
light-touch redesign pass unified every heading accent on `var(--text-accent)`
(the home and About pages previously used two different accents), added an
accent underline for the active nav item, strengthened the focus ring and gave
icon controls 44 px touch targets. Details, rationale and the optional phase-2
backlog are in [`docs/redesign.md`](docs/redesign.md).

A later UI/UX pass fixed what measurements exposed rather than restyling: the
header gutter now scales (20/40/160 px) instead of being pinned at 10rem, page
titles are 36–48 px instead of competing with section headings, focus rings are
keyboard-only (`:focus-visible`), overlay rows are real 44 px touch targets, and
the mobile menu moves focus into the overlay, traps Tab there, marks the page
behind it `inert` and closes itself when the layout resizes to desktop. A
follow-up review then removed the CV from the site entirely and brought inner
page copy down to 16/18/20 px with a 64ch measure, so About/Contact/Projects
match the home page instead of running at 24–25.6 px. Palette and type families
are untouched. Details and the verification log are in
[`docs/ui-ux-pass-2026-10-28.md`](docs/ui-ux-pass-2026-10-28.md).

## Code quality (SonarQube)

The repository is analysed on <https://sonarqube.verduguez.com> as project
`Portfolio`, configured by
[`sonar-project.properties`](sonar-project.properties). Analysis runs locally
with the git-ignored `.env` (contains `SONAR_HOST_URL` and `SONARQUBE_API_KEY`):

```bash
./scripts/sonar-scan.sh
```

The last full scan, taken just before the Dune migration, reported zero open
issues, zero code smells, zero security hotspots and A ratings for reliability,
security and maintainability, with cyclomatic complexity 99 (cognitive
complexity 41). The 2026-10-28 pass that brought it down from 117 is documented
in [`docs/complexity-pass-2026-10-28.md`](docs/complexity-pass-2026-10-28.md);
re-run the scan after the CMS migration to refresh those numbers. The Sonar
configuration already points at the Dune source tree and excludes the
git-ignored `data/` and `.dune/` runtime directories.

## Checks

```bash
deno task check   # deno fmt --check + deno lint + deno check
```

The same command runs in CI and before every deployment, and only needs Deno.
