import { site } from "../data/site.ts";
import { define } from "../utils.ts";
import Header from "../islands/Header.tsx";
import { Footer } from "../components/Footer.tsx";

/**
 * Application shell: <html>, <head> and the persistent header/footer.
 *
 * Props come from Fresh's layout/app wrapper: `Component` is the active page and
 * `config.basePath` is the deployment prefix. Active-link state is not passed
 * down: Fresh annotates matching anchors with `aria-current` while rendering.
 */
export default define.page(function App({ Component, config }) {
  const basePath = config.basePath;

  return (
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content={site.fullName} />
        <meta name="theme-color" content="#0e1217" />
        <meta property="og:site_name" content={site.author} />
        <meta property="og:type" content="website" />
        <link rel="icon" href={`${basePath}/favicon.png`} type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Roboto+Condensed:wght@400;700&display=swap"
        />
        <link rel="stylesheet" href={`${basePath}/styles/main.css`} />
      </head>
      <body>
        <div class="layout">
          <Header basePath={basePath} />
          <main id="main" tabindex={-1}>
            <Component />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
});
