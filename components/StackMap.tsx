import { TechStack } from "./TechTags.tsx";

export interface StackSubgroup {
  title: string;
  items: string[];
}

export interface StackGroup {
  id: string;
  code: string;
  title: string;
  note: string;
  items: string[];
  subgroups?: StackSubgroup[];
}

/**
 * The stack is stored as one flat, editable list on the site. These are the
 * domains it is read through: every curated technology belongs to one layer,
 * and anything added later falls into a visible "Otros" group instead of
 * disappearing.
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
  "DeepSeek Harness": "ai",
  Pi: "ai",
  "Gentle Shell": "ai",
  MCP: "ai",
  Skills: "ai",
  Ollama: "ai",
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
    title: "Backend",
    note: "Lenguajes, plataformas y datos",
  },
  {
    id: "ai",
    code: "IA",
    title: "IA agéntica",
    note: "Agentes, MCP y skills",
  },
] as const;

/**
 * The backend and the infrastructure are broad layers, so they are read as
 * sub-scopes: the backend separates languages from platforms and data, and
 * infrastructure separates access, storage and services. Tags without a
 * sub-scope fall into "Otros" so nothing is hidden.
 */
const SUBGROUPS: Record<string, StackSubgroup[]> = {
  backend: [
    {
      title: "Lenguajes y runtimes",
      items: ["PHP", "Python", "Rust", "C++", "Deno"],
    },
    { title: "Datos", items: ["PostgreSQL"] },
  ],
  infra: [
    {
      title: "Red y acceso",
      items: ["WireGuard", "OpenVPN", "Cloudflare Tunnel"],
    },
    {
      title: "Almacenamiento",
      items: ["Synology NAS", "NFS / SMB", "Rsync"],
    },
    {
      title: "Servicios y automatización",
      items: ["Docker", "Gitea", "SonarQube", "Ansible"],
    },
  ],
};

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags)];
}

function withSubgroups(group: StackGroup): StackGroup {
  const definitions = SUBGROUPS[group.id];
  if (definitions === undefined) return group;

  const remaining = new Set(group.items);
  const subgroups = definitions.flatMap((definition) => {
    const items = definition.items.filter((tag) => remaining.has(tag));
    items.forEach((tag) => remaining.delete(tag));
    return items.length > 0 ? [{ title: definition.title, items }] : [];
  });

  if (remaining.size > 0) {
    subgroups.push({ title: "Otros", items: [...remaining] });
  }

  return { ...group, subgroups };
}

/**
 * Build the architecture layers from the shared stack plus the homelab. The
 * infrastructure label is copy from the page that renders the map.
 */
export function buildStackGroups(
  tags: string[],
  homelabStack: string[],
  infrastructureLabel = "Infraestructura",
): StackGroup[] {
  const pageTags = uniqueTags(tags);
  const groups: StackGroup[] = DOMAINS.map((domain) => ({
    ...domain,
    items: pageTags.filter((tag) => TAG_DOMAIN[tag] === domain.id),
  }));

  const infraTags = uniqueTags([
    ...homelabStack,
    ...pageTags.filter((tag) => TAG_DOMAIN[tag] === "infra"),
  ]);
  groups.push({
    id: "infra",
    code: "OPS",
    title: infrastructureLabel,
    note: "Red, almacenamiento y servicios",
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

  return groups.filter((group) => group.items.length > 0).map(withSubgroups);
}

interface StackMapProps {
  groups: StackGroup[];
  /** Accessible name for the ordered list. */
  label: string;
}

/** The stack drawn as architecture layers: UI, API, IA and OPS. */
export function StackMap({ groups, label }: StackMapProps) {
  return (
    <ol class="stack-map" aria-label={label}>
      {groups.map((group) => (
        <li
          class={group.subgroups === undefined
            ? "stack-layer"
            : "stack-layer stack-layer--grouped"}
          key={group.id}
        >
          <span class="stack-layer-code" aria-hidden="true">
            {group.code}
          </span>
          <div class="stack-layer-head">
            <h3 class="stack-layer-title">{group.title}</h3>
            <p class="stack-layer-note">{group.note}</p>
          </div>
          <div class="stack-layer-tags">
            {group.subgroups === undefined
              ? <TechStack tags={group.items} labeled />
              : group.subgroups.map((subgroup) => (
                <div class="stack-subrow" key={subgroup.title}>
                  <span class="stack-subrow-title">{subgroup.title}</span>
                  <TechStack tags={subgroup.items} labeled />
                </div>
              ))}
          </div>
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
  );
}
