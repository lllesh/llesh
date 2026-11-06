import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/28")({
  head: () => ({
    meta: [
      { title: "artefato tarefas.braee.in" },
      { name: "description", content: "artefato tarefas.braee.in" },
      { property: "og:title", content: "artefato tarefas.braee.in" },
      { property: "og:description", content: "artefato tarefas.braee.in" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/tarefas-braee-in.html" title="artefato tarefas.braee.in" className="fixed inset-0 h-screen w-screen border-0" />,
});
