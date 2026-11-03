import { createFileRoute, notFound } from "@tanstack/react-router";
import artefatos from "@/lib/artefatos.json";

const LISTA = artefatos as { t: string; s: string }[];

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const item = LISTA.find((a) => a.s === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => {
    const titulo = loaderData ? `${loaderData.t} | n o ii` : "n o ii";
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
  component: Artefato,
});

function Artefato() {
  const item = Route.useLoaderData();
  return (
    <iframe
      src={`/artefatos/${item.s}.html`}
      title={item.t}
      className="fixed inset-0 h-screen w-screen border-0"
    />
  );
}
