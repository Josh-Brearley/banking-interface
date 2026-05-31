import type { Meta, StoryObj } from "@storybook/react";
import { BalanceSummary } from "./BalanceSummary";
import { makeDashboardSummary } from "@/tests/fixtures";

/** This month's money in vs. money out — the two real figures from the summary. */
const meta = {
  title: "Dashboard/BalanceSummary",
  component: BalanceSummary,
  tags: ["autodocs"],
  args: { summary: makeDashboardSummary() },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BalanceSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoActivity: Story = {
  args: {
    summary: makeDashboardSummary({
      monthlyDepositsMinor: 0,
      monthlyWithdrawalsMinor: 0,
    }),
  },
};
