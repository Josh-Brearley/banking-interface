import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { writeSession } from "@/lib/auth/session";
import * as authService from "@/services/auth.service";

function FromProbe() {
  const [params] = useSearchParams();
  return <div>from: {params.get("from")}</div>;
}

describe("Auth routing", () => {
  it("redirects unauthenticated users to login, preserving intent (AUTH-AC-09)", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/accounts" element={<h1>Accounts</h1>} />
        </Route>
        <Route path="/login" element={<FromProbe />} />
      </Routes>,
      { initialEntries: ["/accounts"] },
    );
    expect(await screen.findByText(/from: \/accounts/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /accounts/i })).toBeNull();
  });

  it("redirects authenticated users away from auth pages (AUTH-AC-11)", async () => {
    const session = await authService.login({
      email: "demo@eaglebank.com",
      password: "Password123!",
    });
    writeSession(session);

    renderWithProviders(
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<h1>Login page</h1>} />
        </Route>
        <Route path="/dashboard" element={<h1>Dashboard home</h1>} />
      </Routes>,
      { initialEntries: ["/login"] },
    );
    expect(
      await screen.findByRole("heading", { name: /dashboard home/i }),
    ).toBeInTheDocument();
  });
});
