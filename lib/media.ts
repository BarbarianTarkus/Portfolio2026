/**
 * Serve Dune's co-located page media.
 *
 * When an image (or PDF, video…) is uploaded through the admin, Dune stores it
 * next to the page's Markdown file (for example `content/06.site/og.png`) and
 * advertises the public URL `/site/og.png`. Stock Dune resolves those URLs in a
 * catch-all mounted by `createDuneApp()`, but this site boots Dune headless and
 * renders public pages from `./routes`, so nothing served that URL: uploads
 * succeeded and the admin media library listed them with a broken thumbnail,
 * while every public request 404'd.
 *
 * This middleware fills that gap for GET/HEAD. It mirrors Dune's own rules:
 * only files whose owning page is indexed are served (`_drafts` never leak),
 * media wins over any same-named route, and the same content-type, cache and
 * sandboxing headers are returned.
 *
 * @module
 */

import type { App, Context } from "fresh";
import type { BootstrapResult } from "@dune/core/bootstrap";
import { isMediaFile } from "@dune/core/content/path-utils";
import type { State } from "../utils.ts";

/** Active content that must stay behind a sandboxed document. */
const SANDWICHED_TYPES = new Set(["text/html", "image/svg+xml"]);

/** Strip trailing slashes, keeping "/" for the root. */
function trimSlash(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * True when `dir` is the page directory itself or a media subdirectory of it.
 *
 * Dune lets a page keep media in nested folders (uploading `images/a.png` under
 * `06.site` yields `/site/images/a.png`), so the whole prefix counts as owned.
 */
function isInsidePage(dir: string, route: string): boolean {
  const pageRoute = trimSlash(route);
  return pageRoute === "/" || dir === pageRoute ||
    dir.startsWith(`${pageRoute}/`);
}

/**
 * Wrap the media bytes as a Response body.
 *
 * `Uint8Array<ArrayBufferLike>` is not a valid `BodyInit` for Deno's DOM type
 * definitions, so hand Response the backing `ArrayBuffer` (copying only when
 * the view is a slice, which `Deno.readFile` never returns).
 */
function toBody(data: Uint8Array): ArrayBuffer {
  if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
    return data.buffer as ArrayBuffer;
  }
  return data.slice().buffer as ArrayBuffer;
}

/**
 * Register the co-located media handler on `app`.
 *
 * `basePath` must match the app's base path: Fresh appends it to request paths,
 * and media URLs are built (and exported) with that same prefix.
 */
export function installContentMedia(
  app: App<State>,
  dune: BootstrapResult,
  options: { basePath?: string } = {},
): void {
  const basePath = options.basePath ?? "";
  app.use(async (ctx: Context<State>): Promise<Response> => {
    if (ctx.req.method !== "GET" && ctx.req.method !== "HEAD") {
      return ctx.next();
    }

    const pathname = basePath !== "" && ctx.url.pathname.startsWith(basePath)
      ? ctx.url.pathname.slice(basePath.length) || "/"
      : ctx.url.pathname;
    const name = pathname.slice(pathname.lastIndexOf("/") + 1);
    if (name === "" || !isMediaFile(name)) return ctx.next();

    const dir = trimSlash(pathname.slice(0, pathname.lastIndexOf("/")));
    const owner = dune.engine.pages.find((page) =>
      isInsidePage(dir, page.route)
    );
    if (owner === undefined) return ctx.next();

    const media = await dune.engine.serveMedia(pathname.slice(1));
    if (media === null) return ctx.next();

    const headers = new Headers({
      "content-type": media.contentType,
      "content-length": String(media.size),
      // Gated pages must not be cached by shared caches (same rule as Dune).
      "cache-control": (owner as { gated?: boolean }).gated === true
        ? "private, no-store"
        : "public, max-age=3600",
      "x-content-type-options": "nosniff",
    });
    const type = media.contentType.split(";")[0].trim().toLowerCase();
    if (SANDWICHED_TYPES.has(type)) {
      headers.set(
        "content-security-policy",
        "sandbox allow-scripts allow-popups",
      );
      headers.set("x-frame-options", "SAMEORIGIN");
    }

    return new Response(
      ctx.req.method === "HEAD" ? null : toBody(media.data),
      { headers },
    );
  });
}
