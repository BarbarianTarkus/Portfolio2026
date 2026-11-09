import { ProseField } from "../lib/markdown.tsx";
import type { AboutContent, SiteContent } from "../lib/content.ts";
import { loadAboutPage } from "../lib/content.ts";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { SectionHead } from "../components/SectionHead.tsx";
import { TechStack } from "../components/TechTags.tsx";
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
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface AboutPageProps {
  site: SiteContent;
  page: AboutContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

export function AboutPage(
  { site, page, basePath, sourcePath, inlineEditing }: AboutPageProps,
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

      <div class="prose">
        {page.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <ProseField
              text={paragraph}
              basePath={basePath}
              path={`paragraphs.${index}`}
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </p>
        ))}
      </div>

      <SectionHead
        num={page.homelabSection.num}
        id="homelab"
        title={
          <ProseField
            text={page.homelabSection.title}
            path="homelabSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
      />

      <p class="section-note">
        <ProseField
          text={page.homelabNote}
          basePath={basePath}
          path="homelabNote"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>

      <TechStack tags={site.homelabStack} class="homelab-stack" labeled />

      <SectionHead
        num={page.followSection.num}
        title={
          <ProseField
            text={page.followSection.title}
            path="followSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
      />

      <p class="prose">
        <ProseField
          text={page.follow}
          basePath={basePath}
          path="follow"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>
    </>
  );
}
