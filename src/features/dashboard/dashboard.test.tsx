import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { makeDashboardSummary } from "@/tests/fixtures";
import { writeSession } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/client";
import * as authService from "@/services/auth.service";
import * as dashboardService from "@/services/dashboard.service";
import { DashboardPage } from "./pages/DashboardPage";

async function seedSession() {
  const session = await authService.login({
    email: "demo@eaglebank.com",
    password: "Password123!",
  });
  writeSession(session);
}

function renderDashboard() {
  return renderWithProviders(
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/accounts" element={<h1>Accounts home</h1>} />
      <Route path="/transactions" element={<h1>Transactions home</h1>} />
      <Route path="/profile" element={<h1>Profile home</h1>} />
    </Routes>,
    { initialEntries: ["/dashboard"] },
  );
}

describe("DashboardPage", () => {
  it("greets the user by first name (DASH-AC-01)", async () => {
    await seedSession();
    vi.spyOn(dashboardService, "getSummary").mockResolvedValue(
      makeDashboardSummary(),
    );
    renderDashboard();
    expect(await screen.findByText(/priya/i)).toBeInTheDocument();
  });

  it("shows the summary figures formatted as GBP (DASH-AC-02)", async () => {
    vi.spyOn(dashboardService, "getSummary").mockResolvedValue(
      makeDashboardSummary({
        totalBalanceMinor: 348215,
        monthlyDepositsMinor: 285000,
        monthlyWithdrawalsMinor: 50000,
      }),
    );
    renderDashboard();
    expect(await screen.findByText("£3,482.15")).toBeInTheDocument();
    expect(screen.getByText("£2,850.00")).toBeInTheDocument();
    expect(screen.getByText("£500.00")).toBeInTheDocument();
  });

  it("lists recent transactions with a view-all link (DASH-AC-03)", async () => {
    vi.spyOn(dashboardService, "getSummary").mockResolvedValue(
      makeDashboardSummary(),
    );
    renderDashboard();
    expect(
      await screen.findByText("Salary - Acme Ltd"),
    ).toBeInTheDocument();
    expect(screen.getByText("Tesco")).toBeInTheDocument();
    const viewAll = screen.getByRole("link", { name: /view all/i });
    expect(viewAll).toHaveAttribute("href", "/transactions");
  });

  it("renders skeletons while loading (DASH-AC-04)", async () => {
    vi.spyOn(dashboardService, "getSummary").mockReturnValue(
      new Promise(() => {}),
    );
    renderDashboard();
    expect(await screen.findByRole("status", { name: /loading/i })).toBeInTheDocument();
  });

  it("shows an empty state when there is no activity (DASH-AC-05)", async () => {
    vi.spyOn(dashboardService, "getSummary").mockResolvedValue(
      makeDashboardSummary({
        totalBalanceMinor: 0,
        monthlyDepositsMinor: 0,
        monthlyWithdrawalsMinor: 0,
        accountsCount: 0,
        recentTransactions: [],
      }),
    );
    renderDashboard();
    expect(
      await screen.findByText(/no accounts yet|get started|nothing here/i),
    ).toBeInTheDocument();
  });

  it("shows an error state with working retry (DASH-AC-06)", async () => {
    const spy = vi
      .spyOn(dashboardService, "getSummary")
      .mockRejectedValueOnce(new ApiError(500, "SERVER_ERROR", "Boom"))
      .mockResolvedValueOnce(makeDashboardSummary());
    renderDashboard();
    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByText("Salary - Acme Ltd")).toBeInTheDocument();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("quick actions navigate to their destinations (DASH-AC-07)", async () => {
    vi.spyOn(dashboardService, "getSummary").mockResolvedValue(
      makeDashboardSummary(),
    );
    renderDashboard();
    await userEvent.click(
      await screen.findByRole("link", { name: /view accounts/i }),
    );
    expect(
      await screen.findByRole("heading", { name: /accounts home/i }),
    ).toBeInTheDocument();
  });
});
