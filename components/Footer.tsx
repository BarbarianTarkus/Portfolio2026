import { GitHubIcon, LinkedInIcon } from "./Icons.tsx";
import type { SiteContent } from "../lib/content.ts";
import { tinaField } from "../lib/tina/metadata.ts";

/**
 * Site footer: one call to action and the colophon. Fully static, so it is a
 * plain component rather than an island. Every text node is annotated with a
 * Tina field marker so editors can click it in the admin preview.
 */
export function Footer({ site }: { site: SiteContent }) {
  return (
    <footer class="site-footer">
      <div class="shell">
        <div class="footer-cta">
          <div>
            <p
              class="eyebrow"
              data-tina-field={tinaField(site.labels, "contactEyebrow")}
            >
              {site.labels.contactEyebrow}
            </p>
            <a
              class="footer-mail"
              href={"mailto:" + site.email}
              data-tina-field={tinaField(site, "email")}
            >
              {site.email}
            </a>
          </div>

          <nav
            class="footer-social"
            aria-label={site.labels.socialNav}
            data-tina-field={tinaField(site.labels, "socialNav")}
          >
            <ul>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={site.labels.githubProfile}
                  data-tina-field={tinaField(site.labels, "githubProfile")}
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
                  data-tina-field={tinaField(site.labels, "linkedinProfile")}
                >
                  <LinkedInIcon />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p class="colophon">
          <span>
            <span data-tina-field={tinaField(site, "fullName")}>
              {site.fullName}
            </span>
            {" · "}
            <span data-tina-field={tinaField(site, "role")}>{site.role}</span>
          </span>
          <span data-tina-field={tinaField(site.labels, "location")}>
            {site.labels.location}
          </span>
        </p>
      </div>
    </footer>
  );
}
