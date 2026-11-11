import type { JobEntry } from "../../lib/content.ts";
import { Markdown } from "../../lib/markdown.tsx";
import { TechStack } from "../TechTags.tsx";

interface ExperienceBoardProps {
  jobs: JobEntry[];
  basePath: string;
}

/**
 * Compact three-column work board for the home page: period, role, one
 * representative bullet and the job's first four technologies. The full
 * timeline with every bullet and linked work project stays on /experience.
 */
export function ExperienceBoard({ jobs, basePath }: ExperienceBoardProps) {
  return (
    <ol class="experience-board">
      {jobs.map((job) => {
        const point = job.bullets[0] ?? job.summary;
        const logo = job.logo === undefined ? undefined : (
          <img
            src={basePath + job.logo}
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        );

        return (
          <li class="experience-column" key={job.company + "-" + job.period}>
            <div class="experience-top">
              <span class="experience-period">
                <Markdown text={job.period} basePath={basePath} links={false} />
              </span>
              {logo !== undefined && (job.url === undefined
                ? <span class="experience-brand">{logo}</span>
                : (
                  <a
                    class="experience-brand"
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={job.company}
                    title={job.company}
                  >
                    {logo}
                  </a>
                ))}
            </div>

            <h3 class="experience-role">
              <Markdown text={job.role} basePath={basePath} links={false} />
            </h3>
            <p class="experience-company">
              <Markdown text={job.company} basePath={basePath} links={false} />
              {", "}
              <Markdown text={job.place} basePath={basePath} links={false} />
            </p>

            {point !== undefined && (
              <p class="experience-point">
                <Markdown text={point} basePath={basePath} links={false} />
              </p>
            )}

            {job.stack.length > 0 && (
              <TechStack
                tags={job.stack.slice(0, 4)}
                class="experience-stack"
                linked={false}
                labeled
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
