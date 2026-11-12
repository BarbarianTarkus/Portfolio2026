import { useEffect, useRef } from "preact/hooks";
import type { RefObject } from "preact";
import { type Signal, useSignal } from "@preact/signals";
import { CloseIcon, MenuIcon } from "../components/Icons.tsx";
import { BrandMark } from "../components/BrandMark.tsx";
import type { SiteContent } from "../lib/content.ts";
import {
  canonicalPath,
  type Language,
  languageMeta,
  LANGUAGES,
  localizedHref,
} from "../lib/i18n.tsx";
import { uiStrings } from "../lib/ui-strings.ts";

type Labels = SiteContent["labels"];

interface HeaderProps {
  /** Site globals (identity, nav labels, menu copy). */
  site: SiteContent;
  /** Deployment prefix, e.g. "/Portfolio2026" ("" when served from the root). */
  basePath: string;
  /** Current request path, used only to mark the logo when it is the page. */
  path: string;
  /** Language of the current page, used to build links and the switcher. */
  lang: Language;
}

interface MenuToggleProps {
  open: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement>;
  labels: Labels;
}

/**
 * Keep the mobile menu keyboard-accessible: Escape closes it, Tab stays inside
 * the fullscreen overlay and the open state locks page scroll.
 */
function useMenuEffects(open: Signal<boolean>): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!open.value) return;
      if (event.key === "Escape") {
        open.value = false;
        return;
      }
      if (event.key !== "Tab") return;
      // Cycle between the overlay's first and last focusable controls.
      const nav = document.getElementById("main-nav");
      const focusable = nav?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open.value);
    // The overlay is modal: while it is open the page behind it is removed from
    // the tab order and from the accessibility tree.
    const background = document.querySelectorAll<HTMLElement>("main, footer");
    for (const element of background) element.inert = open.value;
    return () => {
      document.body.classList.remove("menu-open");
      for (const element of background) element.inert = false;
    };
  });

  // Rotating or resizing to the desktop layout while the menu is open would
  // leave an invisible overlay trapping focus; close it instead of hiding it.
  useEffect(() => {
    const desktop = globalThis.matchMedia("(min-width: 48rem)");
    const onChange = () => {
      if (desktop.matches && open.value) open.value = false;
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);
}

/**
 * The open overlay covers the hamburger, so focus has to move into it: the
 * close button receives focus on open and the hamburger gets it back on close.
 * Without this, keyboard users keep tabbing from a control they cannot see.
 */
function useMenuFocus(
  open: Signal<boolean>,
  toggleRef: RefObject<HTMLButtonElement>,
  closeRef: RefObject<HTMLButtonElement>,
): void {
  const wasOpen = useRef(false);

  useEffect(() => {
    // Skip the initial render: the menu is closed and focus must stay put.
    if (wasOpen.current === open.value) return;
    wasOpen.current = open.value;
    const target = open.value ? closeRef : toggleRef;
    target.current?.focus();
  }, [open.value]);
}

/** One nav entry with the two-digit index it is labelled and reached by. */
interface NavEntry {
  title: string;
  route: string;
  /** 00 for the home page, then 01, 02… in the order the nav lists them. */
  index: number;
}

/**
 * Number the navigation: home is .00 and every other page counts up from .01.
 * The label, the href and the keyboard shortcut all read from this list, so an
 * entry can never show one number and answer to another.
 */
function navEntries(items: SiteContent["nav"]): NavEntry[] {
  let counter = 0;
  return items.map((item) => {
    if (item.route === "/") return { ...item, index: 0 };
    counter += 1;
    return { ...item, index: counter };
  });
}

/** A focused field keeps what the visitor types: shortcuts must not steal it. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable ||
    target.closest("input, textarea, select, [contenteditable]") !== null;
}

/**
 * Keyboard navigation: a digit opens the nav entry carrying that index and
 * `h` goes home. Modifier chords keep their browser meaning.
 */
function useNavShortcuts(
  entries: NavEntry[],
  basePath: string,
  lang: Language,
): void {
  // Only the index→route table matters to the listener; keying the effect on
  // that string (not the array identity) keeps it from re-binding every render.
  const table = entries.map((entry) => `${entry.index}:${entry.route}`).join(
    "|",
  );

  useEffect(() => {
    const routes = new Map<string, string>();
    for (const pair of table.split("|")) {
      const separator = pair.indexOf(":");
      routes.set(pair.slice(0, separator), pair.slice(separator + 1));
    }

    const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      let route: string | undefined;
      if (key === "h") route = "/";
      else if (/^[0-9]$/.test(key)) route = routes.get(key);
      if (route === undefined) return;

      const target = new URL(
        localizedHref(basePath, lang, route),
        globalThis.location.href,
      );
      // Re-opening the page the visitor is already on would only reload it.
      if (
        normalize(globalThis.location.pathname) === normalize(target.pathname)
      ) {
        return;
      }

      event.preventDefault();
      globalThis.location.assign(target.href);
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [table, basePath, lang]);
}

function MenuToggle({ open, onToggle, buttonRef, labels }: MenuToggleProps) {
  return (
    <button
      type="button"
      class="menu-button"
      aria-expanded={open ? "true" : "false"}
      aria-controls="main-nav"
      aria-label={open ? labels.closeMenu : labels.openMenu}
      ref={buttonRef}
      onClick={onToggle}
    >
      <MenuIcon />
    </button>
  );
}

/**
 * Header island: the only part of the page that needs client-side JavaScript.
 * It owns the mobile menu state, Escape handling, focus management and scroll
 * locking; the rest of the site is plain server-rendered HTML.
 *
 * Active-link state is not computed here: Fresh annotates matching anchors with
 * aria-current, which the stylesheet uses for the active nav indicator.
 *
 * Navigation is numbered from 00 so the digits double as shortcuts: 0 or h
 * opens home, 1 to 9 open the page carrying that number.
 */
export default function Header(
  { site, basePath, path, lang }: HeaderProps,
) {
  const open = useSignal(false);
  // The active state is owned here on purpose: Fresh annotates the matching
  // anchor during SSR, but hydration re-renders this island from site.nav
  // and the attribute would be lost. data-current is what the client router
  // reads to keep intercepting links, so both are rendered together.
  const normalise = (value: string) => value.replace(/\/+$/, "") || "/";
  // Nav routes are canonical ("/about"): the language prefix is stripped before
  // comparing, and added back when rendering links.
  const route = normalise(canonicalPath(path, basePath).path);
  const isActive = (target: string) => normalise(target) === route;
  const isHome = route === "/";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const href = (target: string) => localizedHref(basePath, lang, target);
  const entries = navEntries(site.nav);
  const strings = uiStrings(lang);
  const closeMenu = () => (open.value = false);
  const labels = site.labels;

  useMenuEffects(open);
  useMenuFocus(open, toggleRef, closeRef);
  useNavShortcuts(entries, basePath, lang);

  return (
    <header>
      <a
        class="skip-to-content-link"
        href="#main"
      >
        {labels.skipToContent}
      </a>

      <div class="header-inner shell">
        <a
          class="site-title"
          href={href("/")}
          aria-label={site.author + " — " + labels.homeLink}
          aria-current={isHome ? "page" : "false"}
        >
          <BrandMark class="brand-mark" />
        </a>

        <MenuToggle
          open={open.value}
          onToggle={() => (open.value = !open.value)}
          buttonRef={toggleRef}
          labels={labels}
        />

        <nav
          id="main-nav"
          class={"main-nav" + (open.value ? " open" : "")}
          aria-label={labels.mainNav}
        >
          <ul onClick={closeMenu}>
            {entries.map((item) => (
              <li key={item.route}>
                <a
                  href={href(item.route)}
                  aria-current={isActive(item.route) ? "page" : undefined}
                  data-current={isActive(item.route) ? "true" : undefined}
                  aria-keyshortcuts={item.index === 0
                    ? "0 h"
                    : String(item.index)}
                >
                  <b class="nav-index">
                    {String(item.index).padStart(2, "0")}.{" "}
                  </b>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          <div
            class="lang-switcher"
            role="group"
            aria-label={strings.languageNav}
          >
            {LANGUAGES.map((candidate) => (
              <a
                key={candidate}
                href={localizedHref(basePath, candidate, route)}
                hreflang={languageMeta[candidate].htmlLang}
                lang={languageMeta[candidate].htmlLang}
                title={languageMeta[candidate].name}
                aria-current={candidate === lang ? "true" : undefined}
                onClick={closeMenu}
              >
                {languageMeta[candidate].label}
              </a>
            ))}
          </div>

          <button
            type="button"
            class="menu-button close-menu"
            aria-label={labels.closeMenu}
            ref={closeRef}
            onClick={closeMenu}
          >
            <CloseIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}
