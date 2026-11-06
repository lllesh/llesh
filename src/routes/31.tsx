import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/31")({
  head: () => ({
    meta: [
      { title: "artefato ve\u0300enus\u00ae agora" },
      { name: "description", content: "artefato ve\u0300enus\u00ae agora" },
      { property: "og:title", content: "artefato ve\u0300enus\u00ae agora" },
      { property: "og:description", content: "artefato ve\u0300enus\u00ae agora" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/veenus-agora.html" title="artefato ve\u0300enus\u00ae agora" className="fixed inset-0 h-screen w-screen border-0" />,
});
