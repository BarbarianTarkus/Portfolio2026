/** @jsxImportSource preact */
//
// Bundling bridge for a Dune admin island.
//
// Dune ships its admin panel as a JSR package (@dune/plugin-admin) and its
// islands live at https:// URLs. Fresh's island crawler needs a file in
// ./islands to discover a client island, so each file here re-exports one
// admin component under the exact island name Dune renders. Keep the list in
// sync with @dune/plugin-admin's adminIslands when upgrading Dune.
export { default } from "https://jsr.io/@dune/plugin-admin/3.1.2/src/admin/islands/PageBuilder.tsx";
