import { createFileRoute } from "@tanstack/react-router";
import { CashierDashboard } from "@/pages/CashierDashboard";

export const Route = createFileRoute("/cashier/dashboard")({
  head: () => ({ meta: [{ title: "Cashier Dashboard — Edify School" }, { name: "description", content: "Edify School cashier dashboard." }] }),
  component: CashierDashboard,
});
