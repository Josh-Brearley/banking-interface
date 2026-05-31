import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MoneyAmount } from "./MoneyAmount";

// NFR-FMT-01 / NFR-A11Y-07: formats minor units; sign is text, not colour-only.
describe("MoneyAmount", () => {
  it("formats minor units as GBP", () => {
    render(<MoneyAmount amountMinor={123456} />);
    expect(screen.getByText("£1,234.56")).toBeInTheDocument();
  });

  it("shows a leading minus for negative amounts", () => {
    render(<MoneyAmount amountMinor={-4599} signed />);
    expect(screen.getByText("−£45.99")).toBeInTheDocument();
  });

  it("shows a leading plus for signed positive amounts", () => {
    render(<MoneyAmount amountMinor={2500} signed />);
    expect(screen.getByText("+£25.00")).toBeInTheDocument();
  });
});
