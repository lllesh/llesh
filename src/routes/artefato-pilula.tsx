import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-pilula")({
  head: () => ({
    meta: [
      { title: "artefato P I\u0301 L U L A" },
      { name: "description", content: "artefato P I\u0301 L U L A" },
      { property: "og:title", content: "artefato P I\u0301 L U L A" },
      { property: "og:description", content: "artefato P I\u0301 L U L A" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/pilula.html" title="artefato P I\u0301 L U L A" className="fixed inset-0 h-screen w-screen border-0" />,
});
