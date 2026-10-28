/**
 * Shared site metadata: identity, navigation, links and the project catalogue.
 * Page-specific prose (About/Contact copy) lives in the matching route file.
 * Components and routes read from this module so the site can be re-branded or
 * extended without touching markup.
 */

/** Single source for the social handles and URLs defined below. */
const GITHUB_USERNAME = "BarbarianTarkus";
const LINKEDIN_SLUG = "ricardverdclar";

export interface NavItem {
  title: string;
  route: string;
}

/** External or internal destination listed at the bottom of a project fiche. */
export interface ProjectLink {
  label: string;
  href: string;
}

/**
 * One project fiche. This is not a marketing blurb: every entry answers what
 * the problem was, which trade-offs were made and what broke, so the page reads
 * like engineering notes rather than a list of technologies.
 */
/** Where a public repository comes from: a client, university, or my own work. */
export type ProjectKind = "cliente" | "académico" | "propio";

/** Human labels for `ProjectKind`, used by the project list and its index. */
export const projectKindLabels: Record<ProjectKind, string> = {
  cliente: "Cliente",
  académico: "Académico",
  propio: "Propio",
};

/**
 * One period of paid or supported work. This is the primary content of the
 * site: `experience` is rendered before any project list, and `/experience`
 * is the page a recruiter should land on.
 */
export interface Job {
  role: string;
  company: string;
  /** Human-readable range, e.g. "octubre 2023 — mayo 2026". */
  period: string;
  place: string;
  /** Technologies that actually appear in the bullets below. */
  stack: string[];
  bullets: string[];
}

export interface Project {
  /** Anchor id used by /projects and by links from other pages. */
  slug: string;
  name: string;
  /**
   * Origin of the work. The site separates professional experience
   * (`experience`) from public repositories, and this label keeps the
   * distinction visible inside the project list.
   */
  kind: ProjectKind;
  /** One sentence, no adjectives. Shown under the title. */
  summary: string;
  tags: string[];
  /** Human-readable date range, e.g. "marzo – junio 2024". */
  period: string;
  /** Compact label for the index rows where the full period does not fit. */
  year: string;
  /** Only set when the count is verified against the repository. */
  work?: string;
  links: ProjectLink[];
  problem: string;
  decisions: string[];
  /** What actually broke and how it was found/fixed. Omit if unverified. */
  broke?: string;
  /** What would be done differently today. */
  next?: string;
}

export const site = {
  /** Name shown in the hero and in <title>. */
  author: "Ricardo Verduguez",
  /** Legal/full name, used in the page footer and metadata authors. */
  fullName: "Ricardo Verduguez Claros",
  /** Short logo text in the header. */
  shortTitle: "R",
  /** Document title for the home page. */
  title: "Ricardo Verduguez — Desarrollador full-stack",
  /** Default meta description; individual pages override it. */
  description:
    "Desarrollador full-stack con base en sistemas: aplicaciones web en producción e infraestructura propia con NAS, VPN, Gitea y SonarQube.",
  /** Headline under the name on the home page. */
  role: "Desarrollador full-stack con base en sistemas",
  /** Intro paragraph on the home page. */
  intro:
    "Construyo aplicaciones web en producción y mantengo la infraestructura que las sostiene: un homelab con NAS, VPN, servidor Git propio y servicios publicados por túnel de Cloudflare.",
  /** Three verifiable facts, rendered as the rule-separated evidence strip. */
  evidence: [
    { value: "2 años y 8 meses", label: "en producción" },
    { value: "Ingeniería Informática", label: "UPC · 2026" },
    { value: "Badalona", label: "Barcelona" },
  ],
  /** Homelab technologies: shown on the home page and on /about. */
  homelabStack: [
    "Synology NAS",
    "NFS / SMB",
    "Docker",
    "Ansible",
    "Rsync",
    "WireGuard",
    "OpenVPN",
    "Gitea",
    "SonarQube",
    "Cloudflare Tunnel",
  ],
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: `https://www.linkedin.com/in/${LINKEDIN_SLUG}/`,
  /** Handles shown on the contact cards. */
  githubHandle: `@${GITHUB_USERNAME}`,
  linkedinHandle: `in/${LINKEDIN_SLUG}`,
  /** Public contact address. Empty hides the card. */
  email: "ricardoverdclar@gmail.com",
  nav: [
    { title: "Experiencia", route: "/experience" },
    { title: "Proyectos", route: "/projects" },
    { title: "Sobre mí", route: "/about" },
    { title: "Contacto", route: "/contact" },
  ] satisfies NavItem[],
};

export const projects: Project[] = [
  {
    slug: "moodle",
    name: "Herramientas para Moodle",
    kind: "propio",
    year: "2023",
    summary:
      "Dos utilidades propias alrededor de Moodle: un traductor de ficheros de idioma y un bloque que publica un chiste del día.",
    tags: ["Python", "PHP", "Moodle", "PyInstaller"],
    period: "octubre — noviembre 2023",
    work: "7 + 22 commits",
    links: [
      {
        label: "moodle_langer-script",
        href: `https://github.com/${GITHUB_USERNAME}/moodle_langer-script`,
      },
      {
        label: "mod_jokeofday",
        href: `https://github.com/${GITHUB_USERNAME}/mod_jokeofday`,
      },
    ],
    problem:
      "Los plugins de cliente había que traducirlos a mano, clave a clave, sobre el fichero de idioma de Moodle. En paralelo quería recorrer el ciclo completo de un plugin propio: instalación, bloque, permisos y una API externa.",
    decisions: [
      "El script lee el fichero `lang/en` original y genera `lang/es` conservando la estructura de carpetas de Moodle, así que el resultado se importa sin tocar nada más.",
      "Cacheo las traducciones en un JSON local: cada llamada a la API de traducción se paga, y al repetir un fichero solo se traduce lo que ha cambiado.",
      "Lo empaqueté con PyInstaller en un único ejecutable para que se pueda usar sin instalar Python ni dependencias.",
    ],
    next:
      "Solo traduce a un idioma por ejecución. Lo siguiente sería recorrer varios idiomas en la misma pasada y añadir un modo de revisión que marque las cadenas dudosas en vez de escribirlas directamente.",
  },
  {
    slug: "petsalut",
    name: "PetSalut",
    kind: "académico",
    year: "2024",
    summary:
      "Aplicación web de gestión para clínicas veterinarias, desarrollada en equipo dentro del proyecto de la UPC.",
    tags: ["C++", "PostgreSQL", "GitHub Actions", "Azure Functions"],
    period: "marzo — junio 2024",
    work: "12 PRs mergeados",
    links: [
      {
        label: "AMEP-UPC/PetSalut",
        href: "https://github.com/AMEP-UPC/PetSalut",
      },
    ],
    problem:
      "El equipo tenía que entregar un sistema con tres actores (clínicas, propietarios y mascotas) y hacerlo con un flujo de trabajo real —ramas, pull requests y CI—, no con un ZIP al final del cuatrimestre.",
    decisions: [
      "Cada funcionalidad entraba por pull request revisado por otra persona del equipo: 12 PRs mergeados, sin commits directos a la rama principal.",
      "La integración continua corría en GitHub Actions y desplegaba en Azure Functions, para que la entrega no dependiera de que alguien compilara en su portátil.",
      "Fijamos primero el esquema de base de datos y las historias de usuario; cada cambio de esquema obligaba a reescribir las historias antes de seguir con la interfaz.",
    ],
    broke:
      "Empezamos a programar sin una base de datos sólida y la clase de conexión dejó de responder a mitad del proyecto: sin conexión no había forma de probar el CRUD ni de cerrar tareas. Se arregló rediseñando el diagrama de clases de la base de datos y redefiniendo las historias, y de paso unificamos el login de clínicas y propietarios en una sola interfaz.",
    next:
      "Separaría la capa de acceso a datos de la interfaz desde el primer día: en un equipo, una clase de conexión mal aislada bloquea a todo el mundo a la vez.",
  },
  {
    slug: "password-manager",
    name: "Password-Manager",
    kind: "académico",
    year: "2022–25",
    summary:
      "Gestor de contraseñas para la asignatura de administración de bases de datos: PostgreSQL ajustado a mano, PostgREST como API y Svelte en el front.",
    tags: ["PostgreSQL", "PostgREST", "Svelte", "Docker"],
    period: "2022 — 2025",
    work: "23 commits",
    links: [
      {
        label: "BarbarianTarkus/Password-Manager",
        href: `https://github.com/${GITHUB_USERNAME}/Password-Manager`,
      },
    ],
    problem:
      "La asignatura pedía administrar una base de datos de verdad: justificar la configuración, los permisos y las consultas sobre datos que crecen, no un CRUD de juguete.",
    decisions: [
      "Usé PostgREST en vez de escribir un backend propio: la API sale del esquema y de las políticas de la base de datos, así que los permisos se definen en un solo sitio.",
      "Ajusté `postgresql.conf` a mano —memoria compartida, caché efectiva, número de conexiones— en lugar de quedarme con los valores por defecto, pensados para un portátil y no para un servidor.",
      "Docker para que PostgreSQL, PostgREST y pgAdmin se levanten igual en cualquier máquina, incluida la del corrector.",
    ],
    next:
      "Definiría las políticas de acceso a nivel de fila antes de la interfaz: es más limpio que ocultar en el cliente lo que la API no debería devolver nunca.",
  },
  {
    slug: "rebost-api",
    name: "rebost-api",
    kind: "propio",
    year: "2025",
    summary:
      "API para una aplicación de la compra, construida con Deno KV y Oak como excusa para probar almacenamiento serverless sin administrar una base de datos.",
    tags: ["Deno", "TypeScript", "Deno KV", "Oak"],
    period: "abril 2025",
    work: "8 commits",
    links: [
      {
        label: "BarbarianTarkus/rebost-api",
        href: `https://github.com/${GITHUB_USERNAME}/rebost-api`,
      },
    ],
    problem:
      "Quería una API para una app de la compra sin montar un servidor de base de datos, y comprobar si Deno KV servía para algo más que un ejemplo de la documentación.",
    decisions: [
      "Oak como router: es el framework que ya usaba el ecosistema de Deno y no obliga a arrastrar Express ni un framework pesado.",
      "Deno KV en lugar de PostgreSQL: cero provisión y cero copias de seguridad que mantener, a cambio de atar el proyecto a las APIs del runtime.",
      "Despliegue con `deployctl` a Deno Deploy y una tarea de depuración para VS Code, para trabajar en local con el mismo código que corre en producción.",
    ],
    broke:
      "El arranque en local se rompía cada vez que Deno renombraba sus flags inestables (`--unstable-kv` pasó a `--unstable`). Lo dejé documentado en el README para no volver a perder una tarde en el mismo error.",
    next:
      "No usaría APIs inestables para nada que quiera seguir funcionando: parte del trabajo del repositorio se fue en adaptarse al runtime, no en funcionalidad.",
  },
  {
    slug: "mixology",
    name: "Mixology-Luismi",
    kind: "cliente",
    year: "2026",
    summary:
      "Landing page para un servicio de coctelería: sitio estático con Astro y un CMS headless para que el cliente edite sin tocar código.",
    tags: ["Astro", "TinaCMS", "Cloudflare", "GitHub Actions"],
    period: "enero — octubre 2026",
    work: "69 commits",
    links: [
      {
        label: "BarbarianTarkus/Mixology-Luismi",
        href: `https://github.com/${GITHUB_USERNAME}/Mixology-Luismi`,
      },
    ],
    problem:
      "Un amigo empezaba con un servicio de coctelería y necesitaba presencia web con presupuesto casi nulo: dominio barato, hosting gratuito y capacidad de cambiar textos y fotos sin llamarme.",
    decisions: [
      "Astro en modo estático servido desde Cloudflare: coste de hosting cero y ningún servidor que mantener, que era la condición del encargo.",
      "Comparé Strapi, Decap y TinaCMS; me quedé con TinaCMS porque ofrece edición visual real y no obliga a autohospedar nada, algo que el cliente no podría mantener.",
      "Generé la primera versión visual con ayuda de IA para iterar rápido y después fijé tipografía, colores y espaciado a mano: dejar el sistema en manos del generador producía inconsistencias.",
    ],
    broke:
      "El diseño generado con IA no mantenía un sistema: cada pantalla traía otra escala y otra paleta, y encajarlas costaba más que partir de una guía propia. La lección fue que la IA acelera la primera versión, pero los tokens de diseño se escriben a mano.",
    next:
      "Empezaría por un sistema de diseño mínimo —dos tipografías, tres colores, una escala de espaciado— antes de generar pantallas; ahora lo caro es rehacer estilos, no lógica.",
  },
];

/**
 * Work history, most recent first. Kept here rather than in a route because the
 * home page (compact) and /experience (full) render the same source.
 */
export const experience: Job[] = [
  {
    role: "Junior Web Developer",
    company: "3iPunt",
    period: "octubre 2023 — mayo 2026",
    place: "Barcelona",
    stack: [
      "PHP",
      "JavaScript",
      "Moodle",
      "jQuery",
      "Git",
      "Bitbucket",
      "Jira",
    ],
    bullets: [
      "Desarrollo full-stack de aplicaciones web en producción con PHP, JavaScript, Moodle y jQuery.",
      "Control de versiones y trabajo con ramas en Git y Bitbucket.",
      "Seguimiento de incidencias, tareas y planificación en Jira.",
      "Colaboración con el equipo técnico en un entorno de consultoría y desarrollo a medida.",
    ],
  },
  {
    role: "Desarrollador backend PHP",
    company: "4DMOVIN Business / Namastech",
    period: "junio 2022 — septiembre 2022",
    place: "Castelldefels",
    stack: [
      "PHP",
      "Angular",
      "Google APIs",
      "Microsoft Graph",
      "IMAP / POP / SMTP",
    ],
    bullets: [
      "Desarrollo sobre un ERP en PHP y Angular.",
      "Automatización de correos y sincronización de calendarios integrando Google APIs y Microsoft Graph API, mejorando la compatibilidad con IMAP, POP y SMTP.",
      "Pantalla de gestión y automatización de redes sociales (posts y feeds).",
    ],
  },
  {
    role: "Soporte TIC (becario)",
    company: "EPSEVG — Universitat Politècnica de Catalunya",
    period: "noviembre 2020 — enero 2022",
    place: "Barcelona",
    stack: [
      "Linux",
      "Windows",
      "Active Directory",
      "OpenGnsys",
      "Raspberry Pi",
    ],
    bullets: [
      "Helpdesk para el personal de la UPC: incidencias informáticas de primer nivel.",
      "Administración de sistemas Linux y Windows: cuentas, permisos y resolución de incidencias.",
      "Gestión de imágenes de sistemas operativos con OpenGnsys.",
      "Puesta en marcha del Digital Signage de la universidad: sistema operativo Linux y hardware Raspberry.",
    ],
  },
];
