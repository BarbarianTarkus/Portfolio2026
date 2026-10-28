/** @jsxImportSource preact */
/**
 * Dune plugin: raw-content page editor for the portfolio.
 *
 * Dune's built-in page editor exposes the Markdown body and blueprint-declared
 * flat frontmatter. This site's copy lives in nested YAML frontmatter with an
 * empty body, which the built-in editor can only display read-only ("unmanaged
 * frontmatter"). This plugin replaces the page editor with one that edits the
 * whole page source file and previews the real public page.
 *
 * @module
 */

import type { ContentEditorPlugin, DunePlugin } from "@dune/core/hooks";
import { validatePagePath, withGuards } from "@dune/plugin-admin/admin/guards";
import { parse as parseYaml } from "@std/yaml";
import ContentEditor from "../../islands/admin/ContentEditor.tsx";

/** Matches the YAML frontmatter block at the top of a page file. */
const FRONTMATTER = /^---\n([\s\S]*?)\n---/;

const contentEditor: ContentEditorPlugin = {
  pageEditorHandler(ctx) {
    // deno-lint-ignore no-explicit-any
    const admin = (ctx.state as any).adminContext;
    const pagePath = ctx.url.searchParams.get("path");
    if (!pagePath) {
      return new Response(null, {
        status: 302,
        headers: { Location: `${admin.prefix}/pages` },
      });
    }
    const page = (admin.engine.pages as Array<{ sourcePath: string }>).find(
      (candidate) => candidate.sourcePath === pagePath,
    );
    if (!page) return new Response("Page not found", { status: 404 });

    return ctx.render(
      <ContentEditor
        pagePath={pagePath}
        prefix={admin.prefix}
        embedded={ctx.url.searchParams.get("embedded") === "1"}
      />,
    );
  },
};

export default {
  name: "portfolio-content-editor",
  version: "1.0.0",
  hooks: {},
  adminServices: () => ({ contentEditor }),
  mount({ app }) {
    // Read the raw page source (frontmatter + body) for the editor.
    app.get(
      "/admin/api/portfolio-editor/source",
      withGuards({ permission: "pages.read" }, (ctx) => {
        // deno-lint-ignore no-explicit-any
        const admin = (ctx.state as any).adminContext;
        const pagePath = ctx.url.searchParams.get("path");
        if (!pagePath || !validatePagePath(pagePath)) {
          return Response.json({ error: "Invalid path" }, { status: 400 });
        }
        const page = (admin.engine.pages as Array<{
          sourcePath: string;
          route: string;
          format: string;
          title: string;
        }>).find((candidate) => candidate.sourcePath === pagePath);
        if (!page) {
          return Response.json({ error: "Page not found" }, { status: 404 });
        }
        const filePath = `${admin.config.system.content.dir}/${pagePath}`;
        return admin.storage.readText(filePath).then((raw: string) =>
          Response.json({
            sourcePath: page.sourcePath,
            route: page.route,
            format: page.format,
            title: page.title,
            raw,
          })
        ).catch(() =>
          Response.json(
            { error: "Could not read the page source" },
            { status: 500 },
          )
        );
      }),
    );

    // Write the raw page source after validating its YAML frontmatter.
    app.post(
      "/admin/api/portfolio-editor/save",
      withGuards({ permission: "pages.update" }, async (ctx) => {
        // deno-lint-ignore no-explicit-any
        const admin = (ctx.state as any).adminContext;
        let body: { path?: string; raw?: string };
        try {
          body = await ctx.req.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }
        const pagePath = body.path;
        const raw = body.raw;
        if (!pagePath || !validatePagePath(pagePath)) {
          return Response.json({ error: "Invalid path" }, { status: 400 });
        }
        if (typeof raw !== "string") {
          return Response.json(
            { error: "Missing page source" },
            { status: 400 },
          );
        }
        const page = (admin.engine.pages as Array<{
          sourcePath: string;
          format: string;
        }>).find((candidate) => candidate.sourcePath === pagePath);
        if (!page) {
          return Response.json({ error: "Page not found" }, { status: 404 });
        }
        if (page.format !== "md" && page.format !== "mdx") {
          return Response.json(
            { error: "Only Markdown pages can be edited here" },
            { status: 400 },
          );
        }
        const frontmatter = raw.match(FRONTMATTER);
        if (!frontmatter) {
          return Response.json(
            { error: "Missing YAML frontmatter block (--- ... ---)" },
            { status: 422 },
          );
        }
        try {
          parseYaml(frontmatter[1]);
        } catch (cause) {
          const message = cause instanceof Error
            ? cause.message
            : String(cause);
          return Response.json(
            { error: `Invalid YAML frontmatter: ${message}` },
            { status: 422 },
          );
        }

        const filePath = `${admin.config.system.content.dir}/${pagePath}`;
        await admin.storage.write(filePath, new TextEncoder().encode(raw));
        await admin.engine.rebuild();
        return Response.json({ ok: true, sourcePath: pagePath });
      }),
    );
  },
} satisfies DunePlugin;
