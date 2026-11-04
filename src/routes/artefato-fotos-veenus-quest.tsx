import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-fotos-veenus-quest")({
  head: () => ({
    meta: [
      { title: "artefato F O T O S . V E\u0300 E N U S . Q U E S T" },
      { name: "description", content: "artefato F O T O S . V E\u0300 E N U S . Q U E S T" },
      { property: "og:title", content: "artefato F O T O S . V E\u0300 E N U S . Q U E S T" },
      { property: "og:description", content: "artefato F O T O S . V E\u0300 E N U S . Q U E S T" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/fotos-veenus-quest.html" title="artefato F O T O S . V E\u0300 E N U S . Q U E S T" className="fixed inset-0 h-screen w-screen border-0" />,
});
