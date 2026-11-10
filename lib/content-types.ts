/**
 * Content model for the Dune-managed pages in `content/`.
 *
 * Every page is a Dune flat-file page (`content/<nn>.<name>/default.md`) whose
 * YAML frontmatter mirrors the object shapes below exactly. These interfaces
 * describe the frontmatter only: Dune adds its own page fields (`published`,
 * `visible`, `routable`, `route`, ...) around it, so those are not listed.
 *
 * @module
 */

/** Page `<head>` metadata shared by the content pages. */
export interface PageMeta {
  title: string;
  description: string;
}

/** A section heading with its display order ("01", "02", ...). */
export interface SectionHeading {
  num: string;
  title: string;
}

/** A section heading plus the "see more" link rendered next to it. */
export interface LinkedSectionHeading extends SectionHeading {
  linkLabel: string;
  linkRoute: string;
}

/** A link rendered as a button or inline action. */
export interface ActionLink {
  label: string;
  route: string;
}

/* -------------------------------------------------------------------------- */
/* content/06.site/default.md                                                 */
/* -------------------------------------------------------------------------- */

/** One claim in the evidence strip of the home hero. */
export interface EvidenceItem {
  value: string;
  label: string;
}

/** One entry of the primary navigation. */
export interface NavItem {
  title: string;
  route: string;
}

/** Accessible labels and UI strings used by the shared layout. */
export interface SiteLabels {
  skipToContent: string;
  mainNav: string;
  openMenu: string;
  closeMenu: string;
  socialNav: string;
  githubProfile: string;
  linkedinProfile: string;
  contactEyebrow: string;
  location: string;
  homeLink: string;
}

/** Copy for the 404 page. */
export interface NotFoundContent {
  metaTitle: string;
  metaDescription: string;
  code: string;
  heading: string;
  lede: string;
  button: string;
}

/** Site globals shared by every route: identity, nav, labels and 404 copy. */
export interface SiteContent {
  author: string;
  fullName: string;
  shortTitle: string;
  title: string;
  description: string;
  role: string;
  intro: string;
  evidence: EvidenceItem[];
  homelabStack: string[];
  stack: string[];
  github: string;
  linkedin: string;
  githubHandle: string;
  linkedinHandle: string;
  email: string;
  nav: NavItem[];
  labels: SiteLabels;
  notFound: NotFoundContent;
}

/* -------------------------------------------------------------------------- */
/* content/01.home/default.md                                                 */
/* -------------------------------------------------------------------------- */

/** One "focus" block of the home page (title plus short body). */
export interface FocusItem {
  title: string;
  body: string;
}

/** Projects section heading of the home page: heading, link and note. */
export interface ProjectsSectionHeading extends LinkedSectionHeading {
  note: string;
}

/** Stack section heading of the home page: heading, link and column labels. */
export interface StackSectionHeading extends LinkedSectionHeading {
  stackLabel: string;
  infrastructureLabel: string;
}

/** Home page copy: hero, section headings, focus blocks and stack chips. */
export interface HomeContent {
  /** Dune page title (not rendered as page copy). */
  title: string;
  eyebrow: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
  experienceSection: LinkedSectionHeading;
  projectsSection: ProjectsSectionHeading;
  focus: FocusItem[];
  stackSection: StackSectionHeading;
}

/* -------------------------------------------------------------------------- */
/* content/02.about/default.md                                                */
/* -------------------------------------------------------------------------- */

/** About page copy: lede, story paragraphs, stack and "where to follow". */
export interface AboutContent {
  meta: PageMeta;
  title: string;
  lede: string;
  paragraphs: string[];
  stackSection: SectionHeading;
  followSection: SectionHeading;
  follow: string;
}

/* -------------------------------------------------------------------------- */
/* content/03.contact/default.md                                              */
/* -------------------------------------------------------------------------- */

/** One contact channel: visible label plus a short hint. */
export interface ContactChannel {
  label: string;
  hint: string;
}

/** Contact page copy: lede and the three contact channels. */
export interface ContactContent {
  meta: PageMeta;
  title: string;
  lede: string;
  email: ContactChannel;
  github: ContactChannel;
  linkedin: ContactChannel;
}

/* -------------------------------------------------------------------------- */
/* content/04.experience/default.md                                          */
/* -------------------------------------------------------------------------- */

/** One job entry of the experience timeline. */
export interface JobEntry {
  role: string;
  company: string;
  period: string;
  place: string;
  stack: string[];
  bullets: string[];
}

/** One education entry of the experience page. */
export interface EducationEntry {
  period: string;
  role: string;
  company: string;
  /**
   * Inline Markdown paragraph under the degree: what the coursework covered.
   * Optional so an entry can stay a bare period/role/company line.
   */
  summary?: string;
  /**
   * Coursework projects that have their own page in /projects, listed right
   * under the summary; each item is inline Markdown (usually a link).
   */
  projectsLabel?: string;
  projects?: string[];
  /** Lead-in over the coursework bullets ("Aprendizaje que destaco"). */
  bulletsLabel?: string;
  /** What the coursework taught, one bullet per skill; inline Markdown. */
  bullets?: string[];
  /** Technologies used in the coursework, rendered as labeled tiles. */
  stack?: string[];
}

/** Experience page copy: jobs timeline, education and closing note. */
export interface ExperienceContent {
  meta: PageMeta;
  title: string;
  lede: string;
  linkedinLabel: string;
  jobsSection: SectionHeading;
  jobs: JobEntry[];
  educationSection: SectionHeading;
  education: EducationEntry;
  outroSection: SectionHeading;
  outro: string;
}

/* -------------------------------------------------------------------------- */
/* content/05.projects/default.md                                            */
/* -------------------------------------------------------------------------- */

/**
 * Project category as stored in the page data.
 *
 * The value is also the key used in `kindLabels`, so both use the accented
 * "académico" spelling (the legacy JSON mixed "academico" with an accented
 * label key, which rendered an empty category label for academic projects).
 */
export type ProjectKind = "cliente" | "académico" | "propio";

/** Human-readable label per project category. */
export interface ProjectKindLabels {
  cliente: string;
  "académico": string;
  propio: string;
}

/** Labels of the expanded project blocks. */
export interface FicheLabels {
  problem: string;
  decisions: string;
}

/** One headline metric of the homelab hero. */
export interface HomelabFact {
  value: string;
  label: string;
}

/** Featured homelab block that opens the projects page. */
export interface HomelabHero {
  eyebrow: string;
  title: string;
  note: string;
  facts: HomelabFact[];
}

/** One link (repository, demo, ...) attached to a project. */
export interface ProjectLink {
  label: string;
  href: string;
  /**
   * Optional role. `demo` marks the live site: the card links the project
   * name there and builds its call to action from that URL.
   */
  kind?: "demo" | "repo";
  /**
   * Optional site-root-relative icon of the linked page, e.g.
   * `/projects/phenomorph/favicon.png`. Without one, repositories get the
   * GitHub glyph and other sites an arrow.
   */
  icon?: string;
}

/** One screenshot of a project gallery. */
export interface ProjectImage {
  /** Root-relative path under `static/`, e.g. `/projects/slug/shot.webp`. */
  src: string;
  alt: string;
  caption?: string;
}

/** Viewport a gallery pack was captured for: desktop web or phone. */
export type ProjectGalleryView = "web" | "mobile";

/**
 * One pack of screenshots for a viewport. A project can have a web pack, a
 * mobile pack or both; the card shows a selector only when there is more than
 * one pack.
 */
export interface ProjectGalleryGroup {
  view: ProjectGalleryView;
  label: string;
  images: ProjectImage[];
}

/** One project card and the content of its collapsed detail block. */
export interface Project {
  slug: string;
  name: string;
  kind: ProjectKind;
  year: string;
  summary: string;
  tags: string[];
  period: string;
  /** Verified work count, e.g. "69 commits" or "12 PRs mergeados". */
  work?: string;
  links: ProjectLink[];
  /**
   * Screenshot packs in source order. The first image of the first pack is
   * the card's cover; the rest live inside the collapsible detail block.
   */
  gallery?: ProjectGalleryGroup[];
  problem: string;
  decisions: string[];
}

/** Projects page copy: intro, card labels and the project list. */
export interface ProjectsContent {
  meta: PageMeta;
  title: string;
  lede: string;
  homelab: HomelabHero;
  kindLabels: ProjectKindLabels;
  ficheLabels: FicheLabels;
  /** Label of the closed `<details>` summary. */
  detailsLabel: string;
  /** Label shown while the detail block is open. */
  detailsCloseLabel: string;
  /** Accessible name of the Web/Mobile gallery selector. */
  galleryViewLabel: string;
  /**
   * Call to action on every card. It opens the project's demo when there is
   * one, or its repository otherwise.
   */
  visitLabel: string;
  projects: Project[];
}
