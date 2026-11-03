import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/llesh-logo.png.asset.json";

export const Route = createFileRoute("/llesh")({
  head: () => ({
    meta: [
      { title: "ll e.s h" },
      { property: "og:title", content: "ll e.s h" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#F6F4F1" },
    ],
  }),
  component: LleshHome,
});

const INK = "#A9A59F";
const BG = "#F6F4F1";
const relevo = { background: BG, boxShadow: "inset 6px 6px 14px #DEDCD8, inset -6px -6px 14px #FFFFFF" };
const saliente = { background: BG, boxShadow: "8px 8px 18px #DEDCD8, -8px -8px 18px #FFFFFF" };

type Perm = "voz" | "vídeo" | "local";

function traduz(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "e-mail ou senha incorretos";
  if (m.includes("email not confirmed")) return "confirma seu e-mail antes de entrar";
  if (m.includes("already registered")) return "esse e-mail já tem conta";
  if (m.includes("password")) return "senha fraca: use pelo menos 8 caracteres, com letras e números";
  if (m.includes("rate limit")) return "muitas tentativas. espera um pouquinho";
  if (m.includes("invalid") && m.includes("email")) return "e-mail inválido";
  return "algo deu errado. tenta de novo";
}

function LleshHome() {
  const [mode, setMode] = useState<"criar" | "entrar">("criar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [logada, setLogada] = useState<string | null>(null);
  const [perms, setPerms] = useState<Record<Perm, boolean>>({ voz: false, vídeo: false, local: false });

  useEffect(() => {
    const h = document.documentElement, b = document.body;
    const prev: string[] = [h.style.background, b.style.background];
    h.style.background = BG; b.style.background = BG;
    // links antigos de troca de senha caem aqui: leva direto pra tela de nova senha
    if (window.location.hash.includes("type=recovery")) {
      window.location.replace("/redefinir" + window.location.hash);
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "PASSWORD_RECOVERY") window.location.replace("/redefinir");
    });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setLogada((data.user.user_metadata?.["nome"] as string) || data.user.email || "");
    });
    return () => { sub.subscription.unsubscribe(); h.style.background = prev[0] ?? ""; b.style.background = prev[1] ?? ""; };
  }, []);

  const esqueci = async () => {
    if (!email) return setAviso("escreve seu e-mail ali em cima e toca de novo");
    setBusy(true);
    setAviso(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir` });
    setBusy(false);
    if (error) return setAviso(traduz(error.message));
    setAviso("pronto. abre o link que chegou no seu e-mail (olha o spam também).");
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setAviso(null);
    try {
      if (mode === "criar") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: window.location.origin, data: { nome } },
        });
        if (error) return setAviso(traduz(error.message));
        if (data.session) setLogada(nome || email);
        else setAviso("pronto. confirma no seu e-mail e volta aqui pra entrar.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) return setAviso(traduz(error.message));
        setLogada((data.user?.user_metadata?.["nome"] as string) || email);
      }
    } finally {
      setBusy(false);
    }
  };

  const pedir = async (p: Perm) => {
    try {
      if (p === "voz") (await navigator.mediaDevices.getUserMedia({ audio: true })).getTracks().forEach((t) => t.stop());
      if (p === "vídeo") (await navigator.mediaDevices.getUserMedia({ video: true })).getTracks().forEach((t) => t.stop());
      if (p === "local") {
        if (!("geolocation" in navigator)) throw new Error("sem");
        await new Promise((ok, no) => navigator.geolocation.getCurrentPosition(ok, no, { timeout: 15000 }));
      }
      setAviso(null);
      setPerms((s) => ({ ...s, [p]: true }));
    } catch (err) {
      const code = (err as GeolocationPositionError)?.code;
      if (p === "local" && code === 1)
        setAviso("o iPhone bloqueou o local. abre Ajustes › Privacidade › Serviços de Localização › Safari e escolhe “Perguntar”.");
      else if (p === "local") setAviso("não deu pra achar o local agora. tenta de novo");
      else setAviso(`${p} não autorizado`);
    }
  };

  const campo = "h-14 w-full rounded-full px-7 text-center text-lg font-medium outline-none focus:outline-none focus-visible:outline-none placeholder:opacity-60 placeholder:text-center";

  return (
    <main className="min-h-svh flex flex-col items-center justify-center px-6 py-8" style={{ background: BG, color: INK }}>
      <div className="relative flex w-full items-center justify-center"><img src={logo.url} alt="ll e.s h" className="h-[114px] w-auto select-none" draggable={false} /></div>

      {!logada ? (
        <form onSubmit={enviar} className="mt-8 flex w-full max-w-[420px] flex-col gap-4">
          {mode === "criar" && (
            <input className={campo} style={relevo} placeholder="seu nome" aria-label="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
          )}
          <input className={campo} style={relevo} type="email" placeholder="e-mail" aria-label="e-mail" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={campo} style={relevo} type="password" placeholder="senha" aria-label="senha" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" disabled={busy} className="mt-1 h-14 rounded-full text-xl font-bold tracking-tight outline-none focus-visible:outline-none disabled:opacity-50" style={{ ...saliente, color: INK }}>
            {mode === "criar" ? "criar conta" : "entrar"}
          </button>
          <button type="button" onClick={() => { setMode(mode === "criar" ? "entrar" : "criar"); setAviso(null); }} className="self-center text-lg font-bold opacity-60 hover:opacity-100">
            {mode === "criar" ? "já tenho conta" : "criar conta"}
          </button>
          {mode === "entrar" && (
            <button type="button" disabled={busy} onClick={esqueci} className="self-center text-base font-bold opacity-50 hover:opacity-100">
              esqueci a senha
            </button>
          )}
          {aviso && <p className="text-center text-lg opacity-80">{aviso}</p>}
        </form>
      ) : (
        <section className="mt-14 flex w-full max-w-[480px] flex-col items-center gap-5">
          <p className="text-2xl font-bold tracking-tight">{logada}</p>
          {(["voz", "vídeo", "local"] as Perm[]).map((p) => (
            <button key={p} type="button" onClick={() => pedir(p)} className="flex h-14 w-full items-center justify-between rounded-full px-7 text-xl font-bold outline-none focus-visible:outline-none" style={{ ...(perms[p] ? relevo : saliente), color: INK }}>
              <span>{p}</span>
              <span aria-hidden className="h-3 w-3 rounded-full" style={perms[p] ? { background: "#C9C5BF" } : relevo} />
            </button>
          ))}
          {aviso && <p className="text-center text-lg opacity-80">{aviso}</p>}
          <a href="/menstruapp" className="mt-2 flex h-14 w-full items-center justify-center rounded-full text-xl font-bold tracking-tight" style={{ ...saliente, color: INK }}>entrar</a>
          <button type="button" onClick={async () => { await supabase.auth.signOut(); setLogada(null); }} className="mt-2 text-lg font-bold opacity-50 hover:opacity-100">sair</button>
        </section>
      )}
    </main>
  );
}
