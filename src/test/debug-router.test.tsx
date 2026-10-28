import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { cleanup } from "@testing-library/react";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: { id: "test-user" } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(() => cleanup());

describe("debug", () => {
  it("shows router state at /", async () => {
    const router = renderAt("/");
    await waitFor(() => {
      console.log("STATUS", router.state.status, "LOC", router.state.location.pathname);
      console.log("MATCHES", router.state.matches.map((m) => m.routeId));
      expect(router.state.status).toBe("idle");
    }, { timeout: 8000 });
  });

  it("shows router state at 404", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const router = renderAt("/this-route-does-not-exist");
    await waitFor(() => {
      console.log("STATUS404", router.state.status, "LOC", router.state.location.pathname);
      console.log("MATCHES404", router.state.matches.map((m) => m.routeId));
      expect(router.state.status).toBe("idle");
    }, { timeout: 8000 });
  });
});
