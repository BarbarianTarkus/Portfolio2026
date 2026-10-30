import { Head } from "fresh/runtime";
import { EditableText } from "@dune/core/ui/editable";
import { InlineText } from "../components/InlineText.tsx";
import type { AboutContent, SiteContent } from "../lib/content.ts";
import { loadAboutPage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * Biography and the homelab. Work history moved to /experience so this page
 * stops competing with the CV: a recruiter lands on experience, a curious
 * reader lands here.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, sourcePath } = await loadAboutPage(ctx);
    return ctx.render(
      <AboutPage
        site={site}
        page={page}
        basePath={ctx.config.basePath}
        sourcePath={sourcePath}
      />,
    );
  },
});

interface AboutPageProps {
  site: SiteContent;
  page: AboutContent;
  basePath: string;
  sourcePath: string;
}

export function AboutPage(
  { site, page, basePath, sourcePath }: AboutPageProps,
) {
  const metaTitle = page.meta.title + " — " + site.author;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta
          name="description"
          content={page.meta.description}
        />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={page.meta.description} />
      </Head>

      <h1 class="page-title">
        {page.title}
      </h1>
      <p class="page-lede">
        <EditableText field="lede" sourcePath={sourcePath}>
          {page.lede}
        </EditableText>
      </p>

      <div class="prose">
        {page.paragraphs.map((paragraph, index) => (
          <p
            key={index}
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
        >
          {page.homelabSection.title}
        </h2>
      </div>

      <p class="section-note">
        {page.homelabNote}
      </p>

      <ul class="tag-list">
        {site.homelabStack.map((item) => (
          <li
            class="tag"
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>

      <div class="section-head">
        <span class="section-num">{page.followSection.num}</span>
        <h2 class="section-title">
          {page.followSection.title}
        </h2>
      </div>

      <p class="prose">
        <InlineText text={page.follow} basePath={basePath} />
      </p>
    </>
  );
}
