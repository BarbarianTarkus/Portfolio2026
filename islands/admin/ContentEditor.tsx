/** @jsxImportSource preact */
import { useEffect, useRef, useState } from "preact/hooks";

/**
 * Content editor island for the portfolio's Dune admin panel.
 *
 * The stock Dune page editor only exposes Markdown bodies and blueprint-declared
 * flat frontmatter; this site keeps every piece of copy in nested YAML
 * frontmatter, so it is unmanaged there. This editor edits the raw page file
 * (frontmatter + body) and shows the real page in a preview pane.
 *
 * Prose fields may contain inline Markdown (rendered by lib/markdown.tsx).
 */

interface SourceData {
  sourcePath: string;
  route: string;
  format: string;
  title: string;
  raw: string;
}

interface Props {
  /** Content-relative source path, e.g. "03.contact/default.md". */
  pagePath: string;
  /** Admin URL prefix (usually "/admin"). */
  prefix: string;
  /** Rendered inside the inline-edit overlay iframe. */
  embedded?: boolean;
}

function getCsrf(): string {
  return (
    document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
  )?.content ?? "";
}

export default function ContentEditor_(
  { pagePath, prefix, embedded = false }: Props,
) {
  const [data, setData] = useState<SourceData | null>(null);
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  // The preview is the reason this editor exists; open it by default.
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${prefix}/api/portfolio-editor/source?path=${
        encodeURIComponent(pagePath)
      }`,
    )
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${response.status}`);
        }
        return response.json() as Promise<SourceData>;
      })
      .then((source) => {
        setData(source);
        setRaw(source.raw);
        setDirty(false);
      })
      .catch((cause) => setError(String(cause)))
      .finally(() => setLoading(false));
  }, [pagePath]);

  // Warn when leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    globalThis.addEventListener("beforeunload", handler);
    return () => globalThis.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Cmd/Ctrl+S saves.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [raw, saving]);

  function refreshPreview() {
    if (!previewRef.current) return;
    const src = previewRef.current.src;
    previewRef.current.src = "";
    requestAnimationFrame(() => {
      if (previewRef.current) previewRef.current.src = src;
    });
  }

  async function save() {
    if (saving || data === null) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${prefix}/api/portfolio-editor/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrf(),
        },
        body: JSON.stringify({ path: pagePath, raw }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${response.status}`);
      }
      setDirty(false);
      refreshPreview();
    } catch (cause) {
      setError(String(cause instanceof Error ? cause.message : cause));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading editor…</div>;
  }

  const title = data?.title ?? pagePath;
  const route = data?.route ?? "/";

  return (
    <div class="editor-layout">
      <header class="editor-toolbar">
        <div class="toolbar-left">
          {!embedded && (
            <a href={`${prefix}/pages`} class="btn btn-sm btn-outline">
              ← Pages
            </a>
          )}
          <span class="editor-title">{title}</span>
          <span class="badge">{data?.format ?? "md"}</span>
        </div>
        <div class="toolbar-right">
          <button
            type="button"
            class="btn btn-sm btn-outline"
            onClick={() => setShowPreview((value) => !value)}
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
          <a href={route} target="_blank" class="btn btn-sm btn-outline">
            View →
          </a>
          <a
            href={`${prefix}/pages/history?path=${
              encodeURIComponent(pagePath)
            }`}
            target={embedded ? "_blank" : undefined}
            class="btn btn-sm btn-outline"
          >
            History
          </a>
          {dirty && <span class="toolbar-dirty">Unsaved</span>}
          <button
            type="button"
            class="btn btn-sm btn-primary"
            onClick={() => void save()}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <div class="editor-body">
        <aside class="editor-sidebar">
          <h4>Page content</h4>
          <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5" }}>
            You are editing{" "}
            <code style={{ wordBreak: "break-all" }}>{pagePath}</code>.
          </p>
          <ul
            style={{
              color: "#666",
              fontSize: "13px",
              lineHeight: "1.6",
              paddingLeft: "1.1rem",
              margin: "0.75rem 0",
            }}
          >
            <li>
              The YAML frontmatter between the <code>---</code>{" "}
              markers is all the copy the public site renders.
            </li>
            <li>
              Prose fields accept inline Markdown: <code>**bold**</code>,{" "}
              <code>*italic*</code>, <code>`code`</code> and{" "}
              <code>[links](/route)</code>. It is rendered sanitized.
            </li>
            <li>
              The Markdown body below the frontmatter is unused by this site;
              leave it empty.
            </li>
            <li>Save (Ctrl/Cmd+S) writes the file and rebuilds the site.</li>
          </ul>
          <p style={{ color: "#666", fontSize: "13px" }}>
            Route: <code>{route}</code>
          </p>
          {error && (
            <p style={{ color: "#c53030", fontSize: "13px" }}>{error}</p>
          )}
        </aside>

        <main class={`editor-main${showPreview ? " editor-main-split" : ""}`}>
          <textarea
            class="editor-content"
            value={raw}
            onInput={(event) => {
              setRaw((event.target as HTMLTextAreaElement).value);
              setDirty(true);
            }}
            spellcheck={false}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "60vh",
              border: "none",
              outline: "none",
              resize: "none",
              padding: "1rem",
              background: "transparent",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "13px",
              lineHeight: "1.55",
              tabSize: "2",
            }}
          />
        </main>

        {showPreview && (
          <aside class="editor-preview">
            <iframe
              ref={previewRef}
              src={`${prefix}/api/preview?path=${encodeURIComponent(pagePath)}`}
              title="Page preview"
              style={{ width: "100%", height: "100%", border: "0" }}
            />
          </aside>
        )}
      </div>

      {error && <div class="toast toast-error">{error}</div>}
    </div>
  );
}
