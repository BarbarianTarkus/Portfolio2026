import type { ComponentChildren } from "preact";

interface PageHeaderProps {
  title: string;
  lede?: ComponentChildren;
}

/** The title/lede pair at the top of every inner page. */
export function PageHeader({ title, lede }: PageHeaderProps) {
  return (
    <>
      <h1 class="page-title">{title}</h1>
      {lede !== undefined && lede !== null && lede !== "" && (
        <p class="page-lede">{lede}</p>
      )}
    </>
  );
}
