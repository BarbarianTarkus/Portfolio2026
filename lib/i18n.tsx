/** @jsxImportSource preact */
/**
 * Language context for server-rendered components.
 *
 * The language registry and every URL helper live in `languages.ts`; this file
 * only adds the Preact context. Fresh renders the page component outside the
 * `_app` tree, so the provider is mounted by wrapping the vnode given to
 * `ctx.render` (see `language-render.tsx`) rather than in the layout. Islands
 * render and hydrate outside that tree, so they receive the language as an
 * explicit prop instead of reading this context.
 *
 * @module
 */

import { type ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";
import { DEFAULT_LANGUAGE, type Language } from "./languages.ts";

export * from "./languages.ts";

const LanguageContext = createContext<Language>(DEFAULT_LANGUAGE);

/** Makes the current language available to every server-rendered component. */
export function LanguageProvider(
  { lang, children }: { lang: Language; children: ComponentChildren },
) {
  return (
    <LanguageContext.Provider value={lang}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Current language of the page being rendered (server components only). */
export function useLanguage(): Language {
  return useContext(LanguageContext);
}
