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
 * Public origin the site is published from (scheme + host, no trailing slash).
 *
 * Search engines only accept absolute URLs for `rel=canonical` and
 * `hreflang`, and neither the dev server nor the static export can derive the
 * public origin from the request (pages are rendered for 127.0.0.1 or for a LAN
 * address). Override it with SITE_ORIGIN when the site moves to another domain.
 */
export const DEFAULT_SITE_ORIGIN = "https://barbariantarkus.github.io";

/** Effective public origin for the current build (no trailing slash). */
export const SITE_ORIGIN = (Deno.env.get("SITE_ORIGIN") ?? DEFAULT_SITE_ORIGIN)
  .trim().replace(/\/+$/, "");

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
