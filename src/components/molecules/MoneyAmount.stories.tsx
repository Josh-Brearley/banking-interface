import type { Meta, StoryObj } from "@storybook/react";
import { MoneyAmount } from "./MoneyAmount";

/** Renders integer minor units; sign and colour are both signals (never colour alone). */
const meta = {
  title: "Molecules/MoneyAmount",
  component: MoneyAmount,
  tags: ["autodocs"],
  args: { amountMinor: 1248000 },
} satisfies Meta<typeof MoneyAmount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const Credit: Story = {
  args: { amountMinor: 25000, signed: true, colorBySign: true },
};

export const Debit: Story = {
  args: { amountMinor: -4999, signed: true, colorBySign: true },
};

export const Column: Story = {
  render: () => (
    <div className="flex w-40 flex-col items-end gap-1">
      <MoneyAmount amountMinor={120000} signed colorBySign />
      <MoneyAmount amountMinor={-3550} signed colorBySign />
      <MoneyAmount amountMinor={899900} signed colorBySign />
    </div>
  ),
};
