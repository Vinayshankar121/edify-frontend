import type { FeeStructure, Payment, Student } from "./types";

export const inr = (n: number) =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;

export const fullName = (s: Student) => `${s.firstName} ${s.lastName}`;

export const structureTotal = (s?: FeeStructure) =>
  s ? s.heads.reduce((t, h) => t + h.amount, 0) : 0;

export interface FeeSummary {
  total: number;
  discount: number;
  payable: number;
  paid: number;
  balance: number;
  status: "Paid" | "Partial" | "Pending";
}

export function feeSummary(
  student: Student,
  structures: FeeStructure[],
  payments: Payment[],
): FeeSummary {
  const structure = structures.find((s) => s.id === student.structureId);
  const total = structureTotal(structure);
  const discount = student.discount || 0;
  const payable = Math.max(total - discount, 0);
  const paid = payments
    .filter((p) => p.studentId === student.id)
    .reduce((t, p) => t + p.amount, 0);
  const balance = Math.max(payable - paid, 0);
  const status = paid <= 0 ? "Pending" : balance <= 0 ? "Paid" : "Partial";
  return { total, discount, payable, paid, balance, status };
}

export function headBreakdown(
  student: Student,
  structures: FeeStructure[],
  payments: Payment[],
) {
  const structure = structures.find((s) => s.id === student.structureId);
  if (!structure) return [];
  const { paid } = feeSummary(student, structures, payments);
  let remaining = paid;
  return structure.heads.map((h) => {
    const applied = Math.min(h.amount, remaining);
    remaining -= applied;
    return { name: h.name, amount: h.amount, paid: applied, balance: h.amount - applied };
  });
}

export const today = () => new Date().toISOString().slice(0, 10);

export function nextReceiptNo(payments: Payment[]) {
  const max = payments.reduce((m, p) => {
    const n = Number(p.receiptNo.split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ED-2026-${String(max + 1).padStart(4, "0")}`;
}

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

export function toCsv(rows: Record<string, string | number>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
