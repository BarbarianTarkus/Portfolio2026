/**
 * Post-processing for the TinaCMS admin app inside the static export.
 *
 * The Tina CLI builds the admin into `static/admin/` and Fresh's Vite build
 * copies `static/` verbatim into `_fresh/client/`, so the SSG ends up with
 * `dist/admin/index.html` whose assets are referenced with root-absolute URLs
 * (`/admin/assets/...`). Those work at a domain root but break under the
 * GitHub Pages sub-path (`/Portfolio/admin/`), so they are rewritten to paths
 * relative to the document (`./assets/...`), which work at any base path.
 *
 * The helpers here also fail the build loudly when the admin output is
 * missing, so a broken pipeline never publishes a site with a 404 `/admin/`.
 *
 * @module
 */

import { join } from "@std/path";

/** Root-absolute admin asset URL in an HTML attribute, e.g. `src="/admin/assets/x.js"`. */
const ADMIN_ASSET_URL = /(\b(?:href|src)=)"\/admin\/assets\//g;

/** Already relative admin asset URL in an HTML attribute. */
const RELATIVE_ASSET_URL = /\b(?:href|src)="\.\/assets\/([^"]+)"/g;

/** Read a file, turning a missing one into an actionable build error. */
async function readRequiredFile(path: string, label: string): Promise<string> {
  try {
    return await Deno.readTextFile(path);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${label} is missing from the static export (${path}). ` +
        `Did the TinaCMS admin build run? deno task tina:build failed or was skipped: ${reason}`,
      { cause: error },
    );
  }
}

/**
 * Rewrite the admin's root-absolute asset URLs to document-relative ones.
 *
 * `/Portfolio/admin/index.html` and `/admin/index.html` both resolve
 * `./assets/...` against `admin/`, so the same export works everywhere.
 *
 * @param distDir Static export directory (`dist/`).
 * @returns How many URLs were rewritten.
 */
export async function rewriteAdminIndex(distDir: string): Promise<number> {
  const indexPath = join(distDir, "admin", "index.html");
  const html = await readRequiredFile(indexPath, "TinaCMS admin index");
  let rewritten = 0;

  const output = html.replace(ADMIN_ASSET_URL, (_match, attribute: string) => {
    rewritten++;
    return `${attribute}"./assets/`;
  });

  if (rewritten === 0 && !output.includes("./assets/")) {
    throw new Error(
      `${indexPath} references no ./admin/assets/ URLs; the TinaCMS admin build looks empty or unexpected.`,
    );
  }

  await Deno.writeTextFile(indexPath, output);
  return rewritten;
}

/**
 * Assert that the exported admin can be served from a sub-path.
 *
 * Verifies that `dist/admin/index.html` exists, no longer uses root-absolute
 * URLs and references asset files that really exist, and that the Tina bridge
 * script shipped alongside the site.
 *
 * @param distDir Static export directory (`dist/`).
 */
export async function assertTinaAdmin(distDir: string): Promise<void> {
  const indexPath = join(distDir, "admin", "index.html");
  const html = await readRequiredFile(indexPath, "TinaCMS admin index");

  const absolute = html.match(ADMIN_ASSET_URL);
  if (absolute) {
    throw new Error(
      `${indexPath} still contains root-absolute admin URLs (${
        absolute[0]
      }); ` +
        "they would 404 under the deployment base path.",
    );
  }

  const assets = [...html.matchAll(RELATIVE_ASSET_URL)].map((match) =>
    match[1]
  );
  if (assets.length === 0) {
    throw new Error(
      `${indexPath} references no ./assets/ files; the TinaCMS admin build looks empty.`,
    );
  }

  for (const asset of assets) {
    await readRequiredFile(
      join(distDir, "admin", "assets", asset),
      `Admin asset ${asset}`,
    );
  }

  await readRequiredFile(join(distDir, "tina-bridge.js"), "Tina bridge script");
}
