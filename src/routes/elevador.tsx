import { createFileRoute, redirect } from "@tanstack/react-router";

// O lift do prédio ll e.s h mora em /lift; /elevador continua funcionando e leva pra lá.
export const Route = createFileRoute("/elevador")({
  beforeLoad: () => {
    throw redirect({ to: "/lift", replace: true });
  },
});
