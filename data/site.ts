/**
 * Shared site metadata: identity, navigation, links and the project list.
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

export interface Project {
  name: string;
  description: string;
  tags: string[];
  url: string;
}

export const site = {
  /** Full name shown in the hero and in <title>. */
  author: "Ricardo Verduguez",
  /** Short logo text in the header. */
  shortTitle: "R",
  /** Document title for the home page. */
  title: "Ricardo Verduguez",
  /** Used for <meta name="description">. */
  description:
    "Portfolio of Ricardo Verduguez, software engineering student focused on cybersecurity and web development.",
  /** Headline under the name on the home page. */
  role: "Software Engineer Student",
  /** Intro paragraph on the home page. */
  intro:
    "Focusing on cybersecurity, but also interested in Web development, willing to learn new technologies and improve my skills.",
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: `https://www.linkedin.com/in/${LINKEDIN_SLUG}/`,
  /** Handles shown on the contact cards. */
  githubHandle: `@${GITHUB_USERNAME}`,
  linkedinHandle: `in/${LINKEDIN_SLUG}`,
  /** Leave empty to hide the "email" card on the contact page. */
  email: "",
  nav: [
    { title: "About", route: "/about" },
    { title: "Contact", route: "/contact" },
  ] satisfies NavItem[],
};

export const projects: Project[] = [
  {
    name: "Gaming-Scrap-Web",
    description:
      "Desktop web application that indexes game data from FitGirl, with a Svelte frontend and a Rust scraper.",
    tags: ["Svelte", "Rust", "Scraping"],
    url: `https://github.com/${GITHUB_USERNAME}/Gaming-Scrap-Web`,
  },
  {
    name: "Password-Manager",
    description:
      "Password manager built as a database administration course project, with a Svelte interface.",
    tags: ["Svelte", "Databases"],
    url: `https://github.com/${GITHUB_USERNAME}/Password-Manager`,
  },
  {
    name: "rebost-api",
    description:
      "Small REST API built on Deno KV and Oak to experiment with serverless storage.",
    tags: ["Deno", "TypeScript", "Oak"],
    url: `https://github.com/${GITHUB_USERNAME}/rebost-api`,
  },
  {
    name: "Mixology-Luismi",
    description:
      "Landing page for a cocktail service, focused on clean layout and fast loading.",
    tags: ["Astro", "CSS"],
    url: `https://github.com/${GITHUB_USERNAME}/Mixology-Luismi`,
  },
  {
    name: "Moodle Plugin Compatibility",
    description:
      "Moodle plugin that reports which installed plugins are compatible with each Moodle release.",
    tags: ["PHP", "Moodle"],
    url:
      `https://github.com/${GITHUB_USERNAME}/moodle-local_plugincompatibility`,
  },
  {
    name: "moodle_langer-script",
    description:
      "Python script that reads an English Moodle language file and produces a translation-ready version.",
    tags: ["Python", "Tooling"],
    url: `https://github.com/${GITHUB_USERNAME}/moodle_langer-script`,
  },
];
