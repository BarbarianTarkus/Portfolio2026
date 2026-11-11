interface BrandMarkProps {
  class?: string;
}

/**
 * The supplied Ricardo "R" mark, with the white counter cut out of the solid
 * shape so it stays transparent on any surface. The mark inherits the header's
 * accent color, including its hover state.
 */
export function BrandMark({ class: className = "brand-mark" }: BrandMarkProps) {
  return (
    <svg
      class={className}
      viewBox="0 0 73.512 86.731"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d={R_MARK}
      />
    </svg>
  );
}

const R_OUTER =
  "M47.445 6.904 C59.348 16.581 60.132 44.822 43.557 50.337 L43.557 50.337 C43.5 50.356 43.444 50.374 43.387 50.393 L43.384 50.39 C43.085 50.478 42.743 50.567 42.607 50.627 L58.297 86.222 L39.386 86.017 L26.471 55.081 L18.009 55.286 L17.7 86.222 L0.502 86.222 L0.858 2.061 L0.858 0.999 C14.619 1.028 36.384 -2.088 47.445 6.904 Z";
const R_COUNTER =
  "M17.7 40.977 L18.009 15.356 L27.583 15.356 C29.234 15.356 29.917 15.228 31.508 15.825 C33.717 16.653 35.823 18.428 36.802 20.599 C38.112 23.507 38.308 30.913 37.4 33.958 C36.648 36.477 34.659 39.022 32.308 40.23 C30.799 41.004 29.785 40.977 28.192 40.977 Z";
const R_MARK = `${R_OUTER} ${R_COUNTER}`;
