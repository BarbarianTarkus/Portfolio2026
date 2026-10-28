import { site } from "../data/site.ts";
import { GitHubIcon, LinkedInIcon } from "./Icons.tsx";

interface FooterProps {
  /** Deployment prefix, e.g. "/Portfolio" ("" when served from the root). */
  basePath: string;
}

/**
 * Site footer with the social links and the CV shortcut. Fully static, so it is
 * a plain component rather than an island.
 */
export function Footer({ basePath }: FooterProps) {
  return (
    <footer>
      <nav aria-label="Redes y CV">
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
          <li>
            <a
              href={`${basePath}${site.cvPath}`}
              download
              aria-label="Descargar el CV en PDF"
            >
              CV
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
