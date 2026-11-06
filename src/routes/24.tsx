import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/24")({
  head: () => ({
    meta: [
      { title: "artefato n o ii \u00b7 advogados" },
      { name: "description", content: "artefato n o ii \u00b7 advogados" },
      { property: "og:title", content: "artefato n o ii \u00b7 advogados" },
      { property: "og:description", content: "artefato n o ii \u00b7 advogados" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/no-ii-advogados.html" title="artefato n o ii \u00b7 advogados" className="fixed inset-0 h-screen w-screen border-0" />,
});
