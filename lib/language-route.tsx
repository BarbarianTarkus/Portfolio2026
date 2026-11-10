import type { FreshContext } from "fresh";
import { NotFoundPage } from "../components/NotFoundPage.tsx";
import { loadSite } from "./content.ts";
import {
  canonicalPath,
  DEFAULT_LANGUAGE,
  isLanguage,
  pathFor,
} from "./i18n.tsx";
import type { State } from "../utils.ts";

/**
 * Routes under `routes/[lang]/` reuse the canonical handlers and only differ in
 * the language prefix Dune resolves the page from. Two requests must not reach
 * them:
 *
 * - `/es/...`: Spanish keeps clean URLs, so the prefixed form is a 308
 *   redirect to the canonical one.
 * - anything else (`/foo/about`): the [lang] segment is not a language, and
 *   rendering the default-language page there would publish duplicate URLs.
 */

export type RouteHandler = (
  ctx: FreshContext<State>,
) => Response | Promise<Response>;

async function languageGuard(
  ctx: FreshContext<State>,
): Promise<Response | null> {
  const lang = ctx.params.lang;
  const basePath = ctx.config.basePath;

  if (lang === undefined || lang === DEFAULT_LANGUAGE) {
    const canonical = canonicalPath(ctx.url.pathname, basePath);
    const target = new URL(
      `${basePath}${pathFor(DEFAULT_LANGUAGE, canonical.path)}`,
      ctx.url,
    );
    target.search = ctx.url.search;
    return new Response(null, {
      status: 308,
      headers: { location: target.href },
    });
  }

  if (!isLanguage(lang)) {
    const site = await loadSite(ctx);
    ctx.state.notFound = true;
    return ctx.render(
      <NotFoundPage basePath={basePath} site={site} />,
      { status: 404 },
    );
  }

  return null;
}

/** Wrap a canonical route handler for the `/<lang>` URL space. */
export function localized(handlers: { GET?: RouteHandler }) {
  return {
    GET: async (ctx: FreshContext<State>) => {
      const rejected = await languageGuard(ctx);
      if (rejected !== null) return rejected;
      const inner = handlers.GET;
      if (inner === undefined) {
        throw new Error("Localized route without a GET handler");
      }
      return await inner(ctx);
    },
  };
}
