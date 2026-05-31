import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { IconTransfer, IconArrowUpRight } from "./icons";

const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continue" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete account" },
};
export const Link: Story = {
  args: { variant: "link", children: "Learn more" },
};

export const Loading: Story = {
  args: { isLoading: true, children: "Signing in" },
};

export const WithLeftIcon: Story = {
  args: { leftIcon: <IconTransfer />, children: "Transfer" },
};

export const WithRightIcon: Story = {
  args: { rightIcon: <IconArrowUpRight />, children: "Send money" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};
