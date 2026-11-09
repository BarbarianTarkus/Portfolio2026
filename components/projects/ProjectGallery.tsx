import type { ProjectGalleryGroup } from "../../lib/content.ts";
import { ProjectLightbox } from "./ProjectLightbox.tsx";

interface GalleryPanelProps {
  group: ProjectGalleryGroup;
  projectSlug: string;
  projectName: string;
  basePath: string;
  active: boolean;
  hasTabs: boolean;
  eager: boolean;
}

/**
 * One screenshot pack: a native horizontal scroller plus the controls that
 * static/js/gallery.js enables. Every capture is server-rendered, so the pack
 * remains readable without JavaScript.
 */
function GalleryPanel(
  {
    group,
    projectSlug,
    projectName,
    basePath,
    active,
    hasTabs,
    eager,
  }: GalleryPanelProps,
) {
  const count = group.images.length;
  const slider = count > 1;
  const panelId = projectSlug + "-gallery-" + group.view;
  const tabId = panelId + "-tab";

  return (
    <div
      class={"gallery-panel" + (active ? " is-active" : "")}
      id={panelId}
      data-gallery-panel
      data-gallery-view={group.view}
      role={hasTabs ? "tabpanel" : "group"}
      aria-labelledby={hasTabs ? tabId : undefined}
      aria-label={hasTabs ? undefined : "Capturas de " + projectName}
    >
      <div
        class="gallery-track"
        data-gallery-track
        tabindex={slider ? 0 : undefined}
        aria-label={slider
          ? "Carrusel de capturas de " + projectName + " (" + group.label + ")"
          : undefined}
      >
        {group.images.map((image, index) => (
          <figure
            class="gallery-slide"
            data-gallery-slide
            key={image.src}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={(index + 1) + " de " + count}
          >
            <div class="gallery-media">
              <a
                class="gallery-zoom"
                href={image.src.startsWith("http")
                  ? image.src
                  : basePath + image.src}
                target="_blank"
                rel="noopener noreferrer"
                data-gallery-zoom
                aria-label={"Ampliar captura: " + image.alt}
                title="Ampliar captura"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="M10.5 7.6v5.8M7.6 10.5h5.8" />
                  <path d="m15.4 15.4 5.1 5.1" />
                </svg>
              </a>
              <img
                src={image.src.startsWith("http")
                  ? image.src
                  : basePath + image.src}
                alt={image.alt}
                loading={eager && active && index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
            {image.caption !== undefined && (
              <figcaption>{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
      {slider && (
        <div class="gallery-controls" data-gallery-controls>
          <button
            class="gallery-button gallery-prev"
            type="button"
            data-gallery-prev
            aria-label={"Captura anterior de " + group.label}
          >
            <span aria-hidden="true">←</span>
          </button>
          <p class="gallery-counter" aria-live="polite">
            <span data-gallery-current>1</span> / {count}
          </p>
          <button
            class="gallery-button gallery-next"
            type="button"
            data-gallery-next
            aria-label={"Captura siguiente de " + group.label}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface ProjectGalleryProps {
  groups: ProjectGalleryGroup[];
  projectSlug: string;
  projectName: string;
  basePath: string;
  viewLabel: string;
  variant?: "cover";
  eager?: boolean;
}

/**
 * Screenshot slider with an optional Web/Mobile selector. The selector only
 * appears when JavaScript is available; without it, every pack is rendered
 * one after another as its own native scroller.
 */
export function ProjectGallery(
  {
    groups,
    projectSlug,
    projectName,
    basePath,
    viewLabel,
    variant,
    eager = false,
  }: ProjectGalleryProps,
) {
  const packs = groups.filter((group) => group.images.length > 0);
  if (packs.length === 0) return null;
  const hasTabs = packs.length > 1;
  const className = variant === "cover"
    ? "project-gallery project-gallery--cover"
    : "project-gallery";

  return (
    <section class={className} data-gallery>
      {hasTabs && (
        <div
          class="gallery-switcher"
          data-gallery-switcher
          role="tablist"
          aria-label={viewLabel}
        >
          {packs.map((group, index) => (
            <button
              class="gallery-tab"
              type="button"
              role="tab"
              id={projectSlug + "-gallery-" + group.view + "-tab"}
              aria-controls={projectSlug + "-gallery-" + group.view}
              aria-selected={index === 0}
              tabindex={index === 0 ? 0 : -1}
              data-gallery-tab={group.view}
              key={group.view}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}
      {packs.map((group, index) => (
        <GalleryPanel
          group={group}
          projectSlug={projectSlug}
          projectName={projectName}
          basePath={basePath}
          active={index === 0}
          hasTabs={hasTabs}
          eager={eager}
          key={group.view}
        />
      ))}
      <ProjectLightbox
        packs={packs}
        projectName={projectName}
        viewLabel={viewLabel}
        hasTabs={hasTabs}
      />
    </section>
  );
}
