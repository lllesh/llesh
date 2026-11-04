import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-look-bootstrap-vs-o-teu-look")({
  head: () => ({
    meta: [
      { title: "artefato look bootstrap vs. o teu look" },
      { name: "description", content: "artefato look bootstrap vs. o teu look" },
      { property: "og:title", content: "artefato look bootstrap vs. o teu look" },
      { property: "og:description", content: "artefato look bootstrap vs. o teu look" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/look-bootstrap-vs-o-teu-look.html" title="artefato look bootstrap vs. o teu look" className="fixed inset-0 h-screen w-screen border-0" />,
});
