import type { Meta, StoryObj } from "@storybook/react";
import { BrandLogo } from "./BrandLogo";

/**
 * Centralised brand mark (served from `/public/logos`). `full` is the
 * icon + wordmark; `icon` is the mark alone for tight spaces.
 */
const meta = {
  title: "Molecules/BrandLogo",
  component: BrandLogo,
  tags: ["autodocs"],
  argTypes: { variant: { control: "inline-radio", options: ["full", "icon"] } },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = { args: { variant: "full", className: "h-10" } };
export const Icon: Story = { args: { variant: "icon", className: "h-10" } };

export const OnNavy: Story = {
  args: { variant: "full", className: "h-10" },
  parameters: { backgrounds: { default: "navy" } },
  render: (args) => (
    <div className="rounded-lg bg-primary p-6">
      <BrandLogo {...args} />
    </div>
  ),
};
