import { Head } from "fresh/runtime";
import { ProseField } from "../lib/markdown.tsx";
import { ProjectFiche } from "../components/ProjectFiche.tsx";
import type { ProjectsContent, SiteContent } from "../lib/content.ts";
import { loadProjectsPage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * Public repositories, deliberately separated from work history: nothing here
 * is an employment record, and the page says so before the first fiche. The
 * route owns the index table and the sticky rail; the fiche markup lives in
 * components/ProjectFiche.tsx.
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

      <ol class="work-index">
        {page.projects.map((project) => (
          <li key={project.slug}>
            <a
              class="work-row"
              href={"#" + project.slug}
              aria-label={project.name + " — " +
                kindLabels[project.kind as keyof typeof kindLabels]}
            >
              <span class="work-year">
                {project.year}
              </span>
              <span>
                <span class="work-title">
                  <span class="work-name">{project.name}</span>
                  <span class="kind">
                    {kindLabels[project.kind as keyof typeof kindLabels]}
                  </span>
                </span>
                <span class="work-summary">
                  {project.summary}
                </span>
              </span>
              <span class="work-stack">
                {project.tags.join(" · ")}
              </span>
              <span class="work-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>

      <div class="fiche-layout">
        <nav
          class="fiche-rail"
          aria-label={page.indexAriaLabel}
        >
          <p class="eyebrow">
            <ProseField
              text={page.fichesEyebrow}
              path="fichesEyebrow"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </p>
          <ol>
            {page.projects.map((project, index) => (
              <li key={project.slug}>
                <a
                  href={"#" + project.slug}
                >
                  {String(index + 1).padStart(2, "0")} · {project.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {page.projects.map((project, index) => (
            <ProjectFiche
              project={project}
              kindLabels={kindLabels}
              ficheLabels={page.ficheLabels}
              basePath={basePath}
              sourcePath={sourcePath}
              inlineEditing={inlineEditing}
              projectIndex={index}
              key={project.slug}
            />
          ))}
        </div>
      </div>
    </>
  );
}
