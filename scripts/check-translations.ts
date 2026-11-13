/**
 * Guard the translated content pages against drift from the Spanish source.
 *
 * Every page folder in content/ can ship a translation next to its Spanish
 * source (`default.md` → `default.en.md`, `default.ca.md`), including the
 * project article folders nested under 05.projects. The site renders whatever
 * the translation defines, so a typo in a key or a translated URL silently
 * breaks a page or a link. This script parses both frontmatters and reports:
 *
 * - structural drift: missing/extra keys, type changes, array length changes;
 * - translated invariants: URLs, routes, slugs, emails and technology tag names
 *   must stay identical to the source (only prose is translated);
 * - a non-empty Markdown body (all copy of this site lives in frontmatter).
 *
 * Usage:
 *   deno run -A scripts/check-translations.ts            # en + ca
 *   deno run -A scripts/check-translations.ts ca          # one language
 *   deno run -A scripts/check-translations.ts --require-all
 *                                                        # fail on missing files
 *
 * @module
 */

import { join, relative } from "@std/path";
import { parse as parseYaml } from "@std/yaml";
import {
  type Language,
  TRANSLATED_LANGUAGES,
} from "../lib/languages.ts";

const ROOT = join(import.meta.dirname!, "..");
const CONTENT_DIR = join(ROOT, "content");

/** Keys whose value is a machine-readable identifier, never prose. */
const INVARIANT_KEYS = new Set([
  "slug",
  "route",
  "linkRoute",
  "href",
  "url",
  "email",
  "emailAlt",
  "id",
  "kind",
  "icon",
  "code",
  "ogImage",
  "image",
  "src",
  "languages",
  "language",
]);

/** Keys holding arrays of technology names (they drive the stack map). */
const TAG_KEYS = new Set(["stack", "homelabStack", "tags", "technologies"]);

interface Problem {
  file: string;
  message: string;
}

interface Frontmatter {
  data: Record<string, unknown>;
  body: string;
}

function readFrontmatter(path: string): Frontmatter {
  const text = Deno.readTextFileSync(path).replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    throw new Error(`${path}: missing YAML frontmatter`);
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) throw new Error(`${path}: unterminated YAML frontmatter`);
  const yaml = text.slice(text.indexOf("\n") + 1, end);
  const body = text.slice(end + 4).trim();
  return { data: parseYaml(yaml) as Record<string, unknown>, body };
}

const isScalar = (value: unknown) =>
  typeof value !== "object" || value === null;

function compare(
  source: unknown,
  translated: unknown,
  path: string,
  file: string,
  problems: Problem[],
): void {
  if (isScalar(source) || isScalar(translated)) {
    if (typeof source !== typeof translated) {
      problems.push({
        file,
        message:
          `${path}: type changed (${typeof source} → ${typeof translated})`,
      });
    }
    return;
  }

  if (Array.isArray(source) || Array.isArray(translated)) {
    if (!Array.isArray(source) || !Array.isArray(translated)) {
      problems.push({ file, message: `${path}: expected a list` });
      return;
    }
    if (source.length !== translated.length) {
      problems.push({
        file,
        message: `${path}: list length ${source.length} → ${translated.length}`,
      });
      return;
    }
    source.forEach((item, index) => {
      compare(item, translated[index], `${path}[${index}]`, file, problems);
    });
    return;
  }

  const sourceObject = source as Record<string, unknown>;
  const translatedObject = translated as Record<string, unknown>;
  const sourceKeys = Object.keys(sourceObject);
  const translatedKeys = Object.keys(translatedObject);

  for (const key of sourceKeys) {
    if (!(key in translatedObject)) {
      problems.push({ file, message: `${path}.${key}: missing` });
    }
  }
  for (const key of translatedKeys) {
    if (!(key in sourceObject)) {
      problems.push({ file, message: `${path}.${key}: unexpected key` });
    }
  }
  for (const key of sourceKeys) {
    if (key in translatedObject) {
      compare(
        sourceObject[key],
        translatedObject[key],
        path === "" ? key : `${path}.${key}`,
        file,
        problems,
      );
    }
  }
}

/** Route/slug/URL values keep the canonical (unprefixed) form in every language. */
function checkInvariants(
  source: unknown,
  translated: unknown,
  path: string,
  file: string,
  problems: Problem[],
): void {
  if (isScalar(source) || isScalar(translated)) {
    const key = path.split(".").pop()?.replace(/\[\d+\]$/, "") ?? "";
    const looksLikeUrl = typeof source === "string" &&
      /^(https?:\/\/|mailto:|\/|#)/.test(source);
    if (!INVARIANT_KEYS.has(key) && !looksLikeUrl) return;
    if (source !== translated) {
      problems.push({
        file,
        message: `${path}: must stay "${String(source)}" (got "${
          String(translated)
        }")`,
      });
    }
    return;
  }

  if (Array.isArray(source) && Array.isArray(translated)) {
    const key = path.split(".").pop() ?? "";
    if (TAG_KEYS.has(key)) {
      const left = source.map(String).sort();
      const right = translated.map(String).sort();
      if (left.join("\u0000") !== right.join("\u0000")) {
        problems.push({
          file,
          message: `${path}: technology names changed (${left.join(", ")} → ${
            right.join(", ")
          })`,
        });
      }
      return;
    }
    source.forEach((item, index) => {
      checkInvariants(
        item,
        translated[index],
        `${path}[${index}]`,
        file,
        problems,
      );
    });
    return;
  }

  if (!source || !translated) return;
  for (
    const [key, value] of Object.entries(source as Record<string, unknown>)
  ) {
    const other = (translated as Record<string, unknown>)[key];
    if (other !== undefined) {
      checkInvariants(
        value,
        other,
        path === "" ? key : `${path}.${key}`,
        file,
        problems,
      );
    }
  }
}

/** Every page folder in content/, nested project articles included. */
function contentPages(): string[] {
  const pages: string[] = [];
  const walk = (dir: string) => {
    const entries = [...Deno.readDirSync(dir)];
    if (entries.some((entry) => entry.isFile && entry.name === "default.md")) {
      pages.push(dir);
    }
    for (const entry of entries) {
      if (!entry.isDirectory || entry.name.startsWith("_")) continue;
      walk(join(dir, entry.name));
    }
  };
  walk(CONTENT_DIR);
  return pages.sort();
}

function checkLanguage(language: Language, requireAll: boolean): Problem[] {
  const problems: Problem[] = [];
  for (const dir of contentPages()) {
    const sourcePath = join(dir, "default.md");
    const translatedPath = join(dir, `default.${language}.md`);
    const file = `${relative(ROOT, dir)}/default.${language}.md`;
    let translated: Frontmatter;
    try {
      translated = readFrontmatter(translatedPath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        if (requireAll) {
          problems.push({ file, message: "missing translation" });
        }
        continue;
      }
      throw error;
    }

    const source = readFrontmatter(sourcePath);
    if (translated.body !== "") {
      problems.push({
        file,
        message: "body is not empty (all copy belongs in the frontmatter)",
      });
    }
    compare(source.data, translated.data, "", file, problems);
    checkInvariants(source.data, translated.data, "", file, problems);
  }
  return problems;
}

const args = Deno.args.filter((arg) => !arg.startsWith("--"));
const requireAll = Deno.args.includes("--require-all");
const languages = (args.length > 0 ? args : TRANSLATED_LANGUAGES) as Language[];

for (const language of languages) {
  if (!TRANSLATED_LANGUAGES.includes(language)) {
    console.error(
      `Unknown translated language "${language}". Expected one of: ${
        TRANSLATED_LANGUAGES.join(", ")
      }.`,
    );
    Deno.exit(1);
  }
}

let failed = false;
for (const language of languages) {
  const problems = checkLanguage(language, requireAll);
  const files = contentPages().filter((dir) =>
    existsSync(join(dir, `default.${language}.md`))
  ).length;
  if (problems.length === 0) {
    console.log(
      `\u2713 ${language}: ${files} translated page(s) match the Spanish source`,
    );
    continue;
  }
  failed = true;
  console.error(`\u2717 ${language}: ${problems.length} problem(s)`);
  for (const problem of problems) {
    console.error(`  ${problem.file}: ${problem.message}`);
  }
}

function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);
    return true;
  } catch {
    return false;
  }
}

if (failed) Deno.exit(1);
