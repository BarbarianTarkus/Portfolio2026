/**
 * Static site generation (SSG).
 *
 * Fresh renders every request on the server, so turning it into a static site
 * is a matter of:
 *
 *   1. building the TinaCMS admin with the Tina CLI (`deno task tina:build`),
 *   2. building the app with Vite (`deno task build`),
 *   3. rendering each route through the production server handler,
 *   4. writing the resulting HTML plus the hashed assets into `dist/`,
 *   5. rewriting the admin's absolute asset URLs and sanity-checking that
 *      every asset/link referenced by the HTML exists.
 *
 * The output in `dist/` is what GitHub Pages serves. Run it with:
 *
 *     deno task ssg
 *
 * `BASE_PATH` selects the deployment prefix (default: "/Portfolio", matching
 * this repository's GitHub Pages URL). Set `BASE_PATH=""` for a root domain.
 *
 * The implementation is split into small helpers under `scripts/lib/` so this
 * file only orchestrates the pipeline.
 *
 * @module
 */

import { join, relative } from "@std/path";
import { DEFAULT_BASE_PATH, normalizeBasePath } from "../config.ts";
import {
  copyDirectory,
  directorySize,
  isBuildArtifact,
  removeDir,
} from "./lib/files.ts";
import { discoverRoutes } from "./lib/routes.ts";
import { renderNotFound, renderRoute, startServer } from "./lib/render.ts";
import { assertTinaAdmin, rewriteAdminIndex } from "./lib/tina-admin.ts";
import { verifyOutput } from "./lib/verify.ts";

const ROOT = join(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");
const ROUTES_DIR = join(ROOT, "routes");
const CLIENT_DIR = join(ROOT, "_fresh", "client");

/** Route path that cannot exist, used to render the 404 page. */
const NOT_FOUND_PROBE = "/__fresh_ssg_404_probe__";

function log(message: string): void {
  console.log(`  ${message}`);
}

/** Print a step in the pipeline. */
function heading(message: string): void {
  console.log(`\n▸ ${message}`);
}

/** Run a `deno task` sub-command, inheriting stdout/stderr and the environment. */
async function runTask(name: string): Promise<void> {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["task", name],
    cwd: ROOT,
    env: Deno.env.toObject(),
    stdin: "null",
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await command.output();

  if (code !== 0) {
    throw new Error(`\`deno task ${name}\` failed with exit code ${code}`);
  }
}

async function main(): Promise<void> {
  const basePath = normalizeBasePath(
    Deno.env.get("BASE_PATH") ?? DEFAULT_BASE_PATH,
  );

  console.log(`\n🍋 Fresh static site export`);
  console.log(`   base path: ${basePath}/`);
  console.log(`   output:    ${DIST}`);

  // The build must see the same base path as the renderer below. TINA_STATIC
  // tells the shell that the export will be hosted without a request-time
  // server, so the browser must re-render editable regions itself.
  Deno.env.set("BASE_PATH", basePath);
  Deno.env.set("TINA_STATIC", "1");

  heading("Building the TinaCMS admin");
  await runTask("tina:build");

  heading("Building the app");
  await runTask("build");

  const routes = await discoverRoutes(ROUTES_DIR);
  const server = await startServer(basePath);

  try {
    await removeDir(DIST);

    heading("Rendering routes");
    for (const route of routes) {
      const file = await renderRoute(server.origin, basePath, route, DIST);
      log(`${route.padEnd(12)} → ${relative(ROOT, file)}`);
    }
    await renderNotFound(server.origin, basePath, DIST, NOT_FOUND_PROBE);
    log(`/404         → dist/404.html`);

    heading("Copying client assets");
    const copied = await copyDirectory(CLIENT_DIR, DIST, isBuildArtifact);
    log(`${copied} files copied from _fresh/client`);

    // GitHub Pages runs Jekyll unless this marker exists, and Jekyll would drop
    // files/directories whose names start with an underscore.
    await Deno.writeTextFile(join(DIST, ".nojekyll"), "");
    log(".nojekyll written");

    heading("Preparing the TinaCMS admin");
    const rewritten = await rewriteAdminIndex(DIST);
    log(`rewrote ${rewritten} admin asset URL(s) to ./assets/`);
    await assertTinaAdmin(DIST);
    log("admin/index.html and tina-bridge.js verified");

    heading("Verifying output");
    const checked = await verifyOutput(DIST, basePath);
    log(`verified ${checked} internal URLs across dist/*.html`);
  } finally {
    await server.shutdown();
  }

  const size = ((await directorySize(DIST)) / 1024).toFixed(1);
  console.log(
    `\n✅ Static site ready: ${routes.length} pages, ${size} kB in dist/\n`,
  );
}

await main();
