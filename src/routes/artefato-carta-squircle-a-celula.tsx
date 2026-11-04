import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-carta-squircle-a-celula")({
  head: () => ({
    meta: [
      { title: "artefato carta-squircle \u00b7 a ce\u0301lula" },
      { name: "description", content: "artefato carta-squircle \u00b7 a ce\u0301lula" },
      { property: "og:title", content: "artefato carta-squircle \u00b7 a ce\u0301lula" },
      { property: "og:description", content: "artefato carta-squircle \u00b7 a ce\u0301lula" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/carta-squircle-a-celula.html" title="artefato carta-squircle \u00b7 a ce\u0301lula" className="fixed inset-0 h-screen w-screen border-0" />,
});
