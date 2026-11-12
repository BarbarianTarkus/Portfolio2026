// Entrance for the stack cross-section where a scroll-driven animation is not
// available. static/styles/stack.css reveals each row with
// animation-timeline: view(); this script only arms the transition rules of
// that fallback and flips them on when the map reaches the viewport, so every
// other engine keeps the stylesheet's own animation and no-JS visitors keep
// the static map. Nothing is generated here.
(() => {
  "use strict";

  const maps = document.querySelectorAll(".stack-map");
  if (maps.length === 0) return;

  // Where the stylesheet can drive the reveal itself, leave it alone.
  if (globalThis.CSS?.supports?.("animation-timeline: view()") === true) return;
  if (typeof IntersectionObserver !== "function") return;

  const motionQuery = globalThis.matchMedia
    ? globalThis.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  if (motionQuery !== null && motionQuery.matches) return;

  const reveal = (map) => {
    map.dataset.stackReveal = "shown";
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal(entry.target);
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -12% 0px" });

  for (const map of maps) {
    const rows = map.querySelectorAll(".stack-layer");
    for (const [index, row] of rows.entries()) {
      row.style.setProperty("--stack-row", String(index));
    }

    // A map the reader can already see skips the entrance instead of playing
    // it over content in view (an anchor jump, a restored scroll position).
    if (map.getBoundingClientRect().top < globalThis.innerHeight) {
      reveal(map);
      continue;
    }

    // The empty value arms the hidden start state; "shown" transitions out of
    // it, staggered by the row index through --stack-row.
    map.dataset.stackReveal = "";
    observer.observe(map);
  }
})();
