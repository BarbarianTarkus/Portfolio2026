/**
 * Small filesystem helpers shared by the build tooling (`scripts/ssg.ts`).
 *
 * Kept separate from the orchestration so each file stays small and easy to
 * reason about (and SonarQube's per-file complexity stays low).
 *
 * @module
 */

import { dirname, join, relative, SEPARATOR } from "@std/path";

/** Recursively yield every file below `dir`. */
export async function* walkFiles(dir: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const path = join(dir, entry.name);
    if (entry.isDirectory) {
      yield* walkFiles(path);
    } else {
      yield path;
    }
  }
}

export async function writeText(path: string, content: string): Promise<void> {
  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeTextFile(path, content);
}

export async function removeDir(dir: string): Promise<void> {
  try {
    await Deno.remove(dir, { recursive: true });
  } catch {
    // Nothing to remove (e.g. the first run); treat it as already clean.
  }
}

/** Copy every file from `source` into `destination`, skipping paths matched by `skip`. */
export async function copyDirectory(
  source: string,
  destination: string,
  skip: (relativePath: string) => boolean,
): Promise<number> {
  let copied = 0;
  for await (const file of walkFiles(source)) {
    const relativePath = relative(source, file);
    if (skip(relativePath)) continue;
    const target = join(destination, relativePath);
    await Deno.mkdir(dirname(target), { recursive: true });
    await Deno.copyFile(file, target);
    copied++;
  }
  return copied;
}

/** Fresh's internal build metadata must not leak into `dist/`. */
export function isBuildArtifact(relativePath: string): boolean {
  const segments = relativePath.split(SEPARATOR);
  const name = segments[segments.length - 1];
  return name === "metafile.json" || name.endsWith(".map");
}

export async function directorySize(dir: string): Promise<number> {
  let total = 0;
  for await (const file of walkFiles(dir)) {
    total += (await Deno.stat(file)).size;
  }
  return total;
}
