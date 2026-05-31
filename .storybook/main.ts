import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook 8 (React + Vite builder). Reuses the app's Vite config — the `@`
 * alias and Tailwind/PostCSS pipeline are inherited, so stories render with the
 * real design tokens. See README → Design system.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    // Runs axe-core in the Storybook UI — a11y is non-negotiable here.
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Serve the app's static assets (brand logos, card image) so stories that
  // render <img src="/logos/..."> / "/images/..." resolve exactly as in the app.
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
  docs: { autodocs: "tag" },
};

export default config;
