/**
 * Language registry and URL helpers.
 *
 * The site keeps a single canonical route per page ("/about", "/projects/x")
 * while Dune serves one content variant per language (default.md,
 * default.en.md, default.ca.md). Spanish (the Dune default language) lives at
 * the canonical URL; the other languages are served under a "/<lang>" prefix
 * (see config/system.yaml → content.languages).
 *
 * This module is plain TypeScript (no Preact) so build scripts can import the
 * language list without pulling the component runtime in. The context provider
 * lives in `i18n.tsx`.
 *
 * @module
 */

export const LANGUAGES = ["es", "en", "ca"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "es";
/** Languages that get a URL prefix (the default language keeps clean URLs). */
export const LOCALIZED_LANGUAGES: readonly Language[] = ["en", "ca"];

export interface LanguageMeta {
  /** Value for `<html lang>` and `hreflang`. */
  htmlLang: string;
  /** Value for `og:locale`. */
  ogLocale: string;
  /** Compact label for the language switcher. */
  label: string;
  /** Endonym shown as the switcher's accessible title. */
  name: string;
}

export const languageMeta: Record<Language, LanguageMeta> = {
  es: { htmlLang: "es", ogLocale: "es_ES", label: "ES", name: "Español" },
  en: { htmlLang: "en", ogLocale: "en_US", label: "EN", name: "English" },
  ca: { htmlLang: "ca", ogLocale: "ca_ES", label: "CA", name: "Català" },
};

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" &&
    (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Canonical route → URL path for one language, without the deployment
 * `basePath`. Fragments and trailing slashes are preserved, so
 * `pathFor("en", "/projects#homelab")` is `/en/projects#homelab`.
 */
export function pathFor(lang: Language, route: string): string {
  const path = route.startsWith("/") ? route : `/${route}`;
  return lang === DEFAULT_LANGUAGE ? path : `/${lang}${path}`;
}

/** Canonical route → linkable href (language prefix + deployment base path). */
export function localizedHref(
  basePath: string,
  lang: Language,
  route: string,
): string {
  const path = pathFor(lang, route);
  if (!basePath) return path;
  return path === "/" ? `${basePath}/` : basePath + path;
}

/**
 * Request pathname → `{ lang, path }`, where `path` is the canonical route
 * shared by every language. Used for canonical URLs, `hreflang` alternates and
 * the header switcher.
 */
export function canonicalPath(
  pathname: string,
  basePath: string,
): { lang: Language; path: string } {
  let path = pathname || "/";
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    path = path.slice(basePath.length) || "/";
  }

  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLanguage(first)) {
    const rest = segments.slice(1).join("/");
    const trailing = rest && path.endsWith("/") ? "/" : "";
    return { lang: first, path: rest ? `/${rest}${trailing}` : "/" };
  }

  return {
    lang: DEFAULT_LANGUAGE,
    path: path.startsWith("/") ? path : `/${path}`,
  };
}

/** Every language that should be advertised as an alternate of `route`. */
export function alternatesFor(
  basePath: string,
  route: string,
): { lang: Language; href: string }[] {
  return LANGUAGES.map((lang) => ({
    lang,
    href: localizedHref(basePath, lang, route),
  }));
}
