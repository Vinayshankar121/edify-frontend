import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/pages/PaymentsPage";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payment History — Edify School" }] }),
  component: () => <PaymentsPage />,
});
