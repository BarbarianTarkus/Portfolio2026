import type { HomeContent, SiteContent } from "../../lib/content.ts";
import { ProseField } from "../../lib/markdown.tsx";
import { buildStackGroups, StackMap } from "../StackMap.tsx";

interface StackGridProps {
  page: HomeContent;
  site: SiteContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

/**
 * Focus areas sit side by side; below them the stack is drawn as architecture
 * layers (UI, API, IA, OPS). The stack is shared site content, so About renders
 * the same map instead of keeping a second copy.
 */
export function StackGrid(
  { page, site, basePath, sourcePath, inlineEditing }: StackGridProps,
) {
  const groups = buildStackGroups(
    site.stack,
    site.homelabStack,
    page.stackSection.infrastructureLabel,
  );

  return (
    <div class="stack-grid">
      <div class="stack-focus">
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

      <StackMap groups={groups} label={page.stackSection.stackLabel} />
    </div>
  );
}
