import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

// DS-FR-11 / NFR-A11Y-06: labelled input; hint and error linked via
// aria-describedby; invalid state exposed via aria-invalid.
describe("Input", () => {
  it("associates the label with the control", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("links a hint via aria-describedby", () => {
    render(<Input label="Email" hint="We never share it" />);
    const input = screen.getByLabelText("Email");
    const describedby = input.getAttribute("aria-describedby");
    expect(describedby).toBeTruthy();
    expect(screen.getByText("We never share it").id).toBe(describedby);
  });

  it("marks the field invalid and announces the error", () => {
    render(<Input label="Email" error="Enter a valid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const error = screen.getByText("Enter a valid email");
    expect(input.getAttribute("aria-describedby")).toContain(error.id);
  });

  it("toggles password visibility with an accessible control", async () => {
    render(<Input label="Password" type="password" showPasswordToggle />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    const toggle = screen.getByRole("button", { name: /show password/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide password/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
