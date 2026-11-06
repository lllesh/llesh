import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/53")({
  head: () => ({
    meta: [
      { title: "site lle" },
      { name: "description", content: "site lle" },
      { property: "og:title", content: "site lle" },
      { property: "og:description", content: "site lle" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/lle/index.html" title="site lle" className="fixed inset-0 h-screen w-screen border-0" />,
});
