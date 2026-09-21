import { KEYS } from "@/lib/storage";
import { useCollection } from "@/lib/store";
import type {
  AcademicYear,
  Cashier,
  FeeStructure,
  FeeTerm,
  Payment,
  SchoolClass,
  SchoolSettings,
  Student,
} from "@/lib/types";

export const useStudents = () => useCollection<Student[]>(KEYS.students, []);
export const usePayments = () => useCollection<Payment[]>(KEYS.payments, []);
export const useClasses = () => useCollection<SchoolClass[]>(KEYS.classes, []);
export const useFeeStructures = () => useCollection<FeeStructure[]>(KEYS.feeStructures, []);
export const useFeeTerms = () => useCollection<FeeTerm[]>(KEYS.feeTerms, []);
export const useCashiers = () => useCollection<Cashier[]>(KEYS.cashiers, []);
export const useAcademicYears = () => useCollection<AcademicYear[]>(KEYS.academicYears, []);
export const useActiveYear = () => useCollection<string>(KEYS.activeYear, "2025-2026");
export const useSettings = () =>
  useCollection<SchoolSettings>(KEYS.settings, {
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
