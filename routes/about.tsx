import { Head } from "fresh/runtime";
import { InlineText } from "../components/InlineText.tsx";
import type { AboutContent, SiteContent } from "../lib/content.ts";
import { loadAboutPage } from "../lib/content.ts";
import { TinaIsland } from "../lib/tina/island.tsx";
import { tinaField } from "../lib/tina/metadata.ts";
import { define } from "../utils.ts";

/**
 * Biography and the homelab. Work history moved to /experience so this page
 * stops competing with the CV: a recruiter lands on experience, a curious
 * reader lands here.
 */
export const handler = define.handlers({
  GET(ctx) {
    const { site, page } = loadAboutPage(ctx);
    return ctx.render(
      <TinaIsland name="about" basePath={ctx.config.basePath}>
        <AboutPage site={site} page={page} basePath={ctx.config.basePath} />
      </TinaIsland>,
    );
  },
});

interface AboutPageProps {
  site: SiteContent;
  page: AboutContent;
  basePath: string;
}

export function AboutPage({ site, page, basePath }: AboutPageProps) {
  const metaTitle = page.meta.title + " — " + site.author;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta
          name="description"
          content={page.meta.description}
          data-tina-field={tinaField(page.meta, "description")}
        />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={page.meta.description} />
      </Head>

      <h1 class="page-title" data-tina-field={tinaField(page, "title")}>
        {page.title}
      </h1>
      <p class="page-lede" data-tina-field={tinaField(page, "lede")}>
        {page.lede}
      </p>

      <div class="prose">
        {page.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            data-tina-field={tinaField(page, "paragraphs", index)}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div class="section-head">
        <span class="section-num">{page.homelabSection.num}</span>
        <h2
          class="section-title"
          id="homelab"
          data-tina-field={tinaField(page.homelabSection, "title")}
        >
          {page.homelabSection.title}
        </h2>
      </div>

      <p
        class="section-note"
        data-tina-field={tinaField(page, "homelabNote")}
      >
        {page.homelabNote}
      </p>

      <ul class="tag-list">
        {site.homelabStack.map((item, index) => (
          <li
            class="tag"
            key={item}
            data-tina-field={tinaField(site, "homelabStack", index)}
          >
            {item}
          </li>
        ))}
      </ul>

      <div class="section-head">
        <span class="section-num">{page.followSection.num}</span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.followSection, "title")}
        >
          {page.followSection.title}
        </h2>
      </div>

      <p class="prose" data-tina-field={tinaField(page, "follow")}>
        <InlineText text={page.follow} basePath={basePath} />
      </p>
    </>
  );
}
