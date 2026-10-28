import type { ComponentChildren } from "preact";
import type { Project } from "../data/site.ts";

interface FicheBlockProps {
  /** Heading rendered as the block's `h3`. */
  title: string;
  /** Block body: a paragraph for prose sections, a list for the decisions. */
  children: ComponentChildren;
}

/**
 * One titled section of a project fiche. The narrative sections (problem, what
 * broke, what would be done differently) and the decisions list share this
 * wrapper, so the `div.fiche-block` markup is written once instead of four
 * times in the route.
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
}

/**
 * Full fiche for one project: header with the period and the verified work
 * count, summary, tags, the problem, the technical decisions and the optional
 * "what broke" / "what I would do differently" sections. It renders static
 * markup only, so it is a plain component rather than an island.
 *
 * The route passes a `key` to this component (list identity) and the `article`
 * repeats it: Fresh turns an element's `key` into its `data-frsh-key`
 * attribute, so keeping it on the root node preserves the rendered HTML.
 */
export function ProjectFiche({ project }: ProjectFicheProps) {
  return (
    <article class="project-fiche" id={project.slug} key={project.slug}>
      <div class="fiche-head">
        <h2>{project.name}</h2>
        <p class="fiche-meta">
          <span>{project.period}</span>
          {project.work !== undefined && <span>{project.work}</span>}
        </p>
      </div>

      <p class="fiche-summary">{project.summary}</p>

      <ul class="tag-list">
        {project.tags.map((tag) => <li class="tag" key={tag}>{tag}</li>)}
      </ul>

      <FicheBlock title="El problema">
        <p>{project.problem}</p>
      </FicheBlock>

      <FicheBlock title="Decisiones técnicas">
        <ul class="fiche-list">
          {project.decisions.map((decision) => (
            <li key={decision}>{decision}</li>
          ))}
        </ul>
      </FicheBlock>

      {project.broke !== undefined && (
        <FicheBlock title="Qué se rompió">
          <p>{project.broke}</p>
        </FicheBlock>
      )}

      {project.next !== undefined && (
        <FicheBlock title="Qué haría distinto">
          <p>{project.next}</p>
        </FicheBlock>
      )}

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
