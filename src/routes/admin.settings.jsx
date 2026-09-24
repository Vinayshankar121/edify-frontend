import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/AdminConfigPages";
export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "School Settings — Edify School" }] }),
  component: SettingsPage,
});
