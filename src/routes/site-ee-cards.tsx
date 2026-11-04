import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/site-ee-cards")({
  head: () => ({
    meta: [
      { title: "site ee-cards" },
      { name: "description", content: "site ee-cards" },
      { property: "og:title", content: "site ee-cards" },
      { property: "og:description", content: "site ee-cards" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/ee-cards/index.html" title="site ee-cards" className="fixed inset-0 h-screen w-screen border-0" />,
});
