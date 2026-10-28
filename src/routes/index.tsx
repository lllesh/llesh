import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/noii-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "n o ii | núcleo organizado inteligente interativo" },
      { name: "description", content: "Um lugar só para a sua vida inteira. O seu núcleo pessoal." },
      { property: "og:title", content: "n o ii | núcleo organizado inteligente interativo" },
      { property: "og:description", content: "Um lugar só para a sua vida inteira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoiiHome,
});

const portas = [
  { to: "/menstruapp", nome: "menstruapp" },
  { to: "/saude", nome: "saude.show" },
] as const;

function NoiiHome() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#F6F4F1", color: "#3A3836" }}
    >
      <img
        src={logo.url}
        alt="n o ii — núcleo organizado inteligente interativo"
        className="w-full max-w-[560px] select-none"
        draggable={false}
      />
      <nav className="mt-16 flex flex-wrap items-center justify-center gap-5">
        {portas.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="rounded-full px-10 h-16 flex items-center text-2xl font-black tracking-tight transition-transform hover:-translate-y-0.5"
            style={{
              background: "#F6F4F1",
              color: "#3A3836",
              boxShadow: "8px 8px 18px #DEDCD8, -8px -8px 18px #FFFFFF",
            }}
          >
            {p.nome}
          </Link>
        ))}
      </nav>
    </main>
  );
}
