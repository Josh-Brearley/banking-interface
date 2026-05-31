import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke suite (specs/04-testing-strategy.md §3).
 * Runs the production build (`vite preview`) in a real browser so route-based
 * lazy chunks, real localStorage session persistence, and each feature's
 * end-to-end render are exercised — the things jsdom integration tests can't prove.
 */
const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    // Establishes an authenticated session once and saves it to disk.
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  // Build first so we test the real, chunked production bundle, then preview it.
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
