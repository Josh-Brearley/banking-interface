import { test, expect } from "@playwright/test";

test("accounts page lists the user's accounts (ACC-AC-01)", async ({
  page,
}) => {
  await page.goto("/accounts");

  await expect(page.getByRole("heading", { name: "Accounts" })).toBeVisible();

  // Seed accounts span the required types (current / savings / credit).
  await expect(page.getByText("Everyday Current")).toBeVisible();
  await expect(page.getByText("Eagle Platinum Credit")).toBeVisible();
});
