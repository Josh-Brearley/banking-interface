import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, type Column } from "./Table";

interface Row {
  id: string;
  name: string;
  balance: number;
}

const data: Row[] = [
  { id: "1", name: "Savings", balance: 200 },
  { id: "2", name: "Current", balance: 100 },
];

const columns: Column<Row>[] = [
  { id: "name", header: "Name", cell: (r) => r.name, sortable: true },
  { id: "balance", header: "Balance", cell: (r) => r.balance, sortable: true },
];

// DS-FR-14: semantic, sortable, accessible table with loading & empty states.
describe("Table", () => {
  it("renders column headers and a row per item", () => {
    render(<Table caption="Accounts" columns={columns} data={data} getRowId={(r) => r.id} />);
    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /savings/i })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 rows
  });

  it("exposes sort state via aria-sort and toggles on activation", async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        caption="Accounts"
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        sort={{ columnId: "balance", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    );
    expect(
      screen.getByRole("columnheader", { name: /balance/i }),
    ).toHaveAttribute("aria-sort", "ascending");
    expect(
      screen.getByRole("columnheader", { name: /name/i }),
    ).toHaveAttribute("aria-sort", "none");

    await userEvent.click(screen.getByRole("button", { name: /balance/i }));
    expect(onSortChange).toHaveBeenCalledWith({
      columnId: "balance",
      direction: "desc",
    });
  });

  it("renders a busy loading state instead of rows", () => {
    render(
      <Table
        caption="Accounts"
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        isLoading
      />,
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("renders the empty state when there is no data", () => {
    render(
      <Table
        caption="Accounts"
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        emptyState={<p>No accounts found</p>}
      />,
    );
    expect(screen.getByText("No accounts found")).toBeInTheDocument();
  });
});
