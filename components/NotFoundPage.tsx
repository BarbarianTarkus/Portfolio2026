import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";

interface NotFoundPageProps {
  basePath: string;
}

/**
 * Rendered by `routes/_404.tsx`. Fresh's `_404` convention does not force a 404
 * status code, so the route's GET handler renders this component and returns a
 * 404 response explicitly.
 */
export function NotFoundPage({ basePath }: NotFoundPageProps) {
  return (
    <>
      <Head>
        <title>Page not found — {site.author}</title>
      </Head>

      <div class="error-page">
        <p class="error-code" aria-hidden="true">404</p>
        <h1 class="page-title">This page does not exist.</h1>
        <p class="page-lede">
          The link may be broken, or the page may have moved. Head back home and
          start again.
        </p>
        {
          /* Explicit "false" stops Fresh from marking this home link as the
            current/ancestor page while rendering the 404 response. */
        }
        <a class="button" href={`${basePath}/`} aria-current="false">
          Back to home
        </a>
      </div>
    </>
  );
}
