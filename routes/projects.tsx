import { ProseField } from "../lib/markdown.tsx";
import type { ProjectsContent, SiteContent } from "../lib/content.ts";
import { loadProjectsPage } from "../lib/content.ts";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { HomelabHero } from "../components/projects/HomelabHero.tsx";
import { ProjectCard } from "../components/projects/ProjectCard.tsx";
import { define } from "../utils.ts";

/**
 * Public repositories, deliberately separated from work history: nothing here
 * is an employment record. The page is a two-column card grid, newest first:
 * each card shows an impact image and a short summary, and its own link opens
 * the full article with the problem, the decisions and the captures.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, sourcePath } = await loadProjectsPage(ctx);
    return ctx.render(
      <ProjectsPage
        site={site}
        page={page}
        sourcePath={sourcePath}
        basePath={ctx.config.basePath}
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface ProjectsPageProps {
  site: SiteContent;
  page: ProjectsContent;
  sourcePath: string;
  basePath: string;
  inlineEditing: boolean;
}

export function ProjectsPage(
  { site, page, sourcePath, basePath, inlineEditing }: ProjectsPageProps,
) {
  const metaTitle = page.meta.title + " — " + site.author;
  const kindLabels = page.kindLabels;

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

      <HomelabHero
        content={page.homelab}
        tags={site.homelabStack}
        basePath={basePath}
        sourcePath={sourcePath}
        inlineEditing={inlineEditing}
      />

      <div class="project-grid">
        {page.projects.map((project, index) => (
          <ProjectCard
            project={project}
            kindLabels={kindLabels}
            detailsLabel={page.detailsLabel}
            galleryViewLabel={page.galleryViewLabel}
            visitLabel={page.visitLabel}
            basePath={basePath}
            sourcePath={sourcePath}
            inlineEditing={inlineEditing}
            projectIndex={index}
            eagerCover={index < 2}
            key={project.slug}
          />
        ))}
      </div>
    </>
  );
}
