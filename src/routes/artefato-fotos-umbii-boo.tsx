import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-fotos-umbii-boo")({
  head: () => ({
    meta: [
      { title: "artefato F O T O S . U M B I I . B O O" },
      { name: "description", content: "artefato F O T O S . U M B I I . B O O" },
      { property: "og:title", content: "artefato F O T O S . U M B I I . B O O" },
      { property: "og:description", content: "artefato F O T O S . U M B I I . B O O" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/fotos-umbii-boo.html" title="artefato F O T O S . U M B I I . B O O" className="fixed inset-0 h-screen w-screen border-0" />,
});
