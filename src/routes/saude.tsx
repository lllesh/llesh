import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/saude")({
  head: () => ({
    meta: [
      { title: "SAUDE.SHOW — sua marca, seu portal, sua concierge" },
      {
        name: "description",
        content:
          "Plataforma própria com a sua marca: portal privativo, e-mail para cada cliente e uma concierge virtual dedicada. Para médicos, nutris, psicólogos e advogados.",
      },
      { property: "og:title", content: "SAUDE.SHOW — seu atendimento é um show" },
      {
        property: "og:description",
        content: "Portal com a sua marca, e-mail para cada cliente e concierge dedicada. Turma fundadora aberta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SaudeShow,
});

const entregas = [
  { t: "sua marca", d: "domínio, logo e cores seus. o cliente só enxerga você." },
  { t: "e-mail pra cada cliente", d: "mariana@dr.marcos.med.br — conduta registrada, com data e hora." },
  { t: "concierge dedicada", d: "uma por cliente. você dá o nome. a minha é Fiorella." },
  { t: "tudo num lugar", d: "exames, conversas, agenda e lembretes. fim do WhatsApp de domingo." },
];

const lembretes = [
  "quarta tem exame, hein?",
  "jejum de 8h a partir de agora.",
  "falta 1 hora. leva o pedido.",
  "laudo chegou. já organizei pro doutor.",
];

const marcas = ["dr.show", "dra.show", "nutri.show", "psi.show"];

function SaudeShow() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 md:px-12">
        <span className="font-display text-2xl font-black tracking-tight">
          saude<span className="text-primary">.</span>show
        </span>
        <a
          href="#fundador"
          className="rounded-full bg-primary px-6 py-3 font-display text-sm font-black text-primary-foreground"
        >
          fundador ↗
        </a>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-12 md:pt-20">
        <div className="flex flex-wrap gap-3">
          {marcas.map((m) => (
            <span key={m} className="rounded-full bg-secondary px-4 py-1.5 font-display text-sm font-black text-secondary-foreground">
              {m}
            </span>
          ))}
        </div>
        <h1 className="mt-12 font-display text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl lg:text-9xl">
          seu atendimento
          <br />
          não é zap.
          <br />
          <span className="text-primary">é um show.</span>
        </h1>
        <p className="mt-12 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          Uma plataforma inteira com o seu nome. Cada cliente ganha login, e-mail e uma concierge só dela.
          Nossa marca nem aparece.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-2 md:px-12">
        {entregas.map((e, i) => (
          <div
            key={e.t}
            className={`rounded-[2.5rem] p-10 md:p-12 ${i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            <h2 className="font-display text-4xl font-black leading-none tracking-[-0.03em] md:text-5xl">{e.t}</h2>
            <p className="mt-6 text-lg opacity-90">{e.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="rounded-[2.5rem] bg-card p-10 text-card-foreground md:p-16">
          <h2 className="font-display text-5xl font-black leading-none tracking-[-0.03em] md:text-7xl">
            alguém acompanhando.
          </h2>
          <div className="mt-12 flex flex-col gap-4">
            {lembretes.map((l) => (
              <span key={l} className="w-fit rounded-full bg-primary px-6 py-3 font-display text-xl font-black text-primary-foreground md:text-2xl">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="rounded-[2.5rem] bg-primary p-10 text-primary-foreground md:p-16">
          <h2 className="font-display text-5xl font-black leading-none tracking-[-0.03em] md:text-7xl">
            o bolo é de quem responde.
          </h2>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed opacity-90 md:text-2xl">
            Suas respostas viram envelopinhos. Cada envelope aberto conta pra você. O que a plataforma arrecada com
            conhecimento vai para um fundo dividido entre os profissionais de dentro.
          </p>
          <p className="mt-6 text-base opacity-75">regras do fundo em definição com a turma fundadora.</p>
        </div>
      </section>

      <Formulario />

      <footer className="mx-auto max-w-7xl px-6 py-12 text-sm text-muted-foreground md:px-12">
        powered by n o ii
      </footer>
    </main>
  );
}

function Formulario() {
  const [estado, setEstado] = useState<"livre" | "enviando" | "ok" | "erro">("livre");

  async function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    setEstado("enviando");
    const { error } = await (supabase as any).from("fundadores").insert({
      nome: v("nome"),
      profissao: v("profissao"),
      registro: v("registro") || null,
      whatsapp: v("whatsapp"),
      email: v("email"),
      dominio_desejado: v("dominio") || null,
      nome_assistente: v("assistente") || null,
    });
    setEstado(error ? "erro" : "ok");
  }

  const campo =
    "h-16 w-full rounded-full bg-secondary px-7 font-display text-lg font-bold text-secondary-foreground placeholder:text-secondary-foreground/50 outline-none focus:ring-2 focus:ring-ring";

  return (
    <section id="fundador" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <div className="rounded-[2.5rem] bg-card p-10 text-card-foreground md:p-16">
        <h2 className="font-display text-5xl font-black leading-none tracking-[-0.03em] md:text-7xl">turma fundadora.</h2>
        {estado === "ok" ? (
          <p className="mt-10 font-display text-3xl font-black text-primary">recebido. seu núcleo está sendo preparado.</p>
        ) : (
          <form onSubmit={enviar} className="mt-12 grid gap-4 md:grid-cols-2">
            <input name="nome" required minLength={2} maxLength={120} placeholder="nome" className={campo} />
            <select name="profissao" required defaultValue="" className={campo}>
              <option value="" disabled>profissão</option>
              {["médico(a)", "nutricionista", "psicólogo(a)", "advogado(a)", "terapeuta", "outra"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <input name="registro" maxLength={40} placeholder="CRM / CRN / CRP / OAB" className={campo} />
            <input name="whatsapp" required minLength={8} maxLength={30} placeholder="whatsapp" className={campo} />
            <input name="email" type="email" required maxLength={200} placeholder="e-mail atual" className={campo} />
            <input name="dominio" maxLength={120} placeholder="domínio dos sonhos (marcos.doctor)" className={campo} />
            <input name="assistente" maxLength={40} placeholder="nome da sua concierge" className={campo} />
            <button
              disabled={estado === "enviando"}
              aria-label="enviar"
              className="h-16 w-16 justify-self-end rounded-full bg-primary font-display text-2xl font-black text-primary-foreground disabled:opacity-50"
            >
              ✓
            </button>
            {estado === "erro" && <p className="text-primary md:col-span-2">não foi. tenta de novo.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
