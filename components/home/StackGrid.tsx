import type { HomeContent, SiteContent } from "../../lib/content.ts";
import { ProseField } from "../../lib/markdown.tsx";
import { techLinkForTag } from "../../lib/tech-links.ts";

interface StackGridProps {
  page: HomeContent;
  site: SiteContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

/**
 * One chip in the home stack lists. Technologies with a canonical page become
 * links; the rest stay plain text instead of pointing at an approximate source.
 */
function StackChip({ item }: { item: string }) {
  const href = techLinkForTag(item);
  if (href === undefined) {
    return <li>{item}</li>;
  }
  return (
    <li>
      <a
        class="chip-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={"Web oficial de " + item + " (se abre en una pestaña nueva)"}
        aria-label={item + ", web oficial (se abre en una pestaña nueva)"}
        data-tech-link={item}
      >
        {item}
      </a>
    </li>
  );
}

/** Two columns: focus areas on the left, the chip lists on the right. */
export function StackGrid(
  { page, site, basePath, sourcePath, inlineEditing }: StackGridProps,
) {
  return (
    <div class="stack-grid">
      <div>
        {page.focus.map((item, index) => (
          <div class="stack-block" key={item.title}>
            <h3>
              <ProseField
                text={item.title}
                path={"focus." + index + ".title"}
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </h3>
            <p>
              <ProseField
                text={item.body}
                basePath={basePath}
                path={"focus." + index + ".body"}
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </p>
          </div>
        ))}
      </div>
      <div>
        <div class="stack-block">
          <h3>
            {page.stackSection.stackLabel}
          </h3>
          <ul class="chip-list">
            {page.stack.map((item) => <StackChip item={item} key={item} />)}
          </ul>
        </div>
        <div class="stack-block">
          <h3>
            {page.stackSection.infrastructureLabel}
          </h3>
          <ul class="chip-list">
            {site.homelabStack.map((item) => (
              <StackChip item={item} key={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
