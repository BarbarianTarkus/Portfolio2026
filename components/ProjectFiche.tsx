import type { ComponentChildren } from "preact";
import type { ProjectsContent } from "../lib/content.ts";
import { tinaField } from "../lib/tina/metadata.ts";

type Project = ProjectsContent["projects"][number];
type KindLabels = ProjectsContent["kindLabels"];
type FicheLabels = ProjectsContent["ficheLabels"];

interface FicheBlockProps {
  /** Heading rendered as the block's h3. */
  title: string;
  /** Tina field marker for the heading. */
  headingField?: string;
  children: ComponentChildren;
}

/**
 * One titled section of a project fiche. The narrative sections and the
 * decisions list share this wrapper, so the block markup is written once.
 */
function FicheBlock({ title, headingField, children }: FicheBlockProps) {
  return (
    <div class="fiche-block">
      <h3 data-tina-field={headingField}>{title}</h3>
      {children}
    </div>
  );
}

interface ProjectFicheProps {
  project: Project;
  kindLabels: KindLabels;
  ficheLabels: FicheLabels;
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
  { project, kindLabels, ficheLabels }: ProjectFicheProps,
) {
  const kindLabel = kindLabels[project.kind as keyof KindLabels] ??
    project.kind;
  const blocks: ComponentChildren[] = [];

  blocks.push(
    <FicheBlock
      title={ficheLabels.problem}
      headingField={tinaField(ficheLabels, "problem")}
    >
      <p data-tina-field={tinaField(project, "problem")}>{project.problem}</p>
    </FicheBlock>,
  );

  blocks.push(
    <FicheBlock
      title={ficheLabels.decisions}
      headingField={tinaField(ficheLabels, "decisions")}
    >
      <ul class="fiche-list">
        {project.decisions.map((decision, index) => (
          <li
            key={decision}
            data-tina-field={tinaField(project, "decisions", index)}
          >
            {decision}
          </li>
        ))}
      </ul>
    </FicheBlock>,
  );

  if (project.broke !== undefined) {
    blocks.push(
      <blockquote class="fiche-quote">
        <h3 data-tina-field={tinaField(ficheLabels, "broke")}>
          {ficheLabels.broke}
        </h3>
        <p data-tina-field={tinaField(project, "broke")}>{project.broke}</p>
      </blockquote>,
    );
  }

  if (project.next !== undefined) {
    blocks.push(
      <FicheBlock
        title={ficheLabels.next}
        headingField={tinaField(ficheLabels, "next")}
      >
        <p data-tina-field={tinaField(project, "next")}>{project.next}</p>
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
      <p
        class="fiche-kind"
        data-tina-field={tinaField(kindLabels, project.kind as string)}
      >
        {kindLabel}
      </p>
      <h2
        class="fiche-title"
        id={project.slug + "-title"}
        data-tina-field={tinaField(project, "name")}
      >
        {project.name}
      </h2>
      <p class="fiche-meta">
        <span data-tina-field={tinaField(project, "period")}>
          {project.period}
        </span>
        {project.work !== undefined && (
          <span data-tina-field={tinaField(project, "work")}>
            {project.work}
          </span>
        )}
      </p>

      <p
        class="fiche-summary"
        data-tina-field={tinaField(project, "summary")}
      >
        {project.summary}
      </p>

      <ul class="tag-list">
        {project.tags.map((tag, index) => (
          <li
            class="tag"
            key={tag}
            data-tina-field={tinaField(project, "tags", index)}
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
            data-tina-field={tinaField(link, "label")}
          >
            {link.label} <span aria-hidden="true">→</span>
          </a>
        ))}
      </p>
    </article>
  );
}
