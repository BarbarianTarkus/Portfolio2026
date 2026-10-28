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
const pageDescription =
  "La página que buscas no existe en el portfolio de Ricardo Verduguez.";

export function NotFoundPage({ basePath }: NotFoundPageProps) {
  return (
    <>
      <Head>
        <title>Página no encontrada — {site.author}</title>
        <meta name="description" content={pageDescription} />
        <meta
          property="og:title"
          content={`Página no encontrada — ${site.author}`}
        />
        <meta property="og:description" content={pageDescription} />
      </Head>

      <div class="error-page">
        <p class="error-code" aria-hidden="true">404</p>
        <h1 class="page-title">Esta página no existe.</h1>
        <p class="page-lede">
          El enlace puede estar roto o la página haberse movido. Vuelve al
          inicio y empieza de nuevo.
        </p>
        {
          /* Explicit "false" stops Fresh from marking this home link as the
            current/ancestor page while rendering the 404 response. */
        }
        <a class="button" href={`${basePath}/`} aria-current="false">
          Volver al inicio
        </a>
      </div>
    </>
  );
}
