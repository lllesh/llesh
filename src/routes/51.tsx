import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/51")({
  head: () => ({
    meta: [
      { title: "site leticia.ink" },
      { name: "description", content: "site leticia.ink" },
      { property: "og:title", content: "site leticia.ink" },
      { property: "og:description", content: "site leticia.ink" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/leticia.ink/index.html" title="site leticia.ink" className="fixed inset-0 h-screen w-screen border-0" />,
});
