import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/menstruapp-bold")({
  component: () => (
    <div className="imp-menstruappbold min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
});
