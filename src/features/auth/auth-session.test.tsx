import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { useAuth } from "@/app/providers/AuthProvider";
import { readSession, writeSession } from "@/lib/auth/session";
import * as authService from "@/services/auth.service";

function AuthProbe() {
  const { isAuthenticated, user, logout } = useAuth();
  if (!isAuthenticated) return <p>Logged out</p>;
  return (
    <div>
      <span>Hi {user?.fullName}</span>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
}

async function seedSession() {
  const session = await authService.login({
    email: "demo@eaglebank.com",
    password: "Password123!",
  });
  writeSession(session);
}

describe("Auth session", () => {
  it("rehydrates a persisted session on load (AUTH-AC-13)", async () => {
    await seedSession();
    renderWithProviders(<AuthProbe />);
    expect(await screen.findByText(/hi josh brearley/i)).toBeInTheDocument();
  });

  it("clears the session on logout (AUTH-AC-12)", async () => {
    await seedSession();
    renderWithProviders(<AuthProbe />);
    await userEvent.click(
      await screen.findByRole("button", { name: /log out/i }),
    );
    expect(await screen.findByText(/logged out/i)).toBeInTheDocument();
    await waitFor(() => expect(readSession()).toBeNull());
  });
});
