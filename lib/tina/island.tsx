import type { ComponentChildren } from "preact";

/**
 * Server-side half of TinaCMS's contextual editing: each editable page region
 * is wrapped in a marker element. The browser bridge (@tinacms/bridge, served
 * from static/tina-bridge.js) POSTs the current form overlay to
 * /tina-island/<name> on every edit and swaps the returned HTML in place.
 *
 * The wrapper uses display: contents (see static/styles/main.css) so it is
 * layout-neutral both on the public site and in the editor iframe.
 *
 * @module
 */

/** URL the bridge POSTs an island's overlay to. */
export function islandEndpoint(basePath: string, name: string): string {
  return basePath + "/tina-island/" + name;
}

/** Page-side marker. Renders the region exactly like the public site does. */
export function TinaIsland(
  { name, basePath, children }: {
    name: string;
    basePath: string;
    children: ComponentChildren;
  },
) {
  return (
    <div
      class="tina-island"
      data-tina-island={islandEndpoint(basePath, name)}
    >
      {children}
    </div>
  );
}

/** Endpoint-side wrapper; must match TinaIsland's markup exactly. */
export function wrapIsland(
  name: string,
  basePath: string,
  html: string,
): string {
  return '<div class="tina-island" data-tina-island="' +
    islandEndpoint(basePath, name) + '">' + html + "</div>";
}
