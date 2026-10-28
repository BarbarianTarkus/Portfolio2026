import { useEffect, useRef } from "preact/hooks";
import type { RefObject } from "preact";
import { type Signal, useSignal } from "@preact/signals";
import { site } from "../data/site.ts";
import { CloseIcon, MenuIcon } from "../components/Icons.tsx";

interface HeaderProps {
  /** Deployment prefix, e.g. "/Portfolio" ("" when served from the root). */
  basePath: string;
  /** Current request path, used only to mark the logo when it is the page. */
  path: string;
}

interface MenuToggleProps {
  open: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement>;
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

function MenuToggle({ open, onToggle, buttonRef }: MenuToggleProps) {
  return (
    <button
      type="button"
      class="menu-button"
      aria-expanded={open ? "true" : "false"}
      aria-controls="main-nav"
      aria-label={open
        ? "Cerrar el menú de navegación"
        : "Abrir el menú de navegación"}
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
 * `aria-current`, which the stylesheet uses for the active nav indicator.
 */
export default function Header({ basePath, path }: HeaderProps) {
  const open = useSignal(false);
  // The active state is owned here on purpose: Fresh annotates the matching
  // anchor during SSR, but hydration re-renders this island from `site.nav`
  // and the attribute would be lost. `data-current` is what the client router
  // reads to keep intercepting links, so both are rendered together.
  const normalise = (value: string) => value.replace(/\/+$/, "") || "/";
  const route = normalise(
    path.startsWith(basePath) ? path.slice(basePath.length) : path,
  );
  const isActive = (target: string) => normalise(target) === route;
  const isHome = route === "/";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const href = (route: string) => `${basePath}${route}`;
  const closeMenu = () => (open.value = false);

  useMenuEffects(open);
  useMenuFocus(open, toggleRef, closeRef);

  return (
    <header>
      <a class="skip-to-content-link" href="#main">
        Saltar al contenido principal
      </a>

      <div class="header-inner shell">
        <a
          class="site-title"
          href={href("/")}
          aria-label={`${site.author} — inicio`}
          aria-current={isHome ? "page" : "false"}
        >
          {site.shortTitle}
        </a>

        <MenuToggle
          open={open.value}
          onToggle={() => (open.value = !open.value)}
          buttonRef={toggleRef}
        />

        <nav
          id="main-nav"
          class={`main-nav${open.value ? " open" : ""}`}
          aria-label="Navegación principal"
        >
          <ul onClick={closeMenu}>
            {site.nav.map((item, index) => (
              <li key={item.route}>
                <a
                  href={href(item.route)}
                  aria-current={isActive(item.route) ? "page" : undefined}
                  data-current={isActive(item.route) ? "true" : undefined}
                >
                  <b class="nav-index">
                    {String(index + 1).padStart(2, "0")}.{" "}
                  </b>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            class="menu-button close-menu"
            aria-label="Cerrar el menú de navegación"
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
