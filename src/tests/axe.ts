import { expect } from "vitest";
import { axe } from "vitest-axe";

/**
 * Asserts the given DOM subtree has no axe-core violations, scoped to the
 * WCAG 2.0/2.1 Level A & AA success criteria (specs/05-cross-cutting.md §1.1).
 *
 * Colour-contrast (1.4.3) is disabled because jsdom has no layout engine to
 * compute rendered colours, contrast is verified against the design tokens
 * instead; use a browser-based axe run to assert it automatically.
 *
 * Asserts on `results.violations` directly (rather than the vitest-axe matcher)
 * so the failure message lists each offending rule with no extra setup.
 */
const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

export async function expectNoA11yViolations(container: Element) {
  const results = await axe(container, {
    runOnly: { type: "tag", values: WCAG_AA_TAGS },
    rules: { "color-contrast": { enabled: false } },
  });
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`,
  );
  expect(summary, `axe violations:\n${summary.join("\n")}`).toEqual([]);
}
