import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-canga-links")({
  head: () => ({
    meta: [
      { title: "artefato c a n g a \u00b7 links" },
      { name: "description", content: "artefato c a n g a \u00b7 links" },
      { property: "og:title", content: "artefato c a n g a \u00b7 links" },
      { property: "og:description", content: "artefato c a n g a \u00b7 links" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/canga-links.html" title="artefato c a n g a \u00b7 links" className="fixed inset-0 h-screen w-screen border-0" />,
});
