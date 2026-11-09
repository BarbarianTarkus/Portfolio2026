import { Head } from "fresh/runtime";
import { ProseField } from "../lib/markdown.tsx";
import { ProjectCard } from "../components/ProjectFiche.tsx";
import type { ProjectsContent, SiteContent } from "../lib/content.ts";
import { loadProjectsPage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * Public repositories, deliberately separated from work history: nothing here
 * is an employment record. The page is a two-column card grid, newest first:
 * each card shows an impact image and a short summary, and the problem,
 * decisions and screenshots stay behind a native "show more" disclosure.
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
        <ProseField
          text={page.lede}
          basePath={basePath}
          path="lede"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>

      <div class="project-grid">
        {page.projects.map((project, index) => (
          <ProjectCard
            project={project}
            kindLabels={kindLabels}
            ficheLabels={page.ficheLabels}
            detailsLabel={page.detailsLabel}
            detailsCloseLabel={page.detailsCloseLabel}
            galleryViewLabel={page.galleryViewLabel}
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
