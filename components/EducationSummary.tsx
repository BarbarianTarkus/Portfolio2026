import type { EducationEntry } from "../lib/content.ts";
import { localizedHref, useLanguage } from "../lib/i18n.tsx";
import { ProseField } from "../lib/markdown.tsx";

interface EducationSummaryProps {
  education: EducationEntry;
  basePath: string;
  /** File that holds the education copy (the experience page). */
  sourcePath: string;
  editing: boolean;
}

/**
 * Compact education entry shared by the home and about pages.
 *
 * It reads the same `education` block as /experience and renders only the
 * period, degree, university and summary. The full coursework detail stays on
 * the experience page, linked from the section heading.
 */
export function EducationSummary(
  { education, basePath, sourcePath, editing }: EducationSummaryProps,
) {
  const lang = useLanguage();
  const detailHref = localizedHref(basePath, lang, "/experience#education");

  return (
    <ol class="job-list education-list">
      <li class="education-row">
        <div class="education-main">
          <h3 class="job-role">
            <a class="education-link" href={detailHref}>
              <ProseField
                text={education.role}
                path="education.role"
                sourcePath={sourcePath}
                editing={editing}
              />
            </a>
          </h3>
          <p class="job-company">
            <ProseField
              text={education.company}
              path="education.company"
              sourcePath={sourcePath}
              editing={editing}
            />
          </p>
          {education.summary !== undefined && (
            <p class="job-summary">
              <ProseField
                text={education.summary}
                basePath={basePath}
                path="education.summary"
                sourcePath={sourcePath}
                editing={editing}
              />
            </p>
          )}
        </div>
        <div class="education-meta">
          <p class="job-period">
            <ProseField
              text={education.period}
              path="education.period"
              sourcePath={sourcePath}
              editing={editing}
            />
          </p>
          {education.logo !== undefined && (
            <a
              class={education.logoWide === true
                ? "job-brand is-wide"
                : "job-brand"}
              href={education.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={education.company}
              title={education.company}
            >
              <img
                src={basePath + education.logo}
                alt=""
                width={education.logoWide === true ? 120 : 48}
                height={education.logoWide === true ? 20 : 48}
                loading="lazy"
                decoding="async"
              />
            </a>
          )}
        </div>
      </li>
    </ol>
  );
}
