import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";
import { GitHubIcon, LinkedInIcon } from "../components/Icons.tsx";

export default define.page(function Contact() {
  return (
    <>
      <Head>
        <title>Contacto — {site.author}</title>
        <meta
          name="description"
          content="Contacto de Ricardo Verduguez: GitHub, LinkedIn y correo electrónico."
        />
      </Head>

      <h1 class="page-title">Contacto</h1>
      <p class="page-lede">
        Estoy abierto a roles junior de desarrollo, sistemas o seguridad, y a
        proyectos donde las dos cosas se crucen. La forma más rápida de
        contactarme es esta:
      </p>

      <div class="contact-grid">
        {site.email !== "" && (
          <a
            class="contact-card contact-card-wide"
            href={`mailto:${site.email}`}
          >
            <h2>Correo</h2>
            <p>Para cualquier cosa que no encaje en un issue de GitHub.</p>
            <span class="contact-handle">{site.email}</span>
          </a>
        )}

        <a
          class="contact-card"
          href={site.github}
          target="_blank"
          rel="me noopener noreferrer"
        >
          <GitHubIcon />
          <h2>GitHub</h2>
          <p>Código, experimentos y contribuciones en abierto.</p>
          <span class="contact-handle">{site.githubHandle}</span>
        </a>

        <a
          class="contact-card"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
        >
          <LinkedInIcon />
          <h2>LinkedIn</h2>
          <p>Experiencia, estudios y novedades profesionales.</p>
          <span class="contact-handle">{site.linkedinHandle}</span>
        </a>
      </div>
    </>
  );
});
