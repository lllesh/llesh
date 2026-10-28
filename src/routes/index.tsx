import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/noii-logo-relevo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "n o ii | núcleo organizado inteligente interativo" },
      { name: "description", content: "Crie o seu nó: um lugar só para a sua vida inteira." },
      { property: "og:title", content: "n o ii | núcleo organizado inteligente interativo" },
      { property: "og:description", content: "Crie o seu nó: um lugar só para a sua vida inteira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoiiHome,
});

const INK = "#3A3836";
const BG = "#F6F4F1";
const relevo = { background: BG, boxShadow: "inset 6px 6px 14px #DEDCD8, inset -6px -6px 14px #FFFFFF" };
const saliente = { background: BG, boxShadow: "8px 8px 18px #DEDCD8, -8px -8px 18px #FFFFFF" };

type Perm = "voz" | "vídeo" | "local";

function NoiiHome() {
  const [mode, setMode] = useState<"criar" | "entrar">("criar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [logada, setLogada] = useState<string | null>(null);
  const [perms, setPerms] = useState<Record<Perm, boolean>>({ voz: false, vídeo: false, local: false });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setLogada((data.user.user_metadata?.["nome"] as string) || data.user.email || "");
    });
  }, []);

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
        if (error) return setAviso(error.message);
        if (data.session) setLogada(nome || email);
        else setAviso("pronto. confirma no seu e-mail e volta aqui pra entrar.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) return setAviso(error.message);
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
      if (p === "local")
        await new Promise((ok, no) => navigator.geolocation.getCurrentPosition(ok, no));
      setPerms((s) => ({ ...s, [p]: true }));
    } catch {
      setAviso(`${p} não autorizado`);
    }
  };

  const campo = "h-16 w-full rounded-full px-8 text-xl outline-none placeholder:opacity-40";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ background: BG, color: INK }}>
      <img src={logo.url} alt="n o ii — núcleo organizado inteligente interativo" className="w-full max-w-[320px] select-none" draggable={false} />

      {!logada ? (
        <form onSubmit={enviar} className="mt-14 flex w-full max-w-[480px] flex-col gap-5">
          {mode === "criar" && (
            <input className={campo} style={relevo} placeholder="seu nome" aria-label="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
          )}
          <input className={campo} style={relevo} type="email" placeholder="e-mail" aria-label="e-mail" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={campo} style={relevo} type="password" placeholder="senha" aria-label="senha" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" disabled={busy} className="mt-2 h-16 rounded-full text-2xl font-black tracking-tight disabled:opacity-50" style={{ ...saliente, color: INK }}>
            {mode === "criar" ? "criar meu nó" : "entrar"}
          </button>
          <button type="button" onClick={() => { setMode(mode === "criar" ? "entrar" : "criar"); setAviso(null); }} className="self-center text-lg font-bold opacity-60 hover:opacity-100">
            {mode === "criar" ? "já tenho meu nó" : "criar meu nó"}
          </button>
          {aviso && <p className="text-center text-lg opacity-80">{aviso}</p>}
        </form>
      ) : (
        <section className="mt-14 flex w-full max-w-[480px] flex-col items-center gap-5">
          <p className="text-3xl font-black tracking-tight">{logada}</p>
          {(["voz", "vídeo", "local"] as Perm[]).map((p) => (
            <button key={p} type="button" onClick={() => pedir(p)} className="flex h-16 w-full items-center justify-between rounded-full px-8 text-2xl font-black" style={perms[p] ? relevo : saliente}>
              <span>{p}</span>
              <span>{perms[p] ? "✓" : "↗"}</span>
            </button>
          ))}
          {aviso && <p className="text-center text-lg opacity-80">{aviso}</p>}
          <button type="button" onClick={async () => { await supabase.auth.signOut(); setLogada(null); }} className="mt-4 text-lg font-bold opacity-50 hover:opacity-100">sair</button>
        </section>
      )}
    </main>
  );
}
