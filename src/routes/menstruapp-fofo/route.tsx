import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/menstruapp-fofo")({
  component: () => (
    <div className="imp-menstruappfofo min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
});
