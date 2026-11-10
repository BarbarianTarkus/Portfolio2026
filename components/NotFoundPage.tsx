import type { SiteContent } from "../lib/content.ts";
import { localizedHref, useLanguage } from "../lib/i18n.tsx";
import { PageHeader } from "./PageHeader.tsx";
import { Markdown } from "../lib/markdown.tsx";
import { PageMeta } from "./PageMeta.tsx";

interface NotFoundPageProps {
  basePath: string;
  site: SiteContent;
}

/**
 * Rendered by routes/_404.tsx. Fresh's _404 convention does not force a 404
 * status code, so the route's GET handler renders this component and returns a
 * 404 response explicitly.
 */
export function NotFoundPage({ basePath, site }: NotFoundPageProps) {
  const notFound = site.notFound;
  const lang = useLanguage();
  const metaTitle = notFound.metaTitle + " — " + site.author;
  return (
    <>
      <PageMeta title={metaTitle} description={notFound.metaDescription} />

      <div class="error-page">
        <p class="error-code" aria-hidden="true">
          {notFound.code}
        </p>
        <PageHeader
          title={notFound.heading}
          lede={<Markdown text={notFound.lede} basePath={basePath} />}
        />
        {
          /* Explicit "false" stops Fresh from marking this home link as the
            current/ancestor page while rendering the 404 response. */
        }
        <a
          class="button"
          href={localizedHref(basePath, lang, "/")}
          aria-current="false"
        >
          {notFound.button}
        </a>
      </div>
    </>
  );
}
