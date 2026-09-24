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
};
const hasWindow = () => typeof window !== "undefined";
export function getStorage(key, fallback) {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
export function setStorage(key, value) {
  if (hasWindow()) window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}
export function removeStorage(key) {
  if (hasWindow()) window.localStorage.removeItem(key);
}
export function updateStorage(key, updater, fallback) {
  return setStorage(key, updater(getStorage(key, fallback)));
}
export function initStorage(key, value) {
  if (!hasWindow()) return;
  if (window.localStorage.getItem(key) === null) setStorage(key, value);
}
