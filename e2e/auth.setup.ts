import { test as setup, expect } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

/**
 * Logs in through the real UI once and persists the session. Every authenticated
 * spec reuses this via `storageState`, so they don't each pay the login cost.
 */
setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("demo@eaglebank.com");
  await page.getByLabel("Password", { exact: true }).fill("Password123!");
  await page.getByRole("button", { name: /log in/i }).click();

  // Landing on the dashboard proves the session is live.
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
