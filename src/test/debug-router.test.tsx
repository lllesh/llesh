import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("debug", () => {
  it("shows router state", async () => {
    const queryClient = new QueryClient();
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      console.log("STATUS", router.state.status, "LOC", router.state.location.pathname);
      console.log("MATCHES", router.state.matches.map((m) => m.routeId));
      expect(router.state.status).toBe("idle");
    }, { timeout: 8000 });
  });
});
