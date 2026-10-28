import { Head } from "fresh/runtime";
import type {
  ExperienceContent,
  HomeContent,
  ProjectsContent,
  SiteContent,
} from "../lib/content.ts";
import { loadHomePage } from "../lib/content.ts";
import { TinaIsland } from "../lib/tina/island.tsx";
import { tinaField } from "../lib/tina/metadata.ts";
import { define } from "../utils.ts";

/**
 * Home page. Hierarchy is deliberate: the hero states who he is, the evidence
 * strip proves it, and work history comes before the public repositories — the
 * site argues from employment, not from side projects.
 */
export const handler = define.handlers({
  GET(ctx) {
    const { site, page, experience, projects } = loadHomePage(ctx);
    return ctx.render(
      <TinaIsland name="home" basePath={ctx.config.basePath}>
        <HomePage
          site={site}
          page={page}
          experience={experience}
          projects={projects}
          basePath={ctx.config.basePath}
        />
      </TinaIsland>,
    );
  },
});

interface HomePageProps {
  site: SiteContent;
  page: HomeContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  basePath: string;
}

export function HomePage(
  { site, page, experience, projects, basePath }: HomePageProps,
) {
  const kindLabels = projects.kindLabels;

  return (
    <>
      <Head>
        <title>{site.title}</title>
        <meta
          name="description"
          content={site.description}
          data-tina-field={tinaField(site, "description")}
        />
        <meta property="og:title" content={site.title} />
        <meta property="og:description" content={site.description} />
      </Head>

      <section class="hero">
        <p class="eyebrow" data-tina-field={tinaField(page, "eyebrow")}>
          {page.eyebrow}
        </p>
        <h1 class="hero-name" data-tina-field={tinaField(site, "author")}>
          {site.author}.
        </h1>
        <p class="hero-role" data-tina-field={tinaField(site, "role")}>
          {site.role}
        </p>
        <p class="hero-intro" data-tina-field={tinaField(site, "intro")}>
          {site.intro}
        </p>

        <div class="hero-actions">
          <a
            class="button"
            href={basePath + page.primaryAction.route}
            data-tina-field={tinaField(page.primaryAction, "label")}
          >
            {page.primaryAction.label}
          </a>
          <a
            class="button button-ghost"
            href={basePath + page.secondaryAction.route}
            data-tina-field={tinaField(page.secondaryAction, "label")}
          >
            {page.secondaryAction.label}
          </a>
        </div>
      </section>

      <ul class="evidence">
        {site.evidence.map((item) => (
          <li key={item.label} data-tina-field={tinaField(item)}>
            <span
              class="evidence-value"
              data-tina-field={tinaField(item, "value")}
            >
              {item.value}
            </span>
            <span
              class="evidence-label"
              data-tina-field={tinaField(item, "label")}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div class="section-head">
        <span class="section-num">
          {page.experienceSection.num}
        </span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.experienceSection, "title")}
        >
          {page.experienceSection.title}
        </h2>
        <a
          class="section-link"
          href={basePath + page.experienceSection.linkRoute}
          data-tina-field={tinaField(page.experienceSection, "linkLabel")}
        >
          {page.experienceSection.linkLabel}
        </a>
      </div>

      <ol class="job-list">
        {experience.jobs.map((job) => (
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
                {job.bullets.slice(0, 2).map((bullet, index) => (
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
        <span class="section-num">{page.projectsSection.num}</span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.projectsSection, "title")}
        >
          {page.projectsSection.title}
        </h2>
        <a
          class="section-link"
          href={basePath + page.projectsSection.linkRoute}
          data-tina-field={tinaField(page.projectsSection, "linkLabel")}
        >
          {page.projectsSection.linkLabel}
        </a>
      </div>

      <p
        class="section-note"
        data-tina-field={tinaField(page.projectsSection, "note")}
      >
        {page.projectsSection.note}
      </p>

      <ol class="work-index">
        {projects.projects.map((project) => (
          <li key={project.slug} data-tina-field={tinaField(project)}>
            <a
              class="work-row"
              href={basePath + "/projects#" + project.slug}
              aria-label={project.name + " — " +
                kindLabels[project.kind as keyof typeof kindLabels]}
              data-tina-field={tinaField(project, "name")}
            >
              <span
                class="work-year"
                data-tina-field={tinaField(project, "year")}
              >
                {project.year}
              </span>
              <span>
                <span class="work-title">
                  <span class="work-name">{project.name}</span>
                  <span
                    class="kind"
                    data-tina-field={tinaField(
                      kindLabels,
                      project.kind as string,
                    )}
                  >
                    {kindLabels[project.kind as keyof typeof kindLabels]}
                  </span>
                </span>
                <span
                  class="work-summary"
                  data-tina-field={tinaField(project, "summary")}
                >
                  {project.summary}
                </span>
              </span>
              <span
                class="work-stack"
                data-tina-field={tinaField(project, "tags")}
              >
                {project.tags.join(" · ")}
              </span>
              <span class="work-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>

      <div class="section-head">
        <span class="section-num">{page.stackSection.num}</span>
        <h2
          class="section-title"
          data-tina-field={tinaField(page.stackSection, "title")}
        >
          {page.stackSection.title}
        </h2>
        <a
          class="section-link"
          href={basePath + page.stackSection.linkRoute}
          data-tina-field={tinaField(page.stackSection, "linkLabel")}
        >
          {page.stackSection.linkLabel}
        </a>
      </div>

      <div class="stack-grid">
        <div>
          {page.focus.map((item) => (
            <div class="stack-block" key={item.title}>
              <h3 data-tina-field={tinaField(item, "title")}>{item.title}</h3>
              <p data-tina-field={tinaField(item, "body")}>{item.body}</p>
            </div>
          ))}
        </div>
        <div>
          <div class="stack-block">
            <h3 data-tina-field={tinaField(page.stackSection, "stackLabel")}>
              {page.stackSection.stackLabel}
            </h3>
            <ul class="chip-list">
              {page.stack.map((item, index) => (
                <li
                  key={item}
                  data-tina-field={tinaField(page, "stack", index)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div class="stack-block">
            <h3
              data-tina-field={tinaField(
                page.stackSection,
                "infrastructureLabel",
              )}
            >
              {page.stackSection.infrastructureLabel}
            </h3>
            <ul class="chip-list">
              {site.homelabStack.map((item, index) => (
                <li
                  key={item}
                  data-tina-field={tinaField(site, "homelabStack", index)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
