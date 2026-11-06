import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/21")({
  head: () => ({
    meta: [
      { title: "artefato Maestro" },
      { name: "description", content: "artefato Maestro" },
      { property: "og:title", content: "artefato Maestro" },
      { property: "og:description", content: "artefato Maestro" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/maestro.html" title="artefato Maestro" className="fixed inset-0 h-screen w-screen border-0" />,
});
