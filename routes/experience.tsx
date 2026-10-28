import { Head } from "fresh/runtime";
import { experience, site } from "../data/site.ts";
import { define } from "../utils.ts";

/**
 * The CV page. This is the site's primary destination: full work history with
 * every bullet, then education. `/about` keeps the biography and the homelab.
 */
const pageDescription =
  "Experiencia laboral de Ricardo Verduguez: desarrollo full-stack en 3iPunt, backend PHP en 4DMOVIN y soporte TIC en la UPC, con formación en Ingeniería Informática.";

export default define.page(function Experience(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>Experiencia — {site.author}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`Experiencia — ${site.author}`} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <h1 class="page-title">Experiencia</h1>
      <p class="page-lede">
        Tres etapas, en orden inverso al calendario: desarrollo full-stack en
        producción, backend sobre un ERP en PHP y, antes, soporte TIC en la
        universidad. Es donde he aprendido lo que sé.
      </p>

      <p class="page-meta">
        <a
          class="text-link"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
        >
          LinkedIn <span aria-hidden="true">→</span>
        </a>
      </p>

      <div class="section-head">
        <span class="section-num">01</span>
        <h2 class="section-title">Experiencia laboral</h2>
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
                {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <p class="job-stack">{job.stack.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>

      <div class="section-head">
        <span class="section-num">02</span>
        <h2 class="section-title">Formación</h2>
      </div>

      <ol class="job-list">
        <li class="job">
          <p class="job-period">2017 — 2026</p>
          <div>
            <h3 class="job-role">Grado en Ingeniería Informática</h3>
            <p class="job-company">
              Universitat Politècnica de Catalunya (UPC) · EPSEVG, Vilanova i la
              Geltrú
            </p>
          </div>
        </li>
      </ol>

      <div class="section-head">
        <span class="section-num">03</span>
        <h2 class="section-title">Lo que hay detrás</h2>
      </div>

      <p class="prose">
        El detalle técnico de lo que he construido —problema, decisiones y lo
        que se rompió— está en{" "}
        <a href={`${basePath}/projects`}>
          la página de proyectos
        </a>. El homelab que mantengo en paralelo está en{" "}
        <a href={`${basePath}/about#homelab`}>sobre mí</a>.
      </p>
    </>
  );
});
