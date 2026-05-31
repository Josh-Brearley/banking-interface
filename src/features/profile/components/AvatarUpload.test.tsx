import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AvatarUpload } from "./AvatarUpload";

function makeFile(name: string, type: string, sizeBytes: number): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: sizeBytes });
  return file;
}

// PROF-AC-07: frontend-only avatar upload with client-side validation.
describe("AvatarUpload", () => {
  it("previews a valid image", async () => {
    render(<AvatarUpload name="Priya Shah" />);
    const input = screen.getByLabelText(
      /upload.*photo|change photo|profile photo/i,
    );
    await userEvent.upload(input, makeFile("pic.png", "image/png", 1024));
    expect(
      await screen.findByRole("img", { name: /priya shah/i }),
    ).toHaveAttribute("src", expect.stringContaining("blob:"));
  });

  it("rejects a non-image file", async () => {
    render(<AvatarUpload name="Priya Shah" />);
    const input = screen.getByLabelText(
      /upload.*photo|change photo|profile photo/i,
    );
    // Bypass the input's accept filter to exercise the defensive validation.
    await userEvent.upload(input, makeFile("doc.txt", "text/plain", 1024), {
      applyAccept: false,
    });
    expect(
      await screen.findByText(/choose an image|must be an image/i),
    ).toBeInTheDocument();
  });

  it("rejects an oversized image", async () => {
    render(<AvatarUpload name="Priya Shah" />);
    const input = screen.getByLabelText(
      /upload.*photo|change photo|profile photo/i,
    );
    await userEvent.upload(
      input,
      makeFile("big.png", "image/png", 3 * 1024 * 1024),
    );
    expect(await screen.findByText(/too large|under 2/i)).toBeInTheDocument();
  });
});
