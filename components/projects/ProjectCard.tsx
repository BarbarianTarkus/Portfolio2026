import type { Project, ProjectsContent } from "../../lib/content.ts";
import { localizedHref, useLanguage } from "../../lib/i18n.tsx";
import { ProseField } from "../../lib/markdown.tsx";
import { TechStack } from "../TechTags.tsx";
import { ProjectGallery } from "./ProjectGallery.tsx";
import { ProjectLinks } from "./ProjectLinks.tsx";

type KindLabels = ProjectsContent["kindLabels"];

interface ProjectMediaProps {
  project: Project;
  basePath: string;
  viewLabel: string;
  eager: boolean;
}

/**
 * The card's first-impact area: the screenshot slider itself, not a static
 * thumbnail. The Web/Mobile selector sits on top of the images, and the detail
 * block below contains text only. Projects without screenshots simply omit the
 * media block, so no empty frame is rendered.
 */
function ProjectMedia(
  { project, basePath, viewLabel, eager }: ProjectMediaProps,
) {
  const packs = (project.gallery ?? []).filter((pack) =>
    pack.images.length > 0
  );

  if (project.video !== undefined) {
    return (
      <div class="project-cover project-cover--video">
        <iframe
          src={project.video.embed}
          title={project.video.label}
          loading="lazy"
          allowFullScreen
          allow="encrypted-media; picture-in-picture"
          referrerpolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (packs.length === 0) {
    return null;
  }

  return (
    <div class="project-media">
      <ProjectGallery
        groups={packs}
        projectSlug={project.slug}
        projectName={project.name}
        basePath={basePath}
        viewLabel={viewLabel}
        variant="cover"
        eager={eager}
      />
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  kindLabels: KindLabels;
  detailsLabel: string;
  galleryViewLabel: string;
  visitLabel: string;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
  eagerCover: boolean;
}

/**
 * One project card: the impact image, the name, a short description and the
 * stack. The problem, the technical decisions and the captures live on the
 * project's own page, so the grid stays a scanning surface and every card
 * ends with the same link into its article.
 *
 * The route passes a key to this component (list identity) and the article
 * repeats it: Fresh turns an element's key into its data-frsh-key attribute,
 * so keeping it on the root node preserves the rendered HTML.
 */
export function ProjectCard(
  {
    project,
    kindLabels,
    detailsLabel,
    galleryViewLabel,
    visitLabel,
    basePath,
    sourcePath,
    inlineEditing,
    eagerCover,
  }: ProjectCardProps,
) {
  const lang = useLanguage();
  const kindLabel = kindLabels[project.kind as keyof KindLabels] ??
    project.kind;
  const demoLink = project.links.find((link) => link.kind === "demo");
  const titleField = (
    <ProseField
      text={project.name}
      path="name"
      sourcePath={sourcePath}
      editing={inlineEditing}
    />
  );

  return (
    <article
      class={project.featured === true
        ? "project-card project-card--featured"
        : "project-card"}
      id={project.slug}
      key={project.slug}
      aria-labelledby={project.slug + "-title"}
    >
      <ProjectMedia
        project={project}
        basePath={basePath}
        viewLabel={galleryViewLabel}
        eager={eagerCover}
      />

      <div class="project-card-body">
        <ProjectLinks
          project={project}
          basePath={basePath}
          visitLabel={visitLabel}
        />

        <p class="fiche-kind">{kindLabel}</p>
        <h2 class="project-card-title" id={project.slug + "-title"}>
          {demoLink !== undefined && !inlineEditing
            ? (
              <a
                class="project-card-title-link"
                href={demoLink.href}
                target="_blank"
                rel="noopener noreferrer"
                title={demoLink.label}
              >
                {titleField}
              </a>
            )
            : titleField}
        </h2>
        <p class="fiche-meta">
          <span>
            <ProseField
              text={project.period}
              path="period"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </span>
          {project.work !== undefined && (
            <span>
              <ProseField
                text={project.work}
                path="work"
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </span>
          )}
        </p>

        <p class="project-card-summary">
          <ProseField
            text={project.summary}
            basePath={basePath}
            path="summary"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </p>

        <TechStack tags={project.tags} />

        <a
          class="project-more"
          href={localizedHref(
            basePath,
            lang,
            "/projects/" + project.slug + "/",
          )}
        >
          {detailsLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
