import { createFileRoute } from "@tanstack/react-router";
import { FilhappDashboard } from "@/components/filhapp-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MENSTRUAPP | Menstruação e ciclo menstrual" },
      { name: "description", content: "Acompanhe seu ciclo, entenda sua fertilidade e planeje seus próximos passos com inteligência clínica." },
      { property: "og:title", content: "MENSTRUAPP | Menstruação e ciclo menstrual" },
      { property: "og:description", content: "Panorama clínico da sua menstruação e do seu ciclo menstrual." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <FilhappDashboard />;
}
