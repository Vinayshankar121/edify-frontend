import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedDemoData } from "@/data/seed";
import { KEYS, getStorage, removeStorage, setStorage } from "@/lib/storage";
const AuthContext = createContext(null);
/**
 * Demo-only authentication backed by LocalStorage.
 * NOT production security — swap this provider for real JWT/session auth later.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    seedDemoData();
    setUser(getStorage(KEYS.auth, null));
    setReady(true);
  }, []);
  const value = useMemo(
    () => ({
      user,
      ready,
      login: (username, password) => {
        const admins = getStorage(KEYS.users, []);
        const admin = admins.find(
          (a) =>
            a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password,
        );
        if (admin) {
          const next = { id: admin.id, name: admin.name, username: admin.username, role: "admin" };
          setStorage(KEYS.auth, next);
          setUser(next);
          return { ok: true, user: next };
        }
        const cashiers = getStorage(KEYS.cashiers, []);
        const cashier = cashiers.find(
          (c) =>
            c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password,
        );
        if (cashier) {
          if (cashier.status !== "active")
            return { ok: false, error: "This account is deactivated. Contact the administrator." };
          const next = {
            id: cashier.id,
            name: cashier.name,
            username: cashier.username,
            role: "cashier",
          };
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
