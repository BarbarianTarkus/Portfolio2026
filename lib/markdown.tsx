/** @jsxImportSource preact */
/**
 * Inline Markdown renderer for the content fields.
 *
 * Copy is stored as plain strings in the page frontmatter; prose fields may use
 * inline Markdown — **bold**, *italic*, `code` and [links](https://example.com).
 * The result is rendered to HTML and sanitized with Dune's allowlist (no
 * scripts, event handlers or style attributes), so editors can format text
 * without being able to inject markup that breaks or compromises the page.
 *
 * Internal links ("/about") are prefixed with the deployment base path, the
 * same way components/InlineText.tsx used to do before Markdown replaced it.
 *
 * @module
 */

import { sanitizeHtml } from "@dune/core/security";
import { marked } from "marked";

interface MarkdownProps {
  /** Markdown source; inline syntax only (no block elements inside a <p>). */
  text: string;
  /** Deployment prefix applied to root-relative links ("" for the root). */
  basePath?: string;
  /** Optional class for the wrapping <span>. */
  class?: string;
}

/** Escape a string for literal use inside a RegExp. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Markdown({ text, basePath = "", class: cls }: MarkdownProps) {
  const raw = marked.parseInline(text ?? "") as string;
  let html = sanitizeHtml(raw);

  if (basePath !== "") {
    const prefix = basePath.replace(/\/+$/, "");
    const pattern = new RegExp(`href="/(?!${escapeRegExp(prefix)}/)`, "g");
    html = html.replace(pattern, `href="${prefix}/`);
  }

  // The HTML is produced by marked and then passed through Dune's allowlist
  // sanitizer below, so it cannot contain scripts, event handlers or styles.
  // deno-lint-ignore react-no-danger
  return <span class={cls} dangerouslySetInnerHTML={{ __html: html }} />;
}

interface ProseFieldProps extends MarkdownProps {
  /** Dotted frontmatter path, e.g. "lede" or "projects.0.summary". */
  path?: string;
  /** Page source path used by the inline editor. */
  sourcePath?: string;
  /** True for admin sessions: render the raw Markdown so inline edits keep it. */
  editing?: boolean;
}

/**
 * Render a prose field: sanitized Markdown for visitors, but raw Markdown for
 * admins in edit mode. The inline editor writes the element's text content, so
 * showing the source (rather than formatted HTML) is what lets an inline edit
 * preserve formatting (bold, code, links) instead of flattening it.
 *
 * The data-prose-* markers are only rendered for editors; static export and
 * anonymous responses get the rendered Markdown without them.
 */
export function ProseField(
  { text, basePath = "", class: cls, path, sourcePath, editing = false }:
    ProseFieldProps,
) {
  if (editing && path !== undefined && sourcePath !== undefined) {
    // Editors also get the rendered Markdown (the page must not look broken),
    // but the raw source travels in data-prose-raw so the inline editor can
    // round-trip bold/italic/code/links without flattening them.
    return (
      <span
        class={cls}
        data-prose-field={path}
        data-prose-source={sourcePath}
        data-prose-raw={text}
      >
        <Markdown text={text} basePath={basePath} />
      </span>
    );
  }
  return <Markdown text={text} basePath={basePath} class={cls} />;
}
