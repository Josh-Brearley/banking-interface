import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";
import { Button, IconPlus } from "@/components/atoms";

/** Consistent page heading — owns the page's single `h1`. */
const meta = {
  title: "Molecules/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: { title: "Transactions" },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: {
    title: "Accounts",
    subtitle: "Your savings, current and credit accounts.",
  },
};

export const WithActions: Story = {
  args: {
    title: "Accounts",
    subtitle: "Your savings, current and credit accounts.",
    actions: (
      <Button leftIcon={<IconPlus className="h-4 w-4" />} size="sm">
        New account
      </Button>
    ),
  },
};
