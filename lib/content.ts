/**
 * Typed view over the Tina-managed content files in content/.
 *
 * Every document is loaded through this module so it can be decorated with the
 * `_content_source` metadata Tina uses for click-to-edit and so its query is
 * recorded for the browser bridge. Routes pass the loaded content down as
 * props; components never import the JSON directly.
 *
 * @module
 */

import type { Context } from "fresh";
import type { State } from "../utils.ts";
import { addMetadata, hashFromQuery } from "./tina/metadata.ts";
import { recordForm, tinaState } from "./tina/forms.ts";

import siteJson from "../content/site.json" with { type: "json" };
import homeJson from "../content/home.json" with { type: "json" };
import aboutJson from "../content/about.json" with { type: "json" };
import contactJson from "../content/contact.json" with { type: "json" };
import experienceJson from "../content/experience.json" with { type: "json" };
import projectsJson from "../content/projects.json" with { type: "json" };

import { documents } from "./tina/documents.generated.ts";

/** Content loaded from disk, plus the metadata Tina attaches to it. */
export type WithMeta<T> = T & {
  _content_source?: { queryId: string; path: (string | number)[] };
};

export type SiteContent = WithMeta<typeof siteJson>;
export type HomeContent = WithMeta<typeof homeJson>;
export type AboutContent = WithMeta<typeof aboutJson>;
export type ContactContent = WithMeta<typeof contactJson>;
export type ExperienceContent = WithMeta<typeof experienceJson>;
export type ProjectsContent = WithMeta<typeof projectsJson>;

export interface TinaDocument<TData> {
  data: TData;
  query: string;
  variables: { relativePath: string };
  id: string;
}

/** Tina's JSON documents get the same system fields a GraphQL query returns. */
function systemInfo(filename: string): Record<string, unknown> {
  const relativePath = `${filename}.json`;
  return {
    filename,
    basename: filename,
    hasReferences: false,
    breadcrumbs: [filename],
    path: `content/${relativePath}`,
    relativePath,
    extension: ".json",
  };
}

/**
 * Build one document's query result exactly as Tina's generated client would:
 * `{ [collection]: { _sys, id, ...fields } }`, decorated with metadata.
 */
function makeDocument(
  collection: string,
  filename: string,
  typename: string,
  query: string,
  value: Record<string, unknown>,
): TinaDocument<Record<string, unknown>> {
  const variables = { relativePath: `${filename}.json` };
  const id = hashFromQuery(JSON.stringify({ query, variables }));
  const document = {
    __typename: typename,
    _sys: systemInfo(filename),
    id: `content/${filename}.json`,
    ...value,
  };
  const data = addMetadata(id, { [collection]: document }) as Record<
    string,
    unknown
  >;
  return { data, query, variables, id };
}

/**
 * Load one document and record its form for the current request. Passing `null`
 * as context (used by the island re-renderer) loads data without recording.
 */
function load<TData>(
  ctx: Context<State> | null,
  collection: string,
  filename: string,
  typename: string,
  query: string,
  value: unknown,
  priority: "primary" | null = "primary",
): TinaDocument<TData> {
  const document = makeDocument(
    collection,
    filename,
    typename,
    query,
    value as Record<string, unknown>,
  ) as unknown as TinaDocument<TData>;
  if (ctx) {
    recordForm(ctx, {
      id: document.id,
      query: document.query,
      variables: document.variables,
      data: document.data as Record<string, unknown>,
      priority: filename === "site" ? undefined : (priority ?? undefined),
    });
  }
  return document;
}

/** Site globals (identity, nav, footer labels); available on every page. */
export function loadSite(
  ctx: Context<State> | null,
): SiteContent {
  const doc = load<{ site: SiteContent }>(
    ctx,
    "site",
    "site",
    "Site",
    documents.site,
    siteJson,
  );
  const site = doc.data.site;
  if (ctx) tinaState(ctx).site = site;
  return site;
}

/** Load one page document plus the site globals it renders inside. */
export function loadHomePage(ctx: Context<State> | null) {
  const site = loadSite(ctx);
  const page = load<{ home: HomeContent }>(
    ctx,
    "home",
    "home",
    "Home",
    documents.home,
    homeJson,
  ).data.home;
  // The home page also renders the work history and the project index, so
  // those documents are loaded as secondary forms (click-to-edit works on the
  // home page without stealing the primary form from the page document).
  const experience = load<{ experience: ExperienceContent }>(
    ctx,
    "experience",
    "experience",
    "Experience",
    documents.experience,
    experienceJson,
    null,
  ).data.experience;
  const projects = load<{ projects: ProjectsContent }>(
    ctx,
    "projects",
    "projects",
    "Projects",
    documents.projects,
    projectsJson,
    null,
  ).data.projects;
  return { site, page, experience, projects };
}

export function loadAboutPage(ctx: Context<State> | null) {
  return {
    site: loadSite(ctx),
    page: load<{ about: AboutContent }>(
      ctx,
      "about",
      "about",
      "About",
      documents.about,
      aboutJson,
    ).data.about,
  };
}

export function loadContactPage(ctx: Context<State> | null) {
  return {
    site: loadSite(ctx),
    page: load<{ contact: ContactContent }>(
      ctx,
      "contact",
      "contact",
      "Contact",
      documents.contact,
      contactJson,
    ).data.contact,
  };
}

export function loadExperiencePage(ctx: Context<State> | null) {
  return {
    site: loadSite(ctx),
    page: load<{ experience: ExperienceContent }>(
      ctx,
      "experience",
      "experience",
      "Experience",
      documents.experience,
      experienceJson,
    ).data.experience,
  };
}

export function loadProjectsPage(ctx: Context<State> | null) {
  return {
    site: loadSite(ctx),
    page: load<{ projects: ProjectsContent }>(
      ctx,
      "projects",
      "projects",
      "Projects",
      documents.projects,
      projectsJson,
    ).data.projects,
  };
}

/** Stable Tina form id for one content document. */
export function documentFormId(name: keyof typeof documents): string {
  const variables = { relativePath: name + ".json" };
  return hashFromQuery(JSON.stringify({ query: documents[name], variables }));
}

/**
 * Resolve one document from the overlay the bridge POSTs on every edit. The
 * overlay maps form ids to query results; adding metadata back restores the
 * click-to-edit markers for the re-rendered HTML.
 */
export function overlayDocument<TData>(
  name: keyof typeof documents,
  overlay: Record<string, unknown>,
): TData | null {
  const id = documentFormId(name);
  const raw = overlay[id];
  if (raw === undefined) return null;
  return addMetadata(id, raw) as TData;
}
