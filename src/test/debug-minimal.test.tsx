import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StrictMode, useEffect, useState } from "react";

describe("minimal router", () => {
  it("reaches idle", async () => {
    const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
      component: () => {
        const [n, setN] = useState(0);
        useEffect(() => { const t = setInterval(() => setN((x) => x + 1), 50); return () => clearInterval(t); }, []);
        return <StrictMode><div>hello {n}</div><Outlet /></StrictMode>;
      },
    });
    const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: () => <div>index</div> });
    const routeTree = rootRoute.addChildren([indexRoute]);
    const queryClient = new QueryClient();
    const router = createRouter({ routeTree, context: { queryClient }, history: createMemoryHistory({ initialEntries: ["/"] }) });
    render(<RouterProvider router={router} />);
    await waitFor(() => expect(router.state.status).toBe("idle"), { timeout: 5000 });
  });
});
