import { describe, it, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { expectNoA11yViolations } from "@/tests/axe";
import { makeAccount, makeTransaction } from "@/tests/fixtures";
import * as authService from "@/services/auth.service";
import * as accountsService from "@/services/accounts.service";
import * as transactionsService from "@/services/transactions.service";
import { writeSession } from "@/lib/auth/session";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { AccountsPage } from "@/features/accounts/pages/AccountsPage";
import { TransactionsPage } from "@/features/transactions/pages/TransactionsPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { NotFoundPage } from "@/features/misc/pages/NotFoundPage";
import { Modal } from "@/components/atoms/Modal";
import { Drawer } from "@/components/atoms/Drawer";

/**
 * Automated WCAG 2.1 AA checks (NFR-A11Y-V1), every route and the dialog
 * widgets must pass axe-core's Level A & AA ruleset once loaded. Contrast is
 * excluded (jsdom has no layout); see tests/axe.ts.
 */

async function seedSession() {
  const session = await authService.login({
    email: "demo@eaglebank.com",
    password: "Password123!",
  });
  writeSession(session);
}

// Wait for the page heading then for any loading skeletons (aria-busy) to clear,
// so axe runs against the fully rendered UI rather than a placeholder.
async function settle(container: HTMLElement) {
  await screen.findByRole("heading", { level: 1 });
  await waitFor(() => {
    if (container.querySelector('[aria-busy="true"]')) {
      throw new Error("still loading");
    }
  });
}

describe("accessibility (WCAG 2.1 AA), authenticated pages", () => {
  beforeEach(async () => {
    await seedSession();
  });

  it("DashboardPage has no axe violations", async () => {
    const { container } = renderWithProviders(<DashboardPage />, {
      initialEntries: ["/dashboard"],
    });
    await settle(container);
    await expectNoA11yViolations(container);
  });

  it("AccountsPage has no axe violations", async () => {
    vi.spyOn(accountsService, "listAccounts").mockResolvedValue([
      makeAccount({ id: "a1", name: "Everyday Current" }),
      makeAccount({ id: "a2", name: "Rainy Day Savings", type: "savings" }),
    ]);
    const { container } = renderWithProviders(<AccountsPage />, {
      initialEntries: ["/accounts"],
    });
    await settle(container);
    await expectNoA11yViolations(container);
  });

  it("TransactionsPage has no axe violations", async () => {
    vi.spyOn(transactionsService, "listTransactions").mockResolvedValue({
      items: [
        makeTransaction({ id: "t1", description: "Salary - Acme Ltd" }),
        makeTransaction({ id: "t2", description: "Tesco" }),
      ],
      total: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });
    const { container } = renderWithProviders(<TransactionsPage />, {
      initialEntries: ["/transactions"],
    });
    await settle(container);
    await expectNoA11yViolations(container);
  });

  it("ProfilePage has no axe violations", async () => {
    const { container } = renderWithProviders(<ProfilePage />, {
      initialEntries: ["/profile"],
    });
    await settle(container);
    await expectNoA11yViolations(container);
  });
});

describe("accessibility (WCAG 2.1 AA), public pages", () => {
  it("LoginPage has no axe violations", async () => {
    const { container } = renderWithProviders(<LoginPage />, {
      initialEntries: ["/login"],
    });
    await screen.findByRole("heading", { level: 1 });
    await expectNoA11yViolations(container);
  });

  it("RegisterPage has no axe violations", async () => {
    const { container } = renderWithProviders(<RegisterPage />, {
      initialEntries: ["/register"],
    });
    await screen.findByRole("heading", { level: 1 });
    await expectNoA11yViolations(container);
  });

  it("NotFoundPage has no axe violations", async () => {
    const { container } = renderWithProviders(<NotFoundPage />, {
      initialEntries: ["/nope"],
    });
    await screen.findByRole("heading", { level: 1 });
    await expectNoA11yViolations(container);
  });
});

describe("accessibility (WCAG 2.1 AA), dialog widgets", () => {
  it("open Modal has no axe violations", async () => {
    const { baseElement } = renderWithProviders(
      <Modal open onClose={vi.fn()} title="Transaction details">
        <p>Body content</p>
      </Modal>,
    );
    await expectNoA11yViolations(baseElement);
  });

  it("open Drawer has no axe violations", async () => {
    const { baseElement } = renderWithProviders(
      <Drawer open onClose={vi.fn()} title="Filters">
        <p>Body content</p>
      </Drawer>,
    );
    await expectNoA11yViolations(baseElement);
  });
});
