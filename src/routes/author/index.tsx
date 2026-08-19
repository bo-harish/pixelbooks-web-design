import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DashboardContent } from "../publisher/index";

export const Route = createFileRoute("/author/")({
  component: AuthorDashboard,
});

function AuthorDashboard() {
  return (
    <AppShell title="Dashboard" subtitle="A quick pulse on your sales, royalties and top published titles.">
      <DashboardContent />
    </AppShell>
  );
}
