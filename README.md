# Ricardo Verduguez — portfolio

A static portfolio site built with **[Deno](https://deno.com)** and
**[Fresh 2](https://fresh.deno.dev)**. Every page is rendered on the server by
Fresh and then exported to plain HTML, CSS and (a tiny amount of) JavaScript, so
it can be hosted for free on GitHub Pages.

This repository replaces the previous SvelteKit version of the portfolio. The
visual identity (dark navy background, yellow accent, Fira Code / Roboto
Condensed typography, hamburger menu) was kept, while the implementation moved
from client-side Svelte to server-rendered Preact.

## How it works

```
routes/          Fresh file-system routes (pages + _app shell + _404)
islands/         Components that need client-side JS (only the header/menu)
components/      Static Preact components (footer, icons)
content/         Editable site copy (JSON, modelled by tina/config.ts)
lib/content.ts   Typed loaders that pass content to routes
tina/config.ts   TinaCMS schema for content/*.json
static/          Static assets copied as-is (styles, favicon, robots.txt)
scripts/ssg.ts   Static site generator entry point (build, render, verify)
scripts/lib/     Filesystem, route, rendering and output-verification helpers
scripts/preview.ts  Local preview server that mimics GitHub Pages
scripts/sonar-scan.sh  Local SonarQube analysis (reads .env)
docs/redesign.md Light-touch redesign plan and design-token rationale
docs/content-pass-2026-10-28.md  Content pass: scope, provenance, pending items
docs/ui-ux-pass-2026-10-28.md    Interaction, accessibility and hierarchy fixes
config.ts        BASE_PATH handling shared by app, Vite and SSG
```

- **Server rendering:** `routes/_app.tsx` renders the document shell and wraps
  every page with the header (an island) and the footer.
- **Partial hydration:** only `islands/Header.tsx` ships JavaScript (mobile menu
  state, Escape key, focus trap/inert handling and scroll lock). Everything else
  is static HTML.
- **Static export:** `deno task ssg` runs the Vite build, renders each route
  through the production server handler, copies hashed assets into `dist/`,
  writes `404.html` and `.nojekyll`, and finally verifies that every URL
  referenced by the HTML — including the island module imports — exists on disk
  (CSS `url()` references are not inspected; the stylesheet has none today).

## Requirements

- [Deno](https://docs.deno.com/runtime/getting_started/installation) 2.x
- [Node.js](https://nodejs.org) 24+ — only for the TinaCMS admin build in
  `tools/tina/`; the site itself runs on Deno.

## Setup

Install the project's dependencies once (Fresh uses Vite, which is an npm
package, so `node_modules/` has to be populated):

```bash
deno install
```

## Development

```bash
deno task dev
```

The dev server runs at <http://localhost:5173/> (with live reload and hot module
replacement). No `BASE_PATH` is needed in development: the site is served from
the domain root.

## Build the static site

```bash
deno task ssg      # → dist/
deno task preview  # → http://127.0.0.1:8787/Portfolio/
```

`deno task ssg` always writes a deployable site. By default it targets the
GitHub Pages sub-path `/Portfolio`; override it with the `BASE_PATH` environment
variable:

```bash
BASE_PATH="" deno task ssg          # serve from a root domain
BASE_PATH="/my-repo" deno task ssg  # different project site
BASE_PATH="" deno task preview      # preview a root-domain build
```

The generator fails if any generated `href`/`src`/island import points at a
missing file or forgets the base path, so a green run means the deployment links
are sound.

You can also run the Fresh server itself against the production build:

```bash
deno task build
deno task start    # http://localhost:8000/
# BASE_PATH=/Portfolio deno task start  — serve under the GitHub Pages sub-path
```

`deno task start` always binds port 8000. To use another port, call the server
directly: `deno serve -A --port 8803 _fresh/server.js` (extra arguments passed
to a Deno task land after the script path, where `deno serve` ignores them).

## Deployment

`.github/workflows/deploy.yml` runs the checks, builds `dist/` with Deno and
publishes it with GitHub Pages' official actions whenever `master` is pushed.
`.github/workflows/ci.yml` runs the same checks on pull requests.

One-time repository setup: **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The site is then available at
<https://barbariantarkus.github.io/Portfolio/>.

To use a custom domain instead, add a `CNAME` file to `static/` (it is copied
into `dist/`) and set the `BASE_PATH` repository variable to `/` so the site is
built for the domain root (GitHub Actions variables cannot be empty, and `/` is
normalized to root by `config.ts`).

## Customizing content

Editable site copy lives in [`content/*.json`](content/) — one file per page
plus `content/site.json` for shared metadata and `content/projects.json` for the
project fiches. The schema for every field is
[`tina/config.ts`](tina/config.ts); [`lib/content.ts`](lib/content.ts) loads the
JSON and passes it to the routes as typed props.

- `content/site.json` — name, role, intro, highlights, social links, navigation
  items and (optionally) an email address. Leave `email` empty to hide the email
  card. There is deliberately no CV file in the repository: it is shared through
  LinkedIn instead.
- `content/projects.json` — one fiche per project: `name`, `summary`, `tags`,
  `period`, an optional verified `work` line (e.g. "12 PRs mergeados"), `links`,
  then the narrative fields `problem`, `decisions`, `broke` and `next`. Every
  fiche is rendered by [`routes/projects.tsx`](routes/projects.tsx); omit
  `broke`/`next` rather than inventing an incident.

Edit the JSON by hand or through the [TinaCMS admin](#content-tinacms). After a
schema change, run `deno task tina:build` to regenerate `tina/__generated__/`
and the query strings in `lib/tina/documents.generated.ts`. The site copy is
written in Spanish (`<html lang="es">`); there is no English translation yet.
Colours, typography and layout are defined with CSS custom properties at the top
of [`static/styles/main.css`](static/styles/main.css).

## Content (TinaCMS)

Page copy lives in [`content/*.json`](content/) and is modelled by
[`tina/config.ts`](tina/config.ts). The editing UI (TinaCMS admin) is built by
the Tina CLI from isolated Node tooling in [`tools/tina/`](tools/tina/); its
generated output (`static/admin/`, `tina/__generated__/`) is git-ignored and is
rebuilt by the static export.

Local setup, once Deno dependencies are installed and Node.js 24+ is available:

```bash
deno task tina:install   # npm install inside tools/tina (isolated)
deno task tina:dev       # Tina dev server + `deno task dev` together
```

`deno task tina:dev` serves the site and the admin together: open
<http://localhost:5173/admin/index.html> (the admin app itself is served by Tina
on port 4001 and loaded by the site's own dev server). In local mode Tina writes
edits straight to `content/*.json`.

Clicking **Enter Edit Mode** puts the site in the admin's preview iframe. Every
page registers its content documents as Tina forms and every text node carries a
`data-tina-field` marker, so clicking a paragraph focuses the matching field and
typing in the form re-renders the page live. The preview is rendered by the
Fresh server through `/tina-island/<name>` while `tina:dev` (or a Deno server
deployment) is serving the site; see `lib/tina/` for the server side and
`static/tina-bridge.js` / `static/tina-live-fallback.js` for the browser side.

`deno task tina:build` rebuilds the static admin and regenerates
`tina/__generated__/` plus the query strings in
`lib/tina/documents.generated.ts`, without starting a server.

In production `deno task ssg` runs `tina:build` first and exports the admin to
`dist/admin/` (served from the deployment sub-path, e.g.
<https://barbariantarkus.github.io/Portfolio/admin/>). Editing uses Tina Cloud
with the `PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` credentials that CI passes
from repository secrets, and changes are committed through GitHub.

GitHub Pages only serves static files, so the island endpoints do not exist
there. The static export is marked with `data-tina-static` and
`static/tina-live-fallback.js` re-renders the edited text in the browser from
the same form overlay, which keeps live preview working without a server. Server
deployments keep using the faster server-rendered islands.

### Tina Cloud project prerequisite

Tina Cloud binds a client id to one connected Git repository and its schema. The
credentials must belong to a project connected to **this** repository; reusing
another site's `.env` makes the admin edit the wrong content. Verify before
deploying:

```bash
deno task tina:check-cloud
```

It queries the Content API and fails unless the `site`, `home`, `about`,
`contact`, `experience` and `projects` collections exist. If it fails, create a
project on <https://app.tina.io> for this repository and update both `.env` and
the `PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN` GitHub secrets.

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

The scan currently reports zero open issues, zero code smells, zero security
hotspots and A ratings for reliability, security and maintainability. Cyclomatic
complexity is 99 (cognitive complexity 41); the 2026-10-28 pass that brought it
down from 117 is documented in
[`docs/complexity-pass-2026-10-28.md`](docs/complexity-pass-2026-10-28.md).

## Checks

```bash
deno task check   # deno fmt --check + deno lint + deno check
```
