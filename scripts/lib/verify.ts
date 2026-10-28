/**
 * Output verification for the static-site generator.
 *
 * Every root-relative URL in the generated HTML must point at a file that was
 * actually written to `dist/` and must carry the deployment base path. This
 * catches the classic GitHub Pages bugs: a wrong asset prefix, or a link to a
 * page that was never emitted.
 *
 * @module
 */

import { extname, relative, SEPARATOR } from "@std/path";
import { join as posixJoin } from "@std/path/posix";
import { walkFiles } from "./files.ts";

// Attributes (href/src) plus ES module specifiers from the island boot script
// (`import ... from "/assets/..."`), which are just as important.
const URL_PATTERN = /(?:(?:href|src)=|\bfrom\s+|\bimport\s+)"(\/[^"?#]*)/g;

function isUnderBasePath(urlPath: string, basePath: string): boolean {
  return urlPath === basePath || urlPath.startsWith(`${basePath}/`);
}

/** URL path → the file path (POSIX, relative to dist/) that should exist. */
function targetForUrl(urlPath: string, basePath: string): string {
  const rel = urlPath.slice(basePath.length).replace(/^\//, "");
  return extname(rel) === "" ? posixJoin(rel, "index.html") : rel;
}

/** Index every file in dist/ (POSIX separators) so lookups are O(1). */
async function indexDistFiles(distDir: string): Promise<Set<string>> {
  const files = new Set<string>();
  for await (const file of walkFiles(distDir)) {
    files.add(relative(distDir, file).split(SEPARATOR).join("/"));
  }
  return files;
}

/**
 * Verify all HTML in `distDir`; returns the number of URLs checked and throws
 * with every problem found (so a broken export fails the build).
 */
export async function verifyOutput(
  distDir: string,
  basePath: string,
): Promise<number> {
  const distFiles = await indexDistFiles(distDir);
  const problems: string[] = [];
  let checked = 0;

  for await (const file of walkFiles(distDir)) {
    if (!file.endsWith(".html")) continue;

    const html = await Deno.readTextFile(file);
    const relativeFile = relative(distDir, file);

    for (const match of html.matchAll(URL_PATTERN)) {
      checked++;
      const urlPath = match[1];

      if (!isUnderBasePath(urlPath, basePath)) {
        problems.push(
          `${relativeFile}: unprefixed URL "${urlPath}" (expected it to start with "${basePath}")`,
        );
        continue;
      }

      const target = targetForUrl(urlPath, basePath);
      if (!distFiles.has(target)) {
        problems.push(`${relativeFile}: "${urlPath}" does not exist in dist/`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Static output verification failed:\n  - ${problems.join("\n  - ")}`,
    );
  }

  return checked;
}
