import type { Project, ProjectsContent } from "../../lib/content.ts";
import { localizedHref, useLanguage } from "../../lib/i18n.tsx";
import { ProseField } from "../../lib/markdown.tsx";
import { FicheBlock } from "../FicheBlock.tsx";
import { TechStack } from "../TechTags.tsx";
import { ProjectGallery } from "./ProjectGallery.tsx";
import { ProjectLinks } from "./ProjectLinks.tsx";

type KindLabels = ProjectsContent["kindLabels"];
type FicheLabels = ProjectsContent["ficheLabels"];

interface ProjectArticleProps {
  project: Project;
  kindLabels: KindLabels;
  ficheLabels: FicheLabels;
  galleryTitle: string;
  galleryViewLabel: string;
  visitLabel: string;
  backLabel: string;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

/**
 * The project's own page: the same kicker, name and meta as the card, followed
 * by the full case study — problem, technical decisions and every capture with
 * its caption. Cards link here instead of expanding in place, so the article
 * can be read, shared and linked from the degree summary.
 */
export function ProjectArticle(
  {
    project,
    kindLabels,
    ficheLabels,
    galleryTitle,
    galleryViewLabel,
    visitLabel,
    backLabel,
    basePath,
    sourcePath,
    inlineEditing,
  }: ProjectArticleProps,
) {
  const lang = useLanguage();
  const kindLabel = kindLabels[project.kind as keyof KindLabels] ??
    project.kind;
  const packs = (project.gallery ?? []).filter((pack) =>
    pack.images.length > 0
  );
  const back = (
    <a class="article-back" href={localizedHref(basePath, lang, "/projects/")}>
      <span aria-hidden="true">←</span> {backLabel}
    </a>
  );

  return (
    <article class="project-article" id={project.slug}>
      {back}

      {packs.length > 0 && (
        <section
          class="article-gallery"
          data-gallery-fit
          aria-labelledby="article-gallery-title"
        >
          <h2 class="article-section-title" id="article-gallery-title">
            {galleryTitle}
          </h2>
          <ProjectGallery
            groups={packs}
            projectSlug={project.slug}
            projectName={project.name}
            basePath={basePath}
            viewLabel={galleryViewLabel}
            eager
          />
        </section>
      )}

      <p class="article-kind">{kindLabel}</p>
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
            text={project.period}
            path="period"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </span>
        {project.work !== undefined && (
          <span>
            <ProseField
              text={project.work}
              path="work"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </span>
        )}
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

      <ProjectLinks
        project={project}
        basePath={basePath}
        visitLabel={visitLabel}
      />

      {project.video !== undefined && (
        <div class="project-cover project-cover--video article-video">
          <iframe
            src={project.video.embed}
            title={project.video.label}
            allowFullScreen
            allow="encrypted-media; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      <div class="article-body">
        <FicheBlock title={ficheLabels.problem}>
          <p>
            <ProseField
              text={project.problem}
              basePath={basePath}
              path="problem"
              sourcePath={sourcePath}
              editing={inlineEditing}
            />
          </p>
        </FicheBlock>

        <FicheBlock title={ficheLabels.decisions}>
          <ul class="fiche-list">
            {project.decisions.map((decision, index) => (
              <li key={index}>
                <ProseField
                  text={decision}
                  basePath={basePath}
                  path={`decisions.${index}`}
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
