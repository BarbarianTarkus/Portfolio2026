import { createDefine } from "fresh";
import type { TinaState } from "./lib/tina/forms.ts";

/**
 * Shared types for `ctx.state` and the typed `define` helpers used by routes,
 * layouts and middlewares.
 *
 * `tina` is request-scoped data for the content layer: the loaded site globals
 * plus every TinaCMS form rendered on the page (see lib/tina/forms.ts).
 */
export type State = {
  tina?: TinaState;
};

export const define = createDefine<State>();
