import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-um-recado")({
  head: () => ({
    meta: [
      { title: "artefato Um Recado" },
      { name: "description", content: "artefato Um Recado" },
      { property: "og:title", content: "artefato Um Recado" },
      { property: "og:description", content: "artefato Um Recado" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/um-recado.html" title="artefato Um Recado" className="fixed inset-0 h-screen w-screen border-0" />,
});
