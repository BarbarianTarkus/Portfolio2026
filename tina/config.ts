// @ts-nocheck -- loaded by the Tina CLI under Node; Deno's bare `deno check`
// has no `process` types and does not know why the helpers are untyped.
/**
 * TinaCMS configuration.
 *
 * The site is a static Fresh/Deno build, so Tina is used as a content layer:
 * every piece of editable copy lives in content/*.json and is modelled here.
 * The generated admin is written to static/admin and copied into the static
 * export by scripts/ssg.ts.
 *
 * No import from "tinacms" here on purpose: this config is loaded by the Tina
 * CLI (Node, from tools/tina) while the site itself runs on Deno. A plain
 * default export keeps that toolchain boundary small.
 */

/** Self-contained router: Tina serialises it, so it must not close over values. */
const routeFor = ({ document }) => {
  const filename = document?._sys?.filename ?? "home";
  const prefix = (globalThis.location?.pathname ?? "").replace(
    /\/admin\/.*$/,
    "",
  );
  return filename === "home" || filename === "site"
    ? prefix + "/"
    : prefix + "/" + filename;
};

const textarea = { component: "textarea" };

/** Shorthand for a plain string field. */
const text = (name, label, extra = {}) => ({
  type: "string",
  name,
  label,
  ...extra,
});

/** Shorthand for a field that is edited in a textarea. */
const longText = (name, label, extra = {}) =>
  text(name, label, { ui: textarea, ...extra });

/** num + title pair used by every numbered section heading. */
const section = (name, label, extra = {}) => ({
  type: "object",
  name,
  label,
  fields: [text("num", "Número"), text("title", "Título")],
  ...extra,
});

/** Two-field object: visible label + destination route/URL. */
const action = (name, label) => ({
  type: "object",
  name,
  label,
  fields: [text("label", "Texto"), text("route", "Ruta")],
});

const meta = {
  type: "object",
  name: "meta",
  label: "Metadatos",
  fields: [text("title", "Título"), longText("description", "Descripción")],
};

export default {
  branch: process.env.HEAD ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ??
    "master",
  clientId: process.env.PUBLIC_TINA_CLIENT_ID ?? "",
  token: process.env.TINA_TOKEN ?? "",
  build: {
    publicFolder: "static",
    outputFolder: "admin",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      {
        name: "site",
        label: "Sitio",
        path: "content",
        format: "json",
        match: { include: "site" },
        ui: { global: true, router: routeFor },
        fields: [
          text("author", "Nombre"),
          text("fullName", "Nombre completo"),
          text("shortTitle", "Inicial del logo"),
          longText("title", "Título del sitio"),
          longText("description", "Descripción por defecto"),
          text("role", "Rol"),
          longText("intro", "Introducción"),
          {
            type: "object",
            name: "evidence",
            label: "Cifras de evidencia",
            list: true,
            fields: [text("value", "Valor"), text("label", "Etiqueta")],
          },
          text("homelabStack", "Stack del homelab", { list: true }),
          text("github", "URL de GitHub"),
          text("linkedin", "URL de LinkedIn"),
          text("githubHandle", "Usuario de GitHub"),
          text("linkedinHandle", "Usuario de LinkedIn"),
          text("email", "Correo electrónico"),
          {
            type: "object",
            name: "nav",
            label: "Navegación",
            list: true,
            fields: [text("title", "Título"), text("route", "Ruta")],
          },
          {
            type: "object",
            name: "labels",
            label: "Etiquetas de interfaz",
            fields: [
              text("skipToContent", "Saltar al contenido"),
              text("mainNav", "Navegación principal"),
              text("openMenu", "Abrir menú"),
              text("closeMenu", "Cerrar menú"),
              text("socialNav", "Navegación social"),
              text("githubProfile", "Perfil de GitHub"),
              text("linkedinProfile", "Perfil de LinkedIn"),
              text("contactEyebrow", "Antetítulo de contacto"),
              text("location", "Ubicación (pie)"),
              text("homeLink", "Enlace de inicio"),
            ],
          },
          {
            type: "object",
            name: "notFound",
            label: "Página 404",
            fields: [
              text("metaTitle", "Título de la pestaña"),
              longText("metaDescription", "Descripción"),
              text("code", "Código"),
              text("heading", "Titular"),
              text("lede", "Entradilla"),
              text("button", "Botón"),
            ],
          },
        ],
      },
      {
        name: "home",
        label: "Inicio",
        path: "content",
        format: "json",
        match: { include: "home" },
        ui: { router: routeFor },
        fields: [
          text("eyebrow", "Antetítulo"),
          action("primaryAction", "Acción principal"),
          action("secondaryAction", "Acción secundaria"),
          section("experienceSection", "Sección de experiencia", {
            fields: [
              text("num", "Número"),
              text("title", "Título"),
              text("linkLabel", "Enlace"),
              text("linkRoute", "Ruta"),
            ],
          }),
          section("projectsSection", "Sección de proyectos", {
            fields: [
              text("num", "Número"),
              text("title", "Título"),
              text("linkLabel", "Enlace"),
              text("linkRoute", "Ruta"),
              longText("note", "Nota"),
            ],
          }),
          {
            type: "object",
            name: "focus",
            label: "Bloques de enfoque",
            list: true,
            fields: [text("title", "Título"), longText("body", "Texto")],
          },
          section("stackSection", "Sección de stack", {
            fields: [
              text("num", "Número"),
              text("title", "Título"),
              text("linkLabel", "Enlace"),
              text("linkRoute", "Ruta"),
              text("stackLabel", "Etiqueta de stack"),
              text("infrastructureLabel", "Etiqueta de infraestructura"),
            ],
          }),
          text("stack", "Stack", { list: true }),
        ],
      },
      {
        name: "about",
        label: "Sobre mí",
        path: "content",
        format: "json",
        match: { include: "about" },
        ui: { router: routeFor },
        fields: [
          meta,
          text("title", "Titular"),
          longText("lede", "Entradilla"),
          longText("paragraphs", "Párrafos", { list: true }),
          section("homelabSection", "Sección del homelab"),
          longText("homelabNote", "Nota del homelab"),
          section("followSection", "Sección dónde seguir"),
          longText("follow", "Texto final"),
        ],
      },
      {
        name: "contact",
        label: "Contacto",
        path: "content",
        format: "json",
        match: { include: "contact" },
        ui: { router: routeFor },
        fields: [
          meta,
          text("title", "Titular"),
          longText("lede", "Entradilla"),
          {
            type: "object",
            name: "email",
            label: "Fila de correo",
            fields: [text("label", "Etiqueta"), longText("hint", "Pista")],
          },
          {
            type: "object",
            name: "github",
            label: "Fila de GitHub",
            fields: [text("label", "Etiqueta"), longText("hint", "Pista")],
          },
          {
            type: "object",
            name: "linkedin",
            label: "Fila de LinkedIn",
            fields: [text("label", "Etiqueta"), longText("hint", "Pista")],
          },
        ],
      },
      {
        name: "experience",
        label: "Experiencia",
        path: "content",
        format: "json",
        match: { include: "experience" },
        ui: { router: routeFor },
        fields: [
          meta,
          text("title", "Titular"),
          longText("lede", "Entradilla"),
          text("linkedinLabel", "Texto de LinkedIn"),
          section("jobsSection", "Sección de empleos"),
          {
            type: "object",
            name: "jobs",
            label: "Empleos",
            list: true,
            fields: [
              text("role", "Puesto"),
              text("company", "Empresa"),
              text("period", "Periodo"),
              text("place", "Lugar"),
              text("stack", "Tecnologías", { list: true }),
              longText("bullets", "Responsabilidades", { list: true }),
            ],
          },
          section("educationSection", "Sección de formación"),
          {
            type: "object",
            name: "education",
            label: "Formación",
            fields: [
              text("period", "Periodo"),
              text("role", "Titulación"),
              text("company", "Centro"),
            ],
          },
          section("outroSection", "Sección final"),
          longText("outro", "Texto final"),
        ],
      },
      {
        name: "projects",
        label: "Proyectos",
        path: "content",
        format: "json",
        match: { include: "projects" },
        ui: { router: routeFor },
        fields: [
          meta,
          text("title", "Titular"),
          longText("lede", "Entradilla"),
          {
            type: "object",
            name: "kindLabels",
            label: "Etiquetas de tipo",
            fields: [
              text("cliente", "Cliente"),
              text("academico", "Académico"),
              text("propio", "Propio"),
            ],
          },
          text("indexAriaLabel", "Etiqueta del índice"),
          text("fichesEyebrow", "Antetítulo de fichas"),
          {
            type: "object",
            name: "ficheLabels",
            label: "Etiquetas de ficha",
            fields: [
              text("problem", "Problema"),
              text("decisions", "Decisiones"),
              text("broke", "Qué se rompió"),
              text("next", "Qué haría distinto"),
            ],
          },
          {
            type: "object",
            name: "projects",
            label: "Fichas de proyecto",
            list: true,
            fields: [
              text("slug", "Ancla"),
              text("name", "Nombre"),
              {
                type: "string",
                name: "kind",
                label: "Tipo",
                options: [
                  { label: "Cliente", value: "cliente" },
                  { label: "Académico", value: "academico" },
                  { label: "Propio", value: "propio" },
                ],
              },
              longText("summary", "Resumen"),
              text("tags", "Tecnologías", { list: true }),
              text("period", "Periodo"),
              text("year", "Año"),
              text("work", "Trabajo verificado", { required: false }),
              {
                type: "object",
                name: "links",
                label: "Enlaces",
                list: true,
                fields: [text("label", "Texto"), text("href", "URL")],
              },
              longText("problem", "El problema"),
              longText("decisions", "Decisiones técnicas", { list: true }),
              longText("broke", "Qué se rompió", { required: false }),
              longText("next", "Qué haría distinto", { required: false }),
            ],
          },
        ],
      },
    ],
  },
};
