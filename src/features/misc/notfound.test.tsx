import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { NotFoundPage } from "./pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("shows a 404 heading and a link back to the dashboard (NFR-ERR-06)", () => {
    renderWithProviders(<NotFoundPage />);

    expect(
      screen.getByRole("heading", { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
