import { NotFoundPage } from "../components/NotFoundPage.tsx";
import { define } from "../utils.ts";

/**
 * Custom 404 page.
 *
 * Fresh maps `_404.tsx` to the app's not-found handler, but it renders it with
 * the default 200 status, so the handler below renders the page and forces a
 * 404 response. The static-site generator also writes this page out as
 * `404.html`, which is the file GitHub Pages serves for unknown URLs.
 */
export const handler = define.handlers({
  GET(ctx) {
    return ctx.render(
      <NotFoundPage basePath={ctx.config.basePath} />,
      { status: 404 },
    );
  },
});
