import { Head } from "fresh/runtime";
import type {
  ExperienceContent,
  HomeContent,
  ProjectsContent,
  SiteContent,
} from "../lib/content.ts";
import { loadHomePage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * Home page. Hierarchy is deliberate: the hero states who he is, the evidence
 * strip proves it, and work history comes before the public repositories — the
 * site argues from employment, not from side projects.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, experience, projects } = await loadHomePage(ctx);
    return ctx.render(
      <HomePage
        site={site}
        page={page}
        experience={experience}
        projects={projects}
        basePath={ctx.config.basePath}
      />,
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
        />
        <meta property="og:title" content={site.title} />
        <meta property="og:description" content={site.description} />
      </Head>

      <section class="hero">
        <p class="eyebrow">
          {page.eyebrow}
        </p>
        <h1 class="hero-name">
          {site.author}.
        </h1>
        <p class="hero-role">
          {site.role}
        </p>
        <p class="hero-intro">
          {site.intro}
        </p>

        <div class="hero-actions">
          <a
            class="button"
            href={basePath + page.primaryAction.route}
          >
            {page.primaryAction.label}
          </a>
          <a
            class="button button-ghost"
            href={basePath + page.secondaryAction.route}
          >
            {page.secondaryAction.label}
          </a>
        </div>
      </section>

      <ul class="evidence">
        {site.evidence.map((item) => (
          <li key={item.label}>
            <span class="evidence-value">
              {item.value}
            </span>
            <span class="evidence-label">
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div class="section-head">
        <span class="section-num">
          {page.experienceSection.num}
        </span>
        <h2 class="section-title">
          {page.experienceSection.title}
        </h2>
        <a
          class="section-link"
          href={basePath + page.experienceSection.linkRoute}
        >
          {page.experienceSection.linkLabel}
        </a>
      </div>

      <ol class="job-list">
        {experience.jobs.map((job) => (
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
                {job.bullets.slice(0, 2).map((bullet) => (
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
        <span class="section-num">{page.projectsSection.num}</span>
        <h2 class="section-title">
          {page.projectsSection.title}
        </h2>
        <a
          class="section-link"
          href={basePath + page.projectsSection.linkRoute}
        >
          {page.projectsSection.linkLabel}
        </a>
      </div>

      <p class="section-note">
        {page.projectsSection.note}
      </p>

      <ol class="work-index">
        {projects.projects.map((project) => (
          <li key={project.slug}>
            <a
              class="work-row"
              href={basePath + "/projects#" + project.slug}
              aria-label={project.name + " — " +
                kindLabels[project.kind as keyof typeof kindLabels]}
            >
              <span class="work-year">
                {project.year}
              </span>
              <span>
                <span class="work-title">
                  <span class="work-name">{project.name}</span>
                  <span class="kind">
                    {kindLabels[project.kind as keyof typeof kindLabels]}
                  </span>
                </span>
                <span class="work-summary">
                  {project.summary}
                </span>
              </span>
              <span class="work-stack">
                {project.tags.join(" · ")}
              </span>
              <span class="work-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>

      <div class="section-head">
        <span class="section-num">{page.stackSection.num}</span>
        <h2 class="section-title">
          {page.stackSection.title}
        </h2>
        <a
          class="section-link"
          href={basePath + page.stackSection.linkRoute}
        >
          {page.stackSection.linkLabel}
        </a>
      </div>

      <div class="stack-grid">
        <div>
          {page.focus.map((item) => (
            <div class="stack-block" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <div>
          <div class="stack-block">
            <h3>
              {page.stackSection.stackLabel}
            </h3>
            <ul class="chip-list">
              {page.stack.map((item) => (
                <li
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div class="stack-block">
            <h3>
              {page.stackSection.infrastructureLabel}
            </h3>
            <ul class="chip-list">
              {site.homelabStack.map((item) => (
                <li
                  key={item}
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
