import { createFileRoute } from "@tanstack/react-router";
import { FeeTermsPage } from "@/pages/AdminConfigPages";
export const Route = createFileRoute("/admin/fee-terms")({
  head: () => ({ meta: [{ title: "Fee Terms — Edify School" }] }),
  component: FeeTermsPage,
});
