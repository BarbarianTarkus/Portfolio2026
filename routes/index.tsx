import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";

/** The three things the home page promises, each one linking to the detail. */
const archetypes = [
  {
    title: "Infraestructura y seguridad",
    body:
      "NAS, WireGuard y OpenVPN, Gitea, SonarQube y servicios publicados por túnel de Cloudflare, sin abrir puertos en el router.",
    href: "/about#homelab",
  },
  {
    title: "Desarrollo full-stack",
    body:
      "PHP, JavaScript y Moodle en producción; Svelte, Astro, Python, Rust y Deno en proyectos propios y en cliente.",
    href: "/projects",
  },
  {
    title: "Experiencia real",
    body:
      "2 años y 8 meses en 3iPunt, un verano de backend en 4DMOVIN y año y medio de soporte TIC en la UPC.",
    href: "/about#experiencia",
  },
];

export default define.page(function Home(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>{site.title}</title>
        <meta name="description" content={site.description} />
      </Head>

      <section class="hero">
        <p class="little-heading">Hola, me llamo</p>
        <h1 class="big-heading">{site.author}.</h1>
        <p class="big-heading-faded">{site.role}</p>
        <p class="resume-text">{site.intro}</p>

        <p class="hero-highlights">{site.highlights.join(" · ")}</p>

        <div class="hero-actions">
          <a class="button button-primary" href={`${basePath}/projects`}>
            Ver proyectos
          </a>
          <a
            class="button"
            href={`${basePath}${site.cvPath}`}
            download
          >
            Descargar CV
          </a>
        </div>
      </section>

      <h2 class="section-title">Qué hago</h2>
      <div class="archetype-grid">
        {archetypes.map((archetype) => (
          <a
            class="archetype-card"
            href={`${basePath}${archetype.href}`}
            key={archetype.href}
          >
            <h3>{archetype.title}</h3>
            <p>{archetype.body}</p>
            <span class="archetype-more" aria-hidden="true">Ver más →</span>
          </a>
        ))}
      </div>
    </>
  );
});
