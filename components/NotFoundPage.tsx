import { Head } from "fresh/runtime";
import type { SiteContent } from "../lib/content.ts";

interface NotFoundPageProps {
  basePath: string;
  site: SiteContent;
}

/**
 * Rendered by routes/_404.tsx. Fresh's _404 convention does not force a 404
 * status code, so the route's GET handler renders this component and returns a
 * 404 response explicitly.
 */
export function NotFoundPage({ basePath, site }: NotFoundPageProps) {
  const notFound = site.notFound;
  return (
    <>
      <Head>
        <title>
          {notFound.metaTitle + " — " + site.author}
        </title>
        <meta
          name="description"
          content={notFound.metaDescription}
        />
        <meta
          property="og:title"
          content={notFound.metaTitle + " — " + site.author}
        />
        <meta
          property="og:description"
          content={notFound.metaDescription}
        />
      </Head>

      <div class="error-page">
        <p
          class="error-code"
          aria-hidden="true"
        >
          {notFound.code}
        </p>
        <h1 class="page-title">
          {notFound.heading}
        </h1>
        <p class="page-lede">
          {notFound.lede}
        </p>
        {
          /* Explicit "false" stops Fresh from marking this home link as the
            current/ancestor page while rendering the 404 response. */
        }
        <a
          class="button"
          href={basePath + "/"}
          aria-current="false"
        >
          {notFound.button}
        </a>
      </div>
    </>
  );
}
