import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

const options = [
  { label: "Savings", value: "savings" },
  { label: "Current", value: "current" },
];

// DS-FR-12: native labelled select; placeholder; error wiring like Input.
describe("Select", () => {
  it("renders a labelled select with its options", () => {
    render(<Select label="Account type" options={options} />);
    const select = screen.getByLabelText("Account type");
    expect(select).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Savings" }),
    ).toBeInTheDocument();
  });

  it("renders a disabled placeholder option", () => {
    render(
      <Select label="Account type" options={options} placeholder="Choose…" />,
    );
    const placeholder = screen.getByRole("option", { name: "Choose…" });
    expect(placeholder).toBeDisabled();
  });

  it("marks the field invalid and announces the error", () => {
    render(
      <Select label="Account type" options={options} error="Required" />,
    );
    const select = screen.getByLabelText("Account type");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select.getAttribute("aria-describedby")).toContain(
      screen.getByText("Required").id,
    );
  });
});
