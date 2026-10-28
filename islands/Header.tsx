import { useEffect } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";
import { site } from "../data/site.ts";
import { CloseIcon, MenuIcon } from "../components/Icons.tsx";

interface HeaderProps {
  /** Deployment prefix, e.g. "/Portfolio" ("" when served from the root). */
  basePath: string;
  /** Current path without the base path, e.g. "/about" (used for active nav). */
  currentPath: string;
}

interface MenuToggleProps {
  open: boolean;
  onToggle: () => void;
}

/**
 * Keep the mobile menu keyboard-accessible: Escape closes it and the open
 * state locks page scroll behind the fullscreen overlay.
 */
function useMenuEffects(open: Signal<boolean>): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") open.value = false;
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open.value);
    return () => document.body.classList.remove("menu-open");
  });
}

function MenuToggle({ open, onToggle }: MenuToggleProps) {
  const pressed = open ? "true" : "false";
  return (
    <button
      type="button"
      class="menu-button"
      aria-pressed={pressed}
      aria-expanded={pressed}
      aria-controls="main-nav"
      onClick={onToggle}
    >
      <span class="sr-only">Toggle navigation menu</span>
      <MenuIcon />
    </button>
  );
}

/**
 * Header island: the only part of the page that needs client-side JavaScript.
 * It owns the mobile menu state, Escape handling and scroll locking; the rest
 * of the site is plain server-rendered HTML.
 *
 * Active-link state is not computed here: Fresh annotates matching anchors with
 * `aria-current`, which the stylesheet uses for the active nav indicator.
 */
export default function Header({ basePath, currentPath }: HeaderProps) {
  const open = useSignal(false);
  const href = (route: string) => `${basePath}${route}`;
  const closeMenu = () => (open.value = false);

  useMenuEffects(open);

  return (
    <header>
      <a class="skip-to-content-link" href="#main">Skip to main content</a>

      <a
        class="site-title"
        href={href("/")}
        aria-label={`${site.author} — home`}
      >
        {site.shortTitle}
      </a>

      <MenuToggle
        open={open.value}
        onToggle={() => (open.value = !open.value)}
      />

      <nav
        id="main-nav"
        class={`main-nav${open.value ? " open" : ""}`}
        aria-label="Main"
      >
        <ul onClick={closeMenu}>
          {site.nav.map((item, index) => {
            const active = currentPath === item.route ||
              currentPath.startsWith(`${item.route}/`);
            return (
              <li key={item.route}>
                <a
                  href={href(item.route)}
                  aria-current={active ? "page" : undefined}
                >
                  <b class="nav-index">
                    {String(index + 1).padStart(2, "0")}.{" "}
                  </b>
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          class="menu-button close-menu"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        >
          <CloseIcon />
        </button>
      </nav>
    </header>
  );
}
