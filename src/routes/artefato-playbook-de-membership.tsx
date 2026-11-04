import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/artefato-playbook-de-membership")({
  head: () => ({
    meta: [
      { title: "artefato Playbook de Membership" },
      { name: "description", content: "artefato Playbook de Membership" },
      { property: "og:title", content: "artefato Playbook de Membership" },
      { property: "og:description", content: "artefato Playbook de Membership" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <iframe src="/artefatos/playbook-de-membership.html" title="artefato Playbook de Membership" className="fixed inset-0 h-screen w-screen border-0" />,
});
