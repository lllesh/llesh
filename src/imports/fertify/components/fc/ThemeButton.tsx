import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
  return (
    <button
      onClick={toggle}
      className="fixed left-5 bottom-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-stroke1 bg-b-surface2 text-t-secondary hover:text-t-primary hover:shadow-hover transition"
      aria-label="Alternar tema"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
