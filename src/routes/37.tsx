import { createFileRoute, redirect } from "@tanstack/react-router";

// O lift do prédio ll e.s h mora em /lift; /elevador continua funcionando e leva pra lá.
export const Route = createFileRoute("/37")({
  beforeLoad: () => {
    throw redirect({ to: "/0", replace: true });
  },
});
