import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/fitmail")({
  component: FitmailPage,
  head: () => ({
    meta: [
      { title: "fitmail — painel de e-mails · n o ii" },
      { name: "description", content: "Painel de administração de e-mails do ecossistema n o ii." },
      { property: "og:title", content: "fitmail — painel de e-mails · n o ii" },
      { property: "og:description", content: "Painel de administração de e-mails do ecossistema n o ii." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const BG = "#F6F4F1";
const INK = "#A9A59F";
const PILL = "#ECEAE5";

type Mail = { from: string; subject: string; preview: string; time: string; unread?: boolean };

const MAILS: Mail[] = [
  { from: "mariana@dr.marcos.med.br", subject: "resultado do exame de sangue", preview: "doutora, saiu o resultado do painel hormonal, segue em anexo o laudo...", time: "09:12", unread: true },
  { from: "fiorella", subject: "lembrete: jejum amanhã", preview: "não esquece: exame às 7h30, jejum de 8 horas. água pode...", time: "08:47", unread: true },
  { from: "camila@nutri.show", subject: "plano alimentar da semana", preview: "ajustei as porções do jantar conforme conversamos na última consulta...", time: "ontem" },
  { from: "clinica vida", subject: "confirmação de agendamento", preview: "sua consulta de retorno foi confirmada para quinta-feira às 14h...", time: "ontem" },
  { from: "joao@dra.paula.med.br", subject: "dúvida sobre medicação", preview: "a dipirona de 1g pode ser tomada junto com o anticoncepcional?...", time: "seg" },
  { from: "papelito", subject: "sua cartinha foi enviada", preview: "a cartinha para a vó helena saiu hoje de manhã e chega em 3 dias...", time: "seg" },
];

const FOLDERS = ["entrada", "enviados", "rascunhos", "arquivo", "lixeira"];

function FitmailPage() {
  const [active, setActive] = useState(0);
  const [folder, setFolder] = useState("entrada");
  const mail = MAILS[active];

  return (
    <div className="flex min-h-svh" style={{ background: BG, color: INK }}>
      {/* rail de pastas */}
      <aside className="flex w-56 shrink-0 flex-col gap-2 p-5">
        <p className="mb-4 text-2xl font-bold tracking-tight" style={{ color: "#8B8880" }}>
          fitmail
        </p>
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className="rounded-full px-5 py-3 text-left text-sm font-bold lowercase transition-all"
            style={{
              background: folder === f ? "#DEDCD6" : PILL,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,.8), 0 1px 2px rgba(0,0,0,.04)",
            }}
          >
            {f}
          </button>
        ))}
      </aside>

      {/* lista de e-mails */}
      <section className="flex w-96 shrink-0 flex-col gap-2 overflow-y-auto p-5">
        {MAILS.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-3xl p-4 text-left transition-all"
            style={{
              background: active === i ? "#DEDCD6" : PILL,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,.8), 0 1px 2px rgba(0,0,0,.04)",
            }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className={`truncate text-sm ${m.unread ? "font-bold" : "font-medium"}`} style={m.unread ? { color: "#8B8880" } : undefined}>
                {m.from}
              </span>
              <span className="shrink-0 text-xs opacity-70">{m.time}</span>
            </div>
            <p className={`mt-1 truncate text-sm ${m.unread ? "font-bold" : ""}`}>{m.subject}</p>
            <p className="mt-0.5 truncate text-xs opacity-70">{m.preview}</p>
          </button>
        ))}
      </section>

      {/* leitura */}
      <main className="flex-1 p-5">
        <div
          className="flex h-full flex-col rounded-3xl p-8"
          style={{ background: PILL, boxShadow: "inset 0 1px 2px rgba(255,255,255,.8), 0 1px 2px rgba(0,0,0,.04)" }}
        >
          <p className="text-xs lowercase opacity-70">{mail.from}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight" style={{ color: "#8B8880" }}>
            {mail.subject}
          </h1>
          <p className="mt-6 max-w-prose text-base leading-relaxed">{mail.preview}</p>
          <div className="mt-auto flex gap-3 pt-8">
            {["responder", "encaminhar", "arquivar"].map((a) => (
              <button
                key={a}
                className="rounded-full px-6 py-3 text-sm font-bold lowercase"
                style={{ background: "#DEDCD6", boxShadow: "inset 0 1px 2px rgba(255,255,255,.8)" }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
