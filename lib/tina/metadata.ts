/**
 * Content-source metadata helpers.
 *
 * Vendored from @tinacms/bridge 0.3.1 (Apache-2.0), the canonical
 * implementation shared by Tina's React and Astro integrations. Keeping a local
 * copy avoids pulling the whole bridge package (and its Node-oriented build)
 * into the Deno server bundle; the browser bridge is served from
 * static/tina-bridge.js.
 *
 * @module
 */

interface ContentSource {
  queryId: string;
  path: (string | number)[];
}

/** Keys that describe Tina system state and never become editable fields. */
const SYSTEM_KEYS = new Set([
  "__typename",
  "_sys",
  "_internalSys",
  "_values",
  "_internalValues",
  "_content_source",
  "_tina_metadata",
]);

function isScalarOrUndefined(value: unknown): boolean {
  const type = typeof value;
  if (
    type === "string" || type === "number" || type === "boolean" ||
    type === "undefined" || value == null
  ) return true;
  return value instanceof String || value instanceof Number ||
    value instanceof Boolean;
}

/**
 * Walk a query result and stamp every non-system object with
 * `_content_source: { queryId, path }`. That pair is what tinaField() reads to
 * build the `data-tina-field` markers the admin uses for click-to-edit.
 */
export function addMetadata<T>(
  id: string,
  obj: T,
  path: (string | number)[] = [],
): T {
  if (obj === null) return obj;
  if (isScalarOrUndefined(obj)) return obj;
  if (obj instanceof String) return obj.valueOf() as T;
  if (Array.isArray(obj)) {
    return obj.map((item, index) =>
      addMetadata(id, item, [...path, index])
    ) as T;
  }
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    next[key] = SYSTEM_KEYS.has(key)
      ? value
      : addMetadata(id, value, [...path, key]);
  }
  if (next && typeof next === "object" && next.type === "root") {
    return next as T;
  }
  return { ...next, _content_source: { queryId: id, path } } as T;
}

/**
 * Derive the form id from `JSON.stringify({ query, variables })`. Both ends of
 * the wire (page render and admin sidebar) hash the same string so overlay
 * updates address the same form.
 */
export function hashFromQuery(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) & 4294967295;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a field identifier for Tina to associate DOM elements with form
 * fields. Format: `queryId---path.to.field` or `queryId---path.to.array.index`.
 */
export function tinaField(
  object: unknown,
  property?: string,
  index?: number,
): string {
  const contentSource = (object as { _content_source?: ContentSource } | null)
    ?._content_source;
  if (!contentSource) return "";
  const { queryId, path } = contentSource;
  if (!property) return `${queryId}---${path.join(".")}`;
  const fullPath = typeof index === "number"
    ? [...path, property, index]
    : [...path, property];
  return `${queryId}---${fullPath.join(".")}`;
}
