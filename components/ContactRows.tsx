import type { ComponentChildren } from "preact";
import type { ContactContent, SiteContent } from "../lib/content.ts";
import { Markdown } from "../lib/markdown.tsx";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons.tsx";

/** The three channels the page lists, in render order. */
type Channel = "email" | "github" | "linkedin";

interface ContactRowProps {
  row: ContactContent["email"];
  label: string;
  value: string;
  href: string;
  channel: Channel;
  icon: ComponentChildren;
  external?: boolean;
  me?: boolean;
}

/**
 * One channel as a full-row link. The tinted glyph tile anchors the row and
 * names it at a glance; the label and the value keep the reading order. Colour
 * lives in the tile, the row rule and the hover state, so the hierarchy still
 * comes from the type scale instead of from colour.
 */
function ContactRow(
  { row, label, value, href, channel, icon, external = false, me = false }:
    ContactRowProps,
) {
  return (
    <li>
      <a
        class="contact-row"
        href={href}
        data-channel={channel}
        target={external ? "_blank" : undefined}
        rel={external
          ? (me ? "me noopener noreferrer" : "noopener noreferrer")
          : undefined}
      >
        <span class="contact-mark" aria-hidden="true">{icon}</span>
        <span class="contact-label">{label}</span>
        <span class="contact-value">{value}</span>
        <span class="contact-hint">
          <Markdown text={row.hint} links={false} />
        </span>
        <span class="contact-arrow" aria-hidden="true">
          {external ? "↗" : "→"}
        </span>
      </a>
    </li>
  );
}

/** Contact as link rows: each row is one channel, the tile and arrow decorate. */
export function ContactRows({ site, page }: ContactRowsProps) {
  return (
    <ul class="contact-rows">
      {site.email !== "" && (
        <ContactRow
          row={page.email}
          label={page.email.label}
          value={site.email}
          href={"mailto:" + site.email}
          channel="email"
          icon={<MailIcon />}
        />
      )}
      <ContactRow
        row={page.github}
        label={page.github.label}
        value={site.githubHandle}
        href={site.github}
        channel="github"
        icon={<GitHubIcon />}
        external
        me
      />
      <ContactRow
        row={page.linkedin}
        label={page.linkedin.label}
        value={site.linkedinHandle}
        href={site.linkedin}
        channel="linkedin"
        icon={<LinkedInIcon />}
        external
        me
      />
    </ul>
  );
}

interface ContactRowsProps {
  site: SiteContent;
  page: ContactContent;
}
