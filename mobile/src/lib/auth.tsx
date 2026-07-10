import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import { tokenStorage } from "./tokenStorage";

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
  isDriver: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      await tokenStorage.loadInitial();
      const raw = await tokenStorage.getUser();
      if (raw) setUser(JSON.parse(raw) as AuthUser);
      setIsReady(true);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login/", { email, password });
    await tokenStorage.set(data.access, data.refresh);
    await tokenStorage.setUser(JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isReady,
    isAuthenticated: !!user,
    isDriver: !!user?.roles.includes("driver"),
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
