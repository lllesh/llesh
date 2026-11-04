import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-indice-ghost")({
  head: () => ({
    meta: [
      { title: "artefato I\u0301ndice Ghost" },
      { name: "description", content: "artefato I\u0301ndice Ghost" },
      { property: "og:title", content: "artefato I\u0301ndice Ghost" },
      { property: "og:description", content: "artefato I\u0301ndice Ghost" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/indice-ghost.html" title="artefato I\u0301ndice Ghost" className="fixed inset-0 h-screen w-screen border-0" />,
});
