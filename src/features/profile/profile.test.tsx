import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/renderWithProviders";
import { makeUser } from "@/tests/fixtures";
import { ApiError } from "@/lib/api/client";
import { writeSession } from "@/lib/auth/session";
import { useAuth } from "@/app/providers/AuthProvider";
import * as authService from "@/services/auth.service";
import * as profileService from "@/services/profile.service";
import { ProfilePage } from "./pages/ProfilePage";

const baseUser = makeUser({
  fullName: "Priya Shah",
  email: "priya@eaglebank.com",
  phoneNumber: "+447700900123",
  address: {
    line1: "14 Kingsway",
    line2: "Flat 2",
    city: "London",
    postcode: "WC2B 6LH",
    country: "GB",
  },
});

function mockProfile(user = baseUser) {
  vi.spyOn(profileService, "getProfile").mockResolvedValue(user);
}

function AuthProbe() {
  const { user } = useAuth();
  return <p>Auth: {user?.fullName ?? "none"}</p>;
}

async function startEditing() {
  await screen.findByText("Priya Shah");
  await userEvent.click(screen.getByRole("button", { name: /edit profile/i }));
}

describe("ProfilePage", () => {
  it("displays the current profile (PROF-AC-01)", async () => {
    mockProfile();
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    expect(await screen.findByText("Priya Shah")).toBeInTheDocument();
    expect(screen.getByText("priya@eaglebank.com")).toBeInTheDocument();
    expect(screen.getByText(/447700900123/)).toBeInTheDocument();
    expect(screen.getByText(/14 Kingsway/)).toBeInTheDocument();
    expect(screen.getByText(/London/)).toBeInTheDocument();
    expect(screen.getByText(/WC2B 6LH/)).toBeInTheDocument();
  });

  it("validates required fields and email, focusing the first error (PROF-AC-02)", async () => {
    mockProfile();
    const updateSpy = vi.spyOn(profileService, "updateProfile");
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    await startEditing();

    const name = screen.getByLabelText(/full name/i);
    await userEvent.clear(name);
    const email = screen.getByLabelText(/^email/i);
    await userEvent.clear(email);
    await userEvent.type(email, "not-an-email");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(
      await screen.findByText(/enter your full name/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(name).toHaveFocus();
  });

  it("validates phone and postcode (PROF-AC-03)", async () => {
    mockProfile();
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    await startEditing();

    const phone = screen.getByLabelText(/phone/i);
    await userEvent.clear(phone);
    await userEvent.type(phone, "abc");
    const postcode = screen.getByLabelText(/postcode/i);
    await userEvent.clear(postcode);
    await userEvent.type(postcode, "123");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(await screen.findByText(/valid uk phone/i)).toBeInTheDocument();
    expect(screen.getByText(/valid uk postcode/i)).toBeInTheDocument();
  });

  it("saves successfully and reflects the new values (PROF-AC-04)", async () => {
    mockProfile();
    vi.spyOn(profileService, "updateProfile").mockImplementation((body) =>
      Promise.resolve({ ...baseUser, ...body }),
    );
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    await startEditing();

    const name = screen.getByLabelText(/full name/i);
    await userEvent.clear(name);
    await userEvent.type(name, "Priya Patel");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(await screen.findByText(/profile updated/i)).toBeInTheDocument();
    expect(await screen.findByText("Priya Patel")).toBeInTheDocument();
  });

  it("syncs the updated name across the app (PROF-AC-05)", async () => {
    const session = await authService.login({
      email: "demo@eaglebank.com",
      password: "Password123!",
    });
    writeSession(session);
    mockProfile();
    vi.spyOn(profileService, "updateProfile").mockImplementation((body) =>
      Promise.resolve({ ...baseUser, ...body }),
    );
    renderWithProviders(
      <>
        <ProfilePage />
        <AuthProbe />
      </>,
      { initialEntries: ["/profile"] },
    );
    expect(await screen.findByText(/auth: priya shah/i)).toBeInTheDocument();
    await startEditing();
    const name = screen.getByLabelText(/full name/i);
    await userEvent.clear(name);
    await userEvent.type(name, "Priya Patel");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );
    expect(await screen.findByText(/auth: priya patel/i)).toBeInTheDocument();
  });

  it("maps a server field error onto the email field (PROF-AC-06)", async () => {
    mockProfile();
    vi.spyOn(profileService, "updateProfile").mockRejectedValue(
      new ApiError(422, "VALIDATION", "Invalid", {
        email: "Email already in use",
      }),
    );
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    await startEditing();
    const email = screen.getByLabelText(/^email/i);
    await userEvent.clear(email);
    await userEvent.type(email, "taken@eaglebank.com");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );
    expect(
      await screen.findByText(/email already in use/i),
    ).toBeInTheDocument();
  });

  it("reverts changes on cancel (PROF-AC-08)", async () => {
    mockProfile();
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    await startEditing();
    const name = screen.getByLabelText(/full name/i);
    await userEvent.clear(name);
    await userEvent.type(name, "Changed Name");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(await screen.findByText("Priya Shah")).toBeInTheDocument();
    expect(screen.queryByText("Changed Name")).toBeNull();
  });

  it("gates save until the form is dirty (PROF-AC-09)", async () => {
    mockProfile();
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    await startEditing();
    const save = screen.getByRole("button", { name: /save changes/i });
    expect(save).toBeDisabled();

    const name = screen.getByLabelText(/full name/i);
    await userEvent.type(name, " Jr");
    expect(save).toBeEnabled();
  });

  it("shows loading then error with retry (PROF-AC-10)", async () => {
    vi.spyOn(profileService, "getProfile").mockRejectedValueOnce(
      new ApiError(500, "SERVER_ERROR", "Boom"),
    );
    renderWithProviders(<ProfilePage />, { initialEntries: ["/profile"] });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    vi.spyOn(profileService, "getProfile").mockResolvedValue(baseUser);
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByText("Priya Shah")).toBeInTheDocument();
  });
});
