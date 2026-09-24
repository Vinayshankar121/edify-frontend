import { KEYS } from "@/lib/storage";
import { useCollection } from "@/lib/store";
export const useStudents = () => useCollection(KEYS.students, []);
export const usePayments = () => useCollection(KEYS.payments, []);
export const useClasses = () => useCollection(KEYS.classes, []);
export const useFeeStructures = () => useCollection(KEYS.feeStructures, []);
export const useFeeTerms = () => useCollection(KEYS.feeTerms, []);
export const useCashiers = () => useCollection(KEYS.cashiers, []);
export const useAcademicYears = () => useCollection(KEYS.academicYears, []);
export const useActiveYear = () => useCollection(KEYS.activeYear, "2025-2026");
export const useSettings = () =>
  useCollection(KEYS.settings, {
    schoolName: "Edify School",
    tagline: "Think Beyond",
    location: "Thikkonda",
    address: "",
    phone: "",
    email: "",
    website: "",
    receiptFooter: "",
    principal: "",
  });
export const uid = () => Math.random().toString(36).slice(2, 10);
