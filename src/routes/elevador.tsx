import { createFileRoute, redirect } from "@tanstack/react-router";

// O elevador agora é o próprio ll e.s h e mora na raiz; /elevador continua funcionando e leva pra lá.
export const Route = createFileRoute("/elevador")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
