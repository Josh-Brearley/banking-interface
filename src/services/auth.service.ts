import usersSeed from "@/data/users.json";
import { ApiError, simulateNetwork } from "@/lib/api/client";
import type { Session, User } from "@/types";

interface SeedUser extends Omit<User, "avatarUrl"> {
  password: string;
  avatarUrl: string | null;
}

/** In-memory user store (mock). Mutable so profile edits persist per session. */
const users: SeedUser[] = (usersSeed as SeedUser[]).map((u) => ({ ...u }));

function toUser(seed: SeedUser): User {
  const { password: _password, avatarUrl, ...rest } = seed;
  return { ...rest, avatarUrl: avatarUrl ?? undefined };
}

function makeToken(userId: string): string {
  // Opaque mock token — not a real JWT.
  return `mock.${btoa(userId)}.${userId.length}`;
}

export interface LoginBody {
  email: string;
  password: string;
}
export interface RegisterBody {
  fullName: string;
  email: string;
  password: string;
}

/** POST /api/auth/login */
export function login({ email, password }: LoginBody): Promise<Session> {
  return simulateNetwork(() => {
    const seed = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!seed || seed.password !== password) {
      throw new ApiError(
        401,
        "INVALID_CREDENTIALS",
        "Email or password is incorrect.",
      );
    }
    return { token: makeToken(seed.id), user: toUser(seed) };
  });
}

/** POST /api/auth/register */
export function register({
  fullName,
  email,
  password,
}: RegisterBody): Promise<Session> {
  return simulateNetwork(() => {
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (exists) {
      throw new ApiError(409, "EMAIL_TAKEN", "That email is already registered.", {
        email: "That email is already registered.",
      });
    }
    const seed: SeedUser = {
      id: `usr_${users.length + 1}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phoneNumber: undefined,
      address: undefined,
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };
    users.push(seed);
    return { token: makeToken(seed.id), user: toUser(seed) };
  });
}

/** POST /api/auth/logout */
export function logout(): Promise<{ success: true }> {
  return simulateNetwork(() => ({ success: true }), { min: 80, max: 200 });
}

/** GET /api/auth/me — resolves the user encoded in a mock token. */
export function me(token: string): Promise<User> {
  return simulateNetwork(() => {
    const userId = token.split(".")[1];
    const decoded = userId ? atob(userId) : "";
    const seed = users.find((u) => u.id === decoded);
    if (!seed) {
      throw new ApiError(401, "UNAUTHENTICATED", "Session expired.");
    }
    return toUser(seed);
  });
}

/** Internal: used by profile.service to read/update the shared store. */
export const _userStore = {
  find: (id: string) => users.find((u) => u.id === id),
  toUser,
};
