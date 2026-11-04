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
  { nome: "lift", href: "/lift" },
  { nome: "fertify alertas", href: "/fertify/alertas" },
  { nome: "fertify arquivos", href: "/fertify/arquivos" },
  { nome: "fertify calendario", href: "/fertify/calendario" },
  { nome: "fertify ciclos", href: "/fertify/ciclos" },
  { nome: "fertify configuracoes", href: "/fertify/configuracoes" },
  { nome: "fertify crm", href: "/fertify/crm" },
  { nome: "fertify exames", href: "/fertify/exames" },
  { nome: "fertify fertilistas", href: "/fertify/fertilistas" },
  { nome: "fertify medicacoes", href: "/fertify/medicacoes" },
  { nome: "fertify mensagens", href: "/fertify/mensagens" },
  { nome: "fertify pacientes", href: "/fertify/pacientes" },
  { nome: "fertify procedimentos", href: "/fertify/procedimentos" },
  { nome: "fertify protocolos", href: "/fertify/protocolos" },
  { nome: "fertify tarefas", href: "/fertify/tarefas" },
  { nome: "fertify templates", href: "/fertify/templates" },
  { nome: "fertify ultrassons", href: "/fertify/ultrassons" },
  { nome: "terminal", href: "/terminal/index.html" },
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

function Sites() {
  const todas = [
    ...PAGINAS,
    ...SITES.map((x) => ({ nome: `site ${x.nome}`, href: x.href })),
    ...ARTEFATOS.map((a) => ({ nome: `artefato ${a.t}`, href: `/${a.s}` })),
  ];
  return (
    <main className="min-h-screen bg-background p-10">
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        {todas.map((s, i) => (
          <a
            key={s.href + s.nome}
            href={s.href}
            className={`${CORES[i % CORES.length]} flex h-16 items-center justify-between rounded-full px-8 text-2xl font-black tracking-tight text-primary-foreground`}
          >
            <span className="truncate">{s.nome}</span> <span className="text-xl">↗</span>
          </a>
        ))}
      </div>
    </main>
  );
}
