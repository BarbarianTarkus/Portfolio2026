/**
 * `/<lang>`:
 * same page as the canonical route, served from the matching Dune language
 * variant. The canonical handler does the rendering; this file only adds the
 * language guard.
 */
import { handler as canonical } from "../index.tsx";
import { localized } from "../../lib/language-route.tsx";

export const handler = localized(canonical);
