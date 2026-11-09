import type { ContactContent, SiteContent } from "../lib/content.ts";

interface ContactRowsProps {
  site: SiteContent;
  page: ContactContent;
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

/** Contact as link rows: each row is one channel, the arrow is decorative. */
export function ContactRows({ site, page }: ContactRowsProps) {
  return (
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
  );
}
