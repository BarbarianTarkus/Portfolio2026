import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import { VITE_BASE } from "./config.ts";

// `base` controls how Vite writes asset URLs into the generated HTML. It must
// match the Fresh `basePath` (see main.ts), otherwise the CSS/JS references
// break when the site is hosted under a sub-path such as GitHub Pages.
export default defineConfig({
  base: VITE_BASE,
  plugins: [fresh()],
});
