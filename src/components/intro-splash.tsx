import { useEffect, useState } from "react";
import introVideo from "@/assets/menstruapp-intro.mp4.asset.json";

export function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const close = () => {
    setLeaving(true);
    setTimeout(() => setVisible(false), 700);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        src={introVideo.url}
        autoPlay
        muted
        playsInline
        onEnded={close}
        className="h-full w-full object-cover md:w-auto md:object-contain"
      />
      <button
        type="button"
        onClick={close}
        className="absolute bottom-8 right-8 rounded-full bg-background px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-porcelain"
      >
        Pular ↗
      </button>
    </div>
  );
}
