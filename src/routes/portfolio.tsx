import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "ll e.s h — portfolio" },
      { name: "description", content: "Portfolio ll e.s h em índice e lista." },
      { property: "og:title", content: "ll e.s h — portfolio" },
      { property: "og:description", content: "Portfolio ll e.s h em índice e lista." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Portfolio,
});

const B = "https://first.lle.sh/img/t/";
const ITENS = [
  ["Ovabike","8c1d5b21"],["Peel-O","aebe2238"],["Ovulation","0effa6ac"],["Estrogen","3df3a9f2"],
  ["Folículo","344f5a3d"],["Fresh Ovary","1172f348"],["Ai meu Deus","514e8591"],["Gutey","d460484a"],
  ["Second Month","dde3dfb1"],["Coincidence","e4fad7d2"],["Very Nice","6c5a5971"],["Olive","a4654008"],
  ["Pedal","cefe1b9a"],["Two Ovary","bd4de308"],["Great Success","254b262b"],["Indeed","bde98e81"],
];
const INK = "#111111";

function Portfolio() {
  const [p, setP] = useState(0);
  const [view, setView] = useState<"index" | "list">("index");
  useEffect(() => {
    const t = setInterval(() => setP((v) => (v >= 100 ? 100 : v + 4)), 30);
    return () => clearInterval(t);
  }, []);

  if (p < 100)
    return (
      <div className="grid min-h-svh place-items-center" style={{ background: "#fff", color: INK }}>
        <div className="flex w-[760px] max-w-[90vw] items-center gap-4 text-[12px] uppercase">
          <span>ll e.s h</span>
          <div className="relative h-px flex-1" style={{ background: "#ddd" }}>
            <div className="absolute inset-y-0 left-0" style={{ width: `${p}%`, background: INK }} />
          </div>
          <span className="w-6 text-right">{p}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-svh px-6 py-8 md:px-10" style={{ background: "#fff", color: INK }}>
      <header className="flex items-start justify-between text-[12px] uppercase">
        <span>ll e.s h</span>
        <div className="flex gap-3">
          <span className="opacity-40">[view]</span>
          {(["index", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className="uppercase" style={{ opacity: view === v ? 1 : 0.4 }}>
              [{view === v ? "·" : " "}] {v}
            </button>
          ))}
        </div>
      </header>
      <h1 className="mt-24 max-w-[1100px] text-[clamp(40px,7vw,110px)] font-medium leading-[0.95] tracking-[-0.04em]">
        Ciclo, corpo e memória em cartinhas para quem ovula
      </h1>
      {view === "index" ? (
        <div className="mt-24 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
          {ITENS.map(([n, id]) => (
            <figure key={id} className="group">
              <img src={`${B}${id}.jpg`} alt={n} className="aspect-[4/5] w-full object-cover transition-opacity group-hover:opacity-80" loading="lazy" />
              <figcaption className="mt-2 text-[12px] uppercase">{n}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <ul className="mt-24 border-t" style={{ borderColor: "#e5e5e5" }}>
          {ITENS.map(([n, id], i) => (
            <li key={id} className="group relative flex items-center justify-between border-b py-4 text-[clamp(20px,3vw,40px)] tracking-[-0.03em]" style={{ borderColor: "#e5e5e5" }}>
              <span>{n}</span>
              <span className="text-[12px]">{String(i + 1).padStart(2, "0")}</span>
              <img src={`${B}${id}.jpg`} alt="" className="pointer-events-none absolute right-24 top-1/2 hidden h-40 -translate-y-1/2 group-hover:block" />
            </li>
          ))}
        </ul>
      )}
      <footer className="mt-32 flex justify-between text-[12px] uppercase"><span>ll e.s h</span><span>{new Date().getFullYear()}</span></footer>
    </div>
  );
}
