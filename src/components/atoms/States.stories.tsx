import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./Skeleton";
import { IconTransactions } from "./icons";

/**
 * The non-happy-path states every data view must implement
 * (CLAUDE.md golden rule #5: "Every state has a UI").
 */
const meta = {
  title: "Atoms/States",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <EmptyState
      icon={<IconTransactions />}
      title="No transactions yet"
      description="Once money moves in or out of your accounts, it'll show up here."
      action={{ label: "Make a transfer", onClick: () => {} }}
    />
  ),
};

export const Error: Story = {
  render: () => <ErrorState onRetry={() => {}} />,
};

export const Loading: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  ),
};
