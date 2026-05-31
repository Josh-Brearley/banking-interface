import { test, expect } from "@playwright/test";

// Auth flows run from a clean, unauthenticated context (opt out of the shared session).
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("authentication", () => {
  test("redirects an unauthenticated visit to a protected route to login (AUTH-AC-09)", async ({
    page,
  }) => {
    await page.goto("/accounts");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("rejects bad credentials with an inline error (AUTH-AC-04)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@eaglebank.com");
    await page.getByLabel("Password", { exact: true }).fill("wrong-password");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByRole("alert")).toContainText(/incorrect/i);
    await expect(page).toHaveURL(/\/login/);
  });

  test("logs in, reaches the dashboard, then logs out (AUTH-AC-10, AUTH-FR-10)", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@eaglebank.com");
    await page.getByLabel("Password", { exact: true }).fill("Password123!");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    // Logout lives on the Profile page (AUTH-FR-10).
    await page.goto("/profile");
    await page.getByRole("button", { name: /log out/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});
