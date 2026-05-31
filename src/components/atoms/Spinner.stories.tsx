import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { label: "Loading" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-primary">
      <Spinner className="h-4 w-4" />
      <Spinner className="h-6 w-6" />
      <Spinner className="h-8 w-8" />
    </div>
  ),
};

export const OnBrand: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
      <Spinner className="h-4 w-4" />
      <span className="text-body-sm font-medium">Signing in…</span>
    </div>
  ),
};
