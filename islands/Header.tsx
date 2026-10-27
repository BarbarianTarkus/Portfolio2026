import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { site } from "../data/site.ts";
import { CloseIcon, MenuIcon } from "../components/Icons.tsx";

interface HeaderProps {
  /** Deployment prefix, e.g. "/Portfolio" ("" when served from the root). */
  basePath: string;
  /** Current path *without* the basePath, e.g. "/about". */
  currentPath: string;
}

function isActive(currentPath: string, route: string): boolean {
  if (route === "/") return currentPath === "/";
  return currentPath === route || currentPath.startsWith(`${route}/`);
}

/**
 * Header island: the only part of the page that needs client-side JavaScript.
 * It owns the mobile menu state, Escape handling and scroll locking; the rest
 * of the site is plain server-rendered HTML.
 */
export default function Header({ basePath, currentPath }: HeaderProps) {
  const open = useSignal(false);
  const href = (route: string) => `${basePath}${route}`;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") open.value = false;
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  // Reflect the open state on <body> so the page behind the overlay cannot
  // scroll while the mobile menu is visible.
  useEffect(() => {
    document.body.classList.toggle("menu-open", open.value);
    return () => document.body.classList.remove("menu-open");
  });

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

      <button
        type="button"
        class="menu-button"
        aria-pressed={open.value ? "true" : "false"}
        aria-expanded={open.value ? "true" : "false"}
        aria-controls="main-nav"
        onClick={() => (open.value = !open.value)}
      >
        <span class="sr-only">Toggle navigation menu</span>
        <MenuIcon />
      </button>

      <nav
        id="main-nav"
        class={`main-nav${open.value ? " open" : ""}`}
        aria-label="Main"
      >
        <ul>
          {site.nav.map((item, index) => {
            const active = isActive(currentPath, item.route);
            return (
              <li key={item.route}>
                <a
                  href={href(item.route)}
                  class={active ? "active" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => (open.value = false)}
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
          onClick={() => (open.value = false)}
        >
          <CloseIcon />
        </button>
      </nav>
    </header>
  );
}
