import { createFileRoute } from "@tanstack/react-router";

// A página ll e.s h é servida DIRETO na raiz, sem iframe (iframe deixava o toque lento no iPhone).
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const res = await fetch(new URL("/sites/lle/index.html", request.url));
        const html = await res.text();
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
        });
      },
    },
  },
  head: () => ({
    meta: [
      { title: "ll e.s h" },
      { name: "description", content: "a biblioteca de tudo, em grid, canvas e infinity" },
      { property: "og:title", content: "ll e.s h" },
      { property: "og:description", content: "a biblioteca de tudo, em grid, canvas e infinity" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
