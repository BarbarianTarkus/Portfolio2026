import type { Project, ProjectKindLabels } from "../../lib/content.ts";
import { localizedHref, useLanguage } from "../../lib/i18n.tsx";
import { Markdown } from "../../lib/markdown.tsx";
import { TechStack } from "../TechTags.tsx";

interface WorkIndexProps {
  projects: Project[];
  kindLabels: ProjectKindLabels;
  basePath: string;
  /** Render only the first N rows (home selection). */
  limit?: number;
}

/** Numbered project rows: the scanning layer over the project fiches. */
export function WorkIndex(
  { projects, kindLabels, basePath, limit }: WorkIndexProps,
) {
  const lang = useLanguage();
  const rows = limit === undefined ? projects : projects.slice(0, limit);

  return (
    <ol class="work-index">
      {rows.map((project) => (
        <li key={project.slug}>
          {
            /*
            No `aria-label`: an explicit name would hide the year, the kind
            and the summary from the accessible name, which fails WCAG 2.5.3
            (the visible label must appear in the accessible name). The row's
            own text is a fine name for the link.
          */
          }
          <a
            class="work-row"
            href={localizedHref(basePath, lang, "/projects#" + project.slug)}
          >
            <span class="work-year">
              {project.year}
            </span>
            <span>
              <span class="work-title">
                <span class="work-name">{project.name}</span>
                <span class="kind">
                  {kindLabels[project.kind]}
                </span>
              </span>
              <span class="work-summary">
                <Markdown
                  text={project.summary}
                  basePath={basePath}
                  links={false}
                />
              </span>
            </span>
            <TechStack tags={project.tags} class="work-stack" linked={false} />
            <span class="work-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
