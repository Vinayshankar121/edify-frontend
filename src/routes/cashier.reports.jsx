import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/pages/ReportsPage";
export const Route = createFileRoute("/cashier/reports")({
  head: () => ({ meta: [{ title: "Reports — Edify School" }] }),
  component: ReportsPage,
});
