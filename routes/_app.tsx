import { define } from "../utils.ts";
import Header from "../islands/Header.tsx";
import { Footer } from "../components/Footer.tsx";

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

  return (
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content={site.fullName} />
        <meta name="theme-color" content="#0B0E13" />
        <meta property="og:site_name" content={site.author} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={site.title} />
        <meta name="twitter:description" content={site.description} />
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
        <link rel="icon" href={basePath + "/favicon.png"} type="image/png" />
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
          <Header site={site} basePath={basePath} path={url.pathname} />
          <main id="main" tabindex={-1}>
            <div class="shell">
              <Component />
            </div>
          </main>
          <Footer site={site} />
        </div>
      </body>
    </html>
  );
});
