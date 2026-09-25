import { createFileRoute } from "@tanstack/react-router";
import { StudentProfile } from "@/pages/StudentProfile";

export const Route = createFileRoute("/admin/students/$id")({
  head: () => ({ meta: [{ title: "Student Profile — Edify School" }] }),
  component: () => <StudentProfile id={Route.useParams().id} base="/admin" />,
});
