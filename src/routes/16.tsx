import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/16")({
  head: () => ({
    meta: [
      { title: "artefato Fluxo do Cadastro" },
      { name: "description", content: "artefato Fluxo do Cadastro" },
      { property: "og:title", content: "artefato Fluxo do Cadastro" },
      { property: "og:description", content: "artefato Fluxo do Cadastro" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/fluxo-do-cadastro.html" title="artefato Fluxo do Cadastro" className="fixed inset-0 h-screen w-screen border-0" />,
});
