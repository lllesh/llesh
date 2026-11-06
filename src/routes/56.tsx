import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/56")({
  head: () => ({
    meta: [
      { title: "site pulse" },
      { name: "description", content: "site pulse" },
      { property: "og:title", content: "site pulse" },
      { property: "og:description", content: "site pulse" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/pulse/index.html" title="site pulse" className="fixed inset-0 h-screen w-screen border-0" />,
});
