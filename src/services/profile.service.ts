import { ApiError, simulateNetwork } from "@/lib/api/client";
import type { Address, User } from "@/types";
import { _userStore } from "./auth.service";

const CURRENT_USER_ID = "usr_1";

export interface UpdateProfileBody {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: Address;
}

/** GET /api/profile */
export function getProfile(): Promise<User> {
  return simulateNetwork(() => {
    const seed = _userStore.find(CURRENT_USER_ID);
    if (!seed) throw new ApiError(401, "UNAUTHENTICATED", "Session expired.");
    return _userStore.toUser(seed);
  });
}

/** PUT /api/profile */
export function updateProfile(body: UpdateProfileBody): Promise<User> {
  return simulateNetwork(() => {
    const seed = _userStore.find(CURRENT_USER_ID);
    if (!seed) throw new ApiError(401, "UNAUTHENTICATED", "Session expired.");
    if (body.fullName !== undefined) seed.fullName = body.fullName.trim();
    if (body.email !== undefined) seed.email = body.email.trim().toLowerCase();
    if (body.phoneNumber !== undefined) seed.phoneNumber = body.phoneNumber;
    if (body.address !== undefined) seed.address = body.address;
    return _userStore.toUser(seed);
  });
}

/** Frontend-only avatar, returns a preview URL, not persisted server-side. */
export function setAvatar(file: File): Promise<{ avatarUrl: string }> {
  return simulateNetwork(() => ({ avatarUrl: URL.createObjectURL(file) }), {
    min: 100,
    max: 300,
  });
}
