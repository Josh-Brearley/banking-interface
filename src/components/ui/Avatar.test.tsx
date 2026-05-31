import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

// DS-FR-17: image with name as alt; initials fallback when no/broken image.
describe("Avatar", () => {
  it("renders the image with the name as alt text", () => {
    render(<Avatar name="Priya Shah" src="https://example.com/p.jpg" />);
    expect(screen.getByRole("img", { name: "Priya Shah" })).toBeInTheDocument();
  });

  it("shows initials when no image is provided", () => {
    render(<Avatar name="Priya Shah" />);
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar name="Priya Shah" src="https://example.com/broken.jpg" />);
    fireEvent.error(screen.getByRole("img", { name: "Priya Shah" }));
    expect(screen.getByText("PS")).toBeInTheDocument();
  });
});
