import { App, staticFiles } from "fresh";
import { normalizeBasePath } from "./config.ts";

/**
 * The Fresh application.
 *
 * `basePath` is read at *runtime* so the very same build can be served from the
 * domain root or from a sub-path such as GitHub Pages' `/Portfolio/`.
 */
export const app = new App({
  basePath: normalizeBasePath(Deno.env.get("BASE_PATH")),
});

app.use(staticFiles());

// File-system based routes (everything in ./routes).
app.fsRoutes();
