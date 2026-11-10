import type { Project, ProjectKindLabels } from "../../lib/content.ts";
import { localizedHref, useLanguage } from "../../lib/i18n.tsx";
import { Markdown } from "../../lib/markdown.tsx";
import { TechStack } from "../TechTags.tsx";

interface WorkIndexProps {
  projects: Project[];
  kindLabels: ProjectKindLabels;
  basePath: string;
}

/** Numbered project rows: the scanning layer over the project fiches. */
export function WorkIndex({ projects, kindLabels, basePath }: WorkIndexProps) {
  const lang = useLanguage();

  return (
    <ol class="work-index">
      {projects.map((project) => (
        <li key={project.slug}>
          <a
            class="work-row"
            href={localizedHref(basePath, lang, "/projects#" + project.slug)}
            aria-label={project.name + " — " + kindLabels[project.kind]}
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
