import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

// DS-FR-20: empty state gives guidance and an optional action.
describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState title="No accounts yet" description="Open one to begin." />,
    );
    expect(
      screen.getByRole("heading", { name: "No accounts yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Open one to begin.")).toBeInTheDocument();
  });

  it("renders an action that responds to clicks", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No results"
        description="Try clearing filters."
        action={{ label: "Clear filters", onClick }}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Clear filters" }),
    );
    expect(onClick).toHaveBeenCalledOnce();
  });
});

// DS-FR-21 / NFR-ERR-03: error state is announced and offers retry.
describe("ErrorState", () => {
  it("announces itself as an alert", () => {
    render(<ErrorState title="Something went wrong" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("calls onRetry when the retry button is pressed", async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Failed to load" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
