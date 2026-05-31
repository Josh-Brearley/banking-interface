import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { RegisterForm } from "./RegisterForm";

function renderRegister() {
  return renderWithProviders(
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<h1>Dashboard home</h1>} />
    </Routes>,
    { initialEntries: ["/register"] },
  );
}

describe("RegisterForm", () => {
  it("requires the core fields (AUTH-AC-05)", async () => {
    renderRegister();
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );
    expect(await screen.findByText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it("enforces password strength (AUTH-AC-06)", async () => {
    renderRegister();
    await userEvent.type(screen.getByLabelText(/^password/i), "weak");
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it("requires the passwords to match (AUTH-AC-07)", async () => {
    renderRegister();
    await userEvent.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
    await userEvent.type(screen.getByLabelText(/email/i), "ada@eaglebank.com");
    await userEvent.type(screen.getByLabelText(/^password/i), "Password123!");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "Password124!",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );
    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();
  });

  it("registers successfully and lands on the dashboard (AUTH-AC-08)", async () => {
    renderRegister();
    await userEvent.type(screen.getByLabelText(/full name/i), "New Customer");
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "newcustomer@eaglebank.com",
    );
    await userEvent.type(screen.getByLabelText(/^password/i), "Password123!");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "Password123!",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );
    expect(
      await screen.findByRole("heading", { name: /dashboard home/i }),
    ).toBeInTheDocument();
  });
});
