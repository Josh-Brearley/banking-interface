import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Savings account</CardTitle>
        <CardDescription>•••• 4821 · GBP</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-h2 tabular-nums">£12,480.00</p>
        <p className="text-body-sm text-foreground-muted">Available balance</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View transactions
        </Button>
      </CardFooter>
    </Card>
  ),
};
