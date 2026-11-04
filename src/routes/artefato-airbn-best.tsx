import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-airbn-best")({
  head: () => ({
    meta: [
      { title: "artefato airbn.best" },
      { name: "description", content: "artefato airbn.best" },
      { property: "og:title", content: "artefato airbn.best" },
      { property: "og:description", content: "artefato airbn.best" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/airbn-best.html" title="artefato airbn.best" className="fixed inset-0 h-screen w-screen border-0" />,
});
