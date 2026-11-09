import type { HomeContent, SiteContent } from "../../lib/content.ts";
import { ProseField } from "../../lib/markdown.tsx";
import { TechStack } from "../TechTags.tsx";

interface StackGridProps {
  page: HomeContent;
  site: SiteContent;
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

interface StackGroup {
  id: string;
  code: string;
  title: string;
  note: string;
  items: string[];
}

/**
 * The home stack is a flat, editable list. These are the domains it is read
 * through: every curated technology belongs to one layer, and anything added
 * later falls into a visible "Otros" group instead of disappearing.
 */
const TAG_DOMAIN: Record<string, string> = {
  JavaScript: "frontend",
  TypeScript: "frontend",
  Svelte: "frontend",
  Astro: "frontend",
  Preact: "frontend",
  React: "frontend",
  CSS: "frontend",
  HTML: "frontend",
  "Tailwind CSS": "frontend",
  Deno: "backend",
  "Fresh 2": "backend",
  PHP: "backend",
  Python: "backend",
  Rust: "backend",
  "C++": "backend",
  Moodle: "backend",
  PostgreSQL: "backend",
  SQLite: "backend",
  Oak: "backend",
  Docker: "infra",
  "Synology NAS": "infra",
  "NFS / SMB": "infra",
  Ansible: "infra",
  Rsync: "infra",
  WireGuard: "infra",
  OpenVPN: "infra",
  Gitea: "infra",
  SonarQube: "infra",
  "Cloudflare Tunnel": "infra",
  "GitHub Actions": "infra",
  Linux: "infra",
};

const DOMAINS = [
  {
    id: "frontend",
    code: "UI",
    title: "Frontend",
    note: "Interfaz y componentes",
  },
  {
    id: "backend",
    code: "API",
    title: "Backend y datos",
    note: "Servicios, lógica y persistencia",
  },
] as const;

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags)];
}

/** Build the three layers from the editable stack plus the shared homelab. */
function buildGroups(page: HomeContent, site: SiteContent): StackGroup[] {
  const pageTags = uniqueTags(page.stack);
  const groups: StackGroup[] = DOMAINS.map((domain) => ({
    ...domain,
    items: pageTags.filter((tag) => TAG_DOMAIN[tag] === domain.id),
  }));

  const infraTags = uniqueTags([
    ...site.homelabStack,
    ...pageTags.filter((tag) => TAG_DOMAIN[tag] === "infra"),
  ]);
  groups.push({
    id: "infra",
    code: "OPS",
    title: page.stackSection.infrastructureLabel,
    note: "Red, despliegue y operación",
    items: infraTags,
  });

  const known = new Set(Object.keys(TAG_DOMAIN));
  const otherTags = pageTags.filter((tag) => !known.has(tag));
  if (otherTags.length > 0) {
    groups.push({
      id: "other",
      code: "OTROS",
      title: "Otros",
      note: "Tecnologías complementarias",
      items: otherTags,
    });
  }

  return groups.filter((group) => group.items.length > 0);
}

/**
 * Focus areas sit side by side; below them the stack is drawn as three
 * architecture layers (UI, API, OPS) instead of two paragraphs of chips.
 */
export function StackGrid(
  { page, site, basePath, sourcePath, inlineEditing }: StackGridProps,
) {
  const groups = buildGroups(page, site);

  return (
    <div class="stack-grid">
      <div class="stack-focus">
        {page.focus.map((item, index) => (
          <div class="stack-block" key={item.title}>
            <h3>
              <ProseField
                text={item.title}
                path={"focus." + index + ".title"}
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </h3>
            <p>
              <ProseField
                text={item.body}
                basePath={basePath}
                path={"focus." + index + ".body"}
                sourcePath={sourcePath}
                editing={inlineEditing}
              />
            </p>
          </div>
        ))}
      </div>

      <ol class="stack-map" aria-label={page.stackSection.stackLabel}>
        {groups.map((group) => (
          <li class="stack-layer" key={group.id}>
            <span class="stack-layer-code" aria-hidden="true">
              {group.code}
            </span>
            <div class="stack-layer-head">
              <h4 class="stack-layer-title">{group.title}</h4>
              <p class="stack-layer-note">{group.note}</p>
            </div>
            <TechStack
              tags={group.items}
              class="stack-layer-tags"
              labeled
            />
            <span
              class="stack-layer-count"
              title={group.items.length + " tecnologías"}
              aria-hidden="true"
            >
              {String(group.items.length).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
