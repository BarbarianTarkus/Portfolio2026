/**
 * Official pages and documentation for the technologies shown on the site.
 *
 * The project tags are icon-only, so each tile links to the source of truth for
 * that stack instead of leaving the reader with a logo and no way to learn what
 * it is. Tags without an unambiguous official page stay unlinked rather than
 * pointing somewhere approximate.
 *
 * @module
 */

const TECH_LINKS: Record<string, string> = {
  // Project stacks.
  Deno: "https://deno.com/",
  "Fresh 2": "https://fresh.deno.dev/",
  Preact: "https://preactjs.com/",
  SQLite: "https://www.sqlite.org/",
  Tailwind: "https://tailwindcss.com/",
  Python: "https://www.python.org/",
  Astro: "https://astro.build/",
  TinaCMS: "https://tina.io/",
  Cloudflare: "https://www.cloudflare.com/",
  "GitHub Actions": "https://github.com/features/actions",
  PHP: "https://www.php.net/",
  Moodle: "https://moodle.org/",
  PyInstaller: "https://pyinstaller.org/",
  TypeScript: "https://www.typescriptlang.org/",
  "Deno KV": "https://docs.deno.com/deploy/kv/",
  Oak: "https://oakserver.org/",
  PostgreSQL: "https://www.postgresql.org/",
  PostgREST: "https://postgrest.org/",
  Svelte: "https://svelte.dev/",
  Docker: "https://www.docker.com/",
  "C++": "https://isocpp.org/",
  "Azure Functions": "https://learn.microsoft.com/azure/azure-functions/",

  // Work history and homelab stacks.
  jQuery: "https://jquery.com/",
  Git: "https://git-scm.com/",
  Bitbucket: "https://bitbucket.org/",
  Jira: "https://www.atlassian.com/software/jira",
  Angular: "https://angular.dev/",
  "Google APIs": "https://cloud.google.com/apis/docs/overview",
  "Microsoft Graph": "https://learn.microsoft.com/graph/",
  Linux: "https://www.kernel.org/",
  Windows: "https://www.microsoft.com/windows/",
  "Active Directory":
    "https://learn.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview",
  OpenGnsys: "https://opengnsys.es/",
  "Raspberry Pi": "https://www.raspberrypi.com/",

  // Home stack and homelab chips.
  JavaScript: "https://developer.mozilla.org/docs/Web/JavaScript",
  Rust: "https://www.rust-lang.org/",
  "Synology NAS": "https://www.synology.com/",
  Ansible: "https://www.ansible.com/",
  Rsync: "https://rsync.samba.org/",
  WireGuard: "https://www.wireguard.com/",
  OpenVPN: "https://openvpn.net/",
  Gitea: "https://about.gitea.com/",
  SonarQube: "https://www.sonarsource.com/products/sonarqube/",
  "Cloudflare Tunnel":
    "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/",
};

/** Official page for a technology tag, when one exists. */
export function techLinkForTag(tag: string): string | undefined {
  return TECH_LINKS[tag];
}
