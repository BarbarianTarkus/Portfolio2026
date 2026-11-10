/**
 * Typed view over the Dune-managed content pages in content/.
 *
 * Every page is a Dune flat-file page (`content/<nn>.<name>/default.md`) whose
 * YAML frontmatter holds the structured copy the routes render. Translations
 * live next to it as `default.<lang>.md` (`default.en.md`, `default.ca.md`):
 * Dune serves them under the same canonical route, tagged with their language.
 *
 * This module is the only place that talks to Dune's content engine, so routes
 * and components stay independent of where the content lives.
 *
 * @module
 */

import type { Context } from "fresh";
import type { DuneEngine, State } from "../utils.ts";
import { DEFAULT_LANGUAGE, type Language } from "./i18n.tsx";
import type {
  AboutContent,
  ContactContent,
  EvidenceItem,
  ExperienceContent,
  HomeContent,
  HomelabFact,
  HomelabHero,
  JobEntry,
  Project,
  ProjectGalleryGroup,
  ProjectKindLabels,
  ProjectLink,
  ProjectsContent,
  SiteContent,
  WorkProject,
  WorkProjectLabels,
} from "./content-types.ts";

export type {
  AboutContent,
  ContactContent,
  EvidenceItem,
  ExperienceContent,
  HomeContent,
  HomelabFact,
  HomelabHero,
  JobEntry,
  Project,
  ProjectGalleryGroup,
  ProjectKindLabels,
  ProjectLink,
  ProjectsContent,
  SiteContent,
  WorkProject,
  WorkProjectLabels,
};

/**
 * The subset of Dune's page index this module relies on: one row per
 * (route, language) pair, pointing at the flat file that holds it.
 */
interface PageRef {
  route: string;
  language: string;
  sourcePath: string;
  parentPath: string | null;
  order: number;
}

/** Raw frontmatter of one resolved page plus the file it was read from. */
export interface LoadedPage<FM> {
  frontmatter: FM;
  sourcePath: string;
}

function engineOf(ctx: Context<State>): DuneEngine {
  const engine = ctx.state.engine;
  if (engine === undefined) {
    throw new Error(
      "Dune engine missing from ctx.state. Is main.ts mounted correctly?",
    );
  }
  return engine;
}

/** Language of the request being rendered (set by main.ts from the URL). */
export function currentLanguage(ctx: Context<State>): Language {
  return ctx.state.lang ?? DEFAULT_LANGUAGE;
}

function pageIndex(ctx: Context<State>): PageRef[] {
  return (engineOf(ctx).pages ?? []) as unknown as PageRef[];
}

/** Dune addresses pages with a trailing slash ("/about/"). */
function canonicalRoute(route: string): string {
  if (route === "/" || route === "") return "/";
  return `${route.replace(/\/+$/, "")}/`;
}

/**
 * The route of the site's home page.
 *
 * Every top-level folder of content/ yields a root page (the home page is the
 * first one, by folder order), so "first root page of the requested language"
 * is not stable: a translated site that only has `content/02.about/default.en.md`
 * would resolve "/" to the English *about* page. The home page is therefore
 * defined by the default language, and the variant for `lang` is resolved by
 * route like any other page.
 */
function homeRoute(pages: PageRef[]): string {
  const roots = pages.filter((page) => page.parentPath === null);
  if (roots.length === 0) {
    throw new Error("No Dune content pages found in content/");
  }
  const [home] = roots
    .filter((page) => page.language === DEFAULT_LANGUAGE)
    .sort((a, b) => a.order - b.order);
  return (home ?? roots.sort((a, b) => a.order - b.order)[0]).route;
}

/**
 * Index entry serving `route` in `lang`. Untranslated pages fall back to the
 * default-language variant, so a partly translated site still renders.
 */
function findPageRef(
  ctx: Context<State>,
  route: string,
  lang: Language,
): PageRef | undefined {
  const pages = pageIndex(ctx);
  const wanted = route === "/" ? homeRoute(pages) : canonicalRoute(route);
  return pages.find((page) =>
    page.route === wanted && page.language === lang
  ) ??
    pages.find((page) =>
      page.route === wanted && page.language === DEFAULT_LANGUAGE
    ) ??
    pages.find((page) => page.route === wanted);
}

/** Load one page by canonical route, in the language of the request. */
async function loadPage<FM>(
  ctx: Context<State>,
  route: string,
): Promise<LoadedPage<FM>> {
  const lang = currentLanguage(ctx);
  const ref = findPageRef(ctx, route, lang);
  if (ref === undefined) {
    throw new Error(
      `Dune content page not found for route "${route}" (language "${lang}"). ` +
        `Check content/ and the language variants (default.md, default.${lang}.md).`,
    );
  }

  const page = await engineOf(ctx).loadPage(ref.sourcePath);
  return {
    frontmatter: (page as unknown as { frontmatter: FM }).frontmatter,
    sourcePath: ref.sourcePath,
  };
}

/**
 * Site globals (identity, nav, footer labels, 404 copy) plus the page shared by
 * every route. The result is cached on `ctx.state.site` for the app shell.
 */
export async function loadSite(ctx: Context<State>): Promise<SiteContent> {
  const page = await loadPage<SiteContent>(ctx, "/site");
  ctx.state.site = page.frontmatter;
  ctx.state.siteSourcePath = page.sourcePath;
  return page.frontmatter;
}

/** Load one page document plus the site globals it renders inside. */
export async function loadHomePage(ctx: Context<State>) {
  const site = await loadSite(ctx);
  const [page, experience, projects] = await Promise.all([
    loadPage<HomeContent>(ctx, "/"),
    loadPage<ExperienceContent>(ctx, "/experience"),
    loadPage<ProjectsContent>(ctx, "/projects"),
  ]);

  return {
    site,
    page: page.frontmatter,
    experience: experience.frontmatter,
    projects: projects.frontmatter,
    sourcePath: page.sourcePath,
    siteSourcePath: ctx.state.siteSourcePath ?? "",
  };
}

export async function loadAboutPage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<AboutContent>(ctx, "/about"),
  ]);
  return { site, page: page.frontmatter, sourcePath: page.sourcePath };
}

export async function loadContactPage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<ContactContent>(ctx, "/contact"),
  ]);
  return { site, page: page.frontmatter, sourcePath: page.sourcePath };
}

export async function loadExperiencePage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<ExperienceContent>(ctx, "/experience"),
  ]);
  return { site, page: page.frontmatter, sourcePath: page.sourcePath };
}

export async function loadProjectsPage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<ProjectsContent>(ctx, "/projects"),
  ]);
  return { site, page: page.frontmatter, sourcePath: page.sourcePath };
}

/**
 * One project of a job ("/experience/<company>/<project>"), resolved by the
 * company slug and the project slug. Returns `null` when either does not
 * match, so the route can answer with the 404 page instead of rendering an
 * empty article.
 */
export async function loadWorkProjectPage(
  ctx: Context<State>,
  company: string,
  slug: string,
) {
  const { site, page, sourcePath } = await loadExperiencePage(ctx);
  const jobIndex = page.jobs.findIndex((job) => job.slug === company);
  if (jobIndex === -1) return null;

  const job = page.jobs[jobIndex];
  const projects = job.projects ?? [];
  const projectIndex = projects.findIndex((project) => project.slug === slug);
  if (projectIndex === -1) return null;

  return {
    site,
    page,
    job,
    jobIndex,
    project: projects[projectIndex],
    projectIndex,
    sourcePath,
  };
}

/**
 * One project of the projects page, resolved by slug. Returns `null` when no
 * project matches, so the route can answer with the 404 page instead of
 * rendering an empty article.
 */
export async function loadProjectPage(ctx: Context<State>, slug: string) {
  const { site, page, sourcePath } = await loadProjectsPage(ctx);
  const index = page.projects.findIndex((project) => project.slug === slug);
  if (index === -1) return null;
  return { site, page, project: page.projects[index], index, sourcePath };
}
