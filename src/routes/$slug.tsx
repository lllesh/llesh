import { createFileRoute, notFound } from "@tanstack/react-router";
import artefatos from "@/lib/artefatos.json";

const LISTA = artefatos as { t: string; s: string }[];

// Sites importados: endereço curto na raiz -> /sites/<pasta>/index.html
const SITES: Record<string, string> = {
  cards: "ee-cards",
  "ee.cards": "ee-cards",
  ink: "leticia.ink",
  "leticia.ink": "leticia.ink",
  land: "leticia.land",
  "leticia.land": "leticia.land",
  pulse: "pulse",
  pro: "noiipro",
  hospital: "hospital",
  med: "mediciiiiish",
  mediciiiiish: "mediciiiiish",
  lle: "lle",
  "lle.sh": "lle",
};

// Títulos bonitos por endereço curto (a aba mostra o nome do site)
const NOMES: Record<string, string> = {
  cards: "ee.cards",
  "ee.cards": "ee.cards",
  ink: "leticia.ink",
  "leticia.ink": "leticia.ink",
  land: "leticia.land",
  "leticia.land": "leticia.land",
  pulse: "pulse",
  pro: "pro",
  hospital: "hospital",
  med: "mediciiiiish",
  mediciiiiish: "mediciiiiish",
  lle: "lle.sh",
  "lle.sh": "lle.sh",
};

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const item = LISTA.find((a) => a.s === params.slug);
    if (item) return { tipo: "artefato" as const, titulo: item.t, src: `/artefatos/${item.s}.html` };
    const pasta = SITES[params.slug];
    if (pasta) return { tipo: "site" as const, titulo: NOMES[params.slug], src: `/sites/${pasta}/index.html` };
    throw notFound();
  },
  head: ({ loaderData }) => {
    const titulo = loaderData ? `${loaderData.titulo} | n o ii` : "n o ii";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: titulo },
        { property: "og:title", content: titulo },
        { property: "og:description", content: titulo },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Pagina,
});

function Pagina() {
  const item = Route.useLoaderData();
  return (
    <iframe
      src={item.src}
      title={item.titulo}
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
