import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// O elevador é o próprio ll e.s h e mora na raiz: a pessoa entra, anda livre
// pelos andares e brinca; o cadastro só é pedido quando ela quer ENTRAR num andar.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ll e.s h" },
      { name: "description", content: "O elevador infinito do ecossistema ll e.s h. Aperte um andar e suba." },
      { property: "og:title", content: "ll e.s h" },
      { property: "og:description", content: "O elevador infinito do ecossistema ll e.s h. Aperte um andar e suba." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Elevador,
});

const ANDARES = [
  "ll e.s h", "n o ii", "quem.app", "minha.id", "menstruapp", "pre.natal.br", "fem.ia.br",
  "fertify", "saude.show", "b r a e e . i n", "p r o n t u a i", "dr.show", "a l u m n i . s h o w",
  "c a r t a s . l i v e", "ee.cards", "art.ee.cards", "p a y i n g . c a r d s", "vovó.casa",
  "vovô.casa", "jardim da saudade", "m e m o r i . e u", "ôn.de", "din.lle.sh", "m a t c h",
  "lumiii", "b i t c h . t e n n i s", "p o d s . c a t", "p o d . v i n", "i ô . i o",
  "ia-ia-io.io", "g i u s . a p p", "papelito", "b o o k . i n g",
];

// Destinos reais por andar (índice). O primeiro andar é a experiência do ll e.s h.
const DESTINOS: Record<number, string> = { 0: "/llesh" };

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const SLAB = 480;
type Fase = "parado" | "fechando" | "viajando" | "abrindo";

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function useSom() {
  const ctx = useRef<AudioContext | null>(null);
  const hum = useRef<{ o: OscillatorNode; g: GainNode } | null>(null);
  const get = () => {
    if (!ctx.current) ctx.current = new AudioContext();
    return ctx.current;
  };
  return {
    ding() {
      const c = get();
      [880, 660].forEach((f, i) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.frequency.value = f;
        o.type = "sine";
        const t = c.currentTime + i * 0.28;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t + 1.2);
      });
    },
    motor(on: boolean) {
      const c = get();
      if (on && !hum.current) {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "sawtooth";
        o.frequency.value = 52;
        g.gain.value = 0.0001;
        g.gain.exponentialRampToValueAtTime(0.025, c.currentTime + 0.6);
        o.connect(g).connect(c.destination);
        o.start();
        hum.current = { o, g };
      } else if (!on && hum.current) {
        const { o, g } = hum.current;
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.5);
        o.stop(c.currentTime + 0.6);
        hum.current = null;
      }
    },
  };
}

function Elevador() {
  const navigate = useNavigate();
  const [atual, setAtual] = useState(0);
  const [visor, setVisor] = useState(0);
  const [destino, setDestino] = useState<number | null>(null);
  const [fase, setFase] = useState<Fase>("parado");
  const [dir, setDir] = useState<1 | -1>(1);
  const [chegou, setChegou] = useState(0);
  const shaft = useRef<HTMLDivElement[]>([]);
  const cabine = useRef<HTMLDivElement>(null);
  const som = useSom();

  const chamar = (alvo: number) => {
    if (fase !== "parado" || alvo === atual) return;
    const d = alvo > atual ? 1 : -1;
    setDir(d);
    setDestino(alvo);
    setFase("fechando");
    setTimeout(() => viajar(alvo, d), 750);
  };

  const viajar = (alvo: number, d: 1 | -1) => {
    setFase("viajando");
    som.motor(true);
    const de = atual;
    const dist = Math.abs(alvo - de);
    const dur = Math.min(900 + dist * 260, 5200);
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = ease(p);
      const pos = e * dist * SLAB;
      shaft.current.forEach((el) => {
        if (el) el.style.backgroundPosition = `0 ${d * pos}px, 0 ${d * pos}px`;
      });
      // força G: afunda ao acelerar, flutua ao frear
      const accel = p < 0.5 ? 1 - p * 2 : -(p - 0.5) * 2;
      if (cabine.current) cabine.current.style.transform = `translateY(${d * accel * 5}px)`;
      setVisor(de + d * Math.round(e * dist));
      if (p < 1) requestAnimationFrame(tick);
      else {
        som.motor(false);
        if (cabine.current) cabine.current.style.transform = "";
        setAtual(alvo);
        setVisor(alvo);
        setChegou((n) => n + 1);
        som.ding();
        setTimeout(() => setFase("abrindo"), 450);
        setTimeout(() => {
          setFase("parado");
          setDestino(null);
        }, 1350);
      }
    };
    requestAnimationFrame(tick);
  };

  // Entrar de verdade no andar: exige a conta do ecossistema.
  const entrarNoAndar = async (indice: number) => {
    const alvo = DESTINOS[indice];
    if (!alvo) return;
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await navigate({ href: alvo });
    } else {
      await navigate({ href: `/auth?redirect=${encodeURIComponent(alvo)}` });
    }
  };

  const fechado = fase === "fechando" || fase === "viajando";
  const andar = ANDARES[atual] ?? "";

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ background: "var(--elev-bg)", color: "var(--elev-ink)" }}>
      <div
        ref={cabine}
        className="absolute inset-0"
        style={{ animation: fase === "viajando" ? "elev-shake 0.12s linear infinite" : undefined }}
      >
        {/* andar */}
        <Andar key={chegou} indice={atual} nome={andar} onEntrar={() => entrarNoAndar(atual)} temDestino={!!DESTINOS[atual]} />

        {/* portas */}
        {[0, 1].map((lado) => (
          <div
            key={lado}
            className="elev-steel absolute top-0 bottom-0 z-20"
            style={{
              width: "50%",
              left: lado === 0 ? 0 : "50%",
              transform: fechado ? "translateX(0)" : `translateX(${lado === 0 ? "-101%" : "101%"})`,
              transition: "transform 0.75s cubic-bezier(.65,0,.35,1)",
              boxShadow: lado === 0 ? "inset -2px 0 0 var(--elev-steel-3)" : "inset 2px 0 0 var(--elev-steel-3)",
            }}
          >
            {/* janelinha mostrando o poço passando */}
            <div
              ref={(el) => {
                if (el) shaft.current[lado] = el;
              }}
              className="elev-shaft absolute"
              style={{
                top: "28%",
                height: "44%",
                width: 18,
                [lado === 0 ? "right" : "left"]: 36,
                borderRadius: 999,
                boxShadow: "inset 0 0 0 3px var(--elev-steel-3), inset 0 0 18px var(--elev-display)",
                filter: fase === "viajando" ? "blur(0.6px)" : undefined,
              }}
            />
          </div>
        ))}
      </div>

      {/* painel */}
      <aside
        className="elev-steel absolute z-30 flex flex-col rounded-[28px] p-4"
        style={{ right: 20, top: 20, bottom: 20, width: 236, boxShadow: "0 30px 60px -20px var(--elev-display)" }}
      >
        <div className="mb-3 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "var(--elev-display)" }}>
          <span style={{ color: "var(--elev-glow)", opacity: fase === "viajando" ? 1 : 0.25, fontSize: 14 }}>
            {dir === 1 ? "▲" : "▼"}
          </span>
          <span className="font-mono text-4xl font-black tabular-nums" style={{ color: "var(--elev-glow)", textShadow: "0 0 12px var(--elev-glow)" }}>
            {visor === 0 ? "T" : String(visor).padStart(2, "0")}
          </span>
          <span className="truncate text-[10px] tracking-[0.2em]" style={{ color: "var(--elev-glow)" }}>
            {ANDARES[visor]}
          </span>
        </div>
        <div className="-mr-2 flex flex-1 flex-col-reverse gap-2 overflow-y-auto pr-2 scrollbar-none">
          {ANDARES.map((nome, i) => (
            <button
              key={nome}
              onClick={() => chamar(i)}
              className="flex items-center gap-3 text-left"
              aria-label={i === 0 ? "térreo: ll e.s h" : `andar ${i}: ${nome}`}
            >
              <span
                className="elev-btn grid h-11 w-11 shrink-0 place-items-center rounded-full font-mono text-sm font-bold"
                data-on={destino === i || (fase === "parado" && atual === i)}
              >
                {i === 0 ? "T" : i}
              </span>
              <span className="truncate text-[11px] font-semibold tracking-[0.12em]" style={{ color: "var(--elev-display)" }}>
                {nome}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-[9px] tracking-[0.3em]" style={{ color: "var(--elev-steel-3)" }}>
          ll e.s h · CAPACIDADE INFINITA
        </p>
      </aside>
    </main>
  );
}

function Andar({
  indice,
  nome,
  onEntrar,
  temDestino,
}: {
  indice: number;
  nome: string;
  onEntrar: () => void;
  temDestino: boolean;
}) {
  const [virada, setVirada] = useState(false);
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntrou(true), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <section
      className="absolute inset-0 flex items-center gap-16 py-16 pl-[6vw] pr-[300px]"
      style={{
        transform: entrou ? "translateY(0)" : "translateY(14px)",
        transition: "transform 0.9s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-6 font-mono text-xs tracking-[0.3em]" style={{ color: "var(--elev-glow)" }}>
          {indice === 0 ? "TÉRREO" : `${String(indice).padStart(2, "0")} — ANDAR`}
        </p>
        <h1 className="mb-8 text-[clamp(56px,9vw,150px)] font-black leading-[0.85] tracking-[-0.05em]">{nome}</h1>
        <p className="max-w-xl text-xl leading-relaxed" style={{ color: "var(--elev-ink-2)" }}>
          {LOREM}
        </p>
        {temDestino && (
          <button
            onClick={onEntrar}
            aria-label="entrar no andar"
            className="mt-10 inline-flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{
              background: "var(--elev-glow)",
              color: "var(--elev-ink)",
              boxShadow: "0 10px 30px -10px var(--elev-glow)",
            }}
          >
            ↗
          </button>
        )}
      </div>
      <button
        onClick={() => setVirada((v) => !v)}
        className="hidden shrink-0 md:block"
        style={{ width: "min(22vw, 300px)", aspectRatio: "400/710", perspective: 1400 }}
        aria-label="virar a cartinha"
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d", transition: "transform 0.8s cubic-bezier(.4,0,.2,1)", transform: virada ? "rotateY(180deg)" : "none" }}
        >
          <div
            className="absolute inset-0 flex items-end p-7 text-left text-3xl font-black leading-none"
            style={{ backfaceVisibility: "hidden", borderRadius: "12.5% / 7%", background: "var(--elev-glow)", color: "var(--elev-ink)" }}
          >
            {nome}
          </div>
          <div
            className="absolute inset-0 flex items-center p-7 text-left text-base"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "12.5% / 7%", background: "var(--elev-display)", color: "var(--elev-ink)" }}
          >
            {LOREM}
          </div>
        </div>
      </button>
    </section>
  );
}
