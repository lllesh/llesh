import { createFileRoute } from "@tanstack/react-router";
import itens from "@/lib/artefatos.json";

export const Route = createFileRoute("/33")({
  head: () => ({
    meta: [
      { title: "artefatos · n o ii" },
      { name: "description", content: "Coleção de artefatos do ecossistema n o ii." },
      { property: "og:title", content: "artefatos · n o ii" },
      { property: "og:description", content: "Coleção de artefatos do ecossistema n o ii." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Artefatos,
});

function Artefatos() {
  return (
    <main className="min-h-screen bg-[#F6F4F1] px-6 py-16 text-[#6f6b65]">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 text-6xl font-black tracking-tight">artefatos</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/terminal/index.html" className="rounded-full bg-[#A9A59F] px-8 py-5 text-xl font-bold text-[#FFFBF3]">
            terminal ↗
          </a>
          {itens.map((i) => (
            <a
              key={i.s}
              href={`/${i.s}`}
              className="truncate rounded-full bg-[#A9A59F] px-8 py-5 text-xl font-bold text-[#FFFBF3]"
            >
              {i.t} ↗
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
