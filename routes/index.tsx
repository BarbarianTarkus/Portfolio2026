import { ProseField } from "../lib/markdown.tsx";
import type {
  ExperienceContent,
  HomeContent,
  ProjectsContent,
  SiteContent,
} from "../lib/content.ts";
import { loadHomePage } from "../lib/content.ts";
import { EvidenceStrip } from "../components/home/EvidenceStrip.tsx";
import { Hero } from "../components/home/Hero.tsx";
import { StackGrid } from "../components/home/StackGrid.tsx";
import { WorkIndex } from "../components/home/WorkIndex.tsx";
import { JobList } from "../components/JobList.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { SectionHead } from "../components/SectionHead.tsx";
import { define } from "../utils.ts";

/**
 * Home page. Hierarchy is deliberate: the hero states who he is, the evidence
 * strip proves it, and work history comes before the public repositories — the
 * site argues from employment, not from side projects.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, experience, projects, sourcePath, siteSourcePath } =
      await loadHomePage(ctx);
    return ctx.render(
      <HomePage
        site={site}
        page={page}
        experience={experience}
        projects={projects}
        basePath={ctx.config.basePath}
        sourcePath={sourcePath}
        siteSourcePath={siteSourcePath}
        inlineEditing={ctx.state.inlineEditing === true}
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
  sourcePath: string;
  siteSourcePath: string;
  inlineEditing: boolean;
}

export function HomePage(
  {
    site,
    page,
    experience,
    projects,
    basePath,
    sourcePath,
    siteSourcePath,
    inlineEditing,
  }: HomePageProps,
) {
  const kindLabels = projects.kindLabels;

  return (
    <>
      <PageMeta title={site.title} description={site.description} />

      <Hero
        page={page}
        site={site}
        basePath={basePath}
        sourcePath={sourcePath}
        siteSourcePath={siteSourcePath}
        inlineEditing={inlineEditing}
      />

      <EvidenceStrip items={site.evidence} />

      <SectionHead
        num={page.experienceSection.num}
        title={
          <ProseField
            text={page.experienceSection.title}
            path="experienceSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
        link={{
          href: basePath + page.experienceSection.linkRoute,
          label: page.experienceSection.linkLabel,
        }}
      />

      <JobList
        jobs={experience.jobs}
        maxBullets={2}
        basePath={basePath}
      />

      <SectionHead
        num={page.projectsSection.num}
        title={
          <ProseField
            text={page.projectsSection.title}
            path="projectsSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
        link={{
          href: basePath + page.projectsSection.linkRoute,
          label: page.projectsSection.linkLabel,
        }}
      />

      <p class="section-note">
        <ProseField
          text={page.projectsSection.note}
          basePath={basePath}
          path="projectsSection.note"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>

      <WorkIndex
        projects={projects.projects}
        kindLabels={kindLabels}
        basePath={basePath}
      />

      <SectionHead
        num={page.stackSection.num}
        title={
          <ProseField
            text={page.stackSection.title}
            path="stackSection.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        }
        link={{
          href: basePath + page.stackSection.linkRoute,
          label: page.stackSection.linkLabel,
        }}
      />

      <StackGrid
        page={page}
        site={site}
        basePath={basePath}
        sourcePath={sourcePath}
        inlineEditing={inlineEditing}
      />
    </>
  );
}
