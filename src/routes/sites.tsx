import { createFileRoute } from "@tanstack/react-router";
import artefatos from "@/lib/artefatos.json";

const ARTEFATOS = artefatos as { t: string; s: string }[];

const PAGINAS = [
  { nome: "ll e.s h — entrada", href: "/" },
  { nome: "fertify", href: "/fertify" },
  { nome: "femea", href: "/femea" },
  { nome: "menstruapp", href: "/menstruapp" },
  { nome: "menstruapp bold", href: "/menstruapp-bold" },
  { nome: "menstruapp fofo", href: "/menstruapp-fofo" },
  { nome: "paciente", href: "/paciente" },
  { nome: "saude.show", href: "/saude" },
  { nome: "first.lle.sh", href: "/first" },
  { nome: "calendario", href: "/calendario" },
  { nome: "fitmail", href: "/fitmail" },
  { nome: "portfolio", href: "/portfolio" },
  { nome: "ecossistema", href: "/ecossistema" },
  { nome: "fèm", href: "/fem" },
];

const SITES = [
  { nome: "ee.cards", href: "/cards" },
  { nome: "leticia.ink", href: "/ink" },
  { nome: "leticia.land", href: "/land" },
  { nome: "pulse", href: "/pulse" },
  { nome: "pro", href: "/pro" },
  { nome: "hospital", href: "/hospital" },
  { nome: "mediciiiiish", href: "/med" },
  { nome: "lle.sh", href: "/lle" },
];

const CORES = ["bg-primary", "bg-secondary", "bg-accent"];

export const Route = createFileRoute("/sites")({
  head: () => ({
    meta: [
      { title: "sites | ll e.s h" },
      { name: "description", content: "Todas as páginas, sites e artefatos do ll e.s h, numa lista só." },
      { property: "og:title", content: "sites | ll e.s h" },
      { property: "og:description", content: "Todas as páginas, sites e artefatos do ll e.s h, numa lista só." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sites,
});

function Grupo({ titulo, itens, cor }: { titulo: string; itens: { nome: string; href: string }[]; cor: string }) {
  return (
    <section className="mx-auto mt-14 max-w-5xl first:mt-0">
      <h2 className="mb-5 text-xl font-black uppercase tracking-widest text-muted-foreground">{titulo}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {itens.map((s, i) => (
          <a
            key={s.href + s.nome}
            href={s.href}
            className={`${CORES[i % CORES.length]} flex h-16 items-center justify-between rounded-full px-8 text-2xl font-black tracking-tight text-primary-foreground`}
          >
            <span className="truncate">{s.nome}</span> <span className="text-xl">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Sites() {
  return (
    <main className="min-h-screen bg-background p-10">
      <h1 className="text-5xl font-black tracking-tight text-foreground">sites & artefatos</h1>
      <Grupo titulo="app" itens={PAGINAS} cor="bg-primary" />
      <Grupo titulo="sites" itens={SITES} cor="bg-secondary" />
      <Grupo titulo="artefatos" itens={ARTEFATOS.map((a) => ({ nome: a.t, href: `/${a.s}` }))} cor="bg-accent" />
    </main>
  );
}
