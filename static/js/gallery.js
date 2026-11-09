// Progressive enhancement for the project screenshot sliders.
//
// The server renders every capture inside a native horizontal scroller, so the
// gallery is readable without JavaScript. This script only adds the controls
// and counter once it is safe to assume they can do something: no markup is
// generated here, which keeps the static export identical to the initial HTML.
(() => {
  "use strict";

  const galleries = document.querySelectorAll("[data-gallery]");
  if (galleries.length === 0) return;

  const motionQuery = globalThis.matchMedia
    ? globalThis.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  const scrollBehavior = () =>
    motionQuery !== null && motionQuery.matches ? "auto" : "smooth";

  for (const gallery of galleries) {
    const track = gallery.querySelector("[data-gallery-track]");
    const slides = track ? track.querySelectorAll("[data-gallery-slide]") : [];
    const prev = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const current = gallery.querySelector("[data-gallery-current]");

    if (
      !track || !prev || !next || !current ||
      slides.length < 2
    ) {
      continue;
    }

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
      track.scrollTo({ left: clamped * width, behavior: scrollBehavior() });
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

    globalThis.addEventListener("resize", () => {
      const width = track.clientWidth;
      if (width !== 0) {
        track.scrollTo({ left: index * width, behavior: "auto" });
      }
    });

    // The buttons are hidden by CSS until this class is present, so a failed
    // script leaves the plain scroller instead of dead controls.
    gallery.classList.add("is-ready");
    prev.disabled = true;
    next.disabled = false;
    update();
  }
})();
