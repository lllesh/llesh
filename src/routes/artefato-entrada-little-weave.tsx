import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-entrada-little-weave")({
  head: () => ({
    meta: [
      { title: "artefato Entrada \u2014 Little Weave" },
      { name: "description", content: "artefato Entrada \u2014 Little Weave" },
      { property: "og:title", content: "artefato Entrada \u2014 Little Weave" },
      { property: "og:description", content: "artefato Entrada \u2014 Little Weave" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/entrada-little-weave.html" title="artefato Entrada \u2014 Little Weave" className="fixed inset-0 h-screen w-screen border-0" />,
});
