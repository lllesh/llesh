import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/imports/femea/components/section-page";

export const Route = createFileRoute("/femea/")({
  head: () => ({
    meta: [
      { title: "FÈMEA — Obra completa" },
      { name: "description", content: "Consulte toda a obra FÈMEA em um só lugar." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SectionPage
      config={{
        eyebrow: "Obra completa",
        title: "FÈMEA",
        description:
          "Consulte e converse com toda a obra FÈMEA. Navegue pelas fases ao lado ou pelos eixos clínicos para acessar o conteúdo.",
        suggestions: [
          { title: "Por onde começar", prompt: "Por onde começar a leitura da obra FÈMEA?" },
          { title: "Método FÈMEA", prompt: "Resuma o método FÈMEA em fases." },
          { title: "Buscar tema", prompt: "Onde a obra discute reserva ovariana?" },
          { title: "Caso clínico", prompt: "Traga um caso clínico que exemplifique o método FÈMEA." },
        ],
      }}
    />
  );
}
