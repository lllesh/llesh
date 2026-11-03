import { createFileRoute } from "@tanstack/react-router";
import html from "../../public/sites/lle/index.html?raw";

// A página ll e.s h é entregue direto na raiz, já pronta (sem buscar de novo a cada visita, sem iframe).
export const Route = createFileRoute("/")({
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
