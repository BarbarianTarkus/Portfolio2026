/**
 * CSS linting. `stylelint-config-modern` enforces what the Modern CSS rules
 * can be checked mechanically: no hex/named/rgb()/hsl() colours, two-value
 * `display`, flow-relative properties, units and values, and implicit `&`
 * nesting.
 *
 *     deno task lint:css
 */
export default {
  extends: ["stylelint-config-modern"],
  ignoreFiles: ["dist/**", "_fresh/**", "node_modules/**"],
};
