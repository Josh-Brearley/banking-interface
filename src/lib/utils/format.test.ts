import { describe, expect, it } from "vitest";
import { formatMoney, maskAccountNumber, getInitials } from "./format";

describe("formatMoney", () => {
  it("formats minor units as GBP", () => {
    expect(formatMoney(123456)).toBe("£1,234.56");
  });

  it("shows negative amounts with a minus sign", () => {
    expect(formatMoney(-4500)).toBe("−£45.00");
  });

  it("adds an explicit + when signed and positive", () => {
    expect(formatMoney(2500, "GBP", { signed: true })).toBe("+£25.00");
  });
});

describe("maskAccountNumber", () => {
  it("shows only the last four digits", () => {
    expect(maskAccountNumber("20581234")).toBe("•••• 1234");
  });
});

describe("getInitials", () => {
  it("returns up to two uppercase initials", () => {
    expect(getInitials("Priya Shah")).toBe("PS");
  });
});
