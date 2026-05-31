import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: { open: false, onClose: () => {}, title: "Dialog title" },
  parameters: {
    docs: {
      description: {
        component:
          "Centered, focus-trapped dialog (portal). Focus moves in on open, Tab is trapped, Esc closes, and focus restores to the trigger on close.",
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo({ size }: { size?: "sm" | "md" | "lg" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        title="Order a new card"
        description="Add a new debit or credit card to your account."
      >
        <p className="text-body text-foreground-muted">
          New card ordering is coming soon. This is a demo environment, so no
          card is issued.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Got it</Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = { render: () => <ModalDemo /> };
export const Small: Story = { render: () => <ModalDemo size="sm" /> };
export const Large: Story = { render: () => <ModalDemo size="lg" /> };
