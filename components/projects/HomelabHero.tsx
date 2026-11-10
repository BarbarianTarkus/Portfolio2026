import { ProseField } from "../../lib/markdown.tsx";
import type { HomelabHero as HomelabHeroContent } from "../../lib/content.ts";
import { TechStack } from "../TechTags.tsx";

interface HomelabHeroProps {
  content: HomelabHeroContent;
  tags: string[];
  basePath: string;
  sourcePath: string;
  inlineEditing: boolean;
}

/**
 * The projects page opens with the infrastructure the work runs on: a featured
 * band with the pitch, its headline metrics and the homelab stack. It is the
 * section that used to close the About page, moved here where the inventory of
 * built things lives.
 */
export function HomelabHero(
  { content, tags, basePath, sourcePath, inlineEditing }: HomelabHeroProps,
) {
  return (
    <section
      class="homelab-hero"
      id="homelab"
      aria-labelledby="homelab-hero-title"
    >
      <div class="homelab-hero-copy">
        <p class="homelab-hero-eyebrow">{content.eyebrow}</p>
        <h2 class="homelab-hero-title" id="homelab-hero-title">
          <ProseField
            text={content.title}
            path="homelab.title"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </h2>
        <p class="homelab-hero-note">
          <ProseField
            text={content.note}
            basePath={basePath}
            path="homelab.note"
            sourcePath={sourcePath}
            editing={inlineEditing}
          />
        </p>
        <TechStack tags={tags} labeled class="homelab-hero-tags" />
      </div>

      <dl class="homelab-hero-facts">
        {content.facts.map((fact) => (
          <div class="homelab-hero-fact" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
