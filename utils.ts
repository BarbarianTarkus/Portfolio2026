import { createDefine } from "fresh";
import type { ContentApi } from "@dune/core/content";
import type { SiteContent } from "./lib/content-types.ts";

/**
 * Shared types for `ctx.state` and the typed `define` helpers used by routes,
 * layouts and middlewares.
 *
 * `contentApi` is injected by main.ts (Dune's headless CMS content API) and
 * `site` is filled by lib/content.ts while a request loads its content, so the
 * layout can render the header/footer without a second async lookup.
 */
export type State = {
  contentApi?: ContentApi;
  site?: SiteContent;
  /** True when the request carries an admin session allowed to edit content. */
  inlineEditing?: boolean;
  /** Source path of the site-globals page (content/06.site/default.md). */
  siteSourcePath?: string;
};

export const define = createDefine<State>();
