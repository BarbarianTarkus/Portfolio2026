import type { EvidenceItem } from "../../lib/content.ts";

/** The three facts under the hero, separated by rules rather than cards. */
export function EvidenceStrip({ items }: { items: EvidenceItem[] }) {
  return (
    <ul class="evidence">
      {items.map((item) => (
        <li key={item.label}>
          <span class="evidence-value">
            {item.value}
          </span>
          <span class="evidence-label">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
