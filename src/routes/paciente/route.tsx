import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/paciente")({
  component: () => (
    <div className="imp-paciente min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
});
