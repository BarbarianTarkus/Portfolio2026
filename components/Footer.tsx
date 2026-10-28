import { site } from "../data/site.ts";
import { GitHubIcon, LinkedInIcon } from "./Icons.tsx";

/**
 * Site footer: one call to action and the colophon. Fully static, so it is a
 * plain component rather than an island. The CV is deliberately not hosted
 * here: it is the /experience page or LinkedIn.
 */
export function Footer() {
  return (
    <footer class="site-footer">
      <div class="shell">
        <div class="footer-cta">
          <div>
            <p class="eyebrow">Contacto</p>
            <a class="footer-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>

          <nav class="footer-social" aria-label="Redes">
            <ul>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label="Perfil de GitHub"
                >
                  <GitHubIcon />
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label="Perfil de LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p class="colophon">
          <span>{site.fullName} · {site.role}</span>
          <span>Badalona, Barcelona</span>
        </p>
      </div>
    </footer>
  );
}
