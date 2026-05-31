import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import type { Column } from "@/components/atoms";

interface Row {
  id: string;
  name: string;
}
const columns: Column<Row>[] = [
  { id: "name", header: "Name", cell: (r) => r.name },
];
const data: Row[] = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
];

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

function renderTable(
  props: Partial<Parameters<typeof DataTable<Row>>[0]> = {},
) {
  return render(
    <DataTable
      caption="Rows"
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      renderCard={(r) => <div data-testid="card">{r.name}</div>}
      {...props}
    />,
  );
}

describe("DataTable", () => {
  beforeEach(() => setViewport(true));

  it("renders a table on desktop viewports (ACCT-AC-02)", () => {
    setViewport(true);
    renderTable();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByTestId("card")).toBeNull();
  });

  it("renders cards on mobile viewports (ACCT-AC-02)", () => {
    setViewport(false);
    renderTable();
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getAllByTestId("card")).toHaveLength(2);
  });

  it("shows a busy loading state", () => {
    renderTable({ isLoading: true, data: [] });
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("shows an error state with a working retry", async () => {
    const onRetry = vi.fn();
    renderTable({ isError: true, data: [], onRetry });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders the empty state when there is no data", () => {
    renderTable({ data: [], emptyState: <p>Nothing here</p> });
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
