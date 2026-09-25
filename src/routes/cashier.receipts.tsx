import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/pages/PaymentsPage";

export const Route = createFileRoute("/cashier/receipts")({
  head: () => ({ meta: [{ title: "Receipts — Edify School" }] }),
  component: () => <PaymentsPage title="Receipts" receiptsMode />,
});
