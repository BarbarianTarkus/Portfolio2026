import type { ComponentChildren } from "preact";
import type { ProjectsContent } from "../lib/content.ts";
import { Markdown } from "../lib/markdown.tsx";

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

interface ProjectFicheProps {
  project: Project;
  kindLabels: KindLabels;
  ficheLabels: FicheLabels;
  basePath: string;
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
  { project, kindLabels, ficheLabels, basePath }: ProjectFicheProps,
) {
  const kindLabel = kindLabels[project.kind as keyof KindLabels] ??
    project.kind;
  const blocks: ComponentChildren[] = [];

  blocks.push(
    <FicheBlock
      title={ficheLabels.problem}
    >
      <p>
        <Markdown text={project.problem} basePath={basePath} />
      </p>
    </FicheBlock>,
  );

  blocks.push(
    <FicheBlock
      title={ficheLabels.decisions}
    >
      <ul class="fiche-list">
        {project.decisions.map((decision) => (
          <li key={decision}>
            <Markdown text={decision} basePath={basePath} />
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
          <Markdown text={project.broke} basePath={basePath} />
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
          <Markdown text={project.next} basePath={basePath} />
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
        {project.name}
      </h2>
      <p class="fiche-meta">
        <span>
          {project.period}
        </span>
        {project.work !== undefined && (
          <span>
            {project.work}
          </span>
        )}
      </p>

      <p class="fiche-summary">
        <Markdown text={project.summary} basePath={basePath} />
      </p>

      <ul class="tag-list">
        {project.tags.map((tag) => (
          <li
            class="tag"
            key={tag}
          >
            {tag}
          </li>
        ))}
      </ul>

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
