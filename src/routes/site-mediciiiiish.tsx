import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/site-mediciiiiish")({
  head: () => ({
    meta: [
      { title: "site mediciiiiish" },
      { name: "description", content: "site mediciiiiish" },
      { property: "og:title", content: "site mediciiiiish" },
      { property: "og:description", content: "site mediciiiiish" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/sites/mediciiiiish/index.html" title="site mediciiiiish" className="fixed inset-0 h-screen w-screen border-0" />,
});
