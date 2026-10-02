import { COLLECTIONS, useCollection } from "@/lib/store";
export const useStudents = () => useCollection(COLLECTIONS.students, []);
export const usePayments = () => useCollection(COLLECTIONS.payments, []);
export const useClasses = () => useCollection(COLLECTIONS.classes, []);
export const useFeeStructures = () => useCollection(COLLECTIONS.feeStructures, []);
export const useFeeTerms = () => useCollection(COLLECTIONS.feeTerms, []);
export const useCashiers = () => useCollection(COLLECTIONS.cashiers, []);
export const useAcademicYears = () => useCollection(COLLECTIONS.academicYears, []);
export const useActiveYear = () => useCollection(COLLECTIONS.activeYear, "2025-2026");
export const useSettings = () =>
  useCollection(COLLECTIONS.settings, {
    schoolName: "NR Edify English Medium School",
    tagline: "Think Beyond",
    location: "Thikkonda",
    address: "",
    phone: "",
    email: "",
    website: "",
    receiptFooter: "",
    principal: "",
  });
export const uid = () => crypto.randomUUID();
