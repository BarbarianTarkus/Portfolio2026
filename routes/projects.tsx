import { Head } from "fresh/runtime";
import { projectKindLabels, projects, site } from "../data/site.ts";
import { ProjectFiche } from "../components/ProjectFiche.tsx";
import { define } from "../utils.ts";

/**
 * Public repositories, deliberately separated from work history: nothing here
 * is an employment record, and the page says so before the first fiche. The
 * route owns the index table and the sticky rail; the fiche markup lives in
 * `components/ProjectFiche.tsx`.
 */
const pageDescription =
  "Repositorios públicos de Ricardo Verduguez: trabajo para cliente, proyectos académicos y herramientas propias, con el problema, las decisiones y lo que se rompió.";

export default define.page(function Projects(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>Proyectos — {site.author}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`Proyectos — ${site.author}`} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <h1 class="page-title">Proyectos</h1>
      <p class="page-lede">
        Repositorios públicos, no historial laboral. Aquí está lo que se puede
        leer en GitHub —trabajo para cliente, proyectos de la carrera y
        herramientas propias—; el trabajo en producción está en{" "}
        <a href={`${basePath}/experience`}>experiencia</a>.
      </p>

      <ol class="work-index">
        {projects.map((project) => (
          <li key={project.slug}>
            <a
              class="work-row"
              href={`#${project.slug}`}
              aria-label={`${project.name} — ${
                projectKindLabels[project.kind]
              }`}
            >
              <span class="work-year">{project.year}</span>
              <span>
                <span class="work-title">
                  <span class="work-name">{project.name}</span>
                  <span class="kind">{projectKindLabels[project.kind]}</span>
                </span>
                <span class="work-summary">{project.summary}</span>
              </span>
              <span class="work-stack">{project.tags.join(" · ")}</span>
              <span class="work-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>

      <div class="fiche-layout">
        <nav class="fiche-rail" aria-label="Índice de proyectos">
          <p class="eyebrow">Fichas</p>
          <ol>
            {projects.map((project, index) => (
              <li key={project.slug}>
                <a href={`#${project.slug}`}>
                  {String(index + 1).padStart(2, "0")} · {project.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {projects.map((project) => (
            <ProjectFiche project={project} key={project.slug} />
          ))}
        </div>
      </div>
    </>
  );
});
