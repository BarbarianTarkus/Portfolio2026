import { App, staticFiles } from "fresh";
import { bootstrap } from "@dune/core/bootstrap";
import { mountPlugins } from "@dune/core/plugins";
import type { BootstrapResult } from "@dune/core/bootstrap";
import { normalizeBasePath } from "./config.ts";
import {
  buildClientBundles,
  installInlineEditMiddleware,
  installInlineEditRoutes,
} from "./lib/inline-edit-runtime.ts";
import type { State } from "./utils.ts";

/**
 * Build the Fresh application and boot Dune in headless mode.
 *
 * Dune (https://jsr.io/@dune/core) is mounted as the CMS behind the site:
 * it indexes content/, exposes the content API used by lib/content.ts and
 * serves the /admin editing panel. Public pages, layout and design still come
 * from the Fresh routes in ./routes.
 */
export async function createApp(): Promise<{
  app: App<State>;
  dune: BootstrapResult;
}> {
  const basePath = normalizeBasePath(Deno.env.get("BASE_PATH"));
  const app = new App<State>({ basePath });

  const dune = await bootstrap(import.meta.dirname!, {
    // Dev mode relaxes cookie security (the local server is plain HTTP) and
    // enables Dune's development diagnostics.
    dev: Deno.env.get("DUNE_DEV") === "1",
  });

  app.use(staticFiles());

  // Inline-edit chrome: transform middleware must be registered before the
  // page routes so it can post-process their HTML responses.
  const inlineEditEnabled = Deno.env.get("DUNE_STATIC") !== "1";
  if (inlineEditEnabled) {
    installInlineEditMiddleware(app, dune, { basePath });
  }

  // Dune's stock admin preview renders the page's Markdown body in a generic
  // template. This site keeps all copy in frontmatter and has empty bodies, so
  // that preview would always be blank. Serve the real public route into the
  // admin's preview iframe instead ("Preview" shows the saved page; the admin
  // refreshes the iframe automatically after each save).
  app.use(async (ctx) => {
    const adminPath = dune.config.admin?.path ?? "/admin";
    if (
      ctx.req.method !== "GET" ||
      ctx.url.pathname !== `${adminPath}/api/preview`
    ) {
      return ctx.next();
    }
    const sourcePath = ctx.url.searchParams.get("path");
    const page = sourcePath
      ? dune.engine.pages.find((p) => p.sourcePath === sourcePath)
      : undefined;
    if (page === undefined) return ctx.next();

    // Render the public page in-process (no redirect: the admin's CSP would
    // block a cross-document frame navigation) and reuse its HTML verbatim.
    const basePath = normalizeBasePath(Deno.env.get("BASE_PATH"));
    const target = new URL(`${basePath}${page.route}`, ctx.url);
    const response = await app.handler()(
      new Request(target, { headers: { accept: "text/html" } }),
    );
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  });

  // The static export only needs content rendering: skipping plugin mounting
  // avoids creating admin users/sessions directories in CI. The dev and
  // production servers mount everything.
  if (Deno.env.get("DUNE_STATIC") !== "1") {
    await mountPlugins(app, dune);
  }

  if (inlineEditEnabled) {
    const bundles = await buildClientBundles(dune, {
      root: import.meta.dirname!,
      dev: Deno.env.get("DUNE_DEV") === "1",
    });
    installInlineEditRoutes(app, dune, { bundles, basePath });
  }

  // Route handlers reach the Dune content API through ctx.state.
  app.use((ctx) => {
    ctx.state.contentApi = dune.contentApi;
    return ctx.next();
  });

  // File-system based routes (everything in ./routes).
  app.fsRoutes();

  return { app, dune };
}

/** The application instance imported by the Fresh build and dev server. */
export const { app, dune } = await createApp();
