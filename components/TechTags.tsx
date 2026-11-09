import { techIconForTag } from "../lib/tech-icons.ts";

/**
 * Short labels for the stacks that have no official Simple Icons glyph. They
 * keep the technology row visually consistent (a tile per stack) instead of
 * leaving a text pill among the icons; the full name stays in the tooltip and
 * in the screen-reader-only label.
 */
const TAG_MONOGRAMS: Record<string, string> = {
  "PyInstaller": "PyI",
  "Deno KV": "KV",
  "Oak": "Oak",
  "PostgREST": "REST",
  "Azure Functions": "Fn",
};

function GlyphContent({ tag }: { tag: string }) {
  const icon = techIconForTag(tag);
  if (icon === undefined) {
    return (
      <span class="tag-monogram" aria-hidden="true">
        {TAG_MONOGRAMS[tag] ?? tag.slice(0, 3)}
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  );
}

/** One technology tile for an unordered list (fiche stacks). */
export function TechTag({ tag }: { tag: string }) {
  return (
    <li class="tag tag--tech" title={tag}>
      <GlyphContent tag={tag} />
      <span class="sr-only">{tag}</span>
    </li>
  );
}

/** One technology tile for inline runs of text (index rows, metadata). */
export function TechGlyph({ tag }: { tag: string }) {
  return (
    <span class="tag tag--tech" title={tag}>
      <GlyphContent tag={tag} />
      <span class="sr-only">{tag}</span>
    </span>
  );
}

interface TechStackProps {
  tags: string[];
  class?: string;
}

/**
 * A row of technology tiles. The fiche uses the list form; the project index
 * puts the same row inside its row link, so the stack reads the same in both
 * places instead of falling back to a line of text.
 */
export function TechStack({ tags, class: className }: TechStackProps) {
  const classes = className === undefined
    ? "tag-list"
    : "tag-list " + className;
  return (
    <ul class={classes}>
      {tags.map((tag) => <TechTag tag={tag} key={tag} />)}
    </ul>
  );
}
