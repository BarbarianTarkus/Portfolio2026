import type { ProjectGalleryGroup } from "../../lib/content.ts";
import { useLanguage } from "../../lib/i18n.tsx";
import { uiStrings } from "../../lib/ui-strings.ts";

interface ProjectLightboxProps {
  packs: ProjectGalleryGroup[];
  projectName: string;
  viewLabel: string;
  hasTabs: boolean;
}

/**
 * Full-screen viewer for the screenshot packs. The dialog stays in the DOM;
 * static/js/gallery.js opens it, swaps the image and keeps the counter in sync.
 */
export function ProjectLightbox(
  { packs, projectName, viewLabel, hasTabs }: ProjectLightboxProps,
) {
  const strings = uiStrings(useLanguage());

  return (
    <dialog
      class={"gallery-lightbox" +
        (hasTabs ? " gallery-lightbox--with-switcher" : "")}
      data-gallery-lightbox
      aria-label={strings.gallery.lightbox(projectName)}
    >
      <div class="gallery-lightbox-frame">
        {hasTabs && (
          <div
            class="gallery-lightbox-switcher"
            data-gallery-lightbox-switcher
            role="group"
            aria-label={viewLabel}
          >
            {packs.map((group, index) => (
              <button
                class="gallery-tab gallery-lightbox-tab"
                type="button"
                data-gallery-lightbox-tab={group.view}
                aria-pressed={index === 0 ? "true" : "false"}
                key={group.view}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}
        <button
          class="gallery-lightbox-close"
          type="button"
          data-gallery-lightbox-close
          aria-label={strings.gallery.close}
          autofocus
        >
          <span aria-hidden="true">×</span>
        </button>
        <button
          class="gallery-lightbox-button gallery-lightbox-prev"
          type="button"
          data-gallery-lightbox-prev
          aria-label={strings.gallery.previous}
        >
          <span aria-hidden="true">←</span>
        </button>
        <figure class="gallery-lightbox-media">
          <img data-gallery-lightbox-img alt="" decoding="async" />
          <figcaption data-gallery-lightbox-caption hidden></figcaption>
        </figure>
        <button
          class="gallery-lightbox-button gallery-lightbox-next"
          type="button"
          data-gallery-lightbox-next
          aria-label={strings.gallery.next}
        >
          <span aria-hidden="true">→</span>
        </button>
        <p
          class="gallery-lightbox-counter"
          data-gallery-lightbox-counter
          aria-live="polite"
        >
        </p>
      </div>
    </dialog>
  );
}
