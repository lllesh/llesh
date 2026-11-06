import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/36")({
  head: () => ({
    meta: [
      { title: "ecossistema | n o ii" },
      { name: "description", content: "Todos os mundos da Letícia num lugar só." },
      { property: "og:title", content: "ecossistema | n o ii" },
      { property: "og:description", content: "Todos os mundos da Letícia num lugar só." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ecossistema,
});

const GRUPOS: { nome: string; cor: string; links: string[] }[] = [
  { nome: "cartas & tempo", cor: "#3A3633", links: ["lif.ee.cards", "ee.cards", "squircl.es", "day.luig.app", "infini.lle.sh"] },
  { nome: "saúde & mulher", cor: "#8A3B45", links: ["estrogeni.us", "remed.info", "17.je", "a.17.je", "b.17.je", "wholeaga.in", "whol.ee"] },
  { nome: "umbigo", cor: "#6E5A4E", links: ["umbig.ooo", "2013.umbig.ooo", "2938.umbig.ooo", "3330.umbig.ooo", "3437.umbig.ooo"] },
  { nome: "letícia", cor: "#4A4560", links: ["lle.sh", "i.lle.sh", "les.lle.sh", "leticia.land", "leticia.ink", "leticia.talk", "talk.leticia.talk", "amare.lol"] },
  { nome: "luigi", cor: "#3F5247", links: ["luig.app", "luigi.deskii.top", "luigi.games", "luigi.sk.cool", "luigi.cards", "luigi.lell.ooo", "lell.ooo/t", "lui.lell.ing"] },
  { nome: "livros", cor: "#5C4A3A", links: ["boook.ing", "the.boook.ing", "boooo.uk", "the.boooo.uk"] },
  { nome: "n o ii", cor: "#2E2C2A", links: ["noii.uk", "noiitv.figma.site", "noiiproo.figma.site", "airbnbest.figma.site", "lellesh.figma.site"] },
  { nome: "vida & estilo", cor: "#7A4B3A", links: ["w.appp.to/aubrey", "praia.appp.to", "canga.club", "doadoa.figma.site", "lemail.figma.site", "money-fresco-54184650.figma.site", "dish-cake-34402708.figma.site"] },
  {
    nome: "estudos", cor: "#4B4B4B", links: [
      "easing-reply-88431415.figma.site", "desert-window-92372084.figma.site", "song-tweet-04098925.figma.site",
      "pencil-fire-41563163.figma.site", "serifs-cherry-37579488.figma.site", "impact-kiosk-45104658.figma.site",
      "path-level-24517358.figma.site", "scheme-camel-15783794.figma.site", "alpha-warm-25902993.figma.site",
      "coat-mouse-74650226.figma.site", "parse-salsa-67975421.figma.site", "circle-stroke-52260355.figma.site",
      "slice-gills-31768150.figma.site",
    ],
  },
];

function Ecossistema() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-16" style={{ background: "#F6F4F1" }}>
      <h1 className="mb-14 text-6xl font-black tracking-tight md:text-8xl" style={{ color: "#2E2C2A" }}>n o ii</h1>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {GRUPOS.map((g) => (
          <section key={g.nome} className="rounded-[40px] p-8" style={{ background: g.cor, color: "#FFFBF3" }}>
            <h2 className="mb-6 text-4xl font-black tracking-tight">{g.nome}</h2>
            <div className="flex flex-wrap gap-2">
              {g.links.map((l) => (
                <a key={l} href={`https://${l}`} target="_blank" rel="noreferrer"
                  className="rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-70"
                  style={{ background: "rgba(0,0,0,0.28)", color: "#FFFBF3" }}>
                  {l.replace(/-\d+\.figma\.site$/, "").replace(".figma.site", "")} ↗
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
