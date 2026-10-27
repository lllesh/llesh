import { useEffect, useState } from "react";
import introVideo from "@/assets/menstruapp-intro.mp4.asset.json";
import introDesk from "@/assets/menstruapp-intro-desk.mp4.asset.json";

export function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  const close = () => {
    setLeaving(true);
    setTimeout(() => setVisible(false), 700);
  };

  useEffect(() => {
    const wide = window.matchMedia("(min-aspect-ratio: 1/1)").matches;
    setSrc(wide ? introDesk.url : introVideo.url);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Entrar"
      onClick={close}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-background transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {src && (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          playsInline
          onEnded={close}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
