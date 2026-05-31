import type { Meta, StoryObj } from "@storybook/react";
import { TransactionTypeBadge } from "./TransactionTypeBadge";

const meta = {
  title: "Molecules/TransactionTypeBadge",
  component: TransactionTypeBadge,
  tags: ["autodocs"],
  args: { type: "deposit" },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["deposit", "withdrawal", "transfer"],
    },
  },
} satisfies Meta<typeof TransactionTypeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Deposit: Story = { args: { type: "deposit" } };
export const Withdrawal: Story = { args: { type: "withdrawal" } };
export const Transfer: Story = { args: { type: "transfer" } };

export const All: Story = {
  render: () => (
    <div className="flex gap-2">
      <TransactionTypeBadge type="deposit" />
      <TransactionTypeBadge type="withdrawal" />
      <TransactionTypeBadge type="transfer" />
    </div>
  ),
};
