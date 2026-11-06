import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/3")({
  head: () => ({
    meta: [
      { title: "artefato A C E S S O \u00b7 relato\u0301rio" },
      { name: "description", content: "artefato A C E S S O \u00b7 relato\u0301rio" },
      { property: "og:title", content: "artefato A C E S S O \u00b7 relato\u0301rio" },
      { property: "og:description", content: "artefato A C E S S O \u00b7 relato\u0301rio" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/acesso-relatorio.html" title="artefato A C E S S O \u00b7 relato\u0301rio" className="fixed inset-0 h-screen w-screen border-0" />,
});
