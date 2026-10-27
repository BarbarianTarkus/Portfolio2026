/**
 * Minimal static file server for previewing the exported site exactly the way
 * GitHub Pages will serve it (including the deployment sub-path and the custom
 * 404 page).
 *
 *     deno task ssg       # build dist/
 *     deno task preview   # serve dist/ at http://127.0.0.1:8787/Portfolio/
 *
 * `BASE_PATH` defaults to "/Portfolio"; use the same value as the export.
 *
 * @module
 */

import { extname, join } from "@std/path";
import { DEFAULT_BASE_PATH, normalizeBasePath } from "../config.ts";

const ROOT = join(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");
const basePath = normalizeBasePath(
  Deno.env.get("BASE_PATH") ?? DEFAULT_BASE_PATH,
);
const port = Number(Deno.env.get("PORT") ?? 8787);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

async function fileExists(path: string): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isFile;
  } catch {
    return false;
  }
}

async function serveFile(path: string, status = 200): Promise<Response> {
  const body = await Deno.readFile(path);
  return new Response(body, {
    status,
    headers: {
      "content-type": MIME_TYPES[extname(path)] ?? "application/octet-stream",
      "cache-control": "no-cache",
    },
  });
}

async function htmlNotFound(): Promise<Response> {
  const notFound = join(DIST, "404.html");
  if (await fileExists(notFound)) return await serveFile(notFound, 404);
  return new Response("404 — run `deno task ssg` first", { status: 404 });
}

if (!(await fileExists(join(DIST, "index.html")))) {
  console.error("dist/ is empty. Run `deno task ssg` first.");
  Deno.exit(1);
}

const displayBase = basePath === "" ? "" : basePath;

Deno.serve(
  {
    hostname: "127.0.0.1",
    port,
    onListen({ port }) {
      console.log(
        `\nPreviewing dist/ at http://127.0.0.1:${port}${displayBase}/\n`,
      );
    },
  },
  async (request) => {
    const url = new URL(request.url);
    let pathname: string;

    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return await htmlNotFound();
    }

    // Requests outside the deployment prefix see the site root.
    if (
      basePath !== "" && pathname !== basePath &&
      !pathname.startsWith(`${basePath}/`)
    ) {
      if (pathname === "/") {
        return Response.redirect(`${url.origin}${basePath}/`, 302);
      }
      return await htmlNotFound();
    }

    let relative = pathname.slice(basePath.length);
    if (relative === "" || relative.endsWith("/")) relative += "index.html";

    const file = join(DIST, relative);
    if (await fileExists(file)) return await serveFile(file);

    // Allow extension-less URLs such as /Portfolio/about.
    const withIndex = join(DIST, relative, "index.html");
    if (await fileExists(withIndex)) return await serveFile(withIndex);

    return await htmlNotFound();
  },
);
