"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, tokenStorage } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "sunu_mall_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Toujours démarrer à null (même valeur côté serveur et au premier rendu
  // client) puis hydrater depuis localStorage dans un effet — lire
  // localStorage dans l'initialiseur de useState provoque un mismatch
  // d'hydratation Next.js (le rendu serveur ne peut pas connaître ce token).
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) setUser(JSON.parse(raw) as AuthUser);
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login/", { email, password });
    tokenStorage.set(data.access, data.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isReady,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, isReady, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  }
  return ctx;
}
