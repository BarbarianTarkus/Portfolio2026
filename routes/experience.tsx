import { ProseField } from "../lib/markdown.tsx";
import type { ExperienceContent, SiteContent } from "../lib/content.ts";
import { loadExperiencePage } from "../lib/content.ts";
import { JobList } from "../components/JobList.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { SectionHead } from "../components/SectionHead.tsx";
import { define } from "../utils.ts";

/**
 * The CV page. This is the site's primary page: full work history with
 * every bullet, then education. /about keeps the biography and the homelab.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, sourcePath } = await loadExperiencePage(ctx);
    return ctx.render(
      <ExperiencePage
        site={site}
        page={page}
        basePath={ctx.config.basePath}
        sourcePath={sourcePath}
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface ExperiencePageProps {
  site: SiteContent;
  page: ExperienceContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

export function ExperiencePage(
  { site, page, basePath, sourcePath, inlineEditing }: ExperiencePageProps,
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

      <p class="page-meta">
        <a
          class="text-link"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
        >
          <ProseField
            text={page.linkedinLabel}
            path="linkedinLabel"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />{" "}
          <span aria-hidden="true">→</span>
        </a>
      </p>

      <SectionHead
        num={page.jobsSection.num}
        title={
          <ProseField
            text={page.jobsSection.title}
            path="jobsSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
      />

      <JobList
        jobs={page.jobs}
        edit={{
          sourcePath: sourcePath,
          basePath: basePath,
          editing: inlineEditing,
        }}
      />

      <SectionHead
        num={page.educationSection.num}
        title={
          <ProseField
            text={page.educationSection.title}
            path="educationSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
      />

      <ol class="job-list">
        <li class="job">
          <p class="job-period">
            <ProseField
              text={page.education.period}
              path="education.period"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </p>
          <div>
            <h3 class="job-role">
              <ProseField
                text={page.education.role}
                path="education.role"
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </h3>
            <p class="job-company">
              <ProseField
                text={page.education.company}
                path="education.company"
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </p>
          </div>
        </li>
      </ol>

      <SectionHead
        num={page.outroSection.num}
        title={
          <ProseField
            text={page.outroSection.title}
            path="outroSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
      />

      <p class="prose">
        <ProseField
          text={page.outro}
          basePath={basePath}
          path="outro"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>
    </>
  );
}
