import type { Preview } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
// Self-hosted Inter + design tokens / Tailwind layers — the same imports as the app
// (src/main.tsx) so every story paints with the real brand styling.
import "@fontsource-variable/inter";
import "../src/styles/index.css";

// Match the app router so <Link>-bearing components (cards, rails, headers) render
// without a "useNavigate() outside a Router" error.
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter future={routerFuture}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "#FBFBFD" },
        { name: "surface", value: "#FFFFFF" },
        { name: "navy", value: "#0B2A5B" },
      ],
    },
    a11y: {
      // Fail-loud config: surface violations rather than silently passing.
      config: {},
      options: {},
    },
  },
};

export default preview;
