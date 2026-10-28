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
  stack: string[];
}

/* -------------------------------------------------------------------------- */
/* content/02.about/default.md                                                */
/* -------------------------------------------------------------------------- */

/** About page copy: lede, story paragraphs, homelab and "where to follow". */
export interface AboutContent {
  meta: PageMeta;
  title: string;
  lede: string;
  paragraphs: string[];
  homelabSection: SectionHeading;
  homelabNote: string;
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

/** Labels of the blocks in a project fiche. */
export interface FicheLabels {
  problem: string;
  decisions: string;
  broke: string;
  next: string;
}

/** One link (repository, demo, ...) attached to a project. */
export interface ProjectLink {
  label: string;
  href: string;
}

/** One project fiche. */
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
  problem: string;
  decisions: string[];
  /** What broke while building it, when the project has such a story. */
  broke?: string;
  /** What the author would do differently next time. */
  next?: string;
}

/** Projects page copy: intro, index/fiche labels and the project list. */
export interface ProjectsContent {
  meta: PageMeta;
  title: string;
  lede: string;
  kindLabels: ProjectKindLabels;
  indexAriaLabel: string;
  fichesEyebrow: string;
  ficheLabels: FicheLabels;
  projects: Project[];
}
