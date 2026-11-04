import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-veenus-comentados-fluido")({
  head: () => ({
    meta: [
      { title: "artefato ve\u0300enus\u00ae comentados fluido" },
      { name: "description", content: "artefato ve\u0300enus\u00ae comentados fluido" },
      { property: "og:title", content: "artefato ve\u0300enus\u00ae comentados fluido" },
      { property: "og:description", content: "artefato ve\u0300enus\u00ae comentados fluido" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/veenus-comentados-fluido.html" title="artefato ve\u0300enus\u00ae comentados fluido" className="fixed inset-0 h-screen w-screen border-0" />,
});
