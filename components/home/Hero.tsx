import type { HomeContent, SiteContent } from "../../lib/content.ts";
import { localizedHref, useLanguage } from "../../lib/i18n.tsx";
import { ProseField } from "../../lib/markdown.tsx";

interface HeroProps {
  page: HomeContent;
  site: SiteContent;
  basePath: string;
  sourcePath: string;
  siteSourcePath: string;
  inlineEditing: boolean;
}

/** Home hero: who he is and the two entry points into the site. */
export function Hero(
  {
    page,
    site,
    basePath,
    sourcePath,
    siteSourcePath,
    inlineEditing,
  }: HeroProps,
) {
  const lang = useLanguage();

  return (
    <section class="hero">
      <p class="eyebrow">
        <ProseField
          text={page.eyebrow}
          basePath={basePath}
          path="eyebrow"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>
      {
        /* The heading shows the author from the site page, not this page's
          title: keep it out of the title auto-annotation. */
      }
      <h1 class="hero-name" data-dune-no-edit>
        <ProseField
          text={site.author}
          path="author"
          sourcePath={siteSourcePath}
          editing={inlineEditing}
        />
        .
      </h1>
      <p class="hero-role">
        <ProseField
          text={site.role}
          path="role"
          sourcePath={siteSourcePath}
          editing={inlineEditing}
        />
      </p>
      <p class="hero-intro">
        <ProseField
          text={site.intro}
          basePath={basePath}
          path="intro"
          sourcePath={siteSourcePath}
          editing={inlineEditing}
        />
      </p>

      <div class="hero-actions">
        <a
          class="button"
          href={localizedHref(basePath, lang, page.primaryAction.route)}
        >
          {page.primaryAction.label}
        </a>
        <a
          class="button button-ghost"
          href={localizedHref(basePath, lang, page.secondaryAction.route)}
        >
          {page.secondaryAction.label}
        </a>
      </div>
    </section>
  );
}
