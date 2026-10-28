import { Builder } from "fresh/dev";
import { join } from "@std/path";
import { watchContent } from "./scripts/lib/watch-content.ts";

/**
 * Development server.
 *
 * Fresh's `Builder` bundles the server and the islands on demand and reloads
 * the browser when a route or island changes. Dune's content index is rebuilt
 * when a content file changes, so edits made in /admin (or by hand) show up
 * without restarting the process.
 */
Deno.env.set("DUNE_DEV", "1");
// Dune's dev-only conveniences (diagnostics, the admin's agent change API and
// relaxed cookie security) key off DUNE_ENV=dev.
Deno.env.set("DUNE_ENV", "dev");

const root = import.meta.dirname!;
const { app, dune } = await import("./main.ts");

const builder = new Builder({ root });
watchContent(join(root, "content"), dune);

await builder.listen(() => Promise.resolve(app), {
  port: Number(Deno.env.get("PORT") ?? 5173),
});
