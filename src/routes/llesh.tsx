import { createFileRoute } from "@tanstack/react-router";
import html from "../../public/sites/lle/index.html?raw";

// A experiência do ll e.s h mora no primeiro andar do elevador (que agora é a raiz).
// /llesh entrega essa página direto, já pronta (sem buscar de novo a cada visita, sem iframe).
export const Route = createFileRoute("/llesh")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
        }),
    },
  },
  head: () => ({
    meta: [
      { title: "ll e.s h" },
      { property: "og:title", content: "ll e.s h" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
