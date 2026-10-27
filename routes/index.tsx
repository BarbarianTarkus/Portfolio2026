import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";

export default define.page(function Home(ctx) {
  const basePath = ctx.config.basePath;

  return (
    <>
      <Head>
        <title>{site.title}</title>
      </Head>

      <section class="hero">
        <p class="little-heading">Hi, my name is</p>
        <h1 class="big-heading">{site.author}.</h1>
        <p class="big-heading-faded">{site.role}</p>
        <p class="resume-text">{site.intro}</p>
        <a class="button" href={`${basePath}/about`}>About Me!</a>
      </section>
    </>
  );
});
