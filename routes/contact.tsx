import { Head } from "fresh/runtime";
import { EditableText } from "@dune/core/ui/editable";
import type { ContactContent, SiteContent } from "../lib/content.ts";
import { loadContactPage } from "../lib/content.ts";
import { define } from "../utils.ts";

/**
 * Contact as three rows. Each row is one link; the arrow is decorative and the
 * handle is the link text, so screen readers announce the target once.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const { site, page, sourcePath } = await loadContactPage(ctx);
    return ctx.render(
      <ContactPage site={site} page={page} sourcePath={sourcePath} />,
    );
  },
});

interface ContactPageProps {
  site: SiteContent;
  page: ContactContent;
  sourcePath: string;
}

interface ContactRowProps {
  row: ContactContent["email"];
  label: string;
  value: string;
  href: string;
  external: boolean;
  me?: boolean;
}

function ContactRow(
  { row, label, value, href, external, me }: ContactRowProps,
) {
  return (
    <li>
      <a
        class="contact-row"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external
          ? (me ? "me noopener noreferrer" : "noopener noreferrer")
          : undefined}
      >
        <span class="contact-label">
          {label}
        </span>
        <span class="contact-value">{value}</span>
        <span class="contact-hint">
          {row.hint}
        </span>
        <span class="contact-arrow" aria-hidden="true">→</span>
      </a>
    </li>
  );
}

export function ContactPage({ site, page, sourcePath }: ContactPageProps) {
  const metaTitle = page.meta.title + " — " + site.author;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta
          name="description"
          content={page.meta.description}
        />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={page.meta.description} />
      </Head>

      <h1 class="page-title">
        {page.title}
      </h1>
      <p class="page-lede">
        <EditableText field="lede" sourcePath={sourcePath}>
          {page.lede}
        </EditableText>
      </p>

      <ul class="contact-rows">
        {site.email !== "" && (
          <ContactRow
            row={page.email}
            label={page.email.label}
            value={site.email}
            href={"mailto:" + site.email}
            external={false}
          />
        )}
        <ContactRow
          row={page.github}
          label={page.github.label}
          value={site.githubHandle}
          href={site.github}
          external
          me
        />
        <ContactRow
          row={page.linkedin}
          label={page.linkedin.label}
          value={site.linkedinHandle}
          href={site.linkedin}
          external
          me
        />
      </ul>
    </>
  );
}
