import { Head } from "fresh/runtime";
import { ProseField } from "../lib/markdown.tsx";
import type { ExperienceContent, SiteContent } from "../lib/content.ts";
import { loadExperiencePage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * The CV page. This is the site's primary page: full work history with
 * every bullet, then education. /about keeps the biography and the homelab.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, sourcePath } = await loadExperiencePage(ctx);
    return ctx.render(
      <ExperiencePage
        site={site}
        page={page}
        basePath={ctx.config.basePath}
        sourcePath={sourcePath}
        inlineEditing={ctx.state.inlineEditing === true}
      />,
    );
  },
});

interface ExperiencePageProps {
  site: SiteContent;
  page: ExperienceContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

export function ExperiencePage(
  { site, page, basePath, sourcePath, inlineEditing }: ExperiencePageProps,
) {
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
        <ProseField
          text={page.lede}
          basePath={basePath}
          path="lede"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>

      <p class="page-meta">
        <a
          class="text-link"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
        >
          <ProseField
            text={page.linkedinLabel}
            path="linkedinLabel"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />{" "}
          <span aria-hidden="true">→</span>
        </a>
      </p>

      <div class="section-head">
        <span class="section-num">{page.jobsSection.num}</span>
        <h2 class="section-title">
          <ProseField
            text={page.jobsSection.title}
            path="jobsSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </h2>
      </div>

      <ol class="job-list">
        {page.jobs.map((job, jobIndex) => (
          <li
            class="job"
            key={job.company + "-" + job.period}
          >
            <p class="job-period">
              <ProseField
                text={job.period}
                path={`jobs.${jobIndex}.period`}
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </p>
            <div>
              <h3 class="job-role">
                <ProseField
                  text={job.role}
                  path={`jobs.${jobIndex}.role`}
                  sourcePath={sourcePath}
                  editing={inlineEditing}
                />
              </h3>
              <p class="job-company">
                <span>
                  <ProseField
                    text={job.company}
                    path={`jobs.${jobIndex}.company`}
                    sourcePath={sourcePath}
                    editing={inlineEditing}
                  />
                </span>
                {" · "}
                <span>
                  <ProseField
                    text={job.place}
                    path={`jobs.${jobIndex}.place`}
                    sourcePath={sourcePath}
                    editing={inlineEditing}
                  />
                </span>
              </p>
              <ul class="job-points">
                {job.bullets.map((bullet, bulletIndex) => (
                  <li key={bullet}>
                    <ProseField
                      text={bullet}
                      basePath={basePath}
                      path={`jobs.${jobIndex}.bullets.${bulletIndex}`}
                      sourcePath={sourcePath}
                      editing={inlineEditing}
                    />
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
          <ProseField
            text={page.educationSection.title}
            path="educationSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </h2>
      </div>

      <ol class="job-list">
        <li class="job">
          <p class="job-period">
            <ProseField
              text={page.education.period}
              path="education.period"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </p>
          <div>
            <h3 class="job-role">
              <ProseField
                text={page.education.role}
                path="education.role"
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </h3>
            <p class="job-company">
              <ProseField
                text={page.education.company}
                path="education.company"
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </p>
          </div>
        </li>
      </ol>

      <div class="section-head">
        <span class="section-num">{page.outroSection.num}</span>
        <h2 class="section-title">
          <ProseField
            text={page.outroSection.title}
            path="outroSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </h2>
      </div>

      <p class="prose">
        <ProseField
          text={page.outro}
          basePath={basePath}
          path="outro"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>
    </>
  );
}
