import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/22")({
  head: () => ({
    meta: [
      { title: "artefato M A I L . L L E . S H" },
      { name: "description", content: "artefato M A I L . L L E . S H" },
      { property: "og:title", content: "artefato M A I L . L L E . S H" },
      { property: "og:description", content: "artefato M A I L . L L E . S H" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/mail-lle-sh.html" title="artefato M A I L . L L E . S H" className="fixed inset-0 h-screen w-screen border-0" />,
});
