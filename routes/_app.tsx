import { loadSite } from "../lib/content.ts";
import { define } from "../utils.ts";
import Header from "../islands/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { TinaIsland } from "../lib/tina/island.tsx";

/**
 * Application shell: <html>, <head> and the persistent header/footer.
 *
 * In addition to the normal layout, the shell serialises every TinaCMS form
 * collected while the route handler loaded its content into hidden
 * data-tina-form payloads. The bridge script is loaded only inside the TinaCMS
 * admin iframe; it announces those forms to the editor, which is what makes
 * click-to-edit and live preview work. Outside the iframe the payloads are
 * inert and the bridge is never fetched.
 */
export default define.page(function App({ Component, config, url, state }) {
  const basePath = config.basePath;
  // A static export is hosted without a request-time island renderer, so the
  // client-side fallback has to do the live re-render. Server deployments leave
  // the attribute off and keep the faster server-rendered preview.
  const isStaticExport = Deno.env.get("TINA_STATIC") === "1";
  const tina = state.tina;
  const site = tina?.site ?? loadSite(null);
  const forms = tina?.forms ?? [];

  return (
    <html lang="es" data-tina-static={isStaticExport ? "1" : undefined}>
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
        {forms.map((form) => (
          <div
            key={form.id}
            data-tina-form={JSON.stringify(form)}
            data-tina-primary={form.priority === "primary" ? "true" : undefined}
            hidden
          />
        ))}
        <div class="layout">
          <Header site={site} basePath={basePath} path={url.pathname} />
          <main id="main" tabindex={-1}>
            <div class="shell">
              <Component />
            </div>
          </main>
          <TinaIsland name="footer" basePath={basePath}>
            <Footer site={site} />
          </TinaIsland>
        </div>
        <script type="module" src={basePath + "/tina-bootstrap.js"} />
      </body>
    </html>
  );
});
