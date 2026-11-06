import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/8")({
  head: () => ({
    meta: [
      { title: "artefato Assinado pelo Doutor 2" },
      { name: "description", content: "artefato Assinado pelo Doutor 2" },
      { property: "og:title", content: "artefato Assinado pelo Doutor 2" },
      { property: "og:description", content: "artefato Assinado pelo Doutor 2" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/assinado-pelo-doutor-2.html" title="artefato Assinado pelo Doutor 2" className="fixed inset-0 h-screen w-screen border-0" />,
});
