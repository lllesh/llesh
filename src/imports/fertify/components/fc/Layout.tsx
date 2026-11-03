import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeButton } from "./ThemeButton";
import { Bell, Search } from "lucide-react";

export function Layout({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-b-surface1 text-t-primary">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-stroke1 bg-b-surface1/80 backdrop-blur px-6 py-4">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-[13px] text-t-secondary truncate">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 h-11 w-72 rounded-full border-[1.5px] border-stroke1 bg-b-surface2 px-4 text-[13px] text-t-secondary">
              <Search size={15} />
              <input className="bg-transparent outline-none flex-1 placeholder:text-t-tertiary" placeholder="Buscar paciente, médico, ciclo..." />
            </div>
            <button className="h-11 w-11 grid place-items-center rounded-full border-[1.5px] border-stroke1 bg-b-surface2 text-t-secondary hover:text-t-primary hover:shadow-hover transition">
              <Bell size={17} />
            </button>
            {actions}
            <div className="h-11 w-11 rounded-full bg-b-dark1 text-t-light grid place-items-center font-bold">F</div>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
      <ThemeButton />
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-bb p-5 ${className}`}>{children}</div>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral"|"blue"|"green"|"red"|"amber" }) {
  const tones: Record<string,string> = {
    neutral: "bg-b-surface3 text-t-secondary",
    blue:    "bg-[color:var(--color-primary1)]/10 text-[color:var(--color-primary1)]",
    green:   "bg-[color:var(--color-primary2)]/10 text-[color:var(--color-primary2)]",
    red:     "bg-[color:var(--color-primary3)]/10 text-[color:var(--color-primary3)]",
    amber:   "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  };
  return <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
