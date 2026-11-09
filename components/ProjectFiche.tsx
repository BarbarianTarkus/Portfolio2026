import type { ComponentChildren } from "preact";
import type { ProjectsContent } from "../lib/content.ts";
import { ProseField } from "../lib/markdown.tsx";
import { TechStack } from "./TechTags.tsx";

type Project = ProjectsContent["projects"][number];
type KindLabels = ProjectsContent["kindLabels"];
type FicheLabels = ProjectsContent["ficheLabels"];

interface FicheBlockProps {
  /** Heading rendered as the block's h3. */
  title: string;
  children: ComponentChildren;
}

/**
 * One titled section of a project fiche. The narrative sections and the
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

interface ProjectGalleryProps {
  images: NonNullable<Project["images"]>;
  basePath: string;
  projectName: string;
}

/**
 * Screenshot slider for one fiche.
 *
 * Every capture is server-rendered into the horizontal track, so the static
 * export keeps all the content (and works with JavaScript disabled as a plain
 * horizontal scroller). static/js/gallery.js only adds the arrows and counter
 * on top; it is not needed to read the page.
 */
function ProjectGallery(
  { images, basePath, projectName }: ProjectGalleryProps,
) {
  const count = images.length;
  const slider = count > 1;

  return (
    <section
      class="fiche-gallery"
      data-gallery
      aria-label={"Capturas de " + projectName}
    >
      <div
        class="gallery-track"
        data-gallery-track
        tabindex={slider ? 0 : undefined}
        aria-label={slider
          ? "Carrusel de capturas de " + projectName
          : undefined}
      >
        {images.map((image, index) => (
          <figure
            class="gallery-slide"
            data-gallery-slide
            key={image.src}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={(index + 1) + " de " + count}
          >
            <div class="gallery-media">
              <img
                src={image.src.startsWith("http")
                  ? image.src
                  : basePath + image.src}
                alt={image.alt}
                loading={index === 0 ? "eager" : "lazy"}
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
            aria-label="Captura anterior"
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
            aria-label="Captura siguiente"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  );
}

interface ProjectFicheProps {
  project: Project;
  kindLabels: KindLabels;
  ficheLabels: FicheLabels;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
  projectIndex: number;
}

/**
 * Full fiche for one project: kind, period, verified work count, summary, tags,
 * the problem, the technical decisions and the optional "what broke" / "what I
 * would do differently" sections. It renders static markup only, so it is a
 * plain component rather than an island.
 *
 * "Qué se rompió" is a blockquote rather than another block: it is the most
 * honest paragraph in each fiche and the stylesheet gives it an accent rule.
 *
 * The route passes a key to this component (list identity) and the article
 * repeats it: Fresh turns an element's key into its data-frsh-key attribute,
 * so keeping it on the root node preserves the rendered HTML.
 */
export function ProjectFiche(
  {
    project,
    kindLabels,
    ficheLabels,
    basePath,
    sourcePath,
    inlineEditing,
    projectIndex,
  }: ProjectFicheProps,
) {
  const kindLabel = kindLabels[project.kind as keyof KindLabels] ??
    project.kind;
  const blocks: ComponentChildren[] = [];

  blocks.push(
    <FicheBlock
      title={ficheLabels.problem}
    >
      <p>
        <ProseField
          text={project.problem}
          basePath={basePath}
          path={`projects.${projectIndex}.problem`}
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>
    </FicheBlock>,
  );

  blocks.push(
    <FicheBlock
      title={ficheLabels.decisions}
    >
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
    </FicheBlock>,
  );

  if (project.broke !== undefined) {
    blocks.push(
      <blockquote class="fiche-quote">
        <h3>
          {ficheLabels.broke}
        </h3>
        <p>
          <ProseField
            text={project.broke}
            basePath={basePath}
            path={`projects.${projectIndex}.broke`}
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </p>
      </blockquote>,
    );
  }

  if (project.next !== undefined) {
    blocks.push(
      <FicheBlock
        title={ficheLabels.next}
      >
        <p>
          <ProseField
            text={project.next}
            basePath={basePath}
            path={`projects.${projectIndex}.next`}
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </p>
      </FicheBlock>,
    );
  }

  return (
    <article
      class="fiche"
      id={project.slug}
      key={project.slug}
      aria-labelledby={project.slug + "-title"}
    >
      <p class="fiche-kind">
        {kindLabel}
      </p>
      <h2
        class="fiche-title"
        id={project.slug + "-title"}
      >
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

      <p class="fiche-summary">
        <ProseField
          text={project.summary}
          basePath={basePath}
          path={`projects.${projectIndex}.summary`}
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>

      <TechStack tags={project.tags} />

      {project.images !== undefined && project.images.length > 0 && (
        <ProjectGallery
          images={project.images}
          basePath={basePath}
          projectName={project.name}
        />
      )}

      {blocks}

      <p class="fiche-links">
        {project.links.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            key={link.href}
          >
            {link.label} <span aria-hidden="true">→</span>
          </a>
        ))}
      </p>
    </article>
  );
}
