import { createDefine } from "fresh";

/**
 * Shared types for `ctx.state` and the typed `define` helpers used by routes,
 * layouts and middlewares. This portfolio is fully static, so there is no state
 * to share between handlers; keep this type empty until something needs it.
 */
export type State = Record<string, never>;

export const define = createDefine<State>();
