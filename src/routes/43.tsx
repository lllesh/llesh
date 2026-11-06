import { createFileRoute, redirect } from "@tanstack/react-router";

// O prédio ll e.s h tem o térreo na raiz; /llesh continua funcionando e leva pra lá.
export const Route = createFileRoute("/43")({
  beforeLoad: () => {
    throw redirect({ to: "/42", replace: true });
  },
});
