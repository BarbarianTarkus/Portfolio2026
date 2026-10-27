import { Head } from "fresh/runtime";
import { projects, site } from "../data/site.ts";
import { define } from "../utils.ts";

export default define.page(function About() {
  return (
    <>
      <Head>
        <title>About — {site.author}</title>
      </Head>

      <h1 class="page-title">About Me</h1>

      <div class="about-copy">
        <p class="page-lede">
          I am a software engineering student from Spain with a strong interest
          in cybersecurity. I like understanding how systems work, finding
          weaknesses in them, and then building the tools and interfaces that
          make them safer and easier to use.
        </p>
        <p>
          Outside of security, I enjoy web development: this portfolio is a Deno
          Fresh app that is rendered on the server and exported as static HTML,
          which keeps it fast, accessible and cheap to host. Most of what I
          build ends up on GitHub, from small Deno APIs to Moodle tooling.
        </p>
      </div>

      <h2 class="section-title">Projects</h2>
      <p class="section-lede">
        A selection of public repositories. Everything is open source.
      </p>

      <div class="project-grid">
        {projects.map((project) => (
          <article class="project-card" key={project.name}>
            <h3>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.name}
              </a>
            </h3>
            <p>{project.description}</p>
            <ul class="tag-list">
              {project.tags.map((tag) => <li class="tag" key={tag}>{tag}</li>)}
            </ul>
            <p class="project-links">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub <span aria-hidden="true">→</span>
              </a>
            </p>
          </article>
        ))}
      </div>

      <h2 class="section-title">Get in touch</h2>
      <p>
        The fastest way to reach me is through{" "}
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>{" "}
        or{" "}
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>.
      </p>
    </>
  );
});
