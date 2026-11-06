import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Depois de entrar/criar conta, a pessoa volta para o andar de onde veio (ex.: primeiro andar do elevador).
const alvoSeguro = (pedir?: string | null) =>
  pedir && pedir.startsWith("/") && !pedir.startsWith("//") ? pedir : "/menstruapp";
const pedirDe = () => new URLSearchParams(window.location.search).get("redirect");

export const Route = createFileRoute("/34")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ href: alvoSeguro(pedirDe()) });
  },
  head: () => ({
    meta: [
      { title: "n o ii | entrar" },
      { name: "description", content: "Entre no seu universo com uma conta só." },
      { property: "og:title", content: "n o ii | entrar" },
      { property: "og:description", content: "Entre no seu universo com uma conta só." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const navigate = useNavigate();
  const pedir = pedirDe();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const [nome, setNome] = useState("");
  const [aceite, setAceite] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const goHome = async () => {
    await navigate({ href: alvoSeguro(pedir) });
  };

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === "criar" && etapa < 3) {
      setNotice(null);
      setEtapa(etapa + 1);
      return;
    }
    if (mode === "criar" && !aceite) {
      setNotice("autoriza pra continuar");
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      if (mode === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setNotice(error.message);
          return;
        }
        await goHome();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { nome } },
        });
        if (error) {
          setNotice(error.message);
          return;
        }
        if (data.session) {
          await goHome();
        } else {
          setNotice("confirma no e-mail");
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const campo =
    "h-[64px] w-full rounded-full bg-foreground px-9 font-display text-[24px] font-medium lowercase tracking-[-0.01em] text-porcelain outline-none placeholder:text-porcelain/40";
  const pillBase =
    "flex h-[64px] w-full items-center justify-center rounded-full font-display text-[26px] font-black lowercase leading-none tracking-[-0.02em] transition-opacity disabled:opacity-60";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F4F1] px-6 py-16">
      <h1 className="font-display text-[110px] font-black lowercase leading-none tracking-[0.02em] text-[#1E1B18] md:text-[160px]">
        n o ii
      </h1>

      <div className="mt-14 flex w-full max-w-[520px] flex-col gap-4">


        <form onSubmit={handleEmail} className="mt-4 flex flex-col gap-4">
          {mode === "criar" && (
            <div className="mb-2 flex items-center justify-center gap-3" aria-label={`etapa ${etapa + 1} de 4`}>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-3 rounded-full bg-foreground transition-all",
                    i === etapa ? "w-10" : "w-3",
                    i > etapa && "opacity-20",
                  )}
                />
              ))}
            </div>
          )}
          {mode === "criar" && etapa === 0 && (
            <input
              key="nome"
              autoFocus
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="seu nome"
              aria-label="nome"
              className={campo}
            />
          )}
          {(mode === "entrar" || etapa === 1) && (
            <input
              key="email"
              autoFocus={mode === "criar"}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-mail"
              aria-label="e-mail"
              className={campo}
            />
          )}
          {(mode === "entrar" || etapa === 2) && (
            <input
              key="senha"
              autoFocus={mode === "criar"}
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="senha"
              aria-label="senha"
              className={campo}
            />
          )}
          {mode === "criar" && etapa === 3 && (
            <button
              type="button"
              onClick={() => setAceite(!aceite)}
              aria-pressed={aceite}
              className={cn(
                "flex h-[64px] w-full items-center gap-4 rounded-full bg-foreground px-6 font-display text-[22px] font-bold lowercase text-porcelain",
              )}
            >
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-porcelain text-foreground", !aceite && "opacity-30")}>
                {aceite ? "✓" : ""}
              </span>
              autorizo guardar meus dados
            </button>
          )}
          <button
            type="submit"
            disabled={busy}
            className={cn(pillBase, "bg-coral text-porcelain hover:opacity-90")}
          >
            {mode === "entrar" ? "entrar" : etapa < 3 ? "→" : "criar"}
          </button>
        </form>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setNotice(null);
            if (mode === "criar" && etapa > 0) {
              setEtapa(etapa - 1);
              return;
            }
            setEtapa(0);
            setMode(mode === "entrar" ? "criar" : "entrar");
          }}
          className="mt-2 self-center font-display text-[18px] font-bold lowercase tracking-[0.04em] text-foreground/60 hover:text-foreground"
        >
          {mode === "entrar" ? "criar conta" : "voltar"}
        </button>

        {notice && (
          <p className="self-center font-display text-[18px] font-bold lowercase tracking-[-0.01em] text-coral">
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}
