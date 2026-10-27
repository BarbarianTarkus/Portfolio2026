import { site } from "../data/site.ts";
import { GitHubIcon, LinkedInIcon } from "./Icons.tsx";

/**
 * Site footer with the social links. Fully static, so it is a plain component
 * rather than an island.
 */
export function Footer() {
  return (
    <footer>
      <nav aria-label="Social links">
        <ul>
          <li>
            <a
              href={site.github}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="GitHub profile"
            >
              <GitHubIcon />
            </a>
          </li>
          <li>
            <a
              href={site.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon />
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
