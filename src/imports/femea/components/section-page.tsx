import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { AppShell } from "./app-shell";

type Suggestion = {
  title: string;
  prompt: string;
};

export type SectionConfig = {
  eyebrow: string;
  title: string;
  description: string;
  suggestions: Suggestion[];
};

export function SectionPage({ config }: { config: SectionConfig }) {
  const [input, setInput] = useState("");

  return (
    <AppShell>
      <div className="mx-auto flex h-full min-h-[calc(100vh-0px)] w-full max-w-4xl flex-col px-5 py-10 md:px-10 md:py-14">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {config.eyebrow}
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            {config.title}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {config.description}
          </p>
        </header>

        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {config.suggestions.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setInput(s.prompt)}
              className="group flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-primary-soft/30"
            >
              <span className="text-sm font-semibold text-foreground">{s.title}</span>
              <span className="text-xs text-muted-foreground">{s.prompt}</span>
            </button>
          ))}
        </section>

        <div className="mt-auto pt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setInput("");
            }}
            className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder={`Pergunte sobre ${config.eyebrow.toLowerCase()}...`}
              className="min-h-[44px] max-h-40 w-full resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            As respostas usam a obra FEMEA como base de referência clínica.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
