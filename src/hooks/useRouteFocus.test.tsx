import { describe, it, expect } from "vitest";
import { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useRouteFocus } from "./useRouteFocus";

// NFR-A11Y-08, a route change moves focus to the main content region so
// keyboard and screen-reader users land on the new page, not back at the top.
function Harness() {
  const ref = useRef<HTMLDivElement>(null);
  useRouteFocus(ref);
  const navigate = useNavigate();
  return (
    <>
      <main ref={ref} tabIndex={-1} aria-label="Main content">
        page content
      </main>
      <button onClick={() => navigate("/accounts")}>Go to accounts</button>
    </>
  );
}

describe("useRouteFocus", () => {
  it("does not steal focus on the initial render", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Harness />
      </MemoryRouter>,
    );
    expect(screen.getByRole("main")).not.toHaveFocus();
  });

  it("moves focus to the main region after navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Harness />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: /go to accounts/i }));
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus());
  });
});
