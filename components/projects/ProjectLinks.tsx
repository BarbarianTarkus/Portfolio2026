import type { Project, ProjectLink } from "../../lib/content.ts";
import { GitHubIcon } from "../Icons.tsx";

interface LinkIconProps {
  link: ProjectLink;
  basePath: string;
}

/**
 * Icon shown inside the card's call to action: the linked page's own favicon
 * when the content provides one, the GitHub glyph for repositories, and an
 * arrow for any other site.
 */
function LinkIcon({ link, basePath }: LinkIconProps) {
  if (link.icon !== undefined) {
    return (
      <img
        class="project-link-favicon"
        src={basePath + link.icon}
        alt=""
        width="18"
        height="18"
        loading="lazy"
      />
    );
  }
  if (link.href.includes("github.com")) {
    return <GitHubIcon class="project-link-icon" />;
  }
  return <span class="project-link-glyph" aria-hidden="true">↗</span>;
}

interface ProjectLinksProps {
  project: Project;
  basePath: string;
  visitLabel: string;
}

/**
 * The action row shared by the card and the project page: one prominent call
 * to action (the demo when there is one, its repository otherwise), the
 * standalone diagram when the project ships one, and the remaining links as
 * text or as a GitHub glyph.
 */
export function ProjectLinks(
  { project, basePath, visitLabel }: ProjectLinksProps,
) {
  const demoLink = project.links.find((link) => link.kind === "demo");
  const repoLink = project.links.find((link) =>
    link.kind === "repo" || link.href.includes("github.com")
  );
  const ctaLink = demoLink ?? repoLink ?? project.links[0];
  const secondaryLinks = project.links.filter((link) => link !== ctaLink);

  if (
    ctaLink === undefined && project.diagram === undefined &&
    secondaryLinks.length === 0
  ) {
    return null;
  }

  return (
    <p class="project-links">
      {ctaLink !== undefined && (
        <a
          class="button project-link-cta"
          href={ctaLink.href}
          target="_blank"
          rel="noopener noreferrer"
          title={ctaLink.label}
        >
          <LinkIcon link={ctaLink} basePath={basePath} />
          {visitLabel}
        </a>
      )}
      {project.diagram !== undefined && (
        <a
          class="button button-ghost project-link-diagram"
          href={project.diagram.href.startsWith("http")
            ? project.diagram.href
            : basePath + project.diagram.href}
          target="_blank"
          rel="noopener noreferrer"
          title={project.diagram.label}
        >
          {project.diagram.label}
        </a>
      )}
      {secondaryLinks.map((link) => {
        const isRepo = link.href.includes("github.com");
        return (
          <a
            class={"project-link" + (isRepo ? " project-link--icon" : "")}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isRepo ? link.label : undefined}
            title={link.label}
            key={link.href}
          >
            {isRepo ? <GitHubIcon class="project-link-icon" /> : (
              <>
                {link.label} <span aria-hidden="true">→</span>
              </>
            )}
          </a>
        );
      })}
    </p>
  );
}
