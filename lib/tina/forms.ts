/**
 * Request-scoped Tina form collection.
 *
 * Each rendered document (site globals + the page's own content file) records a
 * Tina form here while the route handler loads it. The app shell (_app.tsx)
 * then serialises the collected forms into hidden `[data-tina-form]` payloads
 * and the browser bridge (@tinacms/bridge) announces them to the admin iframe.
 *
 * @module
 */

import type { Context } from "fresh";
import type { State } from "../../utils.ts";
import type { SiteContent } from "../content.ts";

/** One query result, in the shape the Tina admin expects on the wire. */
export interface TinaForm {
  id: string;
  query: string;
  variables: Record<string, unknown>;
  data: Record<string, unknown>;
  priority?: "primary";
}

/** Editing state attached to `ctx.state.tina` for the current request. */
export interface TinaState {
  forms: TinaForm[];
  /** The site globals, already enriched with Tina metadata. */
  site?: SiteContent;
}

/** Get (or lazily create) the Tina request state. */
export function tinaState(ctx: Context<State>): TinaState {
  const state = ctx.state as State & { tina?: TinaState };
  state.tina ??= { forms: [] };
  return state.tina;
}

/** Record a form, de-duplicating by id and upgrading priority. */
export function recordForm(ctx: Context<State>, form: TinaForm): void {
  const { forms } = tinaState(ctx);
  const existing = forms.find((entry) => entry.id === form.id);
  if (existing) {
    if (form.priority === "primary") existing.priority = "primary";
    return;
  }
  forms.push(form);
}
