import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-as-vezes")({
  head: () => ({
    meta: [
      { title: "artefato A S . V E Z E S" },
      { name: "description", content: "artefato A S . V E Z E S" },
      { property: "og:title", content: "artefato A S . V E Z E S" },
      { property: "og:description", content: "artefato A S . V E Z E S" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/as-vezes.html" title="artefato A S . V E Z E S" className="fixed inset-0 h-screen w-screen border-0" />,
});
