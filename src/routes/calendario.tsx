import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "calendário — n o ii" },
      { name: "description", content: "Calendário mensal do n o ii." },
      { property: "og:title", content: "calendário — n o ii" },
      { property: "og:description", content: "Calendário mensal do n o ii." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Calendario,
});

const MESES = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
const ABREV = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
const SEMANA = ["S","T","Q","Q","S","S","D"];
const TABS = ["#F7EDE3","#F2DCCB","#EDCDB7","#E7C0A6","#EFD3A3","#E6C98E","#D69C8F","#CFC8BF","#DDDCCF","#D9DED3","#C9CEC8","#7E9A93"];
const INK = "#6E6862";

function Calendario() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const ano = hoje.getFullYear();
  const offset = (new Date(ano, mes, 1).getDay() + 6) % 7;
  const total = new Date(ano, mes + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - offset + 1;
    return d >= 1 && d <= total ? d : null;
  });
  const isHoje = (d: number | null) => d === hoje.getDate() && mes === hoje.getMonth();

  return (
    <div className="flex min-h-svh w-full" style={{ background: "#F8EADF", color: INK, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="flex flex-1 flex-col" style={{ background: "#FDF8F3" }}>
        <header className="relative flex items-center justify-center py-5">
          <span className="absolute left-10 grid h-5 w-6 place-items-center rounded-sm border text-[8px]" style={{ borderColor: INK }}>{ano % 100}</span>
          <h1 className="text-[22px] font-light tracking-[0.45em]">{MESES[mes]}</h1>
        </header>
        <div className="grid grid-cols-7 text-center text-[11px] tracking-widest" style={{ background: "#FDF8F3" }}>
          {SEMANA.map((s, i) => <div key={i} className="pb-3">{s}</div>)}
        </div>
        <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-[3px]" style={{ background: "#FDF8F3" }}>
          {cells.map((d, i) => {
            const row = Math.floor(i / 7);
            const bg = `color-mix(in oklab, #F6E3D2 ${30 + row * 12}%, #FDF8F3)`;
            return (
              <div key={i} className="relative min-h-[90px] p-2 text-[11px]" style={{ background: bg }}>
                {d && <span className={isHoje(d) ? "inline-grid h-6 w-6 place-items-center rounded-full" : ""} style={isHoje(d) ? { background: INK, color: "#FDF8F3" } : {}}>{d}</span>}
              </div>
            );
          })}
        </div>
        <footer className="relative flex items-center justify-center py-4 text-[10px]" style={{ background: "#F6E3D2" }}>
          <span className="absolute left-8 opacity-70">n o ii</span>
          Derive happiness in oneself from a good day's work, from illuminating the fog that surrounds us. — Henri Matisse
        </footer>
      </div>
      <nav className="flex w-11 flex-col">
        {ABREV.map((m, i) => (
          <button key={m} onClick={() => setMes(i)} className="flex flex-1 items-center justify-center rounded-r-lg text-[9px] tracking-[0.3em] transition-all"
            style={{ background: TABS[i], color: i === 11 ? "#FDF8F3" : INK, writingMode: "vertical-rl", marginLeft: mes === i ? 0 : 4, fontWeight: mes === i ? 700 : 400 }}>
            {m}
          </button>
        ))}
        <div className="flex h-12 items-center justify-center text-lg" style={{ background: "#FDF8F3" }}>|||</div>
      </nav>
    </div>
  );
}
