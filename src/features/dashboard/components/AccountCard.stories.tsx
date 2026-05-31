import type { Meta, StoryObj } from "@storybook/react";
import { AccountCard } from "./AccountCard";

/**
 * Dashboard hero — the "My card" panel. Total balance is the only figure and
 * comes straight from the summary; the Transfer / Request / New card actions
 * open honest "coming soon" modals (demo environment).
 */
const meta = {
  title: "Dashboard/AccountCard",
  component: AccountCard,
  tags: ["autodocs"],
  args: { totalBalanceMinor: 348215, accountsCount: 3 },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleAccount: Story = {
  args: { totalBalanceMinor: 120000, accountsCount: 1 },
};

export const ZeroBalance: Story = {
  args: { totalBalanceMinor: 0, accountsCount: 1 },
};
