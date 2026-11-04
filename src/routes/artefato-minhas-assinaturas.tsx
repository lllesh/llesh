import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-minhas-assinaturas")({
  head: () => ({
    meta: [
      { title: "artefato Minhas Assinaturas" },
      { name: "description", content: "artefato Minhas Assinaturas" },
      { property: "og:title", content: "artefato Minhas Assinaturas" },
      { property: "og:description", content: "artefato Minhas Assinaturas" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/minhas-assinaturas.html" title="artefato Minhas Assinaturas" className="fixed inset-0 h-screen w-screen border-0" />,
});
