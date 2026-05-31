import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/providers/AuthProvider";
import * as authService from "@/services/auth.service";
import type { LoginValues, RegisterValues } from "../schemas/auth.schema";

/** Login mutation, persists the session via AuthProvider on success (AUTH-FR-06). */
export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (values: LoginValues) => authService.login(values),
    onSuccess: (session) => login(session),
  });
}

/** Registration mutation, strips confirmPassword before calling the service. */
export function useRegister() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ fullName, email, password }: RegisterValues) =>
      authService.register({ fullName, email, password }),
    onSuccess: (session) => login(session),
  });
}

/** Logout mutation, clears session + cache via AuthProvider (AUTH-FR-10). */
export function useLogout() {
  const { logout } = useAuth();
  return useMutation({ mutationFn: () => logout() });
}
