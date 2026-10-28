/**
 * Server-side island renderer for TinaCMS live preview.
 *
 * On every keystroke the admin sends the updated form data to the preview
 * iframe; @tinacms/bridge stores it and POSTs the whole overlay to
 * /tina-island/<name>. This module rebuilds that region from the overlay (or
 * from the on-disk content when a form is absent) and returns the same markup
 * the page rendered, including the click-to-edit field markers.
 *
 * The route components are imported here, not the other way around: routes only
 * depend on lib/tina/island.tsx, so there is no import cycle.
 *
 * @module
 */

import { renderToString } from "preact-render-to-string";
import { Footer } from "../../components/Footer.tsx";
import { AboutPage } from "../../routes/about.tsx";
import { ContactPage } from "../../routes/contact.tsx";
import { ExperiencePage } from "../../routes/experience.tsx";
import { HomePage } from "../../routes/index.tsx";
import { ProjectsPage } from "../../routes/projects.tsx";
import {
  type AboutContent,
  type ContactContent,
  type ExperienceContent,
  type HomeContent,
  loadAboutPage,
  loadContactPage,
  loadExperiencePage,
  loadHomePage,
  loadProjectsPage,
  loadSite,
  overlayDocument,
  type ProjectsContent,
  type SiteContent,
} from "../content.ts";
import { wrapIsland } from "./island.tsx";

type Overlay = Record<string, unknown>;

/** Render one region and wrap it in the marker element the bridge expects. */
export type IslandRenderer = (overlay: Overlay, basePath: string) => string;

/**
 * Remove <title>/<meta> nodes produced when a page component is rendered
 * outside Fresh's document renderer. Inside a normal request those go to
 * <head>; in an island fragment they would be inert body markup.
 */
function withoutHeadTags(html: string): string {
  return html.replace(/<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>/gi, "");
}

/** Site globals from the overlay, falling back to the files on disk. */
function siteFrom(overlay: Overlay): SiteContent {
  return overlayDocument<{ site: SiteContent }>("site", overlay)?.site ??
    loadSite(null);
}

const renderers: Record<string, IslandRenderer> = {
  home(overlay, basePath) {
    const fallback = loadHomePage(null);
    const site =
      overlayDocument<{ site: SiteContent }>("site", overlay)?.site ??
        fallback.site;
    const page =
      overlayDocument<{ home: HomeContent }>("home", overlay)?.home ??
        fallback.page;
    const experience =
      overlayDocument<{ experience: ExperienceContent }>("experience", overlay)
        ?.experience ?? fallback.experience;
    const projects =
      overlayDocument<{ projects: ProjectsContent }>("projects", overlay)
        ?.projects ?? fallback.projects;
    return renderToString(
      <HomePage
        site={site}
        page={page}
        experience={experience}
        projects={projects}
        basePath={basePath}
      />,
    );
  },

  about(overlay, basePath) {
    const fallback = loadAboutPage(null);
    const site =
      overlayDocument<{ site: SiteContent }>("site", overlay)?.site ??
        fallback.site;
    const page = overlayDocument<{ about: AboutContent }>("about", overlay)
      ?.about ?? fallback.page;
    return renderToString(
      <AboutPage site={site} page={page} basePath={basePath} />,
    );
  },

  contact(overlay) {
    const fallback = loadContactPage(null);
    const site =
      overlayDocument<{ site: SiteContent }>("site", overlay)?.site ??
        fallback.site;
    const page =
      overlayDocument<{ contact: ContactContent }>("contact", overlay)
        ?.contact ?? fallback.page;
    return renderToString(<ContactPage site={site} page={page} />);
  },

  experience(overlay, basePath) {
    const fallback = loadExperiencePage(null);
    const site =
      overlayDocument<{ site: SiteContent }>("site", overlay)?.site ??
        fallback.site;
    const page =
      overlayDocument<{ experience: ExperienceContent }>("experience", overlay)
        ?.experience ?? fallback.page;
    return renderToString(
      <ExperiencePage site={site} page={page} basePath={basePath} />,
    );
  },

  projects(overlay) {
    const fallback = loadProjectsPage(null);
    const site =
      overlayDocument<{ site: SiteContent }>("site", overlay)?.site ??
        fallback.site;
    const page =
      overlayDocument<{ projects: ProjectsContent }>("projects", overlay)
        ?.projects ?? fallback.page;
    return renderToString(<ProjectsPage site={site} page={page} />);
  },

  footer(overlay) {
    return renderToString(<Footer site={siteFrom(overlay)} />);
  },
};

/**
 * Render one named island. Returns null for unknown names so the route can
 * answer 404 without leaking which endpoints exist.
 */
export function renderIslandFragment(
  name: string,
  overlay: Overlay,
  basePath: string,
): string | null {
  const renderer = renderers[name];
  if (renderer === undefined) return null;
  return renderer(overlay, basePath);
}

/** Render a full island response (fragment wrapped in its marker element). */
export function renderIslandResponse(
  name: string,
  overlay: Overlay,
  basePath: string,
): string | null {
  const html = renderIslandFragment(name, overlay, basePath);
  if (html === null) return null;
  return withoutHeadTags(wrapIsland(name, basePath, html));
}
