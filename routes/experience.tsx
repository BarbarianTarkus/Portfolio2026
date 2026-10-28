import { Head } from "fresh/runtime";
import { InlineText } from "../components/InlineText.tsx";
import type { ExperienceContent, SiteContent } from "../lib/content.ts";
import { loadExperiencePage } from "../lib/content.ts";
import { TinaIsland } from "../lib/tina/island.tsx";
import { tinaField } from "../lib/tina/metadata.ts";
import { define } from "../utils.ts";

/**
 * The CV page. This is the site's primary destination: full work history with
 * every bullet, then education. /about keeps the biography and the homelab.
 */
export const handler = define.handlers({
  GET(ctx) {
    const { site, page } = loadExperiencePage(ctx);
    return ctx.render(
      <TinaIsland name="experience" basePath={ctx.config.basePath}>
        <ExperiencePage
          site={site}
          page={page}
          basePath={ctx.config.basePath}
        />
      </TinaIsland>,
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
          data-tina-field={tinaField(page.meta, "description")}
        />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={page.meta.description} />
      </Head>

      <h1 class="page-title" data-tina-field={tinaField(page, "title")}>
        {page.title}
      </h1>
      <p class="page-lede" data-tina-field={tinaField(page, "lede")}>
        {page.lede}
      </p>

      <p class="page-meta">
        <a
          class="text-link"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
          data-tina-field={tinaField(page, "linkedinLabel")}
        >
          {page.linkedinLabel} <span aria-hidden="true">→</span>
        </a>
      </p>

      <div class="section-head">
        <span class="section-num">{page.jobsSection.num}</span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.jobsSection, "title")}
        >
          {page.jobsSection.title}
        </h2>
      </div>

      <ol class="job-list">
        {page.jobs.map((job) => (
          <li
            class="job"
            key={job.company + "-" + job.period}
            data-tina-field={tinaField(job)}
          >
            <p
              class="job-period"
              data-tina-field={tinaField(job, "period")}
            >
              {job.period}
            </p>
            <div>
              <h3
                class="job-role"
                data-tina-field={tinaField(job, "role")}
              >
                {job.role}
              </h3>
              <p class="job-company">
                <span data-tina-field={tinaField(job, "company")}>
                  {job.company}
                </span>
                {" · "}
                <span data-tina-field={tinaField(job, "place")}>
                  {job.place}
                </span>
              </p>
              <ul class="job-points">
                {job.bullets.map((bullet, index) => (
                  <li
                    key={bullet}
                    data-tina-field={tinaField(job, "bullets", index)}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
              <p class="job-stack" data-tina-field={tinaField(job, "stack")}>
                {job.stack.join(" · ")}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div class="section-head">
        <span class="section-num">{page.educationSection.num}</span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.educationSection, "title")}
        >
          {page.educationSection.title}
        </h2>
      </div>

      <ol class="job-list">
        <li class="job">
          <p
            class="job-period"
            data-tina-field={tinaField(page.education, "period")}
          >
            {page.education.period}
          </p>
          <div>
            <h3
              class="job-role"
              data-tina-field={tinaField(page.education, "role")}
            >
              {page.education.role}
            </h3>
            <p
              class="job-company"
              data-tina-field={tinaField(page.education, "company")}
            >
              {page.education.company}
            </p>
          </div>
        </li>
      </ol>

      <div class="section-head">
        <span class="section-num">{page.outroSection.num}</span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.outroSection, "title")}
        >
          {page.outroSection.title}
        </h2>
      </div>

      <p class="prose" data-tina-field={tinaField(page, "outro")}>
        <InlineText text={page.outro} basePath={basePath} />
      </p>
    </>
  );
}
