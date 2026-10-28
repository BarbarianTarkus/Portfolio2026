import { Head } from "fresh/runtime";
import { ProjectFiche } from "../components/ProjectFiche.tsx";
import type { ProjectsContent, SiteContent } from "../lib/content.ts";
import { loadProjectsPage } from "../lib/content.ts";
import { TinaIsland } from "../lib/tina/island.tsx";
import { tinaField } from "../lib/tina/metadata.ts";
import { define } from "../utils.ts";

/**
 * Public repositories, deliberately separated from work history: nothing here
 * is an employment record, and the page says so before the first fiche. The
 * route owns the index table and the sticky rail; the fiche markup lives in
 * components/ProjectFiche.tsx.
 */
export const handler = define.handlers({
  GET(ctx) {
    const { site, page } = loadProjectsPage(ctx);
    return ctx.render(
      <TinaIsland name="projects" basePath={ctx.config.basePath}>
        <ProjectsPage site={site} page={page} />
      </TinaIsland>,
    );
  },
});

interface ProjectsPageProps {
  site: SiteContent;
  page: ProjectsContent;
}

export function ProjectsPage({ site, page }: ProjectsPageProps) {
  const metaTitle = page.meta.title + " — " + site.author;
  const kindLabels = page.kindLabels;

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

      <ol class="work-index">
        {page.projects.map((project) => (
          <li key={project.slug} data-tina-field={tinaField(project)}>
            <a
              class="work-row"
              href={"#" + project.slug}
              aria-label={project.name + " — " +
                kindLabels[project.kind as keyof typeof kindLabels]}
              data-tina-field={tinaField(project, "name")}
            >
              <span
                class="work-year"
                data-tina-field={tinaField(project, "year")}
              >
                {project.year}
              </span>
              <span>
                <span class="work-title">
                  <span class="work-name">{project.name}</span>
                  <span
                    class="kind"
                    data-tina-field={tinaField(
                      kindLabels,
                      project.kind as string,
                    )}
                  >
                    {kindLabels[project.kind as keyof typeof kindLabels]}
                  </span>
                </span>
                <span
                  class="work-summary"
                  data-tina-field={tinaField(project, "summary")}
                >
                  {project.summary}
                </span>
              </span>
              <span
                class="work-stack"
                data-tina-field={tinaField(project, "tags")}
              >
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
          data-tina-field={tinaField(page, "indexAriaLabel")}
        >
          <p
            class="eyebrow"
            data-tina-field={tinaField(page, "fichesEyebrow")}
          >
            {page.fichesEyebrow}
          </p>
          <ol>
            {page.projects.map((project, index) => (
              <li key={project.slug}>
                <a
                  href={"#" + project.slug}
                  data-tina-field={tinaField(project, "name")}
                >
                  {String(index + 1).padStart(2, "0")} · {project.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {page.projects.map((project) => (
            <ProjectFiche
              project={project}
              kindLabels={kindLabels}
              ficheLabels={page.ficheLabels}
              key={project.slug}
            />
          ))}
        </div>
      </div>
    </>
  );
}
