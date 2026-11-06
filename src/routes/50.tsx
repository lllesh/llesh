import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/50")({
  head: () => ({
    meta: [
      { title: "site hospital" },
      { name: "description", content: "site hospital" },
      { property: "og:title", content: "site hospital" },
      { property: "og:description", content: "site hospital" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/hospital/index.html" title="site hospital" className="fixed inset-0 h-screen w-screen border-0" />,
});
