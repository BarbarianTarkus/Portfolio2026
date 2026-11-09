import type { ComponentChildren } from "preact";
import type { Project, ProjectsContent } from "../../lib/content.ts";
import { ProseField } from "../../lib/markdown.tsx";
import { GitHubIcon } from "../Icons.tsx";
import { TechStack } from "../TechTags.tsx";
import { ProjectGallery } from "./ProjectGallery.tsx";

type KindLabels = ProjectsContent["kindLabels"];
type FicheLabels = ProjectsContent["ficheLabels"];

interface FicheBlockProps {
  /** Heading rendered as the block's h3. */
  title: string;
  children: ComponentChildren;
}

/**
 * One titled section of a project's expanded details. The problem and the
 * decisions list share this wrapper, so the block markup is written once.
 */
function FicheBlock({ title, children }: FicheBlockProps) {
  return (
    <div class="fiche-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

interface ProjectMediaProps {
  project: Project;
  basePath: string;
  viewLabel: string;
  eager: boolean;
}

/**
 * The card's first-impact area: the screenshot slider itself, not a static
 * thumbnail. The Web/Mobile selector sits on top of the images, and the detail
 * block below contains text only. Projects without screenshots get a
 * typographic panel instead of an empty box, so the grid keeps its rhythm.
 */
function ProjectMedia(
  { project, basePath, viewLabel, eager }: ProjectMediaProps,
) {
  const packs = (project.gallery ?? []).filter((pack) =>
    pack.images.length > 0
  );

  if (packs.length === 0) {
    return (
      <div
        class="project-cover project-cover--empty"
        data-initial={project.name.slice(0, 1)}
        aria-hidden="true"
      >
        <span>{project.name}</span>
      </div>
    );
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
  ficheLabels: FicheLabels;
  detailsLabel: string;
  detailsCloseLabel: string;
  galleryViewLabel: string;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
  projectIndex: number;
  eagerCover: boolean;
}

/**
 * One project card. The cover, name, short description and stack stay
 * visible; the problem, technical decisions and screenshot packs live inside a
 * native `<details>`, so the page stays a two-column grid until the reader asks
 * for more.
 *
 * The route passes a key to this component (list identity) and the article
 * repeats it: Fresh turns an element's key into its data-frsh-key attribute,
 * so keeping it on the root node preserves the rendered HTML.
 */
export function ProjectCard(
  {
    project,
    kindLabels,
    ficheLabels,
    detailsLabel,
    detailsCloseLabel,
    galleryViewLabel,
    basePath,
    sourcePath,
    inlineEditing,
    projectIndex,
    eagerCover,
  }: ProjectCardProps,
) {
  const kindLabel = kindLabels[project.kind as keyof KindLabels] ??
    project.kind;

  return (
    <article
      class="project-card"
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
        <p class="fiche-kind">{kindLabel}</p>
        <h2 class="project-card-title" id={project.slug + "-title"}>
          <ProseField
            text={project.name}
            path={`projects.${projectIndex}.name`}
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </h2>
        <p class="fiche-meta">
          <span>
            <ProseField
              text={project.period}
              path={`projects.${projectIndex}.period`}
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </span>
          {project.work !== undefined && (
            <span>
              <ProseField
                text={project.work}
                path={`projects.${projectIndex}.work`}
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
            path={`projects.${projectIndex}.summary`}
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </p>

        <TechStack tags={project.tags} />

        {project.links.length > 0 && (
          <p class="project-card-links">
            {project.links.map((link) => {
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
        )}

        <details class="project-details">
          <summary>
            <span class="details-closed">{detailsLabel}</span>
            <span class="details-open">{detailsCloseLabel}</span>
          </summary>
          <div class="project-details-body">
            <FicheBlock title={ficheLabels.problem}>
              <p>
                <ProseField
                  text={project.problem}
                  basePath={basePath}
                  path={`projects.${projectIndex}.problem`}
                  sourcePath={sourcePath}
                  editing={inlineEditing}
                />
              </p>
            </FicheBlock>

            <FicheBlock title={ficheLabels.decisions}>
              <ul class="fiche-list">
                {project.decisions.map((decision, decisionIndex) => (
                  <li key={decision}>
                    <ProseField
                      text={decision}
                      basePath={basePath}
                      path={`projects.${projectIndex}.decisions.${decisionIndex}`}
                      sourcePath={sourcePath}
                      editing={inlineEditing}
                    />
                  </li>
                ))}
              </ul>
            </FicheBlock>
          </div>
        </details>
      </div>
    </article>
  );
}
