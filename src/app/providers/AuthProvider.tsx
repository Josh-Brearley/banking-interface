/* eslint-disable react-refresh/only-export-components -- context, hook and
   provider are intentionally colocated; this module is not hot-reload sensitive. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth.service";
import { clearSession, readSession, writeSession } from "@/lib/auth/session";
import type { Session, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (session: Session) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // AUTH-FR-11: rehydrate + validate the persisted session on boot.
  useEffect(() => {
    let active = true;
    const session = readSession();
    if (!session) {
      setIsLoading(false);
      return;
    }
    authService
      .me(session.token)
      .then((fresh) => {
        if (!active) return;
        writeSession({ token: session.token, user: fresh });
        setUserState(fresh);
      })
      .catch(() => {
        if (!active) return;
        clearSession();
        setUserState(null);
      })
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    (session: Session) => {
      writeSession(session);
      setUserState(session.user);
      queryClient.clear();
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
      setUserState(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const setUser = useCallback((next: User) => {
    setUserState(next);
    const session = readSession();
    if (session) writeSession({ ...session, user: next });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      setUser,
    }),
    [user, isLoading, login, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
