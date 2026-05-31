import { test, expect } from "@playwright/test";

test("profile can be viewed, edited and saved (PROF-AC-01, PROF-AC-04)", async ({
  page,
}) => {
  await page.goto("/profile");

  await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
  await expect(page.getByText("demo@eaglebank.com")).toBeVisible();

  // View → edit.
  await page.getByRole("button", { name: /edit profile/i }).click();

  const newName = "Josh B Brearley";
  await page.getByLabel("Full name").fill(newName);
  await page.getByRole("button", { name: /save changes/i }).click();

  // Back in the read-only view, the new value is reflected (in the main panel —
  // it also syncs to the sidebar summary, hence scoping to #main-content).
  await expect(page.locator("#main-content").getByText(newName)).toBeVisible();
});
