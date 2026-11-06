import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/29")({
  head: () => ({
    meta: [
      { title: "artefato tudo de hoje" },
      { name: "description", content: "artefato tudo de hoje" },
      { property: "og:title", content: "artefato tudo de hoje" },
      { property: "og:description", content: "artefato tudo de hoje" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/tudo-de-hoje.html" title="artefato tudo de hoje" className="fixed inset-0 h-screen w-screen border-0" />,
});
