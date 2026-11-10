import type { Language } from "./i18n.tsx";

/**
 * Copy that lives in the components instead of the CMS.
 *
 * Everything a visitor reads is normally authored in `content/`; these are the
 * strings baked into the markup (accessible names, counters, the stack map's
 * layer titles). They are translated here so the three language versions of
 * the site never mix languages. Server components read them through
 * `useLanguage()`; islands receive the language as a prop and call
 * `uiStrings(lang)` directly.
 */

export interface StackDomainStrings {
  title: string;
  note: string;
}

export interface UiStrings {
  /** Accessible name of the header language switcher. */
  languageNav: string;
  gallery: {
    capturesOf: (projectName: string) => string;
    carousel: (projectName: string, groupLabel: string) => string;
    counter: (position: number, total: number) => string;
    /** aria-roledescription of one slide. */
    slideRole: string;
    enlarge: (alt: string) => string;
    enlargeTitle: string;
    previousInGroup: (groupLabel: string) => string;
    nextInGroup: (groupLabel: string) => string;
    lightbox: (projectName: string) => string;
    close: string;
    previous: string;
    next: string;
  };
  tech: {
    officialSite: (tag: string) => string;
    linkLabel: (tag: string) => string;
  };
  stack: {
    domains: {
      frontend: StackDomainStrings;
      backend: StackDomainStrings;
      ai: StackDomainStrings;
    };
    /** Sub-scope titles, in the order the layers read them. */
    subgroups: {
      backend: string[];
      infra: string[];
    };
    other: string;
    otherNote: string;
    infraNote: string;
    infrastructure: string;
    technologies: (count: number) => string;
  };
}

const ES: UiStrings = {
  languageNav: "Idioma",
  gallery: {
    capturesOf: (name) => "Capturas de " + name,
    carousel: (name, group) =>
      "Carrusel de capturas de " + name + " (" + group + ")",
    counter: (position, total) => position + " de " + total,
    slideRole: "diapositiva",
    enlarge: (alt) => "Ampliar captura: " + alt,
    enlargeTitle: "Ampliar captura",
    previousInGroup: (group) => "Captura anterior de " + group,
    nextInGroup: (group) => "Captura siguiente de " + group,
    lightbox: (name) => "Vista ampliada de capturas de " + name,
    close: "Cerrar vista ampliada",
    previous: "Captura anterior",
    next: "Captura siguiente",
  },
  tech: {
    officialSite: (tag) =>
      "Web oficial de " + tag + " (se abre en una pestaña nueva)",
    linkLabel: (tag) => tag + ", web oficial (se abre en una pestaña nueva)",
  },
  stack: {
    domains: {
      frontend: { title: "Frontend", note: "Interfaz y componentes" },
      backend: {
        title: "Backend",
        note: "Lenguajes, plataformas y datos",
      },
      ai: { title: "IA agéntica", note: "Uso de Arneses y Agentes" },
    },
    subgroups: {
      backend: ["Lenguajes y runtimes", "Datos"],
      infra: ["Red y acceso", "Almacenamiento", "Servicios y automatización"],
    },
    other: "Otros",
    otherNote: "Tecnologías/Herramientas complementarias",
    infraNote: "Red, almacenamiento y servicios",
    infrastructure: "Infraestructura",
    technologies: (count) => count + " tecnologías",
  },
};

const EN: UiStrings = {
  languageNav: "Language",
  gallery: {
    capturesOf: (name) => "Screenshots of " + name,
    carousel: (name, group) => name + " screenshots carousel (" + group + ")",
    counter: (position, total) => position + " of " + total,
    slideRole: "slide",
    enlarge: (alt) => "Enlarge screenshot: " + alt,
    enlargeTitle: "Enlarge screenshot",
    previousInGroup: (group) => "Previous screenshot of " + group,
    nextInGroup: (group) => "Next screenshot of " + group,
    lightbox: (name) => "Enlarged view of " + name + " screenshots",
    close: "Close enlarged view",
    previous: "Previous screenshot",
    next: "Next screenshot",
  },
  tech: {
    officialSite: (tag) => "Official " + tag + " site (opens in a new tab)",
    linkLabel: (tag) => tag + ", official site (opens in a new tab)",
  },
  stack: {
    domains: {
      frontend: { title: "Frontend", note: "Interface and components" },
      backend: { title: "Backend", note: "Languages, platforms and data" },
      ai: { title: "Agentic AI", note: "Harnesses and agents in use" },
    },
    subgroups: {
      backend: ["Languages and runtimes", "Data"],
      infra: ["Network and access", "Storage", "Services and automation"],
    },
    other: "Others",
    otherNote: "Complementary technologies/tools",
    infraNote: "Network, storage and services",
    infrastructure: "Infrastructure",
    technologies: (count) => count + " technologies",
  },
};

const CA: UiStrings = {
  languageNav: "Idioma",
  gallery: {
    capturesOf: (name) => "Captures de " + name,
    carousel: (name, group) =>
      "Carrusel de captures de " + name + " (" + group + ")",
    counter: (position, total) => position + " de " + total,
    slideRole: "diapositiva",
    enlarge: (alt) => "Amplia la captura: " + alt,
    enlargeTitle: "Amplia la captura",
    previousInGroup: (group) => "Captura anterior de " + group,
    nextInGroup: (group) => "Captura següent de " + group,
    lightbox: (name) => "Vista ampliada de captures de " + name,
    close: "Tanca la vista ampliada",
    previous: "Captura anterior",
    next: "Captura següent",
  },
  tech: {
    officialSite: (tag) =>
      "Web oficial de " + tag + " (s'obre en una pestanya nova)",
    linkLabel: (tag) => tag + ", web oficial (s'obre en una pestanya nova)",
  },
  stack: {
    domains: {
      frontend: { title: "Frontend", note: "Interfície i components" },
      backend: { title: "Backend", note: "Llenguatges, plataformes i dades" },
      ai: { title: "IA agèntica", note: "Ús d'arnesos i agents" },
    },
    subgroups: {
      backend: ["Llenguatges i runtimes", "Dades"],
      infra: ["Xarxa i accés", "Emmagatzematge", "Serveis i automatització"],
    },
    other: "Altres",
    otherNote: "Tecnologies/eines complementàries",
    infraNote: "Xarxa, emmagatzematge i serveis",
    infrastructure: "Infraestructura",
    technologies: (count) => count + " tecnologies",
  },
};

const STRINGS: Record<Language, UiStrings> = { es: ES, en: EN, ca: CA };

/** Component copy for one language. */
export function uiStrings(lang: Language): UiStrings {
  return STRINGS[lang] ?? ES;
}
