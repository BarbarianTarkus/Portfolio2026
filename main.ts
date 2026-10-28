import { App, staticFiles } from "fresh";
import { bootstrap } from "@dune/core/bootstrap";
import { mountPlugins } from "@dune/core/plugins";
import type { BootstrapResult } from "@dune/core/bootstrap";
import { normalizeBasePath } from "./config.ts";
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
  const app = new App<State>({
    basePath: normalizeBasePath(Deno.env.get("BASE_PATH")),
  });

  const dune = await bootstrap(import.meta.dirname!, {
    // Dev mode relaxes cookie security (the local server is plain HTTP) and
    // enables Dune's development diagnostics.
    dev: Deno.env.get("DUNE_DEV") === "1",
  });

  app.use(staticFiles());

  // The static export only needs content rendering: skipping plugin mounting
  // avoids creating admin users/sessions directories in CI. The dev and
  // production servers mount everything.
  if (Deno.env.get("DUNE_STATIC") !== "1") {
    await mountPlugins(app, dune);
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
