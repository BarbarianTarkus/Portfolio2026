import type { JobEntry } from "../../lib/content.ts";
import { Markdown } from "../../lib/markdown.tsx";
import { plainText } from "../../lib/plain-text.ts";
import { TechStack } from "../TechTags.tsx";

interface ExperienceBoardProps {
  jobs: JobEntry[];
  basePath: string;
  /** Language-aware /experience URL; each column appends its job anchor. */
  experienceHref: string;
}

/**
 * Compact three-column work board for the home page: period, role, one
 * representative bullet and the job's first four technologies. The full
 * timeline with every bullet and linked work project stays on /experience.
 *
 * Every column jumps to its own row on /experience: the role heading is the
 * real anchor and a stretched overlay makes the whole column clickable, while
 * the brand mark keeps its own external link on top.
 */
export function ExperienceBoard(
  { jobs, basePath, experienceHref }: ExperienceBoardProps,
) {
  return (
    <ol class="experience-board">
      {jobs.map((job) => {
        const point = job.bullets[0] ?? job.summary;
        // A wordmark is at least five times wider than tall, so it gets its own
        // slot; square marks keep the 40px box.
        const wide = job.logoWide === true;
        const brandClass = wide
          ? "experience-brand is-wide"
          : "experience-brand";
        const href = job.slug === undefined
          ? undefined
          : experienceHref + "#" + job.slug;
        const logo = job.logo === undefined ? undefined : (
          <img
            src={basePath + job.logo}
            alt=""
            width={wide ? 128 : 40}
            height={wide ? 22 : 40}
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
                ? <span class={brandClass}>{logo}</span>
                : (
                  <a
                    class={brandClass}
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
              {href === undefined
                ? <Markdown text={job.role} basePath={basePath} links={false} />
                : (
                  <a class="experience-link" href={href}>
                    <Markdown
                      text={job.role}
                      basePath={basePath}
                      links={false}
                    />
                    <span class="sr-only">
                      {" — " + plainText(job.company)}
                    </span>
                  </a>
                )}
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
