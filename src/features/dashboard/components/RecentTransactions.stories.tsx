import type { Meta, StoryObj } from "@storybook/react";
import { RecentTransactions } from "./RecentTransactions";
import { makeTransaction } from "@/tests/fixtures";

/** Avatar-led recent activity list; links through to full history. */
const meta = {
  title: "Dashboard/RecentTransactions",
  component: RecentTransactions,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecentTransactions>;

export default meta;
type Story = StoryObj<typeof meta>;

const transactions = [
  makeTransaction({
    id: "t1",
    type: "deposit",
    direction: "credit",
    amountMinor: 285000,
    description: "Salary - Acme Ltd",
    counterparty: "Acme Ltd",
    createdAt: "2026-05-28T08:00:00.000Z",
  }),
  makeTransaction({
    id: "t2",
    type: "withdrawal",
    direction: "debit",
    amountMinor: 4599,
    description: "Tesco",
    counterparty: "Tesco",
    createdAt: "2026-05-27T18:00:00.000Z",
  }),
  makeTransaction({
    id: "t3",
    type: "transfer",
    direction: "debit",
    amountMinor: 20000,
    description: "Transfer to savings",
    counterparty: "Rainy Day Saver",
    createdAt: "2026-05-26T09:30:00.000Z",
  }),
];

export const Default: Story = { args: { transactions } };

export const SingleItem: Story = {
  args: { transactions: transactions.slice(0, 1) },
};
