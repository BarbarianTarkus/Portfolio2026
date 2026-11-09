// Progressive enhancement for the project screenshot sliders, the Web/Mobile
// capture selector and the enlarged-capture lightbox.
//
// The server renders every capture inside a native horizontal scroller and
// every screenshot pack in the document, so the gallery is readable without
// JavaScript. This script only adds the tabs, controls and viewer once it is
// safe to assume they can do something: no markup is generated here, which
// keeps the static export identical to the initial HTML.
(() => {
  "use strict";

  const galleries = document.querySelectorAll("[data-gallery]");
  if (galleries.length === 0) return;

  const motionQuery = globalThis.matchMedia
    ? globalThis.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  const prefersReducedMotion = () =>
    motionQuery !== null && motionQuery.matches;

  const scrollBehavior = () => prefersReducedMotion() ? "auto" : "smooth";

  /**
   * Wire one screenshot pack. Returns a small controller when the pack is a
   * real slider (two or more slides and all three controls present), otherwise
   * null so the native scroller stays untouched.
   */
  const setupSlider = (panel) => {
    const track = panel.querySelector("[data-gallery-track]");
    const prev = panel.querySelector("[data-gallery-prev]");
    const next = panel.querySelector("[data-gallery-next]");
    const current = panel.querySelector("[data-gallery-current]");

    if (!track || !prev || !next || !current) return null;

    const slides = track.querySelectorAll("[data-gallery-slide]");
    if (slides.length < 2) return null;

    let index = 0;
    let frame = 0;

    const update = () => {
      const width = track.clientWidth;
      if (width === 0) return;
      const nextIndex = Math.min(
        Math.max(Math.round(track.scrollLeft / width), 0),
        slides.length - 1,
      );
      if (nextIndex === index) return;
      index = nextIndex;
      current.textContent = String(index + 1);
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    const goTo = (target) => {
      const width = track.clientWidth;
      if (width === 0) return;
      const clamped = Math.min(Math.max(target, 0), slides.length - 1);
      index = clamped;
      current.textContent = String(clamped + 1);
      prev.disabled = clamped === 0;
      next.disabled = clamped === slides.length - 1;
      track.scrollTo({ left: clamped * width, behavior: scrollBehavior() });
    };

    const snap = () => {
      const width = track.clientWidth;
      if (width !== 0) {
        track.scrollTo({ left: index * width, behavior: "auto" });
      }
    };

    prev.addEventListener("click", () => goTo(index - 1));
    next.addEventListener("click", () => goTo(index + 1));

    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    });

    track.addEventListener("scroll", () => {
      if (frame !== 0) return;
      frame = globalThis.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }, { passive: true });

    prev.disabled = true;
    next.disabled = slides.length < 2;
    return { panel, track, snap };
  };

  /**
   * Turn the magnifier anchors into a modal viewer. Each anchor still points at
   * the full-size image, so a browser without dialog/JS opens it in a new tab.
   */
  const setupLightbox = (gallery) => {
    const dialog = gallery.querySelector("[data-gallery-lightbox]");
    if (!dialog || typeof dialog.showModal !== "function") return;

    const image = dialog.querySelector("[data-gallery-lightbox-img]");
    const caption = dialog.querySelector("[data-gallery-lightbox-caption]");
    const counter = dialog.querySelector("[data-gallery-lightbox-counter]");
    const prev = dialog.querySelector("[data-gallery-lightbox-prev]");
    const next = dialog.querySelector("[data-gallery-lightbox-next]");
    const close = dialog.querySelector("[data-gallery-lightbox-close]");

    if (!image || !caption || !counter || !prev || !next || !close) return;

    const lightboxTabs = [
      ...dialog.querySelectorAll("[data-gallery-lightbox-tab]"),
    ];

    let packs = [];
    let currentView = "";
    let items = [];
    let index = 0;
    const positions = new Map();

    const slidesIn = (panel) =>
      [...panel.querySelectorAll("[data-gallery-slide]")].map(
        (slide) => {
          const slideImage = slide.querySelector("img");
          const slideCaption = slide.querySelector("figcaption");
          return {
            src: slideImage?.currentSrc || slideImage?.src || "",
            alt: slideImage?.alt || "",
            caption: slideCaption?.textContent?.trim() || "",
          };
        },
      ).filter((item) => item.src !== "");

    const updateTabs = () => {
      for (const tab of lightboxTabs) {
        const selected = tab.getAttribute("data-gallery-lightbox-tab") ===
          currentView;
        tab.setAttribute("aria-pressed", String(selected));
      }
    };

    const render = () => {
      const item = items[index];
      if (item === undefined) return;
      image.src = item.src;
      image.alt = item.alt;
      if (item.caption === "") {
        caption.textContent = "";
        caption.hidden = true;
      } else {
        caption.textContent = item.caption;
        caption.hidden = false;
      }
      counter.textContent = (index + 1) + " / " + items.length;
      const single = items.length < 2;
      prev.hidden = single;
      next.hidden = single;
    };

    const selectPack = (view) => {
      if (view === currentView) return;
      const pack = packs.find((candidate) => candidate.view === view);
      if (pack === undefined) return;
      if (currentView !== "") positions.set(currentView, index);
      currentView = view;
      items = pack.items;
      index = Math.min(positions.get(view) ?? 0, items.length - 1);
      render();
      updateTabs();
      const pageTab = gallery.querySelector(
        '[data-gallery-tab="' + view + '"]',
      );
      if (pageTab !== null) pageTab.click();
    };

    const step = (delta) => {
      if (items.length === 0) return;
      index = (index + delta + items.length) % items.length;
      render();
    };

    const open = (panel, start) => {
      if (dialog.open) return;
      packs = [...gallery.querySelectorAll("[data-gallery-panel]")].map(
        (candidate) => ({
          view: candidate.getAttribute("data-gallery-view") || "",
          items: slidesIn(candidate),
        }),
      ).filter((pack) => pack.items.length > 0);
      const selectedPack =
        packs.find((pack) =>
          pack.view === panel.getAttribute("data-gallery-view")
        ) ?? packs[0];
      if (selectedPack === undefined) return;
      currentView = selectedPack.view;
      items = selectedPack.items;
      index = Math.min(Math.max(start, 0), items.length - 1);
      positions.clear();
      positions.set(currentView, index);
      render();
      updateTabs();
      dialog.showModal();
      document.documentElement.classList.add("has-lightbox");
    };

    const closeViewer = () => {
      if (dialog.open) dialog.close();
    };

    for (const link of gallery.querySelectorAll("[data-gallery-zoom]")) {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        const panel = link.closest("[data-gallery-panel]");
        const slide = link.closest("[data-gallery-slide]");
        if (panel === null || slide === null) return;
        const slides = [...panel.querySelectorAll("[data-gallery-slide]")];
        const start = slides.indexOf(slide);
        if (start === -1) return;
        event.preventDefault();
        open(panel, start);
      });
    }

    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    close.addEventListener("click", closeViewer);

    for (const tab of lightboxTabs) {
      tab.addEventListener("click", () => {
        selectPack(tab.getAttribute("data-gallery-lightbox-tab") || "");
      });
    }

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeViewer();
    });

    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("has-lightbox");
      image.removeAttribute("src");
      image.alt = "";
      caption.textContent = "";
      caption.hidden = true;
      items = [];
      packs = [];
      currentView = "";
      positions.clear();
    });
  };

  // Height is animated only while the pack changes, then released back to auto
  // so the card can keep resizing with its content.
  const heightAnimations = new WeakMap();

  const animateHeight = (gallery, from) => {
    const to = gallery.getBoundingClientRect().height;
    if (prefersReducedMotion() || Math.abs(to - from) < 2) return;

    heightAnimations.get(gallery)?.cancel();
    gallery.style.height = from + "px";
    gallery.style.overflow = "hidden";

    const animation = gallery.animate(
      [{ height: from + "px" }, { height: to + "px" }],
      { duration: 420, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
    heightAnimations.set(gallery, animation);

    const cleanup = () => {
      if (heightAnimations.get(gallery) !== animation) return;
      heightAnimations.delete(gallery);
      gallery.style.height = "";
      gallery.style.overflow = "";
    };
    animation.addEventListener("finish", cleanup);
    animation.addEventListener("cancel", cleanup);
  };

  for (const gallery of galleries) {
    const panels = [...gallery.querySelectorAll("[data-gallery-panel]")];
    const tabs = [...gallery.querySelectorAll("[data-gallery-tab]")];
    const sliders = new Map();

    for (const panel of panels) {
      const slider = setupSlider(panel);
      if (slider !== null) sliders.set(panel, slider);
    }

    setupLightbox(gallery);

    /**
     * Show one pack, update the tab state and re-align its scroll position.
     * User-driven switches also crossfade the new panel and animate the frame
     * height, because Web and Mobile packs have different aspect ratios.
     */
    const activate = (panel, moveFocus, animate = false) => {
      const from = animate ? gallery.getBoundingClientRect().height : 0;

      for (const candidate of panels) {
        candidate.classList.toggle("is-active", candidate === panel);
      }

      for (const tab of tabs) {
        const selected = tab.getAttribute("aria-controls") === panel.id;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && moveFocus) tab.focus();
      }

      const slider = sliders.get(panel);
      if (slider !== undefined) {
        globalThis.requestAnimationFrame(() => slider.snap());
      }

      if (animate) animateHeight(gallery, from);
    };

    if (tabs.length > 1 && panels.length > 1) {
      for (const [index, tab] of tabs.entries()) {
        tab.addEventListener("click", () => {
          const panel = panels.find((candidate) =>
            candidate.id === tab.getAttribute("aria-controls")
          );
          if (panel !== undefined) activate(panel, false, true);
        });

        tab.addEventListener("keydown", (event) => {
          let targetIndex = -1;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            targetIndex = (index + 1) % tabs.length;
          } else if (
            event.key === "ArrowLeft" || event.key === "ArrowUp"
          ) {
            targetIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (event.key === "Home") {
            targetIndex = 0;
          } else if (event.key === "End") {
            targetIndex = tabs.length - 1;
          }
          if (targetIndex === -1) return;
          event.preventDefault();
          const targetTab = tabs[targetIndex];
          const panel = panels.find((candidate) =>
            candidate.id === targetTab.getAttribute("aria-controls")
          );
          if (panel !== undefined) activate(panel, true, true);
        });
      }
    }

    const initialTab = tabs.find((tab) =>
      tab.getAttribute("aria-selected") === "true"
    ) ?? tabs[0];
    const initialPanel = panels.find((panel) =>
      initialTab !== undefined &&
      panel.id === initialTab.getAttribute("aria-controls")
    ) ?? panels[0];

    if (initialPanel !== undefined) activate(initialPanel, false);

    // The tabs and controls are hidden by CSS until this class is present, so
    // a failed script leaves the plain scrollers instead of dead controls.
    gallery.classList.add("is-ready");

    globalThis.addEventListener("resize", () => {
      for (const slider of sliders.values()) {
        if (slider.panel.classList.contains("is-active")) slider.snap();
      }
    });
  }
})();
