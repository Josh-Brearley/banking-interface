import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "./BrandLogo";

describe("BrandLogo", () => {
  it("renders the full wordmark with an accessible name", () => {
    render(<BrandLogo variant="full" />);
    expect(screen.getByRole("img", { name: /eagle bank/i })).toHaveAttribute(
      "src",
      "/logos/logo-icon-text.png",
    );
  });

  it("renders the icon-only mark", () => {
    render(<BrandLogo variant="icon" />);
    expect(screen.getByRole("img", { name: /eagle bank/i })).toHaveAttribute(
      "src",
      "/logos/logo-icon.png",
    );
  });

  it("can be decorative when accompanied by visible text", () => {
    render(<BrandLogo variant="icon" decorative />);
    // Decorative images expose no accessible name.
    expect(screen.queryByRole("img", { name: /eagle bank/i })).toBeNull();
  });
});
