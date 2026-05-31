import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, type Column, type SortState } from "./Table";
import { EmptyState } from "./EmptyState";
import { Badge } from "./Badge";

interface Row {
  id: string;
  name: string;
  type: string;
  balance: string;
  status: "active" | "frozen";
}

const ROWS: Row[] = [
  {
    id: "1",
    name: "Everyday Current",
    type: "Current",
    balance: "£3,482.15",
    status: "active",
  },
  {
    id: "2",
    name: "Rainy Day Saver",
    type: "Savings",
    balance: "£12,900.00",
    status: "active",
  },
  {
    id: "3",
    name: "Travel Credit",
    type: "Credit",
    balance: "−£420.50",
    status: "frozen",
  },
];

const columns: Column<Row>[] = [
  { id: "name", header: "Account", cell: (r) => r.name, sortable: true },
  { id: "type", header: "Type", cell: (r) => r.type },
  {
    id: "status",
    header: "Status",
    cell: (r) => (
      <Badge variant={r.status === "active" ? "success" : "warning"} withDot>
        {r.status === "active" ? "Active" : "Frozen"}
      </Badge>
    ),
  },
  {
    id: "balance",
    header: "Balance",
    align: "right",
    sortable: true,
    cell: (r) => <span className="tabular-nums">{r.balance}</span>,
  },
];

const meta = {
  title: "Atoms/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    caption: "Your accounts",
    columns,
    data: ROWS,
    getRowId: (r: Row) => r.id,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Semantic, sortable, accessible table. Sortable headers expose `aria-sort`; loading and empty states are built in.",
      },
    },
  },
} satisfies Meta<typeof Table<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

function SortableTable() {
  const [sort, setSort] = useState<SortState>({
    columnId: "name",
    direction: "asc",
  });
  return (
    <Table
      caption="Your accounts"
      columns={columns}
      data={ROWS}
      getRowId={(r) => r.id}
      sort={sort}
      onSortChange={setSort}
    />
  );
}

export const Sortable: Story = { render: () => <SortableTable /> };

export const Loading: Story = {
  render: () => (
    <Table
      caption="Your accounts"
      columns={columns}
      data={[]}
      getRowId={(r) => r.id}
      isLoading
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <Table
      caption="Your accounts"
      columns={columns}
      data={[]}
      getRowId={(r) => r.id}
      emptyState={
        <EmptyState
          title="No accounts"
          description="You don't have any accounts yet."
        />
      }
    />
  ),
};
