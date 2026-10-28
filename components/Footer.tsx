import { site } from "../data/site.ts";
import { GitHubIcon, LinkedInIcon } from "./Icons.tsx";

/**
 * Site footer with the social links. Fully static, so it is a plain component
 * rather than an island. The CV is deliberately not hosted here: it is shared
 * on request through LinkedIn instead.
 */
export function Footer() {
  return (
    <footer>
      <nav aria-label="Redes">
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
    </footer>
  );
}
