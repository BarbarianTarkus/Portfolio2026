/**
 * Production build for the Fresh application.
 *
 * Fresh's Builder bundles the server entry and every island (including the
 * Dune admin islands re-exported from islands/dune-admin/) into ./_fresh. The
 * static site generator imports the generated _fresh/server.js afterwards.
 *
 * When DUNE_STATIC=1 (set by scripts/ssg.ts) the admin panel is not mounted, so
 * its island bundles are pruned from the export: a static site has no /admin
 * and should not ship its client code.
 *
 *     deno task build
 *
 * @module
 */

import { Builder } from "fresh/dev";
import { join } from "@std/path";
import { removeDir } from "./lib/files.ts";

const root = join(import.meta.dirname!, "..");
const staticExport = Deno.env.get("DUNE_STATIC") === "1";

// Start from a clean output directory: Builder writes into _fresh/ but does
// not remove files left by an older build.
await removeDir(join(root, "_fresh"));

const builder = new Builder({
  root,
  // Skip the admin island bridges for a static export (see module docs).
  ignore: staticExport ? [/islands[\/\\](dune-admin|admin)[\/\\]/] : [],
});
await builder.build({ snapshot: "disk" });
