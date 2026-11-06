import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/25")({
  head: () => ({
    meta: [
      { title: "artefato P A T H" },
      { name: "description", content: "artefato P A T H" },
      { property: "og:title", content: "artefato P A T H" },
      { property: "og:description", content: "artefato P A T H" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/path.html" title="artefato P A T H" className="fixed inset-0 h-screen w-screen border-0" />,
});
