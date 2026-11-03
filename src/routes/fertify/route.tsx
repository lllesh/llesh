import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/fertify")({
  component: () => (
    <div className="imp-fertify min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
});
