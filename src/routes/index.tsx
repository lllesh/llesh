import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ll e.s h" },
      { name: "description", content: "a biblioteca de tudo, em grid, canvas e infinity" },
      { property: "og:title", content: "ll e.s h" },
      { property: "og:description", content: "a biblioteca de tudo, em grid, canvas e infinity" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#FFFFFF" },
    ],
  }),
  component: LleshPrincipal,
});

function LleshPrincipal() {
  return (
    <iframe
      src="/sites/lle/index.html"
      title="ll e.s h"
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
