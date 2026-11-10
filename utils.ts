import { createDefine } from "fresh";
import type { ContentApi } from "@dune/core/content";
import type { BootstrapResult } from "@dune/core/bootstrap";
import type { SiteContent } from "./lib/content-types.ts";
import type { Language } from "./lib/i18n.tsx";

/**
 * Shared types for `ctx.state` and the typed `define` helpers used by routes,
 * layouts and middlewares.
 *
 * `contentApi` and `engine` are injected by main.ts (Dune's headless CMS) and
 * `site` is filled by lib/content.ts while a request loads its content, so the
 * layout can render the header/footer without a second async lookup.
 * `lang` is resolved from the URL prefix by main.ts ("/en", "/ca").
 */

/** Dune's runtime content engine (resolves routes, loads page variants). */
export type DuneEngine = BootstrapResult["engine"];

export type State = {
  contentApi?: ContentApi;
  engine?: DuneEngine;
  site?: SiteContent;
  /** Language of the page being rendered (defaults to Dune's default language). */
  lang?: Language;
  /** True when the response is the not-found page. */
  notFound?: boolean;
  /** True when the request carries an admin session allowed to edit content. */
  inlineEditing?: boolean;
  /** Source path of the site-globals page (content/06.site/default.md). */
  siteSourcePath?: string;
};

export const define = createDefine<State>();
