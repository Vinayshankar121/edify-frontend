export const KEYS = {
  auth: "edify_auth",
  users: "edify_users",
  cashiers: "edify_cashiers",
  students: "edify_students",
  classes: "edify_classes",
  feeStructures: "edify_fee_structures",
  feeTerms: "edify_fee_terms",
  payments: "edify_payments",
  academicYears: "edify_academic_years",
  settings: "edify_school_settings",
  activeYear: "edify_active_year",
} as const;

const hasWindow = () => typeof window !== "undefined";

export function getStorage<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage<T>(key: string, value: T): T {
  if (hasWindow()) window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function removeStorage(key: string) {
  if (hasWindow()) window.localStorage.removeItem(key);
}

export function updateStorage<T>(key: string, updater: (current: T) => T, fallback: T): T {
  return setStorage(key, updater(getStorage<T>(key, fallback)));
}

export function initStorage<T>(key: string, value: T) {
  if (!hasWindow()) return;
  if (window.localStorage.getItem(key) === null) setStorage(key, value);
}
