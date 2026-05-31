import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

// DS-FR-18: status/type badge. Information must not be colour-only, the label
// text is always present; a decorative dot is hidden from assistive tech.
describe("Badge", () => {
  it("renders its text label", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("hides the decorative dot from screen readers", () => {
    render(
      <Badge withDot variant="success">
        Active
      </Badge>,
    );
    // The dot is presentational; the text carries the meaning.
    const dot = screen.getByTestId("badge-dot");
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });
});
