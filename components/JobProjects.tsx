import type { WorkProject } from "../lib/content.ts";
import { localizedHref, useLanguage } from "../lib/i18n.tsx";
import { Markdown, ProseField } from "../lib/markdown.tsx";

interface JobProjectsProps {
  projects: WorkProject[];
  /** URL segment of the company that produced them ("3ipunt"). */
  company: string;
  basePath: string;
  /** Inline-edit wiring; omit for a read-only list. */
  sourcePath?: string;
  /** Index of the job, so inline edits address "jobs.<n>.projects.<m>.…". */
  jobIndex: number;
  editing?: boolean;
}

/**
 * Ships a job's projects as rows that lead to their own article. They are not
 * `/projects` cards: a work project is read as part of the job that produced
 * it, so the link leaves the timeline for `/experience/<company>/<project>/`
 * instead of mixing with the coursework and personal builds.
 */
export function JobProjects(
  {
    projects,
    company,
    basePath,
    sourcePath = "",
    jobIndex,
    editing = false,
  }: JobProjectsProps,
) {
  const lang = useLanguage();

  return (
    <ol class="job-projects">
      {projects.map((project, index) => (
        <li class="job-project" key={project.slug}>
          <a
            class="job-project-link"
            href={localizedHref(
              basePath,
              lang,
              `/experience/${company}/${project.slug}/`,
            )}
          >
            <span class="job-project-name">
              <ProseField
                text={project.name}
                path={`jobs.${jobIndex}.projects.${index}.name`}
                sourcePath={sourcePath}
                editing={editing}
              />
            </span>
            <span class="job-project-summary">
              {
                /* Inside the row link: the copy may bold a word, but a nested
                   anchor would be invalid HTML. */
              }
              <Markdown
                text={project.teaser ?? project.summary}
                basePath={basePath}
                links={false}
              />
            </span>
            <span class="job-project-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
