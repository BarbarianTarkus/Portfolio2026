import { ProseField } from "../lib/markdown.tsx";
import type { ContactContent, SiteContent } from "../lib/content.ts";
import { loadContactPage } from "../lib/content.ts";
import { ContactRows } from "../components/ContactRows.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { define } from "../utils.ts";

/**
 * Contact as one row per channel. Each row is one link wrapping its label, value and
 * hint; the glyph tile and the arrow are decorative, so the accessible name is
 * the row's own copy and the target is never announced twice.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, sourcePath } = await loadContactPage(ctx);
    return ctx.render(
      <ContactPage
        site={site}
        page={page}
        basePath={ctx.config.basePath}
        sourcePath={sourcePath}
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface ContactPageProps {
  site: SiteContent;
  page: ContactContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

export function ContactPage(
  { site, page, basePath, sourcePath, inlineEditing }: ContactPageProps,
) {
  const metaTitle = page.meta.title + " — " + site.author;

  return (
    <>
      <PageMeta title={metaTitle} description={page.meta.description} />

      <PageHeader
        title={page.title}
        lede={
          <ProseField
            text={page.lede}
            basePath={basePath}
            path="lede"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
      />

      <ContactRows site={site} page={page} />
    </>
  );
}
