/**
 * Client-side fallback for TinaCMS live preview on static hosts.
 *
 * @tinacms/bridge refreshes an editable region by POSTing the current form
 * overlay to the island endpoint and swapping in the returned HTML. Static
 * hosting has no request-time renderer, so this module intercepts those POSTs
 * when the network cannot answer them and applies the overlay to the existing
 * DOM instead: every element carrying data-tina-field is looked up in the
 * overlay by its "formId---path.to.field" marker and its text is replaced.
 *
 * Only leaf text elements are rewritten. Containers (which may hold links or
 * nested markers) are left alone, so unsupported rich-text edits keep the last
 * rendered HTML instead of producing broken markup.
 */

/** Attribute the bridge/server use to address an editable region. */
const ISLAND_ATTR = "data-tina-island";
const FIELD_ATTR = "data-tina-field";
const SEPARATOR = "---";

/** Safely read one value out of the overlay by form id + dotted path. */
function resolveField(overlay, marker) {
  const separator = marker.indexOf(SEPARATOR);
  if (separator === -1) return undefined;
  const formId = marker.slice(0, separator);
  const path = marker.slice(separator + SEPARATOR.length).split(".").filter(
    Boolean,
  );
  let value = overlay[formId];
  for (const key of path) {
    if (value === null || value === undefined || typeof value !== "object") {
      return undefined;
    }
    value = value[key];
  }
  return value;
}

/** Replace the text of every leaf element that the overlay addresses. */
function applyOverlay(island, overlay) {
  for (const element of island.querySelectorAll("[" + FIELD_ATTR + "]")) {
    // Containers with children are left to their own field markers.
    if (element.children.length > 0) continue;
    const marker = element.getAttribute(FIELD_ATTR) ?? "";
    const value = resolveField(overlay, marker);
    if (typeof value === "string" || typeof value === "number") {
      if (element.textContent !== String(value)) {
        element.textContent = String(value);
      }
    }
  }
}

/** Find the island element a bridge POST refers to. */
function findIsland(endpoint) {
  let pathname = endpoint;
  try {
    pathname = new URL(endpoint, globalThis.location.href).pathname;
  } catch {
    // Keep the raw endpoint; the attribute match below may still succeed.
  }
  for (const island of document.querySelectorAll("[" + ISLAND_ATTR + "]")) {
    const target = island.getAttribute(ISLAND_ATTR) ?? "";
    if (target === endpoint || target === pathname) return island;
  }
  return null;
}

/**
 * Wrap window.fetch so island refreshes work without a server. Requests that
 * succeed (deno task dev, a deployed Deno server) are passed through untouched.
 */
export function installIslandFallback() {
  const originalFetch = globalThis.fetch.bind(globalThis);
  const staticHost = document.documentElement.dataset.tinaStatic === "1";

  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    const method = (init && init.method) || "GET";
    if (method !== "POST" || !url.includes("/tina-island/")) {
      return originalFetch(input, init);
    }

    if (!staticHost) {
      try {
        const response = await originalFetch(input, init);
        if (response.ok) return response;
      } catch {
        // No server answered: fall through to the browser-side renderer.
      }
    }

    const island = findIsland(url);
    if (island === null) {
      return new Response("Unknown island", { status: 404 });
    }

    let overlay = {};
    try {
      const parsed = JSON.parse((init && init.body) || "{}");
      if (parsed !== null && typeof parsed === "object") overlay = parsed;
    } catch {
      // A malformed overlay leaves the current DOM untouched.
    }

    applyOverlay(island, overlay);
    const wrapper = island.cloneNode(true);
    return new Response(wrapper.outerHTML, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  };
}
