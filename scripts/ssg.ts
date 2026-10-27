/**
 * Static site generation (SSG).
 *
 * Fresh renders every request on the server, so turning it into a static site
 * is a matter of:
 *
 *   1. building the app with Vite (`deno task build`),
 *   2. rendering each route through the production server handler,
 *   3. writing the resulting HTML plus the hashed assets into `dist/`,
 *   4. sanity-checking that every asset/link referenced by the HTML exists.
 *
 * The output in `dist/` is what GitHub Pages serves. Run it with:
 *
 *     deno task ssg
 *
 * `BASE_PATH` selects the deployment prefix (default: "/Portfolio", matching
 * this repository's GitHub Pages URL). Set `BASE_PATH=""` for a root domain.
 *
 * @module
 */

import { dirname, join, relative, SEPARATOR } from "@std/path";
import { DEFAULT_BASE_PATH, normalizeBasePath } from "../config.ts";

const ROOT = join(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");
const ROUTES_DIR = join(ROOT, "routes");
const SERVER_DIR = join(ROOT, "_fresh");

/** Route path that cannot exist, used to render the 404 page. */
const NOT_FOUND_PROBE = "/__fresh_ssg_404_probe__";

function log(message: string): void {
  console.log(`  ${message}`);
}

function heading(message: string): void {
  console.log(`\n▸ ${message}`);
}

/** Recursively yield every file below `dir`. */
async function* walkFiles(dir: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const path = join(dir, entry.name);
    if (entry.isDirectory) {
      yield* walkFiles(path);
    } else if (entry.isFile) {
      yield path;
    }
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function writeText(path: string, content: string): Promise<void> {
  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeTextFile(path, content);
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

/**
 * File-system routes → URL paths. Mirrors Fresh's conventions closely enough
 * for this project: `index.tsx` is `/`, `about.tsx` is `/about`, files that
 * start with `_` (layouts, 404, middleware) and the `api/` directory are not
 * pages.
 */
async function discoverRoutes(): Promise<string[]> {
  const routes: string[] = [];

  for await (const file of walkFiles(ROUTES_DIR)) {
    const segments = relative(ROUTES_DIR, file).split(SEPARATOR);
    const fileName = segments.at(-1)!;
    if (!fileName.endsWith(".tsx")) continue;
    if (
      segments.some((segment) => segment.startsWith("_") || segment === "api")
    ) {
      continue;
    }

    segments[segments.length - 1] = fileName.replace(/\.tsx$/, "");
    if (segments.at(-1) === "index") segments.pop();

    routes.push(`/${segments.join("/")}`);
  }

  return routes.sort();
}

/**
 * Boot the *built* Fresh server in-process and expose it on a random port.
 *
 * `BASE_PATH` has to be set before the module is imported because the app reads
 * it while it is being constructed.
 */
async function startServer(
  basePath: string,
): Promise<{ origin: string; shutdown: () => Promise<void> }> {
  Deno.env.set("BASE_PATH", basePath);

  const entry = new URL("../_fresh/server.js", import.meta.url).href;
  const module = await import(entry) as {
    default: { fetch: (request: Request) => Response | Promise<Response> };
  };

  const server = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {/* quiet */} },
    module.default.fetch,
  );
  const { port } = server.addr as Deno.NetAddr;

  return {
    origin: `http://127.0.0.1:${port}`,
    shutdown: () => server.shutdown(),
  };
}

async function fetchPage(
  origin: string,
  basePath: string,
  route: string,
): Promise<string> {
  const url = `${origin}${basePath}${route === "/" ? "/" : route}`;
  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `GET ${url} returned ${response.status}:\n${body.slice(0, 500)}`,
    );
  }
  return body;
}

/** Copy `_fresh/client/**` (hashed JS/CSS/fonts/static files) into `dist/`. */
async function copyClientAssets(): Promise<number> {
  const source = join(SERVER_DIR, "client");
  if (!(await pathExists(source))) {
    throw new Error("`_fresh/client` is missing; did the Vite build run?");
  }

  let copied = 0;
  for await (const file of walkFiles(source)) {
    const relPath = relative(source, file);
    if (relPath.split(SEPARATOR).includes(".vite")) continue;
    const destination = join(DIST, relPath);
    await Deno.mkdir(dirname(destination), { recursive: true });
    await Deno.copyFile(file, destination);
    copied++;
  }
  return copied;
}

/** Where an absolute URL path is expected to live inside `dist/`. */
function candidatesForUrl(urlPath: string, basePath: string): string[] {
  const rel = urlPath.slice(basePath.length).replace(/^\//, "");
  if (rel === "" || rel.endsWith("/")) {
    return [join(rel, "index.html")];
  }
  return [rel, join(rel, "index.html")];
}

/**
 * Verify that every root-relative URL in the generated HTML resolves to a file
 * in `dist/`. This catches the classic GitHub Pages bugs: an asset prefix that
 * does not match the deployment path, or a link to a page that was not emitted.
 */
async function verifyOutput(basePath: string): Promise<void> {
  const problems: string[] = [];
  const baseWithSlash = `${basePath}/`;
  let checked = 0;

  for await (const file of walkFiles(DIST)) {
    if (!file.endsWith(".html")) continue;
    const html = await Deno.readTextFile(file);
    const relativeFile = relative(DIST, file);

    // Attributes (href/src) plus ES module specifiers from the island boot
    // script (`import ... from "/assets/..."`), which are just as important.
    const urlPattern = /(?:(?:href|src)=|\bfrom\s+|\bimport\s+)"(\/[^"?#]*)/g;

    for (const match of html.matchAll(urlPattern)) {
      const urlPath = match[1];
      checked++;

      if (!urlPath.startsWith(baseWithSlash) && urlPath !== basePath) {
        problems.push(
          `${relativeFile}: unprefixed URL "${urlPath}" (expected it to start with "${basePath}")`,
        );
        continue;
      }

      const candidates = candidatesForUrl(urlPath, basePath);
      const exists = await Promise.all(
        candidates.map((candidate) => pathExists(join(DIST, candidate))),
      );
      if (!exists.some(Boolean)) {
        problems.push(
          `${relativeFile}: "${urlPath}" does not exist in dist/ (tried ${
            candidates.join(", ")
          })`,
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Static output verification failed:\n  - ${problems.join("\n  - ")}`,
    );
  }

  log(`verified ${checked} internal URLs across dist/*.html`);
}

async function main(): Promise<void> {
  const basePath = normalizeBasePath(
    Deno.env.get("BASE_PATH") ?? DEFAULT_BASE_PATH,
  );
  const displayBase = basePath === "" ? "/" : `${basePath}/`;

  console.log(`\n🍋 Fresh static site export`);
  console.log(`   base path: ${displayBase}`);
  console.log(`   output:    ${DIST}`);

  heading("Building the app");
  // The build must see the same base path as the renderer below.
  Deno.env.set("BASE_PATH", basePath);
  await runTask("build");

  heading("Rendering routes");
  const routes = await discoverRoutes();
  const server = await startServer(basePath);

  try {
    await Deno.remove(DIST, { recursive: true }).catch(() => {});

    for (const route of routes) {
      const html = await fetchPage(server.origin, basePath, route);
      const file = route === "/"
        ? join(DIST, "index.html")
        : join(DIST, route.slice(1), "index.html");
      await writeText(file, html);
      log(`${route.padEnd(12)} → ${relative(ROOT, file)}`);
    }

    // GitHub Pages serves this file for unknown paths.
    const notFoundUrl = `${server.origin}${basePath}${NOT_FOUND_PROBE}`;
    const notFound = await fetch(notFoundUrl);
    if (notFound.status !== 404) {
      throw new Error(
        `Expected a 404 for ${notFoundUrl}, got ${notFound.status}. ` +
          `Is routes/_404.tsx wired up?`,
      );
    }
    await writeText(join(DIST, "404.html"), await notFound.text());
    log(`/404         → dist/404.html`);

    heading("Copying client assets");
    const copied = await copyClientAssets();
    log(`${copied} files copied from _fresh/client`);

    // GitHub Pages runs Jekyll unless this marker exists, and Jekyll would drop
    // files/directories whose names start with an underscore.
    await Deno.writeTextFile(join(DIST, ".nojekyll"), "");
    log(".nojekyll written");

    heading("Verifying output");
    await verifyOutput(basePath);
  } finally {
    await server.shutdown();
  }

  const size = await directorySize(DIST);
  console.log(
    `\n✅ Static site ready: ${routes.length} pages, ${
      formatBytes(size)
    } in dist/\n`,
  );
}

async function directorySize(dir: string): Promise<number> {
  let total = 0;
  for await (const file of walkFiles(dir)) {
    total += (await Deno.stat(file)).size;
  }
  return total;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

if (import.meta.main) {
  await main();
}
