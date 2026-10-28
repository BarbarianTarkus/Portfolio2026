import { Head } from "fresh/runtime";
import { experience, projectKindLabels, projects, site } from "../data/site.ts";
import { define } from "../utils.ts";

/**
 * What the work actually covers. "Experiencia real" used to be a third card
 * here; it is now the first section of the page, so it is not repeated.
 */
const focus = [
  {
    title: "Infraestructura y seguridad",
    body:
      "NAS, WireGuard y OpenVPN, Gitea, SonarQube y servicios publicados por túnel de Cloudflare, sin abrir puertos en el router.",
  },
  {
    title: "Desarrollo full-stack",
    body:
      "PHP, JavaScript y Moodle en producción; Svelte, Astro, Python, Rust y Deno en proyectos propios y en cliente.",
  },
];

const stack = [
  "PHP",
  "JavaScript",
  "TypeScript",
  "Moodle",
  "Svelte",
  "Astro",
  "Python",
  "Rust",
  "Deno",
  "C++",
  "PostgreSQL",
  "Docker",
];

/**
 * Home page. Hierarchy is deliberate: the hero states who he is, the evidence
 * strip proves it, and work history comes before the public repositories — the
 * site argues from employment, not from side projects.
 */
export default define.page(function Home(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>{site.title}</title>
        <meta name="description" content={site.description} />
        <meta property="og:title" content={site.title} />
        <meta property="og:description" content={site.description} />
      </Head>

      <section class="hero">
        <p class="eyebrow">Hola, me llamo</p>
        <h1 class="hero-name">{site.author}.</h1>
        <p class="hero-role">{site.role}</p>
        <p class="hero-intro">{site.intro}</p>

        <div class="hero-actions">
          <a class="button" href={`${basePath}/experience`}>
            Ver experiencia
          </a>
          <a class="button button-ghost" href={`${basePath}/projects`}>
            Proyectos
          </a>
        </div>
      </section>

      <ul class="evidence">
        {site.evidence.map((item) => (
          <li key={item.label}>
            <span class="evidence-value">{item.value}</span>
            <span class="evidence-label">{item.label}</span>
          </li>
        ))}
      </ul>

      <div class="section-head">
        <span class="section-num">01</span>
        <h2 class="section-title">Experiencia laboral</h2>
        <a class="section-link" href={`${basePath}/experience`}>
          Ver el detalle
        </a>
      </div>

      <ol class="job-list">
        {experience.map((job) => (
          <li class="job" key={`${job.company}-${job.period}`}>
            <p class="job-period">{job.period}</p>
            <div>
              <h3 class="job-role">{job.role}</h3>
              <p class="job-company">
                {job.company} · {job.place}
              </p>
              <ul class="job-points">
                {job.bullets.slice(0, 2).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <p class="job-stack">{job.stack.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>

      <div class="section-head">
        <span class="section-num">02</span>
        <h2 class="section-title">Proyectos</h2>
        <a class="section-link" href={`${basePath}/projects`}>
          Los 5 proyectos
        </a>
      </div>

      <p class="section-note">
        Repositorios públicos: trabajo para cliente, proyectos de la carrera y
        herramientas propias. El trabajo en producción está en la experiencia,
        arriba.
      </p>

      <ol class="work-index">
        {projects.map((project) => (
          <li key={project.slug}>
            <a
              class="work-row"
              href={`${basePath}/projects#${project.slug}`}
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

      <div class="section-head">
        <span class="section-num">03</span>
        <h2 class="section-title">Stack y enfoque</h2>
        <a class="section-link" href={`${basePath}/about#homelab`}>
          El homelab
        </a>
      </div>

      <div class="stack-grid">
        <div>
          {focus.map((item) => (
            <div class="stack-block" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <div>
          <div class="stack-block">
            <h3>Stack</h3>
            <ul class="chip-list">
              {stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div class="stack-block">
            <h3>Infraestructura</h3>
            <ul class="chip-list">
              {site.homelabStack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
});
