import { GitHubIcon, LinkedInIcon } from "./Icons.tsx";
import type { SiteContent } from "../lib/content.ts";

/**
 * Site footer: one call to action and the colophon. Fully static, so it is a
 * plain component rather than an island.
 */
export function Footer({ site }: { site: SiteContent }) {
  return (
    <footer class="site-footer">
      <div class="shell">
        <div class="footer-cta">
          <div>
            <p class="eyebrow">
              {site.labels.contactEyebrow}
            </p>
            <a
              class="footer-mail"
              href={"mailto:" + site.email}
            >
              {site.email}
            </a>
          </div>

          <nav
            class="footer-social"
            aria-label={site.labels.socialNav}
          >
            <ul>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={site.labels.githubProfile}
                >
                  <GitHubIcon />
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={site.labels.linkedinProfile}
                >
                  <LinkedInIcon />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p class="colophon">
          <span>
            <span>
              {site.fullName}
            </span>
            {" · "}
            <span>{site.role}</span>
          </span>
          <span>
            {site.labels.location}
          </span>
        </p>
      </div>
    </footer>
  );
}
