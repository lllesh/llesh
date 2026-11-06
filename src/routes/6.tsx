import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/6")({
  head: () => ({
    meta: [
      { title: "artefato Artefatos recentes" },
      { name: "description", content: "artefato Artefatos recentes" },
      { property: "og:title", content: "artefato Artefatos recentes" },
      { property: "og:description", content: "artefato Artefatos recentes" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/artefatos-recentes.html" title="artefato Artefatos recentes" className="fixed inset-0 h-screen w-screen border-0" />,
});
