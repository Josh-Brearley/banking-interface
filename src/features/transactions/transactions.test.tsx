import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { ApiError } from "@/lib/api/client";
import * as txnService from "@/services/transactions.service";
import { TransactionsPage } from "./pages/TransactionsPage";

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

function renderTransactions() {
  return renderWithProviders(
    <Routes>
      <Route
        path="/transactions"
        element={
          <>
            <TransactionsPage />
            <LocationProbe />
          </>
        }
      />
    </Routes>,
    { initialEntries: ["/transactions"] },
  );
}

const firstDataRow = () => screen.getAllByRole("row")[1]!;

describe("TransactionsPage", () => {
  beforeEach(() => setViewport(true));

  it("renders the first page newest-first (TXN-AC-01)", async () => {
    renderTransactions();
    expect(await screen.findByText(/page 1 of 3/i)).toBeInTheDocument();
    expect(
      within(firstDataRow()).getByText("Salary - Acme Ltd"),
    ).toBeInTheDocument();
  });

  it("filters by search and resets to page 1 in the URL (TXN-AC-02)", async () => {
    renderTransactions();
    await screen.findByText(/page 1 of 3/i);
    await userEvent.type(screen.getByLabelText(/search/i), "rent");
    expect(
      (await screen.findAllByText("Rent - Kingsway")).length,
    ).toBeGreaterThan(0);
    await waitFor(() => expect(screen.queryByText("Tesco")).toBeNull());
    expect(screen.getByTestId("loc").textContent).toContain("q=rent");
  });

  it("filters by date range (TXN-AC-03)", async () => {
    renderTransactions();
    await screen.findByText("Salary - Acme Ltd");
    fireEvent.change(screen.getByLabelText(/^from/i), {
      target: { value: "2026-05-20" },
    });
    fireEvent.change(screen.getByLabelText(/^to/i), {
      target: { value: "2026-05-31" },
    });
    expect(await screen.findByText("Salary - Acme Ltd")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Rent - Kingsway")).toBeNull(),
    );
  });

  it("shows a filtered empty state with clear action (TXN-AC-04)", async () => {
    renderTransactions();
    await screen.findByText("Salary - Acme Ltd");
    await userEvent.type(screen.getByLabelText(/search/i), "zzzzz");
    const clear = await screen.findByRole("button", { name: /clear filters/i });
    await userEvent.click(clear);
    expect(await screen.findByText("Salary - Acme Ltd")).toBeInTheDocument();
  });

  it("sorts by date ascending, oldest first (TXN-AC-05)", async () => {
    renderTransactions();
    await screen.findByText("Salary - Acme Ltd");
    await userEvent.click(screen.getByRole("button", { name: /date/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("columnheader", { name: /date/i }),
      ).toHaveAttribute("aria-sort", "ascending"),
    );
    expect(within(firstDataRow()).getByText("Boots")).toBeInTheDocument();
  });

  it("sorts by amount descending, largest first (TXN-AC-06)", async () => {
    renderTransactions();
    await screen.findByText("Salary - Acme Ltd");
    const amountHeaderBtn = screen.getByRole("button", { name: /amount/i });
    await userEvent.click(amountHeaderBtn); // asc
    await userEvent.click(amountHeaderBtn); // desc
    await waitFor(() =>
      expect(
        screen.getByRole("columnheader", { name: /amount/i }),
      ).toHaveAttribute("aria-sort", "descending"),
    );
    expect(
      within(firstDataRow()).getByText("Salary - Acme Ltd"),
    ).toBeInTheDocument();
  });

  it("paginates to the next page (TXN-AC-07)", async () => {
    renderTransactions();
    await screen.findByText(/page 1 of 3/i);
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(await screen.findByText("Sainsbury's")).toBeInTheDocument();
    expect(screen.queryByText("Tesco")).toBeNull();
    expect(screen.getByTestId("loc").textContent).toContain("page=2");
  });

  it("opens a focus-trapped detail drawer and restores focus (TXN-AC-08)", async () => {
    renderTransactions();
    await screen.findByText("Salary - Acme Ltd");
    const viewButton = screen.getAllByRole("button", {
      name: /view transaction/i,
    })[0]!;
    await userEvent.click(viewButton);
    const dialog = await screen.findByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(viewButton).toHaveFocus();
  });

  it("shows signed amounts (TXN-AC-10)", async () => {
    renderTransactions();
    await screen.findByText("Salary - Acme Ltd");
    expect(screen.getByText("+£2,850.00")).toBeInTheDocument();
    expect(screen.getByText("−£45.99")).toBeInTheDocument();
  });

  it("shows an error state with retry (TXN-AC-09)", async () => {
    const spy = vi
      .spyOn(txnService, "listTransactions")
      .mockRejectedValueOnce(new ApiError(500, "SERVER_ERROR", "Boom"));
    renderTransactions();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    spy.mockRestore();
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByText("Salary - Acme Ltd")).toBeInTheDocument();
  });
});
