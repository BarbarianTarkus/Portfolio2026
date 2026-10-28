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
data/site.ts     Shared identity, links, navigation and project fiches
static/          Static assets copied as-is (styles, favicon, robots.txt, cv.pdf)
scripts/ssg.ts   Static site generator entry point (build, render, verify)
scripts/lib/     Filesystem, route, rendering and output-verification helpers
scripts/preview.ts  Local preview server that mimics GitHub Pages
scripts/sonar-scan.sh  Local SonarQube analysis (reads .env)
docs/redesign.md Light-touch redesign plan and design-token rationale
docs/content-pass-2026-10-28.md  Content pass: scope, provenance, pending items
config.ts        BASE_PATH handling shared by app, Vite and SSG
```

- **Server rendering:** `routes/_app.tsx` renders the document shell and wraps
  every page with the header (an island) and the footer.
- **Partial hydration:** only `islands/Header.tsx` ships JavaScript (mobile menu
  state + Escape key + scroll lock). Everything else is static HTML.
- **Static export:** `deno task ssg` runs the Vite build, renders each route
  through the production server handler, copies hashed assets into `dist/`,
  writes `404.html` and `.nojekyll`, and finally verifies that every URL
  referenced by the HTML — including the island module imports — exists on disk
  (CSS `url()` references are not inspected; the stylesheet has none today).

## Requirements

- [Deno](https://docs.deno.com/runtime/getting_started/installation) 2.x

No Node.js is required: Fresh's Vite plugin runs on Deno.

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

Shared site metadata lives in [`data/site.ts`](data/site.ts):

- `site` — name, role, intro, highlights, social links, navigation items, the CV
  path (`cvPath`, served from `static/cv.pdf`) and (optionally) an email
  address. Leave `email` empty to hide the email card.
- `projects` — one fiche per project: `name`, `summary`, `tags`, `period`, an
  optional verified `work` line (e.g. "12 PRs mergeados"), `links`, then the
  narrative fields `problem`, `decisions`, `broke` and `next`. Every fiche is
  rendered by `routes/projects.tsx`; omit `broke`/`next` rather than inventing
  an incident.

The site copy is written in Spanish (`<html lang="es">`); there is no English
translation yet. Page-specific prose (About/Contact copy) lives in the matching
file under [`routes/`](routes/). Colours, typography and layout are defined with
CSS custom properties at the top of
[`static/styles/main.css`](static/styles/main.css).

## Design notes

The visual identity (palette, type, layout) is intentionally unchanged. A
light-touch redesign pass unified every heading accent on `var(--text-accent)`
(the home and About pages previously used two different accents), added an
accent underline for the active nav item, strengthened the focus ring and gave
icon controls 44 px touch targets. Details, rationale and the optional phase-2
backlog are in [`docs/redesign.md`](docs/redesign.md).

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
