import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Active", withDot: true },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "success", "warning", "danger", "info"],
    },
    size: { control: "select", options: ["sm", "md"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = { args: { variant: "neutral" } };
export const Success: Story = { args: { variant: "success" } };
export const Warning: Story = {
  args: { variant: "warning", children: "Pending" },
};
export const Danger: Story = {
  args: { variant: "danger", children: "Blocked" },
};
export const Info: Story = { args: { variant: "info", children: "Transfer" } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral" withDot>
        Neutral
      </Badge>
      <Badge variant="success" withDot>
        Success
      </Badge>
      <Badge variant="warning" withDot>
        Warning
      </Badge>
      <Badge variant="danger" withDot>
        Danger
      </Badge>
      <Badge variant="info" withDot>
        Info
      </Badge>
    </div>
  ),
};
