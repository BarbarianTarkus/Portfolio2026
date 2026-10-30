// deno-lint-ignore-file no-window -- browser-only file; `window` is intentional.
/**
 * Inline editor for prose fields (admin sessions only).
 *
 * The Dune inline-edit plugin handles flat fields through its own contenteditable
 * markers. Paragraphs, job bullets and project fiches are nested values that the
 * plugin cannot address, so this script adds a small ✎ handle to any element
 * marked with data-prose-field (dot path) / data-prose-source (page source) and
 * saves the raw value through the content-editor plugin's field endpoint.
 *
 * It is only injected into HTML responses for authenticated editors
 * (lib/inline-edit-runtime.ts), and the endpoint re-checks pages.update.
 */
(() => {
  "use strict";

  if (!document.querySelector("[data-prose-field]")) return;

  const style = document.createElement("style");
  style.textContent = `
    #prose-edit-handle {
      position: absolute; display: none; z-index: 99998;
      background: #3498db; color: #fff; border: none; border-radius: 4px;
      padding: 3px 10px; font: 600 11px/1.4 system-ui, sans-serif;
      cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.3);
    }
    #prose-edit-dialog {
      position: fixed; z-index: 99999; width: min(680px, calc(100vw - 32px));
      background: #fff; color: #1a202c; border-radius: 8px;
      box-shadow: 0 8px 30px rgba(0,0,0,.35); padding: 14px;
    }
    #prose-edit-dialog textarea {
      width: 100%; min-height: 140px; max-height: 50vh; resize: vertical;
      font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
      padding: 10px; border: 1px solid #cbd5e0; border-radius: 6px;
    }
    #prose-edit-dialog .prose-edit-actions {
      display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px;
    }
    #prose-edit-dialog button {
      border: none; border-radius: 4px; padding: 6px 14px; cursor: pointer;
      font: 600 12px/1.4 system-ui, sans-serif;
    }
    #prose-edit-dialog .prose-save { background: #27ae60; color: #fff; }
    #prose-edit-dialog .prose-cancel { background: #edf2f7; color: #1a202c; }
    #prose-edit-dialog .prose-hint { color: #718096; font: 12px/1.5 system-ui, sans-serif; margin: 0 0 8px; }
    #prose-edit-dialog .prose-error { color: #c53030; font: 12px/1.5 system-ui, sans-serif; margin-top: 8px; }
  `;
  document.head.appendChild(style);

  const handle = document.createElement("button");
  handle.id = "prose-edit-handle";
  handle.type = "button";
  handle.textContent = "✎ Editar";
  document.body.appendChild(handle);

  let hovered = null;
  let editing = false;
  let dialog = null;

  function showHandle(element) {
    hovered = element;
    const rect = element.getBoundingClientRect();
    handle.style.top = `${window.scrollY + rect.top - 12}px`;
    handle.style.left = `${Math.max(8, window.scrollX + rect.right - 78)}px`;
    handle.style.display = "block";
  }

  function hideHandle() {
    hovered = null;
    handle.style.display = "none";
  }

  document.addEventListener("mouseover", (event) => {
    if (editing) return;
    if (event.target === handle || handle.contains(event.target)) return;
    const element = event.target.closest?.("[data-prose-field]");
    if (element) showHandle(element);
    else if (!hovered || !hovered.contains(event.target)) hideHandle();
  });

  handle.addEventListener("click", () => {
    if (hovered) open(hovered);
  });

  function close() {
    dialog?.remove();
    dialog = null;
    editing = false;
  }

  function open(element) {
    const source = element.dataset.proseSource;
    const field = element.dataset.proseField;
    if (!source || !field) return;

    const original = element.textContent ?? "";
    const rect = element.getBoundingClientRect();
    hideHandle();
    editing = true;

    dialog = document.createElement("div");
    dialog.id = "prose-edit-dialog";
    dialog.style.top = `${
      Math.min(window.innerHeight - 260, Math.max(12, rect.bottom + 8))
    }px`;
    dialog.style.left = `${
      Math.max(12, Math.min(window.innerWidth - 700, rect.left))
    }px`;

    const hint = document.createElement("p");
    hint.className = "prose-hint";
    hint.textContent =
      `Editando ${field} (${source}). Acepta Markdown: **negrita**, *cursiva*, \`código\`, [enlace](/ruta).`;

    const textarea = document.createElement("textarea");
    textarea.value = original;
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", `Contenido de ${field}`);

    const error = document.createElement("p");
    error.className = "prose-error";
    error.style.display = "none";

    const actions = document.createElement("div");
    actions.className = "prose-edit-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "prose-cancel";
    cancel.textContent = "Cancelar";
    const save = document.createElement("button");
    save.type = "button";
    save.className = "prose-save";
    save.textContent = "Guardar";
    actions.append(cancel, save);

    dialog.append(hint, textarea, actions, error);
    document.body.appendChild(dialog);
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    cancel.addEventListener("click", close);
    textarea.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        saveValue();
      }
    });

    async function saveValue() {
      save.disabled = true;
      save.textContent = "Guardando…";
      error.style.display = "none";
      try {
        const response = await fetch("/admin/api/portfolio-editor/field", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: source,
            field,
            value: textarea.value,
          }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? `HTTP ${response.status}`);
        }
        location.reload();
      } catch (cause) {
        error.textContent = String(
          cause instanceof Error ? cause.message : cause,
        );
        error.style.display = "block";
        save.disabled = false;
        save.textContent = "Guardar";
      }
    }

    save.addEventListener("click", () => void saveValue());
  }
})();
