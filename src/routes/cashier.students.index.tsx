import { createFileRoute } from "@tanstack/react-router";
import { StudentsPage } from "@/pages/StudentsPage";

export const Route = createFileRoute("/cashier/students/")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : undefined }),
  head: () => ({ meta: [{ title: "Students — Edify School" }] }),
  component: () => {
    const { q } = Route.useSearch();
    return <StudentsPage key={q ?? ""} base="/cashier" initialQuery={q ?? ""} />;
  },
});
