/**
 * Deployment configuration shared by the Fresh server and the static-site
 * generator (scripts/ssg.ts).
 *
 * The site is published as a GitHub Pages *project* site, which lives under a
 * sub-path (https://<user>.github.io/Portfolio2026/). `basePath` teaches both
 * router and the generated asset URLs about that prefix. Set the BASE_PATH
 * environment variable to override it (use an empty value to serve from "/").
 */

/** Where the site is served from when BASE_PATH is not set (production). */
export const DEFAULT_BASE_PATH = "/Portfolio2026";

/**
 * Normalize a base path to either "" (root) or "/some/prefix".
 *
 * Splitting on "/" also collapses leading, trailing and repeated slashes, so
 * the implementation stays branch-free and easy to reason about.
 */
export function normalizeBasePath(raw: string | null | undefined): string {
  const segments = (raw ?? "").trim().split("/").filter(Boolean);
  return segments.length === 0 ? "" : `/${segments.join("/")}`;
}

/** Effective base path for the current process (empty string means site root). */
export const BASE_PATH = normalizeBasePath(Deno.env.get("BASE_PATH"));

/**
 * Whether a URL path is the deployment root or lives below it.
 *
 * Shared by the output verifier and the preview server, which both have to
 * reject paths outside the published prefix ("" means the site root).
 */
export function isUnderBasePath(urlPath: string, basePath: string): boolean {
  return urlPath === basePath || urlPath.startsWith(`${basePath}/`);
}
