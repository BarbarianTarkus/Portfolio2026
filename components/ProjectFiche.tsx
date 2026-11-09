import type { ComponentChildren } from "preact";
import type {
  Project,
  ProjectGalleryGroup,
  ProjectsContent,
} from "../lib/content.ts";
import { ProseField } from "../lib/markdown.tsx";
import { GitHubIcon } from "./Icons.tsx";
import { TechStack } from "./TechTags.tsx";

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

interface GalleryPanelProps {
  group: ProjectGalleryGroup;
  projectSlug: string;
  projectName: string;
  basePath: string;
  active: boolean;
  hasTabs: boolean;
  eager: boolean;
}

/**
 * One screenshot pack: a native horizontal scroller plus the controls that
 * static/js/gallery.js enables. Every capture is server-rendered, so the pack
 * remains readable without JavaScript.
 */
function GalleryPanel(
  {
    group,
    projectSlug,
    projectName,
    basePath,
    active,
    hasTabs,
    eager,
  }: GalleryPanelProps,
) {
  const count = group.images.length;
  const slider = count > 1;
  const panelId = projectSlug + "-gallery-" + group.view;
  const tabId = panelId + "-tab";

  return (
    <div
      class={"gallery-panel" + (active ? " is-active" : "")}
      id={panelId}
      data-gallery-panel
      data-gallery-view={group.view}
      role={hasTabs ? "tabpanel" : "group"}
      aria-labelledby={hasTabs ? tabId : undefined}
      aria-label={hasTabs ? undefined : "Capturas de " + projectName}
    >
      <div
        class="gallery-track"
        data-gallery-track
        tabindex={slider ? 0 : undefined}
        aria-label={slider
          ? "Carrusel de capturas de " + projectName + " (" + group.label + ")"
          : undefined}
      >
        {group.images.map((image, index) => (
          <figure
            class="gallery-slide"
            data-gallery-slide
            key={image.src}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={(index + 1) + " de " + count}
          >
            <div class="gallery-media">
              <a
                class="gallery-zoom"
                href={image.src.startsWith("http")
                  ? image.src
                  : basePath + image.src}
                target="_blank"
                rel="noopener noreferrer"
                data-gallery-zoom
                aria-label={"Ampliar captura: " + image.alt}
                title="Ampliar captura"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="M10.5 7.6v5.8M7.6 10.5h5.8" />
                  <path d="m15.4 15.4 5.1 5.1" />
                </svg>
              </a>
              <img
                src={image.src.startsWith("http")
                  ? image.src
                  : basePath + image.src}
                alt={image.alt}
                loading={eager && active && index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
            {image.caption !== undefined && (
              <figcaption>{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
      {slider && (
        <div class="gallery-controls" data-gallery-controls>
          <button
            class="gallery-button gallery-prev"
            type="button"
            data-gallery-prev
            aria-label={"Captura anterior de " + group.label}
          >
            <span aria-hidden="true">←</span>
          </button>
          <p class="gallery-counter" aria-live="polite">
            <span data-gallery-current>1</span> / {count}
          </p>
          <button
            class="gallery-button gallery-next"
            type="button"
            data-gallery-next
            aria-label={"Captura siguiente de " + group.label}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface ProjectGalleryProps {
  groups: ProjectGalleryGroup[];
  projectSlug: string;
  projectName: string;
  basePath: string;
  viewLabel: string;
  variant?: "cover";
  eager?: boolean;
}

/**
 * Screenshot slider with an optional Web/Mobile selector. The selector only
 * appears when JavaScript is available; without it, every pack is rendered
 * one after another as its own native scroller.
 */
function ProjectGallery(
  {
    groups,
    projectSlug,
    projectName,
    basePath,
    viewLabel,
    variant,
    eager = false,
  }: ProjectGalleryProps,
) {
  const packs = groups.filter((group) => group.images.length > 0);
  if (packs.length === 0) return null;
  const hasTabs = packs.length > 1;
  const className = variant === "cover"
    ? "project-gallery project-gallery--cover"
    : "project-gallery";

  return (
    <section class={className} data-gallery>
      {hasTabs && (
        <div
          class="gallery-switcher"
          data-gallery-switcher
          role="tablist"
          aria-label={viewLabel}
        >
          {packs.map((group, index) => (
            <button
              class="gallery-tab"
              type="button"
              role="tab"
              id={projectSlug + "-gallery-" + group.view + "-tab"}
              aria-controls={projectSlug + "-gallery-" + group.view}
              aria-selected={index === 0}
              tabindex={index === 0 ? 0 : -1}
              data-gallery-tab={group.view}
              key={group.view}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}
      {packs.map((group, index) => (
        <GalleryPanel
          group={group}
          projectSlug={projectSlug}
          projectName={projectName}
          basePath={basePath}
          active={index === 0}
          hasTabs={hasTabs}
          eager={eager}
          key={group.view}
        />
      ))}
      <dialog
        class="gallery-lightbox"
        data-gallery-lightbox
        aria-label={"Vista ampliada de capturas de " + projectName}
      >
        <div class="gallery-lightbox-frame">
          <button
            class="gallery-lightbox-close"
            type="button"
            data-gallery-lightbox-close
            aria-label="Cerrar vista ampliada"
            autofocus
          >
            <span aria-hidden="true">×</span>
          </button>
          <button
            class="gallery-lightbox-button gallery-lightbox-prev"
            type="button"
            data-gallery-lightbox-prev
            aria-label="Captura anterior"
          >
            <span aria-hidden="true">←</span>
          </button>
          <figure class="gallery-lightbox-media">
            <img data-gallery-lightbox-img alt="" decoding="async" />
            <figcaption data-gallery-lightbox-caption hidden></figcaption>
          </figure>
          <button
            class="gallery-lightbox-button gallery-lightbox-next"
            type="button"
            data-gallery-lightbox-next
            aria-label="Captura siguiente"
          >
            <span aria-hidden="true">→</span>
          </button>
          <p
            class="gallery-lightbox-counter"
            data-gallery-lightbox-counter
            aria-live="polite"
          >
          </p>
        </div>
      </dialog>
    </section>
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
