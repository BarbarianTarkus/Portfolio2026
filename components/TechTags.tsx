import { techColorForTag, techIconForTag } from "../lib/tech-icons.ts";
import { techLinkForTag } from "../lib/tech-links.ts";

/**
 * Short labels for the stacks that have no official Simple Icons glyph. They
 * keep the technology row visually consistent (a tile per stack) instead of
 * leaving a text pill among the icons; the full name stays in the tooltip and
 * in the screen-reader-only label.
 */
const TAG_MONOGRAMS: Record<string, string> = {
  "Java": "JV",
  "Bash": "SH",
  "ReScript": "ReS",
  "DynamoDB": "DDB",
  "PyInstaller": "PyI",
  "Deno KV": "KV",
  "Oak": "Oak",
  "PostgREST": "REST",
  "Azure Functions": "Fn",
  "Active Directory": "AD",
  "OpenGnsys": "OG",
  "IMAP / POP / SMTP": "MAIL",
  "NFS / SMB": "NFS",
  "Rsync": "RSY",
  "Claude Code": "CC",
  "Gemini CLI": "GC",
  "Pi": "π",
  "Gentle Shell": "GS",
  "MCP": "MCP",
  "Skills": "SK",
  "Ollama": "OL",
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

/** Screen-reader label and tooltip text for a linked technology tile. */
function techLinkLabel(tag: string): string {
  return tag + ", web oficial (se abre en una pestaña nueva)";
}

interface TechTagProps {
  tag: string;
  linked?: boolean;
  /** Show the technology name next to the glyph (work history, homelab). */
  labeled?: boolean;
}

/** One technology tile for an unordered list (fiche stacks). */
export function TechTag(
  { tag, linked = true, labeled = false }: TechTagProps,
) {
  const href = linked ? techLinkForTag(tag) : undefined;
  const style = "--tech-color:" + techColorForTag(tag);
  const classes = labeled ? "tag tag--tech tag--tech-labeled" : "tag tag--tech";
  const label = labeled
    ? <span class="tag-label">{tag}</span>
    : <span class="sr-only">{tag}</span>;

  if (href === undefined) {
    return (
      <li
        class={classes}
        title={tag}
        data-tech={tag}
        style={style}
      >
        <GlyphContent tag={tag} />
        {label}
      </li>
    );
  }

  return (
    <li class="tag-list-item" data-tech={tag} style={style}>
      <a
        class={classes}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={"Web oficial de " + tag + " (se abre en una pestaña nueva)"}
        aria-label={techLinkLabel(tag)}
        data-tech-link={tag}
      >
        <GlyphContent tag={tag} />
        {label}
      </a>
    </li>
  );
}

/** One technology tile for inline runs of text (index rows, metadata). */
export function TechGlyph(
  { tag, linked = true }: { tag: string; linked?: boolean },
) {
  const href = linked ? techLinkForTag(tag) : undefined;
  const style = "--tech-color:" + techColorForTag(tag);
  const glyph = (
    <>
      <GlyphContent tag={tag} />
      <span class="sr-only">{tag}</span>
    </>
  );

  if (href === undefined) {
    return (
      <span class="tag tag--tech" title={tag} data-tech={tag} style={style}>
        {glyph}
      </span>
    );
  }

  return (
    <a
      class="tag tag--tech"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={"Web oficial de " + tag + " (se abre en una pestaña nueva)"}
      aria-label={techLinkLabel(tag)}
      data-tech-link={tag}
      style={style}
    >
      {glyph}
    </a>
  );
}

interface TechStackProps {
  tags: string[];
  class?: string;
  /**
   * Whether the tiles link to each technology's official page. The project
   * index wraps the whole row in a link, so it disables the inner links to
   * avoid nested anchors.
   */
  linked?: boolean;
  /** Show the technology name next to each glyph (work history, homelab). */
  labeled?: boolean;
}

/**
 * A row of technology tiles. The fiche uses the list form; the project index
 * puts the same row inside its row link, so the stack reads the same in both
 * places instead of falling back to a line of text.
 */
export function TechStack(
  { tags, class: className, linked = true, labeled = false }: TechStackProps,
) {
  const classes = className === undefined
    ? "tag-list"
    : "tag-list " + className;
  return (
    <ul class={classes}>
      {tags.map((tag) => (
        <TechTag tag={tag} linked={linked} labeled={labeled} key={tag} />
      ))}
    </ul>
  );
}
