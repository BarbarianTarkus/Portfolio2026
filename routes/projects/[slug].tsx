import { NotFoundPage } from "../../components/NotFoundPage.tsx";
import { PageMeta } from "../../components/PageMeta.tsx";
import { ProjectArticle } from "../../components/projects/ProjectArticle.tsx";
import type { ProjectsContent, SiteContent } from "../../lib/content.ts";
import { loadProjectPage, loadSite } from "../../lib/content.ts";
import type { Project } from "../../lib/content-types.ts";
import { plainText } from "../../lib/plain-text.ts";
import { define } from "../../utils.ts";

/**
 * One project as its own article: the card links here, the degree summary
 * links here, and the page can be shared on its own. Unknown slugs fall back
 * to the 404 page instead of a half-rendered article.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const loaded = await loadProjectPage(ctx, ctx.params.slug);

    if (loaded === null) {
      const site = await loadSite(ctx);
      return ctx.render(
        <NotFoundPage basePath={ctx.config.basePath} site={site} />,
        { status: 404 },
      );
    }

    return ctx.render(
      <ProjectPage
        site={loaded.site}
        page={loaded.page}
        project={loaded.project}
        projectIndex={loaded.index}
        sourcePath={loaded.sourcePath}
        basePath={ctx.config.basePath}
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface ProjectPageProps {
  site: SiteContent;
  page: ProjectsContent;
  project: Project;
  projectIndex: number;
  sourcePath: string;
  basePath: string;
  inlineEditing: boolean;
}

export function ProjectPage(
  { site, page, project, projectIndex, sourcePath, basePath, inlineEditing }:
    ProjectPageProps,
) {
  const metaTitle = project.name + " — " + site.author;

  return (
    <>
      <PageMeta title={metaTitle} description={plainText(project.summary)} />

      <ProjectArticle
        project={project}
        kindLabels={page.kindLabels}
        ficheLabels={page.ficheLabels}
        galleryTitle={page.galleryTitle}
        galleryViewLabel={page.galleryViewLabel}
        visitLabel={page.visitLabel}
        backLabel={page.backLabel}
        basePath={basePath}
        sourcePath={sourcePath}
        projectIndex={projectIndex}
        inlineEditing={inlineEditing}
      />
    </>
  );
}
