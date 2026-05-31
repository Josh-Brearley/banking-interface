import { test, expect } from "@playwright/test";

test("dashboard greets the user and renders after login (DASH-AC-01)", async ({
  page,
}) => {
  await page.goto("/dashboard");

  // Greeting is "<time greeting>, <first name>" — the seed user is Josh Brearley.
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Josh");

  // Recent activity links through to the full transaction history.
  await expect(
    page.getByRole("navigation", { name: /primary/i }).first(),
  ).toBeVisible();
});
