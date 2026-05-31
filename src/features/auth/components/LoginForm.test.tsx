import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { LoginForm } from "./LoginForm";
import * as authService from "@/services/auth.service";

function renderLogin(initialEntries: string[] = ["/login"]) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<h1>Dashboard home</h1>} />
      <Route path="/accounts" element={<h1>Accounts home</h1>} />
    </Routes>,
    { initialEntries },
  );
}

describe("LoginForm", () => {
  it("requires email and password and makes no request (AUTH-AC-01)", async () => {
    const spy = vi.spyOn(authService, "login");
    renderLogin();
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalled();
  });

  it("validates the email format (AUTH-AC-02)", async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
    await userEvent.type(screen.getByLabelText(/^password/i), "something");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("locks the submit button while pending (AUTH-AC-03)", async () => {
    vi.spyOn(authService, "login").mockReturnValue(new Promise(() => {}));
    renderLogin();
    await userEvent.type(screen.getByLabelText(/email/i), "demo@eaglebank.com");
    await userEvent.type(screen.getByLabelText(/^password/i), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    const button = screen.getByRole("button", { name: /log in/i });
    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("shows an accessible error on rejected credentials (AUTH-AC-04)", async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText(/email/i), "demo@eaglebank.com");
    await userEvent.type(screen.getByLabelText(/^password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/incorrect/i);
  });

  it("redirects to the intended page after login (AUTH-AC-10)", async () => {
    renderLogin(["/login?from=%2Faccounts"]);
    await userEvent.type(screen.getByLabelText(/email/i), "demo@eaglebank.com");
    await userEvent.type(screen.getByLabelText(/^password/i), "Password123!");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(
      await screen.findByRole("heading", { name: /accounts home/i }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility (AUTH-AC-14)", async () => {
    renderLogin();
    const password = screen.getByLabelText(/^password/i);
    expect(password).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(password).toHaveAttribute("type", "text");
  });
});
