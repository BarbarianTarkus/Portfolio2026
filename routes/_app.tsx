import { SITE_ORIGIN } from "../config.ts";
import { define } from "../utils.ts";
import Header from "../islands/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import {
  absoluteUrl,
  alternatesFor,
  canonicalPath,
  DEFAULT_LANGUAGE,
  languageMeta,
  LanguageProvider,
  LANGUAGES,
  localizedHref,
} from "../lib/i18n.tsx";

/**
 * Application shell: <html>, <head> and the persistent header/footer.
 *
 * Every route loads the Dune-managed site globals into `state.site` while it
 * loads its own content, so the shell only has to read them synchronously here.
 * A missing site means a route forgot to call loadSite.
 */
export default define.page(function App({ Component, config, url, state }) {
  const basePath = config.basePath;
  const site = state.site;
  if (site === undefined) {
    throw new Error(
      "state.site is missing: every route must load the site content before rendering",
    );
  }

  // Language is resolved from the URL prefix by main.ts: unprefixed pages are
  // the default language, "/en" and "/ca" are the translated ones.
  const lang = state.lang ?? DEFAULT_LANGUAGE;
  const meta = languageMeta[lang];
  // The not-found page is rendered for a URL that does not exist, so it keeps
  // the home page's links (the header language switcher must stay usable) and
  // omits canonical/hreflang/og:url instead of advertising a broken address.
  const notFound = state.notFound === true;
  const canonical = canonicalPath(url.pathname, basePath);
  const path = notFound ? "/" : canonical.path;
  // Canonical and hreflang URLs are absolute (a relative one is rejected by
  // search engines); in-document links below stay relative to the base path.
  const canonicalHref = absoluteUrl(
    SITE_ORIGIN,
    localizedHref(basePath, lang, path),
  );
  const alternates = alternatesFor(basePath, path).map((alternate) => ({
    ...alternate,
    href: absoluteUrl(SITE_ORIGIN, alternate.href),
  }));

  return (
    <html lang={meta.htmlLang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content={site.fullName} />
        <meta name="theme-color" content="#0B0E13" />
        <meta property="og:site_name" content={site.author} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={meta.ogLocale} />
        {LANGUAGES.filter((candidate) => candidate !== lang).map((
          candidate,
        ) => (
          <meta
            property="og:locale:alternate"
            content={languageMeta[candidate].ogLocale}
          />
        ))}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={site.title} />
        <meta name="twitter:description" content={site.description} />
        {notFound ? <meta name="robots" content="noindex" /> : (
          <>
            <meta property="og:url" content={canonicalHref} />
            <link rel="canonical" href={canonicalHref} />
            {alternates.map((alternate) => (
              <link
                rel="alternate"
                hreflang={languageMeta[alternate.lang].htmlLang}
                href={alternate.href}
              />
            ))}
            <link
              rel="alternate"
              hreflang="x-default"
              href={absoluteUrl(
                SITE_ORIGIN,
                localizedHref(basePath, DEFAULT_LANGUAGE, path),
              )}
            />
          </>
        )}
        {
          /*
           * The mobile navigation is an overlay that only works once JavaScript
           * has marked the document. This blocking script adds the js class
           * before first paint: without it the stylesheet leaves the nav as a
           * plain visible list, so the static export stays navigable without
           * JavaScript, and there is no flash for everyone else.
           */
        }
        <script src={basePath + "/js/enable-js.js"} />
        <script src={basePath + "/js/gallery.js"} defer />
        <link
          rel="icon"
          href={basePath + "/favicon.svg"}
          type="image/svg+xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;600&family=Roboto+Condensed:wght@700&display=swap"
        />
        <link rel="stylesheet" href={basePath + "/styles/main.css"} />
      </head>
      <body>
        <div class="layout">
          <Header
            site={site}
            basePath={basePath}
            path={notFound ? "/" : url.pathname}
            lang={lang}
          />
          <main id="main" tabindex={-1}>
            <div class="shell">
              <LanguageProvider lang={lang}>
                <Component />
              </LanguageProvider>
            </div>
          </main>
          <Footer site={site} />
        </div>
      </body>
    </html>
  );
});
