import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/pages/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Edify School" }, { name: "description", content: "Edify School admin dashboard." }] }),
  component: AdminDashboard,
});
