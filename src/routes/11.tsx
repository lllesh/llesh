import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/11")({
  head: () => ({
    meta: [
      { title: "artefato b r a i n d u m p" },
      { name: "description", content: "artefato b r a i n d u m p" },
      { property: "og:title", content: "artefato b r a i n d u m p" },
      { property: "og:description", content: "artefato b r a i n d u m p" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/braindump.html" title="artefato b r a i n d u m p" className="fixed inset-0 h-screen w-screen border-0" />,
});
