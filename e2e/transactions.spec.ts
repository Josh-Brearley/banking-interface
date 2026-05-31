import { test, expect } from "@playwright/test";

test("transactions list renders and search narrows it (TXN-AC-01, TXN-AC-02)", async ({
  page,
}) => {
  await page.goto("/transactions");

  await expect(
    page.getByRole("heading", { name: "Transactions" }),
  ).toBeVisible();

  // Baseline: a known deposit is present before filtering.
  await expect(page.getByText("Salary - Acme Ltd")).toBeVisible();

  // Searching a unique term narrows the (server-side) result set.
  await page.getByLabel("Search").fill("Tesco");
  await expect(page.getByText("Tesco")).toBeVisible();
  await expect(page.getByText("Salary - Acme Ltd")).toHaveCount(0);
});
