import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "./Button";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  args: { open: false, onClose: () => {}, title: "Drawer title" },
  parameters: {
    docs: {
      description: {
        component:
          "Right-side sheet sharing the Modal a11y contract (focus trap, Esc, focus restore). Used for the transaction detail view.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>View transaction</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Transaction detail"
        description="Tesco · 27 May 2026"
      >
        <dl className="flex flex-col gap-3 text-body">
          <div className="flex items-center justify-between">
            <dt className="text-foreground-muted">Amount</dt>
            <dd className="font-semibold tabular-nums">−£45.99</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-foreground-muted">Type</dt>
            <dd>
              <Badge withDot>Withdrawal</Badge>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-foreground-muted">Status</dt>
            <dd>
              <Badge variant="success" withDot>
                Completed
              </Badge>
            </dd>
          </div>
        </dl>
      </Drawer>
    </>
  );
}

export const Default: Story = { render: () => <DrawerDemo /> };
