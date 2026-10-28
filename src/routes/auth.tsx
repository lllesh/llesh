import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/menstruapp" });
  },
  head: () => ({
    meta: [
      { title: "lle.sh | entrar" },
      { name: "description", content: "Entre no seu universo com uma conta só." },
      { property: "og:title", content: "lle.sh | entrar" },
      { property: "og:description", content: "Entre no seu universo com uma conta só." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthScreen,
});

async function oauthSignIn(provider: "google" | "lovable") {
  return lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
}

function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const goHome = async () => {
    await navigate({ to: "/menstruapp" });
  };

  const handleOAuth = async (provider: "google" | "lovable") => {
    setBusy(true);
    setNotice(null);
    try {
      const result = await oauthSignIn(provider);
      if (result.error) {
        setNotice(result.error.message);
        return;
      }
      if (!result.redirected) await goHome();
    } finally {
      setBusy(false);
    }
  };

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault();
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
          options: { emailRedirectTo: window.location.origin },
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

  const pillBase =
    "flex h-[64px] w-full items-center justify-center rounded-full font-display text-[26px] font-black lowercase leading-none tracking-[-0.02em] transition-opacity disabled:opacity-60";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F4F1] px-6 py-16">
      <h1 className="font-display text-[110px] font-black lowercase leading-none tracking-[0.02em] text-[#1E1B18] md:text-[160px]">
        n o ii
      </h1>

      <div className="mt-14 flex w-full max-w-[520px] flex-col gap-4">


        <form onSubmit={handleEmail} className="mt-4 flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e-mail"
            aria-label="e-mail"
            className="h-[64px] w-full rounded-full bg-foreground px-9 font-display text-[24px] font-medium lowercase tracking-[-0.01em] text-porcelain outline-none placeholder:text-porcelain/40"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="senha"
            aria-label="senha"
            className="h-[64px] w-full rounded-full bg-foreground px-9 font-display text-[24px] font-medium lowercase tracking-[-0.01em] text-porcelain outline-none placeholder:text-porcelain/40"
          />
          <button
            type="submit"
            disabled={busy}
            className={cn(pillBase, "bg-coral text-porcelain hover:opacity-90")}
          >
            {mode === "entrar" ? "entrar" : "criar"}
          </button>
        </form>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setMode(mode === "entrar" ? "criar" : "entrar");
            setNotice(null);
          }}
          className="mt-2 self-center font-display text-[18px] font-bold lowercase tracking-[0.04em] text-porcelain/50 hover:text-porcelain"
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
