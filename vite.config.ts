/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { buildCsp } from "./src/lib/security/csp";

/**
 * NFR-SEC-01: inject the Content-Security-Policy as a <meta> on the built
 * index.html. Build-only — the dev server / HMR needs inline scripts + ws:,
 * which a strict CSP would break.
 */
function csp(): Plugin {
  return {
    name: "eaglebank-csp",
    apply: "build",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: {
            "http-equiv": "Content-Security-Policy",
            content: buildCsp(),
          },
          injectTo: "head-prepend",
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), csp()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Route-based chunks come from React.lazy; keep a sensible warning ceiling.
    chunkSizeWarningLimit: 700,
    // Drop Vite's inline modulepreload polyfill so the CSP can keep
    // script-src 'self' with no 'unsafe-inline' (NFR-SEC-01). Modern target
    // browsers support <link rel="modulepreload"> natively.
    modulePreload: { polyfill: false },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    css: true,
    // Vitest owns unit/integration tests under src/. Playwright E2E lives in e2e/
    // and must not be collected by Vitest (its default glob would match *.spec.ts).
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.config.*",
        "src/tests/**",
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "src/main.tsx",
      ],
    },
  },
});
