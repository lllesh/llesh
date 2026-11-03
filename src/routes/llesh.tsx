import { createFileRoute, redirect } from "@tanstack/react-router";

// A entrada do ll e.s h agora mora na raiz; /llesh continua funcionando e leva pra lá.
export const Route = createFileRoute("/llesh")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
