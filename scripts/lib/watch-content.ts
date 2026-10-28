/**
 * Keep Dune's content index in sync while the dev server is running.
 *
 * The static build re-indexes everything from scratch, and `deno task dev`
 * restarts on content/config changes thanks to `--watch`. Restarting on every
 * keystroke is disruptive in the admin panel, so the running dev process
 * rebuilds the index in place instead (DuneEngine.rebuild()).
 *
 * @module
 */

import type { BootstrapResult } from "@dune/core/bootstrap";

/** Wait this long after the last filesystem event before rebuilding. */
const DEBOUNCE_MS = 150;

/**
 * Watch `contentDir` and rebuild the Dune content index after changes.
 *
 * Returns a function that stops the watcher (used by tests/shutdown paths).
 */
export function watchContent(
  contentDir: string,
  dune: BootstrapResult,
): () => void {
  let timer: number | undefined;
  let running = false;
  let pending = false;

  const rebuild = async () => {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    try {
      await dune.engine.rebuild();
      console.log("[dune] content index rebuilt");
    } catch (error) {
      console.error("[dune] content rebuild failed:", error);
    } finally {
      running = false;
      if (pending) {
        pending = false;
        void rebuild();
      }
    }
  };

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => void rebuild(), DEBOUNCE_MS);
  };

  let watcher: Deno.FsWatcher | null = null;
  try {
    watcher = Deno.watchFs(contentDir, { recursive: true });
  } catch (error) {
    // A missing content directory is reported by Dune's bootstrap already.
    console.error("[dune] cannot watch content directory:", error);
    return () => {};
  }

  void (async () => {
    for await (const _event of watcher!) schedule();
  })();

  return () => {
    clearTimeout(timer);
    watcher?.close();
  };
}
