import { createFileRoute } from "@tanstack/react-router";

const SITES = [
  { nome: "ee.cards", href: "/sites/ee-cards/index.html", cor: "bg-primary" },
  { nome: "leticia.ink", href: "/sites/leticia.ink/index.html", cor: "bg-secondary" },
  { nome: "leticia.land", href: "/sites/leticia.land/index.html", cor: "bg-accent" },
  { nome: "umbigo", href: "/sites/umbigo/index.html", cor: "bg-primary" },
  { nome: "pulse", href: "/sites/pulse/index.html", cor: "bg-secondary" },
  { nome: "pro", href: "/sites/pro/index.html", cor: "bg-accent" },
  { nome: "hospital", href: "/sites/hospital/index.html", cor: "bg-primary" },
];

export const Route = createFileRoute("/sites")({
  head: () => ({
    meta: [
      { title: "sites | n o ii" },
      { name: "description", content: "Os sites do ecossistema n o ii, todos aqui dentro." },
      { property: "og:title", content: "sites | n o ii" },
      { property: "og:description", content: "Os sites do ecossistema n o ii, todos aqui dentro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sites,
});

function Sites() {
  return (
    <main className="min-h-screen bg-background p-10">
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
        {SITES.map((s) => (
          <a
            key={s.nome}
            href={s.href}
            className={`${s.cor} flex h-20 items-center justify-between rounded-full px-10 text-4xl font-black tracking-tight text-primary-foreground`}
          >
            {s.nome} <span className="text-2xl">↗</span>
          </a>
        ))}
      </div>
    </main>
  );
}
