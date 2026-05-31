import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Transaction details"
      >
        <p>Body content</p>
        <button>Inside action</button>
      </Modal>
    </>
  );
}

// DS-FR-15 / NFR-A11Y-08: focus-trapped, labelled dialog with Esc + focus restore.
describe("Modal", () => {
  it("is not rendered while closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens as a labelled modal dialog and moves focus inside", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Open modal" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Transaction details");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open modal" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes when the overlay is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Details">
        <p>Body</p>
      </Modal>,
    );
    await userEvent.click(screen.getByTestId("dialog-overlay"));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes via the labelled close button", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Details">
        <p>Body</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
