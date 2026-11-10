/**
 * Copy Dune's co-located page media into the static export.
 *
 * `deno task ssg` renders the Fresh routes and copies `static/` and the bundled
 * assets, but media uploaded through the admin lives inside `content/` next to
 * each page's Markdown file. The dev server serves those files through
 * `lib/media.ts`; a static host has no such handler, so the export has to place
 * them at the URL path Dune advertises (`content/06.site/og.png` → `/site/og.png`).
 *
 * Only media owned by an indexed page is copied: directories starting with an
 * underscore (`_drafts`, modules) and `*.md`/`*.mdx`/`*.tsx` page files stay out
 * of `dist/`, matching what the site actually publishes.
 *
 * @module
 */

import { dirname, join } from "@std/path";
import { isMediaFile } from "@dune/core/content/path-utils";

/** Files that make a directory a routable page (Dune's supported formats). */
const PAGE_FILE = /\.(md|mdx|tsx)$/i;

/** A directory counts as a page when it holds a content file directly. */
async function hasPageFile(dir: string): Promise<boolean> {
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isFile && PAGE_FILE.test(entry.name)) return true;
  }
  return false;
}

/** Copy media files below `dir`, preserving their position under `urlPath`. */
async function copyMediaTree(
  dir: string,
  urlPath: string,
  distDir: string,
): Promise<number> {
  let copied = 0;
  for await (const entry of Deno.readDir(dir)) {
    const path = join(dir, entry.name);
    if (entry.isDirectory) {
      // Nested pages are copied by their own URL, never as a parent's media.
      if (await hasPageFile(path)) continue;
      copied += await copyMediaTree(path, `${urlPath}/${entry.name}`, distDir);
    } else if (isMediaFile(entry.name)) {
      const target = join(distDir, ...urlPath.split("/"), entry.name);
      await Deno.mkdir(dirname(target), { recursive: true });
      await Deno.copyFile(path, target);
      copied++;
    }
  }
  return copied;
}

/** Copy the media that belongs directly to one page directory. */
async function copyPageMedia(
  pageDir: string,
  urlPath: string,
  distDir: string,
): Promise<number> {
  let copied = 0;
  for await (const entry of Deno.readDir(pageDir)) {
    if (!entry.isDirectory) continue;
    const path = join(pageDir, entry.name);
    if (await hasPageFile(path)) continue;
    copied += await copyMediaTree(path, urlPath, distDir);
  }
  for await (const entry of Deno.readDir(pageDir)) {
    if (!entry.isFile || !isMediaFile(entry.name)) continue;
    const target = join(distDir, ...urlPath.split("/"), entry.name);
    await Deno.mkdir(dirname(target), { recursive: true });
    await Deno.copyFile(join(pageDir, entry.name), target);
    copied++;
  }
  return copied;
}

/**
 * Walk `contentDir` and copy every page's co-located media into `distDir`.
 *
 * Route segments drop Dune's ordering prefix (`06.site` → `site`), the same
 * transformation Dune applies when it builds page routes.
 */
export async function copyContentMedia(
  contentDir: string,
  distDir: string,
): Promise<number> {
  let copied = 0;
  const walk = async (
    dir: string,
    segments: string[],
  ): Promise<void> => {
    for await (const entry of Deno.readDir(dir)) {
      if (!entry.isDirectory) continue;
      // Dune's private conventions: drafts and module folders are not public.
      if (entry.name.startsWith("_")) continue;
      const path = join(dir, entry.name);
      const slug = entry.name.replace(/^\d+\./, "");
      const url = [...segments, slug];
      if (await hasPageFile(path)) {
        copied += await copyPageMedia(path, url.join("/"), distDir);
      }
      await walk(path, url);
    }
  };
  await walk(contentDir, []);
  return copied;
}
