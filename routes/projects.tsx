import { Head } from "fresh/runtime";
import { projects, site } from "../data/site.ts";
import { ProjectFiche } from "../components/ProjectFiche.tsx";
import { define } from "../utils.ts";

/**
 * Project index. Each entry renders its own fiche component so this route only
 * owns the page chrome (title, lede and the list): the card markup, including
 * the optional sections, lives in `components/ProjectFiche.tsx`.
 */
export default define.page(function Projects() {
  return (
    <>
      <Head>
        <title>Proyectos — {site.author}</title>
        <meta
          name="description"
          content="Fichas de los proyectos de Ricardo Verduguez: qué problema resolvían, qué decisiones tomé y qué se rompió por el camino."
        />
      </Head>

      <h1 class="page-title">Proyectos</h1>
      <p class="page-lede">
        Cada ficha cuenta el problema, las decisiones y lo que se rompió. El
        código es público; lo que no se ve en un repositorio es por qué está
        hecho así.
      </p>

      {projects.map((project) => (
        <ProjectFiche project={project} key={project.slug} />
      ))}
    </>
  );
});
