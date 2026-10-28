/**
 * Rendering helpers for the static-site generator: boot the built Fresh server
 * in-process, request each route and persist the responses.
 *
 * @module
 */

import { join } from "@std/path";
import { writeText } from "./files.ts";

export interface StaticServer {
  origin: string;
  shutdown: () => Promise<void>;
}

/**
 * Boot the *built* Fresh server in-process and expose it on a random port.
 *
 * `BASE_PATH` has to be set before the module is imported because the app reads
 * it while it is being constructed.
 */
export async function startServer(basePath: string): Promise<StaticServer> {
  Deno.env.set("BASE_PATH", basePath);

  const entry = new URL("../../_fresh/server.js", import.meta.url).href;
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

/** Render one route and write it to its `index.html`; returns the file path. */
export async function renderRoute(
  origin: string,
  basePath: string,
  route: string,
  distDir: string,
): Promise<string> {
  const url = `${origin}${basePath}${route}`;
  const response = await fetch(url);
  const html = await response.text();

  if (!response.ok) {
    throw new Error(
      `GET ${url} returned ${response.status}:\n${html.slice(0, 500)}`,
    );
  }

  const file = join(distDir, route.slice(1), "index.html");
  await writeText(file, html);
  return file;
}

/**
 * Render the custom 404 page. Fresh serves it for unknown paths, so the
 * generator requests a path that cannot exist and asserts the response status
 * before saving `404.html` (which GitHub Pages uses for missing URLs).
 */
export async function renderNotFound(
  origin: string,
  basePath: string,
  distDir: string,
  probePath: string,
): Promise<void> {
  const url = `${origin}${basePath}${probePath}`;
  const response = await fetch(url);

  if (response.status !== 404) {
    throw new Error(
      `Expected a 404 for ${url}, got ${response.status}. ` +
        `Is routes/_404.tsx wired up?`,
    );
  }

  await writeText(join(distDir, "404.html"), await response.text());
}
