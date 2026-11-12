import type {
  JobEntry,
  WorkProject,
  WorkProjectLabels,
} from "../../lib/content.ts";
import { localizedHref, useLanguage } from "../../lib/i18n.tsx";
import { ProseField } from "../../lib/markdown.tsx";
import { FicheBlock } from "../FicheBlock.tsx";
import { TechStack } from "../TechTags.tsx";
import { ProjectGallery } from "../projects/ProjectGallery.tsx";

interface WorkProjectArticleProps {
  project: WorkProject;
  /** Job that delivered the project: the kicker and meta come from it. */
  job: JobEntry;
  jobIndex: number;
  labels: WorkProjectLabels;
  basePath: string;
  /** Article file (`.../<nn>.<slug>/default*.md`). */
  sourcePath: string;
  /** Experience page file, owner of the job's role and period. */
  jobSourcePath: string;
  inlineEditing: boolean;
}

/**
 * One work project as its own article, under
 * `/experience/<company>/<project>/`.
 *
 * It reuses the project page's vocabulary — kicker, title, meta, lede, tags,
 * titled prose blocks — but the prose is different: a product description and
 * his contribution, never a problem-and-decisions case study. The back link
 * returns to the timeline, not to `/projects`, because that is where the
 * reader came from.
 */
export function WorkProjectArticle(
  {
    project,
    job,
    jobIndex,
    labels,
    basePath,
    sourcePath,
    jobSourcePath,
    inlineEditing,
  }: WorkProjectArticleProps,
) {
  const lang = useLanguage();
  const packs = (project.gallery ?? []).filter((pack) =>
    pack.images.length > 0
  );
  const productLink = project.links?.[0];
  const back = (
    <a
      class="article-back"
      href={localizedHref(basePath, lang, "/experience/")}
    >
      <span aria-hidden="true">←</span> {labels.back}
    </a>
  );

  return (
    <article class="project-article work-article" id={project.slug}>
      {back}

      {packs.length > 0 && (
        <section
          class="article-gallery"
          data-gallery-fit
          aria-labelledby="article-gallery-title"
        >
          <h2 class="article-section-title" id="article-gallery-title">
            {labels.galleryTitle}
          </h2>
          <ProjectGallery
            groups={packs}
            projectSlug={project.slug}
            projectName={project.name}
            basePath={basePath}
            viewLabel={labels.galleryViewLabel}
            eager
          />
        </section>
      )}

      <p class="article-kind">
        {job.company}
        {job.place !== "" && <>· {job.place}</>}
      </p>
      <h1 class="page-title article-title" id={project.slug + "-title"}>
        <ProseField
          text={project.name}
          path="name"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </h1>
      <p class="article-meta">
        <span>
          <ProseField
            text={job.role}
            path={`jobs.${jobIndex}.role`}
            sourcePath={jobSourcePath}
            editing={inlineEditing}
          />
        </span>
        <span>
          <ProseField
            text={job.period}
            path={`jobs.${jobIndex}.period`}
            sourcePath={jobSourcePath}
            editing={inlineEditing}
          />
        </span>
      </p>

      <p class="page-lede article-lede">
        <ProseField
          text={project.summary}
          basePath={basePath}
          path="summary"
          sourcePath={sourcePath}
          editing={inlineEditing}
        />
      </p>

      <div class="article-tags">
        <TechStack tags={project.tags} />
      </div>

      {productLink !== undefined && (
        <p class="project-links">
          <a
            class="button project-link-cta"
            href={productLink.href}
            target="_blank"
            rel="noopener noreferrer"
            title={productLink.label}
          >
            <span class="project-link-glyph" aria-hidden="true">↗</span>
            {labels.visit}
          </a>
        </p>
      )}

      <div class="article-body">
        <FicheBlock title={labels.description}>
          <p>
            <ProseField
              text={project.description}
              basePath={basePath}
              path="description"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </p>
        </FicheBlock>

        <FicheBlock title={labels.participation}>
          <ul class="fiche-list">
            {project.participation.map((item, index) => (
              <li key={index}>
                <ProseField
                  text={item}
                  basePath={basePath}
                  path={"participation." + index}
                  sourcePath={sourcePath}
                  editing={inlineEditing}
                />
              </li>
            ))}
          </ul>
        </FicheBlock>
      </div>

      {back}
    </article>
  );
}
