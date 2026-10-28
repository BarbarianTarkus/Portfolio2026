/**
 * File-system routes → URL paths for the static-site generator.
 *
 * Mirrors Fresh's conventions closely enough for this project: `index.tsx` is
 * `/`, `about.tsx` is `/about`, while names that start with `_` (layouts, 404,
 * middleware) and anything inside an `api/` directory are not pages.
 *
 * @module
 */

import { relative, SEPARATOR } from "@std/path";
import { walkFiles } from "./files.ts";

const PAGE_EXTENSION = ".tsx";

/** `_`-prefixed names are Fresh-private: layouts, `_404`, middleware. */
const PRIVATE_SEGMENT = /(?:^|\/)_/;

/** `api/` directories hold endpoints, not pages. */
const API_DIRECTORY = /(?:^|\/)api\//;

/** `index` files map to their directory instead of a URL segment. */
const INDEX_SUFFIX = /(?:^|\/)index$/;

/** Turn a route-file path (relative to `routes/`) into a URL path, or `null`. */
export function toRoutePath(relativePath: string): string | null {
  // Compare and cut on POSIX separators so the rules are platform-independent.
  const posixPath = relativePath.split(SEPARATOR).join("/");

  if (
    !posixPath.endsWith(PAGE_EXTENSION) ||
    PRIVATE_SEGMENT.test(posixPath) ||
    API_DIRECTORY.test(posixPath)
  ) {
    return null;
  }

  const withoutExtension = posixPath.slice(0, -PAGE_EXTENSION.length);
  return `/${withoutExtension.replace(INDEX_SUFFIX, "")}`;
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
