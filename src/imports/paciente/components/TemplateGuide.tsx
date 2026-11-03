import { useEffect, useRef, useState } from "react";

const SECTIONS: { n: string; title: string; body: string; prompt: string }[] = [
  {
    n: "01",
    title: "Troque pelas suas pacientes",
    body: "Todas as pacientes desta página são dados de demonstração. Cole uma planilha ou exportação do seu consultório no chat e peça para trocar — o gráfico, as estatísticas e a lista de atenção passam a refletir sua prática.",
    prompt: "Substitua as pacientes de demonstração pelas pacientes deste CSV.",
  },
  {
    n: "02",
    title: "Ligue uma fonte viva",
    body: "Uma colagem única é um bom começo. Quando quiser que a página se atualize sozinha, peça para conectar o diário do ciclo ou adicionar um banco de dados, e o painel passa a se atualizar automaticamente.",
    prompt: "Conecte o diário do ciclo para os dados das pacientes atualizarem sozinhos.",
  },
  {
    n: "03",
    title: "Ajuste o índice à sua prática",
    body: "O índice aqui é construído a partir de seis sinais nomeados — regularidade, sangramento, dor, TPM, diário e exames —, então todo número pode ser explicado. Diga quais sinais você de fato acompanha e o índice é reconstruído em cima deles. Não pontue o que você não mede.",
    prompt: "Refaça o índice com os sinais que eu acompanho: comprimento do ciclo, volume de fluxo e dor.",
  },
  {
    n: "04",
    title: "Guarde o histórico",
    body: "As curvas de tendência, as quedas e as projeções leem um registro semanal por paciente. Peça para salvar um registro semanal para cada paciente; as tendências se formam conforme o histórico acumula.",
    prompt: "Salve um registro semanal por paciente para as tendências se formarem com o tempo.",
  },
  {
    n: "05",
    title: "Afine os limiares",
    body: "A linha de atenção em 40, as cores de alarme e a ordem da lista de atenção são opiniões, não verdades. Conte como você pensa o risco no consultório e os limiares se ajustam.",
    prompt: "Mova o limiar de atenção para 35 e destaque pacientes sem retorno há 60 dias.",
  },
];

export function TemplateGuide() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnTo.current?.focus?.();
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-ink-faint px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:border-ink hover:text-ink"
      >
        Guia do painel
      </button>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-scrim transition-[opacity,visibility] duration-300 ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Guia do painel"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto border-l border-ink-muted bg-background sm:w-[480px] ${
          open ? "visible translate-x-0" : "pointer-events-none invisible translate-x-full"
        }`}
        style={{
          transition:
            "translate 300ms cubic-bezier(0.22, 1, 0.36, 1), visibility 300ms",
        }}
      >
        <div className="px-7 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl leading-[1.05] tracking-tight text-ink">
                Usando este painel
              </h2>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Dos dados de demonstração à sua prática
              </p>
            </div>
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              aria-label="Fechar guia do painel"
              className="-mr-1 mt-1 px-1 text-ink-faint transition-colors hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
            Você transforma este painel em seu conversando com o Lovable no chat. Sem código:
            descreva o que quer e a fiação é feita por lá. Siga estes passos.
          </p>

          <div className="mt-6 space-y-6">
            {SECTIONS.map((s) => (
              <div key={s.n}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-ink-faint tabular-nums">{s.n}</span>
                  <h3 className="font-serif text-[17px] tracking-tight text-ink">{s.title}</h3>
                </div>
                <p className="mt-1.5 pl-[30px] text-[13px] leading-relaxed text-ink-muted">
                  {s.body}
                </p>
                <p className="mt-2 pl-[30px] text-[12px] leading-relaxed text-ink-faint">
                  Experimente: <span className="italic">"{s.prompt}"</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 h-px w-full bg-rule" />
          <p className="mt-5 text-[12px] leading-relaxed text-ink-faint">
            Não sabe por onde começar? Pergunte ao Lovable: "Me guie para fazer este painel
            funcionar com os dados reais das minhas pacientes."
          </p>
        </div>
      </div>
    </>
  );
}
