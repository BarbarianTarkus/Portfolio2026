/**
 * TinaCMS editor bootstrap.
 *
 * Loaded as a module on every exported page. Outside the TinaCMS admin iframe it
 * does nothing (a single tiny request, cached); inside the iframe it installs
 * the client-side island fallback and starts @tinacms/bridge.
 *
 * The bridge talks to the editor and, on every edit, POSTs the current form
 * overlay to /tina-island/<name>. On a server (deno task dev / a Deno deploy)
 * that endpoint re-renders the region. On a static host (GitHub Pages) the
 * request has no server to answer it, so tina-live-fallback.js re-renders the
 * editable text in the browser instead. Same editing experience either way.
 */
if (globalThis.parent !== globalThis) {
  const bridgeUrl = new URL("./tina-bridge.js", import.meta.url).href;
  const fallbackUrl = new URL("./tina-live-fallback.js", import.meta.url).href;

  Promise.all([import(bridgeUrl), import(fallbackUrl)])
    .then(([bridge, fallback]) => {
      fallback.installIslandFallback();
      bridge.init();
    })
    .catch((error) => console.error("[tina] editor bootstrap failed", error));
}
