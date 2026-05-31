import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { useAuth } from "@/app/providers/AuthProvider";
import * as profileService from "@/services/profile.service";
import type { UpdateProfileBody } from "@/services/profile.service";

/** Current user's profile, specs/features/profile.spec.md §4. */
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileService.getProfile(),
  });
}

/**
 * Profile update mutation. On success, refreshes the profile cache, invalidates
 * the auth identity, and updates the AuthProvider so the rest of the app (e.g.
 * the dashboard greeting) reflects the change immediately (PROF-FR-05).
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => profileService.updateProfile(body),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.profile.me(), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      setUser(user);
    },
  });
}
