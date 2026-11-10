/** @jsxImportSource preact */
/**
 * Language context for the rendered page.
 *
 * Fresh renders the route component in a pass of its own, separate from the
 * `_app` layout: a provider placed in the layout therefore never reaches the
 * page, and `useLanguage()` inside a page component would always see the
 * default language. Wrapping the vnode handed to `ctx.render` puts the page
 * (and the custom 404) inside the provider, so server components can read the
 * language from context while islands keep receiving it as a prop.
 *
 * @module
 */

import type { ComponentChild, VNode } from "preact";
import { type Language, LanguageProvider } from "./i18n.tsx";

/** Wraps a page vnode in the language provider for the current request. */
export function wrapPageLanguage(
  vnode: ComponentChild,
  lang: Language,
): VNode {
  return (
    <LanguageProvider lang={lang}>
      {vnode}
    </LanguageProvider>
  );
}
