import type { ComponentChildren } from "preact";

interface FicheBlockProps {
  title: string;
  children: ComponentChildren;
}

/**
 * One titled prose block of a case study: the problem, the decisions, or —
 * on a work project — what the product is and what he did on it.
 */
export function FicheBlock({ title, children }: FicheBlockProps) {
  return (
    <div class="fiche-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
