import type { ComponentChildren } from "preact";

interface InlineTextProps {
  /** Plain text with optional markdown-style [label](/route) links. */
  text: string;
  /** Deployment prefix applied to internal routes. */
  basePath: string;
}

/**
 * Minimal inline rich-text renderer: plain strings with optional
 * `[label](/route)` links. It keeps the content as a single field without
 * pulling a Markdown renderer (and its sanitizer) into the bundle.
 * Internal links are prefixed with the deployment base path.
 */
export function InlineText({ text, basePath }: InlineTextProps) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  const children: ComponentChildren[] = parts.map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (!match) return part;
    const [, label, href] = match;
    const target = href.startsWith("/") ? `${basePath}${href}` : href;
    return <a href={target} key={index}>{label}</a>;
  });
  return <>{children}</>;
}
