import { renderIslandResponse } from "../../lib/tina/islands.tsx";
import { define } from "../../utils.ts";

/** Exact content type the TinaCMS bridge uses for overlay refetches. */
const PREVIEW_CONTENT_TYPE = "application/x-tina-preview+json";

/**
 * Island re-render endpoint used by the TinaCMS live preview.
 *
 * The browser bridge POSTs the current form overlay here on every edit; the
 * response replaces the matching region in the preview iframe. Only same-origin
 * requests carrying the bridge's private content type are accepted, so normal
 * page traffic cannot trigger a render.
 */
export const handler = define.handlers({
  async POST(ctx) {
    const name = ctx.params.name ?? "";

    if (!isPreviewRequest(ctx.req)) {
      return new Response("Not Found", { status: 404 });
    }

    let overlay: Record<string, unknown> = {};
    try {
      const parsed = await ctx.req.json();
      if (parsed !== null && typeof parsed === "object") {
        overlay = parsed as Record<string, unknown>;
      }
    } catch {
      // An empty/invalid body still re-renders from the files on disk.
    }

    const html = renderIslandResponse(name, overlay, ctx.config.basePath);
    if (html === null) {
      return new Response("Unknown island", { status: 404 });
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
});

function isPreviewRequest(request: Request): boolean {
  if (request.method !== "POST") return false;
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes(PREVIEW_CONTENT_TYPE)) return false;
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  return true;
}
