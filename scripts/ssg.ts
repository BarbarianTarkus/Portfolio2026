/**
 * Static site generation (SSG).
 *
 * Fresh renders every request on the server, so turning it into a static site
 * is a matter of:
 *
 *   1. building the app and its islands with Fresh's Builder (`deno task build`),
 *   2. rendering each route through the production server handler,
 *   3. writing the resulting HTML plus the bundled assets into `dist/`,
 *   4. sanity-checking that every asset/link referenced by the HTML exists.
 *
 * The output in `dist/` is what GitHub Pages serves. Run it with:
 *
 *     deno task ssg
 *
 * `BASE_PATH` selects the deployment prefix (default: "/Portfolio2026", matching
 * this repository's GitHub Pages URL). Set `BASE_PATH=""` for a root domain.
 *
 * The implementation is split into small helpers under `scripts/lib/` so this
 * file only orchestrates the pipeline.
 *
 * @module
 */

import { join, relative } from "@std/path";
import matter from "gray-matter";
import { DEFAULT_BASE_PATH, normalizeBasePath } from "../config.ts";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  type Language,
  LOCALIZED_LANGUAGES,
  pathFor,
} from "../lib/languages.ts";
import {
  copyDirectory,
  directorySize,
  isBuildArtifact,
  removeDir,
  walkFiles,
} from "./lib/files.ts";
import { copyContentMedia } from "./lib/content-media.ts";
import { discoverRoutes } from "./lib/routes.ts";
import { renderNotFound, renderRoute, startServer } from "./lib/render.ts";
import { verifyOutput } from "./lib/verify.ts";

const ROOT = join(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");
const ROUTES_DIR = join(ROOT, "routes");
const CONTENT_DIR = join(ROOT, "content");
const STATIC_DIR = join(ROOT, "static");
const BUNDLED_ASSETS_DIR = join(ROOT, "_fresh", "static");

/** Route path that cannot exist, used to render the 404 page. */
const NOT_FOUND_PROBE = "/__fresh_ssg_404_probe__";

/**
 * Inline-edit markers are an admin-only contract: Dune's response pipeline
 * strips them for anonymous visitors, but the static export skips that
 * pipeline (DUNE_STATIC=1), so remove them here before publishing.
 */
const INLINE_EDIT_MARKER = /\s+data-dune-[a-zA-Z-]+(?:="[^"]*")?/g;

async function scrubInlineEditMarkers(distDir: string): Promise<number> {
  let changed = 0;
  for await (const file of walkFiles(distDir)) {
    if (!file.endsWith(".html")) continue;
    const html = await Deno.readTextFile(file);
    const stripped = html.replace(INLINE_EDIT_MARKER, "");
    if (stripped !== html) {
      await Deno.writeTextFile(file, stripped);
      changed++;
    }
  }
  return changed;
}

function log(message: string): void {
  console.log(`  ${message}`);
}

/** `/[lang]` → the localized routes, expanded once per non-default language. */
const LANG_PLACEHOLDER = /^\/\[lang\](?=\/|$)/;

/** `route/[slug]` placeholder of the project fiche, optionally prefixed. */
const SLUG_PLACEHOLDER = /\[slug\]/;

/**
 * `/experience/[company]/[slug]`: the two-segment placeholder of a project he
 * built on a job. It is expanded before `SLUG_PLACEHOLDER`, which would
 * otherwise swallow the `[slug]` half and emit every project slug under every
 * company.
 */
const WORK_PROJECT_PLACEHOLDER = /\[company\]\/\[slug\]/;

/** Language of a discovered route ("/en/about" → "en", everything else → "es"). */
function routeLanguage(route: string): Language {
  const first = route.split("/")[1];
  return isLanguage(first) ? first : DEFAULT_LANGUAGE;
}

/**
 * Project slugs, discovered from the project article folders
 * (`content/05.projects/<nn>.<slug>/`). The numeric prefix carries the display
 * order; the frontmatter `slug` is the source of truth for the URL, so a
 * translation may still rename it. Language variants fall back to the default
 * file when a project has not been translated.
 */
async function projectSlugs(language: Language): Promise<string[]> {
  const variants = language === DEFAULT_LANGUAGE
    ? ["default.md"]
    : [`default.${language}.md`, "default.md"];
  const dir = join(CONTENT_DIR, "05.projects");
  const folders = [...Deno.readDirSync(dir)]
    .filter((entry) => entry.isDirectory && /^\d+\./.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) =>
      Number.parseInt(a, 10) - Number.parseInt(b, 10) ||
      a.localeCompare(b)
    );

  const slugs: string[] = [];
  for (const folder of folders) {
    for (const variant of variants) {
      let source: string;
      try {
        source = await Deno.readTextFile(join(dir, folder, variant));
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) continue;
        throw error;
      }

      const { data } = matter(source);
      const slug = (data as { slug?: unknown }).slug;
      slugs.push(
        typeof slug === "string" && slug !== ""
          ? slug
          : folder.replace(/^\d+\./, ""),
      );
      break;
    }
  }
  return slugs;
}

/**
 * `<company>/<project>` pairs of the job projects, discovered from the nested
 * article folders (`content/04.experience/<nn>.<company>/<nn>.<slug>/`). The
 * company folder name carries the job slug, the project frontmatter `slug` the
 * article URL; the numeric prefixes carry the display order. Language variants
 * fall back to the default file when an article has not been translated.
 */
async function workProjectPaths(language: Language): Promise<string[]> {
  const variants = language === DEFAULT_LANGUAGE
    ? ["default.md"]
    : [`default.${language}.md`, "default.md"];
  const root = join(CONTENT_DIR, "04.experience");
  const byOrder = (a: Deno.DirEntry, b: Deno.DirEntry) =>
    Number.parseInt(a.name, 10) - Number.parseInt(b.name, 10) ||
    a.name.localeCompare(b.name);
  const jobFolders = [...Deno.readDirSync(root)]
    .filter((entry) => entry.isDirectory && /^\d+\./.test(entry.name))
    .sort(byOrder);

  const pairs: string[] = [];
  for (const jobFolder of jobFolders) {
    const company = jobFolder.name.replace(/^\d+\./, "");
    const jobDir = join(root, jobFolder.name);
    const projectFolders = [...Deno.readDirSync(jobDir)]
      .filter((entry) => entry.isDirectory && /^\d+\./.test(entry.name))
      .sort(byOrder);

    for (const projectFolder of projectFolders) {
      for (const variant of variants) {
        let source: string;
        try {
          source = await Deno.readTextFile(
            join(jobDir, projectFolder.name, variant),
          );
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) continue;
          throw error;
        }

        const { data } = matter(source);
        const slug = (data as { slug?: unknown }).slug;
        pairs.push(
          company + "/" +
            (typeof slug === "string" && slug !== ""
              ? slug
              : projectFolder.name.replace(/^\d+\./, "")),
        );
        break;
      }
    }
  }
  return pairs;
}

/**
 * `routes/[lang]/…`, `routes/experience/[company]/[slug].tsx` and
 * `routes/projects/[slug].tsx` answer several URLs at request time, but a
 * static export needs a concrete page for each. This adds one route per
 * non-default language (the default language keeps its canonical URLs), one
 * route per job project, and one route per project slug, per language.
 */
async function expandDynamicRoutes(routes: string[]): Promise<string[]> {
  const localized = routes.flatMap((route) => {
    if (!LANG_PLACEHOLDER.test(route)) return [route];
    const rest = route.replace(LANG_PLACEHOLDER, "") || "/";
    return LOCALIZED_LANGUAGES.map((language) => pathFor(language, rest));
  });

  const workRoutes = localized.filter((route) =>
    WORK_PROJECT_PLACEHOLDER.test(route)
  );
  const workPairsByLanguage = new Map<Language, string[]>();
  for (const language of new Set(workRoutes.map(routeLanguage))) {
    workPairsByLanguage.set(language, await workProjectPaths(language));
  }
  for (const [language, pairs] of workPairsByLanguage) {
    log(`${pairs.length} job project page(s) discovered for "${language}"`);
  }

  const expanded = localized.flatMap((route) => {
    if (!WORK_PROJECT_PLACEHOLDER.test(route)) return [route];
    const pairs = workPairsByLanguage.get(routeLanguage(route)) ?? [];
    return pairs.map((pair) => route.replace(WORK_PROJECT_PLACEHOLDER, pair));
  });

  const slugRoutes = expanded.filter((route) => SLUG_PLACEHOLDER.test(route));
  if (slugRoutes.length === 0) return expanded;

  const languages = new Set(slugRoutes.map(routeLanguage));
  const slugsByLanguage = new Map<Language, string[]>();
  for (const language of languages) {
    slugsByLanguage.set(language, await projectSlugs(language));
  }

  for (const [language, slugs] of slugsByLanguage) {
    log(`${slugs.length} project page(s) discovered for "${language}"`);
  }

  return expanded.flatMap((route) => {
    if (!SLUG_PLACEHOLDER.test(route)) return [route];
    const slugs = slugsByLanguage.get(routeLanguage(route)) ?? [];
    return slugs.map((slug) => route.replace(SLUG_PLACEHOLDER, slug));
  });
}

/** Print a step in the pipeline. */
function heading(message: string): void {
  console.log(`\n▸ ${message}`);
}

/** Run a `deno task` sub-command, inheriting stdout/stderr and the environment. */
async function runTask(name: string): Promise<void> {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["task", name],
    cwd: ROOT,
    env: Deno.env.toObject(),
    stdin: "null",
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await command.output();

  if (code !== 0) {
    throw new Error(`\`deno task ${name}\` failed with exit code ${code}`);
  }
}

async function main(): Promise<void> {
  const basePath = normalizeBasePath(
    Deno.env.get("BASE_PATH") ?? DEFAULT_BASE_PATH,
  );

  console.log(`\n🍋 Fresh static site export`);
  console.log(`   base path: ${basePath}/`);
  console.log(`   output:    ${DIST}`);

  // The build must see the same base path as the renderer below.
  Deno.env.set("BASE_PATH", basePath);
  // The renderer is a static export: it does not need Dune's admin panel.
  Deno.env.set("DUNE_STATIC", "1");

  heading("Building the app");
  await runTask("build");

  const routes = await expandDynamicRoutes(await discoverRoutes(ROUTES_DIR));
  const server = await startServer(basePath);

  try {
    await removeDir(DIST);

    heading("Rendering routes");
    for (const route of routes) {
      const file = await renderRoute(server.origin, basePath, route, DIST);
      log(`${route.padEnd(12)} → ${relative(ROOT, file)}`);
    }
    await renderNotFound(server.origin, basePath, DIST, NOT_FOUND_PROBE);
    log(`/404         → dist/404.html`);

    heading("Copying static and bundled assets");
    // Fresh serves unprocessed static files straight from ./static and writes
    // the bundled islands + processed CSS into ./_fresh/static. Both trees make
    // up the deployed asset set, so copy ./static first and let the processed
    // bundles overwrite their source counterparts.
    const staticFiles = await copyDirectory(STATIC_DIR, DIST, isBuildArtifact);
    const bundleFiles = await copyDirectory(
      BUNDLED_ASSETS_DIR,
      DIST,
      isBuildArtifact,
    );
    log(`${staticFiles} static files + ${bundleFiles} bundled assets copied`);

    heading("Copying content media");
    // Images uploaded through the admin live next to their page's Markdown
    // (content/06.site/og.png → /site/og.png). The dev server serves them from
    // lib/media.ts; the static host needs the files themselves.
    const mediaFiles = await copyContentMedia(CONTENT_DIR, DIST);
    log(`${mediaFiles} co-located content media file(s) copied`);

    heading("Scrubbing inline-edit markers");
    const scrubbed = await scrubInlineEditMarkers(DIST);
    log(`${scrubbed} page(s) cleaned of data-dune-* attributes`);

    // GitHub Pages runs Jekyll unless this marker exists, and Jekyll would drop
    // files/directories whose names start with an underscore.
    await Deno.writeTextFile(join(DIST, ".nojekyll"), "");
    log(".nojekyll written");

    heading("Verifying output");
    const checked = await verifyOutput(DIST, basePath);
    log(`verified ${checked} internal URLs across dist/*.html`);
  } finally {
    await server.shutdown();
  }

  const size = ((await directorySize(DIST)) / 1024).toFixed(1);
  console.log(
    `\n✅ Static site ready: ${routes.length} pages, ${size} kB in dist/\n`,
  );
}

await main();
