/**
 * Deployment configuration shared by the Fresh server, the Vite build and the
 * static-site generator (scripts/ssg.ts).
 *
 * The site is published as a GitHub Pages *project* site, which lives under a
 * sub-path (https://<user>.github.io/Portfolio/). `basePath` teaches both the
 * router and the generated asset URLs about that prefix. Set the BASE_PATH
 * environment variable to override it (use an empty value to serve from "/").
 */

/** Where the site is served from when BASE_PATH is not set (production). */
export const DEFAULT_BASE_PATH = "/Portfolio";

/** Normalize a base path to either "" (root) or "/some/prefix" (no trailing slash). */
export function normalizeBasePath(raw: string | null | undefined): string {
  if (!raw) return "";
  let path = raw.trim();
  if (path === "" || path === "/") return "";
  if (!path.startsWith("/")) path = `/${path}`;
  return path.replace(/\/+$/, "");
}

/** Effective base path for the current process (empty string means site root). */
export const BASE_PATH = normalizeBasePath(Deno.env.get("BASE_PATH"));

/** Vite wants a leading and trailing slash ("/" or "/Portfolio/"). */
export const VITE_BASE = BASE_PATH === "" ? "/" : `${BASE_PATH}/`;
