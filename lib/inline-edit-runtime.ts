/**
 * Inline-editing runtime glue for headless Dune.
 *
 * Dune Core wires @dune/plugin-inline-edit inside createDuneApp(): it bundles
 * plugin client entries, runs the transformResponse pipeline (admin bar
 * injection + marker scrubbing) and registers the /api/inline-edit/ws socket.
 * A headless mount (bootstrap + mountPlugins + own fsRoutes) gets none of that,
 * so this module provides the same three pieces for our Fresh app.
 *
 * @module
 */

import { dirname, join } from "@std/path";
import {
  assertInlineEditWsOrigin,
  checkInlineEditPermission,
  isIndexedInlineEditPath,
} from "@dune/core/fresh-app";
import type { BootstrapResult } from "@dune/core/bootstrap";
import type { DunePlugin } from "@dune/core/hooks";
// deno-lint-ignore no-explicit-any
type App = any;
// deno-lint-ignore no-explicit-any
type Ctx = any;

/** Public routes served by the Dune admin that must never get edit chrome. */
const NON_PAGE_PREFIXES = [
  "/admin",
  "/api",
  "/plugins",
  "/_fresh",
  "/styles",
  "/js",
];

/** Remove inline-edit marker attributes from HTML served to non-editors. */
const MARKER_ATTR = /\s+data-dune-[a-zA-Z-]+(?:="[^"]*")?/g;

/** Append the nested-prose inline editor (admin sessions only). */
async function injectProseEditor(
  response: Response,
  src: string,
): Promise<Response> {
  const html = await response.text();
  const tag = `<script type="module" src="${src}"></script>`;
  const injected = html.includes("</body>")
    ? html.replace("</body>", `${tag}</body>`)
    : html + tag;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(injected, { status: response.status, headers });
}

function isPagePath(pathname: string): boolean {
  return !NON_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  ) && !pathname.includes(".");
}

/** Registered plugin list from the bootstrap hook registry. */
function plugins(dune: BootstrapResult): DunePlugin[] {
  // deno-lint-ignore no-explicit-any
  const hooks = dune.hooks as any;
  return typeof hooks?.plugins === "function" ? hooks.plugins() : [];
}

/** All client entries declared by plugins, e.g. { "inline-edit": {editor: url} }. */
function clientEntries(
  dune: BootstrapResult,
): Array<{ plugin: string; entry: string; specifier: string }> {
  const result: Array<{ plugin: string; entry: string; specifier: string }> =
    [];
  for (const plugin of plugins(dune)) {
    for (
      const [entry, specifier] of Object.entries(plugin.clientEntries ?? {})
    ) {
      result.push({ plugin: plugin.name, entry, specifier: String(specifier) });
    }
  }
  return result;
}

/**
 * Bundle every plugin client entry into .dune/client-bundles/ and return a map
 * from URL pathname to the bundle bytes.
 */
export async function buildClientBundles(
  dune: BootstrapResult,
  options: { root: string; dev?: boolean },
): Promise<Map<string, Uint8Array>> {
  const bundles = new Map<string, Uint8Array>();
  const { root, dev = false } = options;

  for (const { plugin, entry, specifier } of clientEntries(dune)) {
    const outFile = join(
      root,
      ".dune",
      "client-bundles",
      plugin,
      `${entry}.js`,
    );
    const urlPath = `/plugins/${plugin}/${entry}.js`;

    // Dev re-bundles on every start (plugin iteration); production reuses the
    // cached file when present.
    let code: Uint8Array | null = null;
    if (!dev) {
      try {
        code = await Deno.readFile(outFile);
      } catch {
        code = null;
      }
    }
    if (code === null) {
      await Deno.mkdir(dirname(outFile), { recursive: true });
      const result = await new Deno.Command(Deno.execPath(), {
        args: [
          "bundle",
          "--platform",
          "browser",
          "--minify",
          "--quiet",
          // The plugin's client entry pulls its own npm deps (TipTap/Yjs).
          // Auto mode lets Deno resolve/install them on demand; a site-level
          // import-map entry for every editor dependency would be noise.
          "--node-modules-dir=auto",
          "--output",
          outFile,
          specifier,
        ],
        cwd: root,
        stdout: "null",
        stderr: "piped",
      }).output();
      if (!result.success) {
        throw new Error(
          `Failed to bundle ${plugin}/${entry}: ${
            new TextDecoder().decode(result.stderr).trim()
          }`,
        );
      }
      code = await Deno.readFile(outFile);
    }
    bundles.set(urlPath, code);
  }

  return bundles;
}

/** Resolve the content page for a public pathname (base path already stripped). */
async function resolvePage(
  dune: BootstrapResult,
  pathname: string,
): Promise<
  { route: string; sourcePath: string; title: string } | null
> {
  // Dune pages are addressed with a trailing slash ("/about/") while the Fresh
  // routes keep the slash-less URL; normalise like the core content pipeline.
  const trailing = pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
  const candidates = [trailing, pathname];

  for (const candidate of candidates) {
    try {
      // deno-lint-ignore no-explicit-any
      let value: any = await dune.engine.resolve(candidate);
      if (value?.type === "redirect" && typeof value.redirectTo === "string") {
        value = await dune.engine.resolve(value.redirectTo);
      }
      if (value?.type === "page" && value.page) {
        return {
          route: value.page.route,
          sourcePath: value.page.sourcePath,
          title: value.page.title,
        };
      }
    } catch {
      // Try the next form.
    }
  }
  return null;
}

/** Authenticate an admin session and check the pages.update permission. */
async function resolveEditor(
  dune: BootstrapResult,
  req: Request,
): Promise<{ username: string } | null> {
  // deno-lint-ignore no-explicit-any
  const adminAuth = (dune.adminContext as any)?.auth;
  if (!adminAuth) return null;
  const authResult = await adminAuth.authenticate(req).catch(() => null);
  if (!authResult?.authenticated || !authResult.user) return null;
  if (!dune.authz) return null;
  const permitted = await dune.authz.check({
    who: { type: "user", id: authResult.user.id },
    // deno-lint-ignore no-explicit-any
    canThey: "pages.update" as any,
    onWhat: { type: "app", id: "admin" },
  });
  if (!permitted) return null;
  return { username: authResult.user.username ?? authResult.user.id };
}

/**
 * Register the response-transform middleware (must run before the page routes
 * are registered, so call it before mountPlugins/fsRoutes).
 */
export function installInlineEditMiddleware(
  app: App,
  dune: BootstrapResult,
  options: { basePath: string },
): void {
  const adminPrefix = dune.config.admin?.path ?? "/admin";

  app.use(async (ctx: Ctx) => {
    if (ctx.req.method !== "GET") return ctx.next();

    const url = new URL(ctx.req.url);
    let pathname = url.pathname;
    if (options.basePath && pathname.startsWith(options.basePath)) {
      pathname = pathname.slice(options.basePath.length) || "/";
    }
    if (!isPagePath(pathname)) return ctx.next();

    const page = await resolvePage(dune, pathname);
    if (!page) return ctx.next();

    const editor = await resolveEditor(dune, ctx.req);

    // Routes render while ctx.next() runs; expose edit mode so prose fields can
    // render their raw Markdown source (which the inline editor can save without
    // flattening formatting). Visitors get the rendered, sanitized Markdown.
    ctx.state.inlineEditing = editor !== null;

    const response: Response = await ctx.next();
    const contentType = response.headers.get("Content-Type") ?? "";
    if (!contentType.includes("text/html")) return response;

    let transformed = response;

    if (editor) {
      const transformPlugins = plugins(dune).filter((plugin) =>
        plugin.transformResponse
      );
      for (const plugin of transformPlugins) {
        transformed = await plugin.transformResponse!({
          req: ctx.req,
          response: transformed,
          auth: {
            username: editor.username,
            role: "admin",
            hasPermission: () => true,
            // deno-lint-ignore no-explicit-any
          } as any,
          // deno-lint-ignore no-explicit-any
          page: page as any,
          adminPrefix,
          plugins: plugins(dune),
          config: dune.config,
        });
      }
      return await injectProseEditor(
        transformed,
        `${options.basePath}/js/prose-inline-edit.js`,
      );
    }

    // Anonymous/unauthorized: strip marker attributes from the markup.
    const html = (await transformed.text()).replace(MARKER_ATTR, "");
    const headers = new Headers(transformed.headers);
    headers.delete("content-length");
    return new Response(html, {
      status: transformed.status,
      headers,
    });
  });
}

/**
 * Register plugin asset routes and the inline-edit WebSocket endpoint (call
 * after mountPlugins, before fsRoutes).
 */
export function installInlineEditRoutes(
  app: App,
  dune: BootstrapResult,
  options: {
    bundles: Map<string, Uint8Array>;
    basePath: string;
  },
): void {
  for (const [urlPath, code] of options.bundles) {
    app.get(urlPath, () =>
      new Response(code as unknown as BodyInit, {
        headers: {
          "Content-Type": "text/javascript; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }));
  }

  app.get("/api/inline-edit/ws", async (ctx: Ctx) => {
    const inlineEdit = dune.adminServices?.inlineEdit;
    if (!inlineEdit) {
      return new Response("Inline editing not enabled", { status: 501 });
    }
    if (ctx.req.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }
    const originDenied = assertInlineEditWsOrigin(ctx.req);
    if (originDenied) return originDenied;

    const sourcePath = new URL(ctx.req.url).searchParams.get("path");
    if (
      !sourcePath || !isIndexedInlineEditPath(dune.engine.pages, sourcePath)
    ) {
      return new Response("Unknown path", { status: 404 });
    }

    // deno-lint-ignore no-explicit-any
    const adminAuth = (dune.adminContext as any)?.auth;
    if (!adminAuth) return new Response("Unauthorized", { status: 401 });
    const authResult = await adminAuth.authenticate(ctx.req).catch(() => null);
    if (!authResult?.authenticated || !authResult.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const permitted = await checkInlineEditPermission(dune.authz, authResult);
    if (!permitted) return new Response("Forbidden", { status: 403 });

    return inlineEdit.handleUpgrade(ctx.req, {
      id: authResult.user.id,
      name: authResult.user.username ?? authResult.user.id,
    });
  });
}
