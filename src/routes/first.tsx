import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/first")({
  head: () => ({
    meta: [
      { title: "ll e.s h — first" },
      { name: "description", content: "Galeria de cartinhas ll e.s h." },
      { property: "og:title", content: "ll e.s h — first" },
      { property: "og:description", content: "Galeria de cartinhas ll e.s h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: First,
});

const B = "https://first.lle.sh";
const IDS = ["8c1d5b21","aebe2238","0effa6ac","3df3a9f2","344f5a3d","1172f348","514e8591","d460484a","dde3dfb1","e4fad7d2","6c5a5971","a4654008","cefe1b9a","bd4de308","254b262b","bde98e81"];
const VIDEOS = new Set(["0effa6ac","3df3a9f2","8c1d5b21","aebe2238"]);

function First() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="min-h-svh w-full px-[88px] py-12" style={{ background: "#FFFFFF" }}>
      <img src={`${B}/logo-sem-bolinha-sombra-inteira.png`} alt="ll e.s h" className="h-[90px] w-auto" />
      <div className="mt-14 flex flex-wrap gap-[14px]">
        {IDS.map((id) => (
          <button key={id} onClick={() => setOpen(id)} className="overflow-hidden rounded-[14px] transition-transform hover:scale-[1.03]">
            <img src={`${B}/img/t/${id}.jpg`} alt="" className="h-[197px] w-auto object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 grid place-items-center p-10" style={{ background: "rgba(255,255,255,0.92)" }}>
          {VIDEOS.has(open) ? (
            <video src={`${B}/img/leve/${open}.mp4`} autoPlay loop playsInline className="max-h-full max-w-full rounded-[24px]" />
          ) : (
            <img src={`${B}/img/t/${open}.jpg`} alt="" className="max-h-full max-w-full rounded-[24px]" />
          )}
        </div>
      )}
    </div>
  );
}
