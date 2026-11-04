import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-best")({
  head: () => ({
    meta: [
      { title: "artefato b e s t" },
      { name: "description", content: "artefato b e s t" },
      { property: "og:title", content: "artefato b e s t" },
      { property: "og:description", content: "artefato b e s t" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/best.html" title="artefato b e s t" className="fixed inset-0 h-screen w-screen border-0" />,
});
