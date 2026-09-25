import { createFileRoute } from "@tanstack/react-router";
import { AdmissionsPage } from "@/pages/AdmissionsPage";

export const Route = createFileRoute("/admin/admissions")({
  validateSearch: (s: Record<string, unknown>) => ({ edit: typeof s.edit === "string" ? s.edit : undefined }),
  head: () => ({ meta: [{ title: "Admissions — Edify School" }] }),
  component: () => {
    const { edit } = Route.useSearch();
    return <AdmissionsPage key={edit ?? "new"} editId={edit} />;
  },
});
