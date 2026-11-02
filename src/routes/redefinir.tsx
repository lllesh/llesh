import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/noii-logo-relevo.png.asset.json";

export const Route = createFileRoute("/redefinir")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "n o ii | nova senha" },
      { name: "description", content: "Crie uma nova senha para a sua conta n o ii." },
      { property: "og:title", content: "n o ii | nova senha" },
      { property: "og:description", content: "Crie uma nova senha para a sua conta n o ii." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#F6F4F1" },
    ],
  }),
  component: Redefinir,
});

const INK = "#A9A59F";
const BG = "#F6F4F1";
const relevo = { background: BG, boxShadow: "inset 6px 6px 14px #DEDCD8, inset -6px -6px 14px #FFFFFF" };
const saliente = { background: BG, boxShadow: "8px 8px 18px #DEDCD8, -8px -8px 18px #FFFFFF" };

function Redefinir() {
  const navigate = useNavigate();
  const [pronta, setPronta] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [repete, setRepete] = useState("");
  const [busy, setBusy] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const h = document.documentElement, b = document.body;
    h.style.background = BG; b.style.background = BG;
    const { data } = supabase.auth.onAuthStateChange((ev, session) => {
      if (session && (ev === "PASSWORD_RECOVERY" || ev === "SIGNED_IN" || ev === "INITIAL_SESSION")) setPronta(true);
    });
    const t = setTimeout(async () => {
      const { data: s } = await supabase.auth.getSession();
      setPronta(!!s.session);
    }, 1200);
    return () => { data.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setAviso(null);
    if (senha.length < 8) return setAviso("use pelo menos 8 caracteres, com letras e números");
    if (senha !== repete) return setAviso("as duas senhas não estão iguais");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("different from the old")) return setAviso("escolhe uma senha diferente da anterior");
      if (m.includes("weak") || m.includes("password")) return setAviso("senha fraca: use letras e números, pelo menos 8 caracteres");
      return setAviso("algo deu errado. pede um link novo e tenta de novo");
    }
    await navigate({ to: "/menstruapp" });
  };

  const campo = "h-14 w-full rounded-full px-7 text-center text-lg font-medium outline-none placeholder:opacity-60";

  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-6 py-8" style={{ background: BG, color: INK }}>
      <div className="relative h-[150px] w-[260px] overflow-hidden">
        <img src={logo.url} alt="n o ii" className="absolute left-1/2 top-1/2 w-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 select-none" draggable={false} />
      </div>

      {pronta === null ? (
        <p className="mt-10 text-lg opacity-70">abrindo…</p>
      ) : pronta ? (
        <form onSubmit={salvar} className="mt-8 flex w-full max-w-[420px] flex-col gap-4">
          <p className="text-center text-2xl font-bold tracking-tight">nova senha</p>
          <input className={campo} style={relevo} type="password" placeholder="nova senha" aria-label="nova senha" autoComplete="new-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
          <input className={campo} style={relevo} type="password" placeholder="repete a senha" aria-label="repete a senha" autoComplete="new-password" required value={repete} onChange={(e) => setRepete(e.target.value)} />
          <button type="submit" disabled={busy} className="mt-1 h-14 rounded-full text-xl font-bold tracking-tight disabled:opacity-50" style={{ ...saliente, color: INK }}>
            salvar
          </button>
          {aviso && <p className="text-center text-lg opacity-80">{aviso}</p>}
        </form>
      ) : (
        <section className="mt-10 flex w-full max-w-[420px] flex-col items-center gap-5 text-center">
          <p className="text-lg opacity-80">esse link expirou ou já foi usado. pede um novo na entrada.</p>
          <a href="/" className="flex h-14 w-full items-center justify-center rounded-full text-xl font-bold" style={{ ...saliente, color: INK }}>voltar</a>
        </section>
      )}
    </main>
  );
}
