import { createFileRoute } from "@tanstack/react-router";
import { FilhappDashboard } from "@/components/filhapp-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FILHAPP | Fertilidade, ciclo e planos de filhos" },
      { name: "description", content: "Acompanhe seu ciclo, entenda sua fertilidade e planeje seus próximos passos com inteligência clínica." },
      { property: "og:title", content: "FILHAPP | Fertilidade e saúde reprodutiva" },
      { property: "og:description", content: "Seu panorama clínico para ciclo, fertilidade e planos de ter filhos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <FilhappDashboard />;
}
