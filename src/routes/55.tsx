import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/55")({
  head: () => ({
    meta: [
      { title: "site noiipro" },
      { name: "description", content: "site noiipro" },
      { property: "og:title", content: "site noiipro" },
      { property: "og:description", content: "site noiipro" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/noiipro/index.html" title="site noiipro" className="fixed inset-0 h-screen w-screen border-0" />,
});
