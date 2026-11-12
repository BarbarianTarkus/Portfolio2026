import { NotFoundPage } from "../../../components/NotFoundPage.tsx";
import { PageMeta } from "../../../components/PageMeta.tsx";
import { WorkProjectArticle } from "../../../components/experience/WorkProjectArticle.tsx";
import type { ExperienceContent, SiteContent } from "../../../lib/content.ts";
import { loadSite, loadWorkProjectPage } from "../../../lib/content.ts";
import type { JobEntry, WorkProject } from "../../../lib/content-types.ts";
import { plainText } from "../../../lib/plain-text.ts";
import { define } from "../../../utils.ts";

/**
 * A project he built on a job: `/experience/<company>/<project>/`.
 *
 * It lives under the timeline on purpose. These are deliverables of an
 * employer's product line, not coursework or personal builds, so they are read
 * as a footnote to the job that produced them and deliberately stay out of
 * `/projects/`. An unknown company or project slug falls back to the 404 page.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const loaded = await loadWorkProjectPage(
      ctx,
      ctx.params.company,
      ctx.params.slug,
    );

    if (loaded === null) {
      const site = await loadSite(ctx);
      return ctx.render(
        <NotFoundPage basePath={ctx.config.basePath} site={site} />,
        { status: 404 },
      );
    }

    return ctx.render(
      <WorkProjectPage
        site={loaded.site}
        page={loaded.page}
        job={loaded.job}
        project={loaded.project}
        jobIndex={loaded.jobIndex}
        sourcePath={loaded.sourcePath}
        jobSourcePath={loaded.jobSourcePath}
        basePath={ctx.config.basePath}
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface WorkProjectPageProps {
  site: SiteContent;
  page: ExperienceContent;
  job: JobEntry;
  project: WorkProject;
  jobIndex: number;
  sourcePath: string;
  jobSourcePath: string;
  basePath: string;
  inlineEditing: boolean;
}

export function WorkProjectPage(
  {
    site,
    page,
    job,
    project,
    jobIndex,
    sourcePath,
    jobSourcePath,
    basePath,
    inlineEditing,
  }: WorkProjectPageProps,
) {
  /**
   * "FRESK — 3iPunt — Ricardo" reads better in a tab than the bare product
   * name, which is meaningless without the company that ships it.
   */
  const metaTitle = project.name + " — " + job.company + " — " + site.author;

  return (
    <>
      <PageMeta title={metaTitle} description={plainText(project.summary)} />

      <WorkProjectArticle
        project={project}
        job={job}
        jobIndex={jobIndex}
        labels={page.workProjectLabels}
        basePath={basePath}
        sourcePath={sourcePath}
        jobSourcePath={jobSourcePath}
        inlineEditing={inlineEditing}
      />
    </>
  );
}
