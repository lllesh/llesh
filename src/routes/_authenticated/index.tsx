import { createFileRoute } from "@tanstack/react-router";
import { FilhappDashboard } from "@/components/filhapp-dashboard";
import { IntroSplash } from "@/components/intro-splash";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "MENSTRUAPP | Menstruação e ciclo menstrual" },
      { name: "description", content: "Acompanhe sua menstruação e as fases do seu ciclo com precisão clínica." },
      { property: "og:title", content: "MENSTRUAPP | Menstruação e ciclo menstrual" },
      { property: "og:description", content: "Panorama clínico da sua menstruação e do seu ciclo menstrual." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <IntroSplash />
      <FilhappDashboard />
    </>
  );
}
