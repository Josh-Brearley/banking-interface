import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { ApiError } from "@/lib/api/client";
import * as accountsService from "@/services/accounts.service";
import { AccountsPage } from "./pages/AccountsPage";

function setViewport(isDesktop: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: isDesktop,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.search}</div>;
}

function renderAccounts() {
  return renderWithProviders(
    <Routes>
      <Route
        path="/accounts"
        element={
          <>
            <AccountsPage />
            <LocationProbe />
          </>
        }
      />
    </Routes>,
    { initialEntries: ["/accounts"] },
  );
}

describe("AccountsPage", () => {
  beforeEach(() => setViewport(true));

  it("lists accounts with masked numbers and balances (ACCT-AC-01, 08)", async () => {
    renderAccounts();
    expect(await screen.findByText("Everyday Current")).toBeInTheDocument();
    expect(screen.getByText("•••• 1234")).toBeInTheDocument();
    expect(screen.getByText("£3,482.15")).toBeInTheDocument();
    // Full account number is never rendered.
    expect(screen.queryByText("20581234")).toBeNull();
  });

  it("shows status as a labelled badge (ACCT-AC-06)", async () => {
    renderAccounts();
    await screen.findByText("Everyday Current");
    expect(screen.getAllByText("Active").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Frozen")).toBeInTheDocument();
  });

  it("searches by name and reflects it in the URL (ACCT-AC-03)", async () => {
    renderAccounts();
    await screen.findByText("Everyday Current");
    await userEvent.type(
      screen.getByLabelText(/search accounts/i),
      "savings",
    );
    expect(await screen.findByText("Rainy Day Savings")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Everyday Current")).toBeNull(),
    );
    expect(screen.getByTestId("loc").textContent).toContain("q=savings");
  });

  it("shows a no-results state with a clear action (ACCT-AC-04)", async () => {
    renderAccounts();
    await screen.findByText("Everyday Current");
    await userEvent.type(screen.getByLabelText(/search accounts/i), "zzzzz");
    const clear = await screen.findByRole("button", { name: /clear search/i });
    await userEvent.click(clear);
    expect(await screen.findByText("Everyday Current")).toBeInTheDocument();
  });

  it("sorts by balance and toggles direction (ACCT-AC-05)", async () => {
    renderAccounts();
    await screen.findByText("Everyday Current");

    await userEvent.click(screen.getByRole("button", { name: /balance/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("columnheader", { name: /balance/i }),
      ).toHaveAttribute("aria-sort", "ascending"),
    );
    // Lowest balance (credit, -£452.30) sorts first ascending.
    let rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("Eagle Platinum Credit")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /balance/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("columnheader", { name: /balance/i }),
      ).toHaveAttribute("aria-sort", "descending"),
    );
    rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("Rainy Day Savings")).toBeInTheDocument();
  });

  it("shows an error state with retry (ACCT-AC-07)", async () => {
    const spy = vi
      .spyOn(accountsService, "listAccounts")
      .mockRejectedValueOnce(new ApiError(500, "SERVER_ERROR", "Boom"));
    renderAccounts();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    spy.mockResolvedValue([]);
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    await waitFor(() => expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2));
  });
});
