import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import {
  type Column,
  type SortState,
  Card,
  Badge,
  EmptyState,
} from "@/components/atoms";

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
    id: "balance",
    header: "Balance",
    align: "right",
    sortable: true,
    cell: (r) => <span className="tabular-nums">{r.balance}</span>,
  },
];

const renderCard = (r: Row) => (
  <Card className="flex items-center justify-between p-4">
    <div>
      <p className="text-body font-medium">{r.name}</p>
      <p className="text-caption text-foreground-muted">{r.type}</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="tabular-nums">{r.balance}</span>
      <Badge variant={r.status === "active" ? "success" : "warning"} withDot>
        {r.status === "active" ? "Active" : "Frozen"}
      </Badge>
    </div>
  </Card>
);

const meta = {
  title: "Organisms/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  args: {
    caption: "Your accounts",
    columns,
    data: ROWS,
    getRowId: (r: Row) => r.id,
    renderCard,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Responsive list — a sortable Table on desktop, stacked cards on mobile (drag the viewport below ~768px). Owns loading / empty / error so both layouts stay consistent.",
      },
    },
  },
} satisfies Meta<typeof DataTable<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

function ResponsiveDataTable() {
  const [sort, setSort] = useState<SortState>({
    columnId: "name",
    direction: "asc",
  });
  return (
    <DataTable
      caption="Your accounts"
      columns={columns}
      data={ROWS}
      getRowId={(r) => r.id}
      renderCard={renderCard}
      sort={sort}
      onSortChange={setSort}
    />
  );
}

export const Responsive: Story = { render: () => <ResponsiveDataTable /> };

export const Loading: Story = {
  render: () => (
    <DataTable
      caption="Your accounts"
      columns={columns}
      data={[]}
      getRowId={(r) => r.id}
      renderCard={renderCard}
      isLoading
    />
  ),
};

export const ErrorState: Story = {
  render: () => (
    <DataTable
      caption="Your accounts"
      columns={columns}
      data={[]}
      getRowId={(r) => r.id}
      renderCard={renderCard}
      isError
      onRetry={() => {}}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      caption="Your accounts"
      columns={columns}
      data={[]}
      getRowId={(r) => r.id}
      renderCard={renderCard}
      emptyState={
        <EmptyState
          title="No accounts"
          description="You don't have any accounts yet."
        />
      }
    />
  ),
};
