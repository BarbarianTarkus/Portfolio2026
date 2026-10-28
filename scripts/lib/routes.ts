/**
 * File-system routes → URL paths for the static-site generator.
 *
 * Mirrors Fresh's conventions closely enough for this project: `index.tsx` is
 * `/`, `about.tsx` is `/about`, while files that start with `_` (layouts, 404,
 * middleware) and the `api/` directory are not pages.
 *
 * @module
 */

import { join, relative, SEPARATOR } from "@std/path";
import { walkFiles } from "./files.ts";

const PAGE_EXTENSION = ".tsx";
const INDEX_FILE = `index${PAGE_EXTENSION}`;

function isPageSegment(segment: string): boolean {
  return !segment.startsWith("_") && segment !== "api";
}

function isPageFile(fileName: string, directories: string[]): boolean {
  return fileName.endsWith(PAGE_EXTENSION) &&
    !fileName.startsWith("_") &&
    directories.every(isPageSegment);
}

/** Turn a route-file path (relative to `routes/`) into a URL path, or `null`. */
export function toRoutePath(relativePath: string): string | null {
  const segments = relativePath.split(SEPARATOR);
  const fileName = segments.pop() ?? "";

  if (!isPageFile(fileName, segments)) return null;
  if (fileName !== INDEX_FILE) {
    segments.push(fileName.slice(0, -PAGE_EXTENSION.length));
  }

  return `/${segments.join("/")}`;
}

/** Every page route in `routesDir`, sorted with an explicit comparator. */
export async function discoverRoutes(routesDir: string): Promise<string[]> {
  const routes: string[] = [];

  for await (const file of walkFiles(routesDir)) {
    const route = toRoutePath(relative(routesDir, file));
    if (route !== null) routes.push(route);
  }

  return routes.sort((a, b) => a.localeCompare(b));
}

/** Where the generated HTML for `route` should be written inside `distDir`. */
export function outputFileForRoute(
  distDir: string,
  route: string,
): string {
  return join(distDir, route.slice(1), "index.html");
}
