import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/14")({
  head: () => ({
    meta: [
      { title: "artefato Carta\u0303o Branco Lele" },
      { name: "description", content: "artefato Carta\u0303o Branco Lele" },
      { property: "og:title", content: "artefato Carta\u0303o Branco Lele" },
      { property: "og:description", content: "artefato Carta\u0303o Branco Lele" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/cartao-branco-lele.html" title="artefato Carta\u0303o Branco Lele" className="fixed inset-0 h-screen w-screen border-0" />,
});
