import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedDemoData } from "@/data/seed";
import { KEYS, getStorage, removeStorage, setStorage } from "@/lib/storage";
import type { AdminUser, AuthUser, Cashier } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string; user?: AuthUser };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Demo-only authentication backed by LocalStorage.
 * NOT production security — swap this provider for real JWT/session auth later.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDemoData();
    setUser(getStorage<AuthUser | null>(KEYS.auth, null));
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login: (username, password) => {
        const admins = getStorage<AdminUser[]>(KEYS.users, []);
        const admin = admins.find(
          (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password,
        );
        if (admin) {
          const next: AuthUser = { id: admin.id, name: admin.name, username: admin.username, role: "admin" };
          setStorage(KEYS.auth, next);
          setUser(next);
          return { ok: true, user: next };
        }
        const cashiers = getStorage<Cashier[]>(KEYS.cashiers, []);
        const cashier = cashiers.find(
          (c) => c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password,
        );
        if (cashier) {
          if (cashier.status !== "active")
            return { ok: false, error: "This account is deactivated. Contact the administrator." };
          const next: AuthUser = { id: cashier.id, name: cashier.name, username: cashier.username, role: "cashier" };
          setStorage(KEYS.auth, next);
          setUser(next);
          return { ok: true, user: next };
        }
        return { ok: false, error: "Invalid username or password." };
      },
      logout: () => {
        removeStorage(KEYS.auth);
        setUser(null);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
