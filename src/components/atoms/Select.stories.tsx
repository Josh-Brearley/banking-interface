import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const options = [
  { label: "All types", value: "" },
  { label: "Deposit", value: "deposit" },
  { label: "Withdrawal", value: "withdrawal" },
  { label: "Transfer", value: "transfer" },
];

const meta = {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  args: { label: "Transaction type", options },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "Choose a type", options: options.slice(1) },
};

export const WithError: Story = {
  args: { error: "Please choose a transaction type." },
};
