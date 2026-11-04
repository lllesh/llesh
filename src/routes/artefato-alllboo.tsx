import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-alllboo")({
  head: () => ({
    meta: [
      { title: "artefato A L L L B O O" },
      { name: "description", content: "artefato A L L L B O O" },
      { property: "og:title", content: "artefato A L L L B O O" },
      { property: "og:description", content: "artefato A L L L B O O" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/alllboo.html" title="artefato A L L L B O O" className="fixed inset-0 h-screen w-screen border-0" />,
});
