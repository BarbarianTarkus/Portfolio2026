import type { ComponentChildren } from "preact";
import type { JobEntry } from "../lib/content.ts";
import { Markdown, ProseField } from "../lib/markdown.tsx";
import { JobProjects } from "./JobProjects.tsx";
import { TechStack } from "./TechTags.tsx";

interface JobListEdit {
  sourcePath: string;
  basePath: string;
  /** True for admin sessions; controls the inline-editor markers. */
  editing: boolean;
}

interface JobListProps {
  jobs: JobEntry[];
  /** Render only the first N bullets (home preview). */
  maxBullets?: number;
  /** Deployment prefix for Markdown links (read-only lists). */
  basePath?: string;
  /** Inline-edit wiring; omit for a read-only list. */
  edit?: JobListEdit;
}

/**
 * Work history rows. The home page renders the first two bullets of each job
 * read-only; /experience renders every bullet with inline editing.
 */
export function JobList(
  { jobs, maxBullets, basePath = "", edit }: JobListProps,
) {
  // The read-only list (home preview) still renders inline Markdown: bold
  // anchors must not leak as literal ** in the HTML. Only editors get the
  // ProseField wrapper that carries the raw source for inline editing.
  const field = (
    text: string,
    path: string,
    markdown = false,
  ): ComponentChildren =>
    edit === undefined
      ? <Markdown text={text} basePath={basePath} />
      : (
        <ProseField
          text={text}
          path={path}
          basePath={markdown ? edit.basePath : undefined}
          sourcePath={edit.sourcePath}
          editing={edit.editing}
        />
      );

  // The logo is a plain asset path, so the deployment prefix comes from
  // whichever caller knows it: the edit wiring on /experience, the prop on the
  // read-only home preview.
  const assetPrefix = edit?.basePath ?? basePath;

  return (
    <ol class="job-list">
      {jobs.map((job, index) => (
        <li
          class="job"
          id={job.slug}
          key={job.company + "-" + job.period}
        >
          <div class="job-aside">
            <p class="job-period">
              {field(job.period, "jobs." + index + ".period")}
            </p>
            {job.logo !== undefined && (
              <a
                class={job.logoWide === true
                  ? "job-brand is-wide"
                  : "job-brand"}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={job.company}
                title={job.company}
              >
                <img
                  src={assetPrefix + job.logo}
                  alt=""
                  width={job.logoWide === true ? 120 : 48}
                  height={job.logoWide === true ? 20 : 48}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )}
          </div>
          <div>
            <h3 class="job-role">
              {field(job.role, "jobs." + index + ".role")}
            </h3>
            <p class="job-company">
              <span>{field(job.company, "jobs." + index + ".company")}</span>
              {" · "}
              <span>{field(job.place, "jobs." + index + ".place")}</span>
            </p>
            {job.summary !== undefined && (
              <p class="job-summary">
                {field(job.summary, "jobs." + index + ".summary", true)}
              </p>
            )}
            <ul class="job-points">
              {(maxBullets === undefined
                ? job.bullets
                : job.bullets.slice(0, maxBullets)).map((
                  bullet,
                  bulletIndex,
                ) => (
                  <li key={bullet}>
                    {field(
                      bullet,
                      "jobs." + index + ".bullets." + bulletIndex,
                      true,
                    )}
                  </li>
                ))}
            </ul>
            {
              /* Work projects get their own article under
                 /experience/<company>/<project>/, so they are listed here
                 rather than in /projects. The home preview keeps the teaser
                 shape and lists only the bullets. */
            }
            {maxBullets === undefined && job.projects !== undefined &&
              job.projects.length > 0 && job.slug !== undefined && (
              <>
                {job.projectsLabel !== undefined && (
                  <p class="job-points-label">
                    {field(
                      job.projectsLabel,
                      "jobs." + index + ".projectsLabel",
                    )}
                  </p>
                )}
                <JobProjects
                  projects={job.projects}
                  company={job.slug}
                  basePath={assetPrefix}
                  sourcePath={edit?.sourcePath}
                  editing={edit?.editing}
                />
              </>
            )}
            <TechStack tags={job.stack} class="job-stack" labeled />
          </div>
        </li>
      ))}
    </ol>
  );
}
