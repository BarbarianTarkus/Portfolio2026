import { Head } from "fresh/runtime";
import { InlineText } from "../components/InlineText.tsx";
import type { ExperienceContent, SiteContent } from "../lib/content.ts";
import { loadExperiencePage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * The CV page. This is the site's primary page: full work history with
 * every bullet, then education. /about keeps the biography and the homelab.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page } = await loadExperiencePage(ctx);
    return ctx.render(
      <ExperiencePage
        site={site}
        page={page}
        basePath={ctx.config.basePath}
      />,
    );
  },
});

interface ExperiencePageProps {
  site: SiteContent;
  page: ExperienceContent;
  basePath: string;
}

export function ExperiencePage({ site, page, basePath }: ExperiencePageProps) {
  const metaTitle = page.meta.title + " — " + site.author;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta
          name="description"
          content={page.meta.description}
        />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={page.meta.description} />
      </Head>

      <h1 class="page-title">
        {page.title}
      </h1>
      <p class="page-lede">
        {page.lede}
      </p>

      <p class="page-meta">
        <a
          class="text-link"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
        >
          {page.linkedinLabel} <span aria-hidden="true">→</span>
        </a>
      </p>

      <div class="section-head">
        <span class="section-num">{page.jobsSection.num}</span>
        <h2 class="section-title">
          {page.jobsSection.title}
        </h2>
      </div>

      <ol class="job-list">
        {page.jobs.map((job) => (
          <li
            class="job"
            key={job.company + "-" + job.period}
          >
            <p class="job-period">
              {job.period}
            </p>
            <div>
              <h3 class="job-role">
                {job.role}
              </h3>
              <p class="job-company">
                <span>
                  {job.company}
                </span>
                {" · "}
                <span>
                  {job.place}
                </span>
              </p>
              <ul class="job-points">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
              <p class="job-stack">
                {job.stack.join(" · ")}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div class="section-head">
        <span class="section-num">{page.educationSection.num}</span>
        <h2 class="section-title">
          {page.educationSection.title}
        </h2>
      </div>

      <ol class="job-list">
        <li class="job">
          <p class="job-period">
            {page.education.period}
          </p>
          <div>
            <h3 class="job-role">
              {page.education.role}
            </h3>
            <p class="job-company">
              {page.education.company}
            </p>
          </div>
        </li>
      </ol>

      <div class="section-head">
        <span class="section-num">{page.outroSection.num}</span>
        <h2 class="section-title">
          {page.outroSection.title}
        </h2>
      </div>

      <p class="prose">
        <InlineText text={page.outro} basePath={basePath} />
      </p>
    </>
  );
}
