import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";
import { MoneyAmount } from "./MoneyAmount";
import { IconArrowDownRight, IconArrowUpRight } from "@/components/atoms";

const meta = {
  title: "Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MoneyIn: Story = {
  args: {
    label: "Money in this month",
    value: <MoneyAmount amountMinor={324500} />,
    icon: <IconArrowDownRight />,
    iconClassName: "bg-success-subtle text-success",
  },
};

export const MoneyOut: Story = {
  args: {
    label: "Money out this month",
    value: <MoneyAmount amountMinor={189900} />,
    icon: <IconArrowUpRight />,
    iconClassName: "bg-danger-subtle text-danger",
  },
};
