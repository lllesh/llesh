import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/site-leticia-land")({
  head: () => ({
    meta: [
      { title: "site leticia.land" },
      { name: "description", content: "site leticia.land" },
      { property: "og:title", content: "site leticia.land" },
      { property: "og:description", content: "site leticia.land" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/leticia.land/index.html" title="site leticia.land" className="fixed inset-0 h-screen w-screen border-0" />,
});
