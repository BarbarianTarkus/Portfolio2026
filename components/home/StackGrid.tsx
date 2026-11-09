import type { HomeContent, SiteContent } from "../../lib/content.ts";
import { ProseField } from "../../lib/markdown.tsx";

interface StackGridProps {
  page: HomeContent;
  site: SiteContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
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
            {page.stack.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div class="stack-block">
          <h3>
            {page.stackSection.infrastructureLabel}
          </h3>
          <ul class="chip-list">
            {site.homelabStack.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
