/**
 * Typed view over the Dune-managed content pages in content/.
 *
 * Every page is a Dune flat-file page (`content/<nn>.<name>/default.md`) whose
 * YAML frontmatter holds the structured copy the routes render. This module is
 * the only place that talks to Dune's content API, so routes and components
 * stay independent of where the content lives.
 *
 * @module
 */

import type { ContentApi, ResolvedPage } from "@dune/core/content";
import type { Context } from "fresh";
import type { State } from "../utils.ts";
import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  HomeContent,
  ProjectsContent,
  SiteContent,
} from "./content-types.ts";

export type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  HomeContent,
  ProjectsContent,
  SiteContent,
};

/** Return the request-scoped Dune content API. */
function contentApi(ctx: Context<State>): ContentApi {
  const api = ctx.state.contentApi;
  if (api === undefined) {
    throw new Error(
      "Dune content API missing from ctx.state. Is main.ts mounted correctly?",
    );
  }
  return api;
}

/**
 * Dune routes always end with a trailing slash ("/about/"), while Fresh routes
 * are declared without one ("/about"). Accept both when loading a page.
 */
function routeCandidates(route: string): string[] {
  if (route === "/") return [];
  const withoutSlash = route.replace(/\/+$/, "");
  return [`${withoutSlash}/`, withoutSlash];
}

/** The Dune page that serves as the site's home (first top-level folder). */
function homeRoute(api: ContentApi): string {
  const roots = api.pages().filter((page) => page.parentPath === null);
  const home = [...roots].sort((a, b) => a.order - b.order)[0];
  if (home === undefined) {
    throw new Error("No Dune content pages found in content/");
  }
  return home.route;
}

/** Load one page by Fresh-style route, returning its Dune page record. */
async function loadPage<FM>(
  ctx: Context<State>,
  route: string,
): Promise<ResolvedPage<FM>> {
  const api = contentApi(ctx);
  const candidates = route === "/" ? [homeRoute(api)] : routeCandidates(route);

  for (const candidate of candidates) {
    const page = await api.page<FM>(candidate);
    if (page !== null) return page;
  }

  throw new Error(
    `Dune content page not found for route "${route}" ` +
      `(tried: ${
        candidates.join(", ")
      }). Check content/ and content/*/default.md.`,
  );
}

/**
 * Site globals (identity, nav, footer labels, 404 copy) plus the page shared by
 * every route. The result is cached on `ctx.state.site` for the app shell.
 */
export async function loadSite(ctx: Context<State>): Promise<SiteContent> {
  const page = await loadPage<SiteContent>(ctx, "/site");
  ctx.state.site = page.frontmatter;
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
  };
}

export async function loadAboutPage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<AboutContent>(ctx, "/about"),
  ]);
  return { site, page: page.frontmatter };
}

export async function loadContactPage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<ContactContent>(ctx, "/contact"),
  ]);
  return { site, page: page.frontmatter };
}

export async function loadExperiencePage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<ExperienceContent>(ctx, "/experience"),
  ]);
  return { site, page: page.frontmatter };
}

export async function loadProjectsPage(ctx: Context<State>) {
  const [site, page] = await Promise.all([
    loadSite(ctx),
    loadPage<ProjectsContent>(ctx, "/projects"),
  ]);
  return { site, page: page.frontmatter };
}
