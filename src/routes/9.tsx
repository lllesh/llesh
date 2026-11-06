import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/9")({
  head: () => ({
    meta: [
      { title: "artefato Assinado pelo Doutor" },
      { name: "description", content: "artefato Assinado pelo Doutor" },
      { property: "og:title", content: "artefato Assinado pelo Doutor" },
      { property: "og:description", content: "artefato Assinado pelo Doutor" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/assinado-pelo-doutor.html" title="artefato Assinado pelo Doutor" className="fixed inset-0 h-screen w-screen border-0" />,
});
