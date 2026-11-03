import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/femea")({
  component: () => (
    <div className="imp-femea min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
});
