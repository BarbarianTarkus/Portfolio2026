/**
 * Minimal static file server for previewing the exported site exactly the way
 * GitHub Pages will serve it (including the deployment sub-path and the custom
 * 404 page).
 *
 *     deno task ssg       # build dist/
 *     deno task preview   # serve dist/ at http://127.0.0.1:8787/Portfolio2026/
 *
 * `BASE_PATH` defaults to "/Portfolio2026"; use the same value as the export.
 * File serving (MIME types, directory indexes, traversal protection) is handled
 * by `@std/http/file-server`; this module only adds the deployment prefix and
 * the branded 404 page.
 *
 * @module
 */

import { join } from "@std/path";
import { serveDir } from "@std/http/file-server";
import {
  DEFAULT_BASE_PATH,
  isUnderBasePath,
  normalizeBasePath,
} from "../config.ts";

const ROOT = join(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");
const basePath = normalizeBasePath(
  Deno.env.get("BASE_PATH") ?? DEFAULT_BASE_PATH,
);
const port = Number(Deno.env.get("PORT") ?? 8787);

async function notFoundResponse(): Promise<Response> {
  const body = await Deno.readFile(join(DIST, "404.html")).catch(() => null);
  if (body === null) {
    return new Response("404 — run `deno task ssg` first", { status: 404 });
  }
  return new Response(body, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!isUnderBasePath(pathname, basePath)) {
    return pathname === "/"
      ? Response.redirect(`${url.origin}${basePath}/`, 302)
      : await notFoundResponse();
  }

  const response = await serveDir(request, {
    fsRoot: DIST,
    // `serveDir` expects the url root without a leading slash.
    urlRoot: basePath.slice(1),
    showIndex: true,
    quiet: true,
  });

  return response.status === 404 ? await notFoundResponse() : response;
}

Deno.serve(
  {
    hostname: "127.0.0.1",
    port,
    onListen({ port }) {
      console.log(
        `\nPreviewing dist/ at http://127.0.0.1:${port}${basePath}/\n`,
      );
    },
  },
  handleRequest,
);
