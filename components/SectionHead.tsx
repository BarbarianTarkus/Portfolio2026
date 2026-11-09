import type { ComponentChildren } from "preact";

interface SectionHeadProps {
  num: string;
  title: ComponentChildren;
  id?: string;
  link?: { href: string; label: string };
}

/**
 * Shared section heading: number, title and an optional "see more" link.
 * The title stays a child so routes can wrap it in ProseField.
 */
export function SectionHead({ num, title, id, link }: SectionHeadProps) {
  return (
    <div class="section-head">
      <span class="section-num">{num}</span>
      <h2 class="section-title" {...(id === undefined ? {} : { id })}>
        {title}
      </h2>
      {link === undefined
        ? null
        : <a class="section-link" href={link.href}>{link.label}</a>}
    </div>
  );
}
