import { Head } from "fresh/runtime";
import { site } from "../data/site.ts";
import { define } from "../utils.ts";
import { GitHubIcon, LinkedInIcon } from "../components/Icons.tsx";

export default define.page(function Contact() {
  return (
    <>
      <Head>
        <title>Contact — {site.author}</title>
      </Head>

      <h1 class="page-title">Get in touch</h1>
      <p class="page-lede">
        I am open to internships, junior roles and security-related side
        projects. The quickest way to reach me is through one of these:
      </p>

      <div class="contact-grid">
        <a
          class="contact-card"
          href={site.github}
          target="_blank"
          rel="me noopener noreferrer"
        >
          <GitHubIcon />
          <h2>GitHub</h2>
          <p>Code, experiments and open-source contributions.</p>
          <span class="contact-handle">{site.githubHandle}</span>
        </a>

        <a
          class="contact-card"
          href={site.linkedin}
          target="_blank"
          rel="me noopener noreferrer"
        >
          <LinkedInIcon />
          <h2>LinkedIn</h2>
          <p>Experience, studies and professional updates.</p>
          <span class="contact-handle">{site.linkedinHandle}</span>
        </a>

        {site.email !== "" && (
          <a class="contact-card" href={`mailto:${site.email}`}>
            <h2>Email</h2>
            <p>For anything that does not fit in a GitHub issue.</p>
            <span class="contact-handle">{site.email}</span>
          </a>
        )}
      </div>
    </>
  );
});
