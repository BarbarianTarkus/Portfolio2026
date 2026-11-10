/**
 * Plain-text rendering of a Markdown summary, for `<meta name="description">`
 * and other places that must not carry markup.
 *
 * @module
 */

/** Strip the Markdown emphasis and link syntax a summary may carry. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");
}
