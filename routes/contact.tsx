import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";

/**
 * Contact as three rows. Each row is one link; the arrow is decorative and the
 * handle is the link text, so screen readers announce the destination once.
 */
const pageDescription =
  "Contacto de Ricardo Verduguez: correo electrónico, GitHub y LinkedIn.";

export default define.page(function Contact() {
  return (
    <>
      <Head>
        <title>Contacto — {site.author}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={`Contacto — ${site.author}`} />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <h1 class="page-title">Contacto</h1>
      <p class="page-lede">
        Estoy abierto a roles junior de desarrollo, sistemas o seguridad, y a
        proyectos donde las dos cosas se crucen. La forma más rápida de
        contactarme es esta:
      </p>

      <ul class="contact-rows">
        {site.email !== "" && (
          <li>
            <a class="contact-row" href={`mailto:${site.email}`}>
              <span class="contact-label">Correo</span>
              <span class="contact-value">{site.email}</span>
              <span class="contact-hint">
                Para cualquier cosa que no encaje en un issue de GitHub.
              </span>
              <span class="contact-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        )}

        <li>
          <a
            class="contact-row"
            href={site.github}
            target="_blank"
            rel="me noopener noreferrer"
          >
            <span class="contact-label">GitHub</span>
            <span class="contact-value">{site.githubHandle}</span>
            <span class="contact-hint">
              Código, experimentos y contribuciones en abierto.
            </span>
            <span class="contact-arrow" aria-hidden="true">→</span>
          </a>
        </li>

        <li>
          <a
            class="contact-row"
            href={site.linkedin}
            target="_blank"
            rel="me noopener noreferrer"
          >
            <span class="contact-label">LinkedIn</span>
            <span class="contact-value">{site.linkedinHandle}</span>
            <span class="contact-hint">
              Experiencia, estudios y novedades profesionales.
            </span>
            <span class="contact-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ul>
    </>
  );
});
