import { useState, type ReactElement } from "react";
import {
  Activity, ArrowUpRight, BarChart3, BookOpen, CalendarDays, Check, CircleUserRound, Droplet,
  Droplets, Flame, Heart, Home, Menu, MoonStar, Plus, Settings, Sparkles, Thermometer, Waves, Zap,
} from "lucide-react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip as ChartTooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Visão geral", icon: Home },
  { label: "Meu ciclo", icon: CalendarDays },
  { label: "Ovulação", icon: Activity },
  { label: "Sintomas", icon: Droplets },
  { label: "Bio-dados", icon: BarChart3 },
  { label: "Conteúdos", icon: BookOpen },
];

const cycleData = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const estrogen = 35 + 57 * Math.exp(-Math.pow(day - 13, 2) / 18) + 16 * Math.exp(-Math.pow(day - 21, 2) / 20);
  const progesterone = 18 + (day > 13 ? 57 * Math.exp(-Math.pow(day - 21, 2) / 30) : 0);
  return { day, estrogen: Math.round(estrogen), progesterone: Math.round(progesterone) };
});

type Obj = { id: string; label: string; icon: typeof Activity };
type PocketDef = { key: string; title: string; eyebrow: string; tone: string; objects: Obj[]; span: string };

const pockets: PocketDef[] = [
  {
    key: "sangue", title: "Sangue", eyebrow: "Bolsinho de fluxo", tone: "bg-coral", span: "md:col-span-2 xl:col-span-2",
    objects: [
      { id: "spotting", label: "Spotting", icon: Droplet },
      { id: "leve", label: "Leve", icon: Droplet },
      { id: "moderado", label: "Moderado", icon: Droplets },
      { id: "intenso", label: "Intenso", icon: Droplets },
      { id: "coagulos", label: "Coágulos", icon: Flame },
    ],
  },
  {
    key: "muco", title: "Muco", eyebrow: "Bolsinho cervical", tone: "bg-sage", span: "",
    objects: [
      { id: "seco", label: "Seco", icon: Waves },
      { id: "clara", label: "Clara de ovo", icon: Sparkles },
    ],
  },
  {
    key: "sintomas", title: "Sintomas", eyebrow: "Bolsinho do corpo", tone: "bg-periwinkle", span: "",
    objects: [
      { id: "colica", label: "Cólica", icon: Zap },
      { id: "mamas", label: "Mamas sensíveis", icon: Heart },
      { id: "cefaleia", label: "Cefaleia", icon: Flame },
      { id: "humor", label: "Humor", icon: MoonStar },
    ],
  },
];

export function FilhappDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Visão geral");
  const [objective, setObjective] = useState("Engravidar");
  const [logOpen, setLogOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stored, setStored] = useState<Record<string, string[]>>({ sangue: ["leve"], muco: ["clara"], sintomas: ["colica"] });

  const toggle = (pocket: string, id: string) =>
    setStored((s) => {
      const cur = s[pocket] ?? [];
      return { ...s, [pocket]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });

  const saveLog = () => { setSaved(true); window.setTimeout(() => { setLogOpen(false); setSaved(false); }, 900); };
  const totalObjects = Object.values(stored).flat().length;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background p-0 lg:h-screen lg:overflow-hidden lg:p-5">
        <div className="flex min-h-screen gap-5 lg:h-full lg:min-h-0">
          {/* Ilha flutuante */}
          <aside className={cn("hidden h-full shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-[32px] bg-coral py-7 transition-[width] duration-500 ease-in-out lg:flex", collapsed ? "w-[104px]" : "w-[380px]")}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              className={cn("shrink-0 whitespace-nowrap px-4 text-center font-display font-black lowercase leading-none tracking-[-0.05em] text-background transition-opacity hover:opacity-80", collapsed ? "text-[52px]" : "text-[58px]")}
            >
              {collapsed ? "m!" : "menstruapp!"}
            </button>

            <nav className="mt-7 space-y-1 px-4" aria-label="Navegação principal">
              {navItems.map((item) => {
                const selected = active === item.label;
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" onClick={() => setActive(item.label)} className={cn("flex h-[60px] w-full justify-center rounded-full px-0 font-display text-[50px] font-black lowercase leading-none tracking-[-0.04em] text-porcelain transition-all hover:text-porcelain", selected ? "bg-foreground hover:bg-foreground" : "hover:bg-porcelain/15")}>
                        <span className={cn("-translate-y-[0.04em]", collapsed ? "text-center" : "w-[270px] text-left")}>{collapsed ? item.label.charAt(0) : item.label}</span>
                      </Button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                );
              })}
            </nav>

            <div className={cn("flex flex-1 flex-col justify-center gap-1 py-5", collapsed ? "hidden" : "px-4")}>
              {[
                { label: "Temperatura basal", value: "36,8°" },
                { label: "Chance de engravidar hoje", value: "32%" },
                { label: "Próxima menstruação", value: "14 dias" },
              ].map((m) => (
                <Tooltip key={m.label}>
                  <TooltipTrigger asChild>
                    <div className="flex h-[60px] shrink-0 items-center justify-center rounded-full bg-foreground text-porcelain">
                      <span className="font-display text-[44px] font-black lowercase leading-none tracking-[-0.02em]">{m.value}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{m.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            {collapsed && <div className="flex-1" />}

            <div className="shrink-0 px-4">
              <button aria-label="Letícia Motta" className={cn("flex h-[60px] w-full items-center rounded-full bg-foreground text-porcelain transition-transform hover:scale-[1.02]", collapsed ? "justify-center" : "justify-start gap-4 pl-[7px] pr-6")}>
                <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-porcelain/10 text-porcelain"><CircleUserRound className="size-6" strokeWidth={1.8} /></span>
                {!collapsed && <span className="-translate-y-[0.04em] truncate font-display text-[36px] font-black lowercase leading-none tracking-[-0.04em]">letícia motta</span>}
              </button>
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-x-hidden pb-28 lg:h-full lg:overflow-y-auto lg:rounded-[32px] lg:pb-0">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-background/90 px-5 backdrop-blur-xl lg:hidden">
              <span className="font-display text-xl font-black lowercase tracking-[-0.03em] text-coral">menstruapp!</span>
              <Button onClick={() => setLogOpen(true)} aria-label="Hoje" className="size-10 rounded-full bg-coral p-0 text-porcelain hover:bg-coral/90"><Plus /></Button>
            </header>

            <div className="space-y-5 p-5 md:p-7 lg:p-0">
              {/* Hero monumental — palco generoso */}
              <section className="relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[36px] bg-foreground px-8 pb-10 pt-24 md:px-14 md:pb-12">
                <div className="absolute right-8 top-8 flex flex-wrap items-center justify-end gap-2 md:right-10 md:top-10">
                  <span className="rounded-full bg-apricot px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-porcelain">Fase ovulatória</span>
                  <span className="rounded-full bg-porcelain/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-porcelain">Pico de LH</span>
                </div>
                <h1 className="whitespace-nowrap font-display text-[96px] font-black lowercase leading-[0.8] tracking-[-0.06em] text-porcelain md:text-[170px] xl:text-[220px]">
                  dia 14<span className="ml-[0.06em] text-coral">.</span>
                </h1>
                <div className="mt-10 flex w-full items-center justify-between px-6">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <span key={d} title={`Dia ${d}`} className={cn("block shrink-0 rounded-full", d === 14 ? "size-4 animate-today-glow bg-mauve" : cn("size-2.5", d <= 5 ? "bg-coral" : d < 10 ? "bg-porcelain/25" : d <= 16 ? "bg-apricot" : "bg-periwinkle"))} />
                  ))}
                </div>
              </section>

              <section className="grid gap-5 md:grid-cols-2">
                {/* Ovulação — o ato canônico, logo abaixo do dia 14 */}
                <article className="overflow-hidden rounded-[32px] bg-apricot pt-8 text-porcelain md:col-span-2">
                  <div className="flex items-start justify-between gap-4 px-8">
                    <PocketHead title="Ovulação" />
                    <div className="flex gap-2 pt-2">
                      <span className="flex items-center gap-2 rounded-full bg-foreground/40 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]"><i className="block size-2 rounded-full bg-porcelain" />Estrogênio</span>
                      <span className="flex items-center gap-2 rounded-full bg-foreground/40 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]"><i className="block size-2 rounded-full bg-foreground" />Progesterona</span>
                    </div>
                  </div>
                  <div className="mt-4 h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cycleData} margin={{ top: 12, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gEst" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--porcelain)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--porcelain)" stopOpacity={0} /></linearGradient>
                          <linearGradient id="gProg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} /></linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <ChartTooltip cursor={{ stroke: "var(--porcelain)", strokeWidth: 1, strokeOpacity: 0.5 }} content={<HormoneTip />} />
                        <ReferenceLine x={14} stroke="var(--porcelain)" strokeWidth={2} strokeDasharray="4 4" strokeOpacity={0.7} />
                        <Area isAnimationActive={false} type="monotone" dataKey="estrogen" name="Estrogênio" stroke="var(--porcelain)" strokeWidth={3} fill="url(#gEst)" />
                        <Area isAnimationActive={false} type="monotone" dataKey="progesterone" name="Progesterona" stroke="var(--foreground)" strokeWidth={3} fill="url(#gProg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                {pockets.map((p) => (
                  <Pocket key={p.key} def={p} stored={stored[p.key] ?? []} onToggle={(id) => toggle(p.key, id)} />
                ))}

                <article className="flex flex-col justify-between rounded-[32px] bg-mauve p-8 text-porcelain md:col-span-2">
                  <PocketHead title="Insight" />
                  <p className="mt-5 max-w-3xl font-display text-2xl font-bold leading-tight md:text-3xl">
                    Muco em clara de ovo, LH positivo, temperatura subindo. Janela fértil aberta agora.
                  </p>
                  <Button variant="ghost" aria-label="Abrir" className="mt-8 size-12 rounded-full bg-porcelain/20 p-0 text-porcelain hover:bg-porcelain/30 hover:text-porcelain">
                    <ArrowUpRight className="size-6" strokeWidth={1.5} />
                  </Button>
                </article>
              </section>
            </div>
          </main>

          <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-full bg-coral px-2 py-2 shadow-lg lg:hidden" aria-label="Navegação móvel">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.label} variant="ghost" onClick={() => setActive(item.label)} className={cn("h-12 flex-col gap-0.5 rounded-full px-1 text-[9px] font-bold lowercase tracking-[0.08em] text-porcelain hover:text-porcelain", active === item.label ? "bg-mauve hover:bg-mauve" : "hover:bg-porcelain/15")}>
                  <Icon className="size-4" /><span className="truncate">{item.label}</span>
                </Button>
              );
            })}
            <Button variant="ghost" className="h-12 flex-col gap-0.5 rounded-full px-1 text-[9px] font-bold lowercase text-porcelain hover:bg-porcelain/15 hover:text-porcelain"><Menu className="size-4" /><span>Mais</span></Button>
          </nav>
        </div>
      </div>

      <Sheet open={logOpen} onOpenChange={setLogOpen}>
        <SheetContent side="right" className="w-full bg-background sm:max-w-md">
          <SheetHeader className="pr-8 text-left">
            <SheetTitle className="font-display text-4xl font-black lowercase leading-none tracking-[0.02em]">Hoje.</SheetTitle>
            <SheetDescription>Dia 14 · Fase ovulatória</SheetDescription>
          </SheetHeader>
          <div className="mt-8 space-y-7">
            <LogSection icon={Droplets} title="Fluxo" options={["Sem fluxo", "Leve", "Moderado", "Intenso"]} />
            <LogSection icon={MoonStar} title="Humor" options={["Tranquila", "Sensível", "Animada", "Irritada"]} />
            <LogSection icon={Heart} title="Relação sexual" options={["Não", "Com proteção", "Sem proteção"]} />
          </div>
          <Button onClick={saveLog} aria-label="Salvar" className={cn("mx-auto mt-10 flex size-14 rounded-full bg-coral p-0 text-porcelain transition-transform hover:bg-coral/90", saved && "scale-90")}>
            <Check className="size-6" strokeWidth={3} />
          </Button>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

function EggIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path d="M24 4c11 0 20 7 20 17 0 12-9 23-21 23S4 35 6 24C8 12 14 4 24 4Z" fill="currentColor" opacity="0.35" />
      <circle cx="25" cy="24" r="8" fill="currentColor" />
    </svg>
  );
}

const titleIcons: Record<string, (p: { className?: string }) => ReactElement> = {
  sangue: ({ className }) => <Droplet className={className} fill="currentColor" strokeWidth={0} />,
  muco: EggIcon,
};

function PocketHead({ title, iconKey }: { title: string; iconKey?: string }) {
  const Icon = iconKey ? titleIcons[iconKey] : undefined;
  return (
    <div className="flex items-center gap-3">
      <h2 className="min-w-0 break-words font-display text-[56px] font-black lowercase leading-[0.85] tracking-[-0.04em] 2xl:text-[72px]">{title}</h2>
      {Icon && <Icon className="size-11 shrink-0 2xl:size-14" />}
    </div>
  );
}

function HormoneTip({ active, payload, label }: { active?: boolean; payload?: { name?: string; value?: number }[]; label?: number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[210px] rounded-[24px] bg-foreground px-6 py-5 text-porcelain shadow-2xl">
      <p className="font-display text-[28px] font-black lowercase leading-none tracking-[-0.04em]">dia {label}<span className="text-coral">.</span></p>
      <div className="mt-4 flex flex-col gap-2">
        {payload.map((p) => (
          <p key={p.name} className="flex items-center justify-between gap-6 leading-none">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-porcelain/60">{p.name}</span>
            <span className="font-display text-[20px] font-black leading-none tracking-[-0.02em]">{p.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function Pocket({ def, stored, onToggle }: { def: PocketDef; stored: string[]; onToggle: (id: string) => void }) {
  const inside = def.objects.filter((o) => stored.includes(o.id));
  return (
    <article className={cn("flex flex-col rounded-[32px] p-8 text-porcelain", def.tone, def.span)}>
      <PocketHead title={def.title} iconKey={def.key} />
      {/* O bolsinho */}
      <div className="mt-5 flex min-h-[56px] flex-wrap items-center content-center gap-2 rounded-full bg-foreground/80 px-3 py-2.5">
        {inside.map((o) => (
          <button key={o.id} onClick={() => onToggle(o.id)} aria-label={`Tirar ${o.label}`} className="flex h-9 items-center rounded-full bg-background px-6 text-[15px] font-black uppercase leading-none tracking-[0.14em] text-porcelain transition-transform animate-in zoom-in-50 hover:scale-105">
            {o.label}
          </button>
        ))}
      </div>
      {/* Objetos para guardar */}
      <div className="mt-3 flex flex-wrap gap-2">
        {def.objects.filter((o) => !stored.includes(o.id)).map((o) => (
          <button key={o.id} onClick={() => onToggle(o.id)} aria-label={`Guardar ${o.label}`} className="flex h-10 items-center rounded-full bg-foreground/25 px-4 text-[12px] font-black uppercase tracking-[0.12em] text-porcelain transition hover:bg-foreground/40">
            {o.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone: string }) {
  return (
    <div className={cn("rounded-[24px] p-4 text-porcelain", tone)}>
      <div className="flex items-center gap-2 text-[9px] font-bold lowercase tracking-[0.14em] text-porcelain/90"><Icon className="size-3.5" />{label}</div>
      <p className="mt-2 font-display text-2xl font-black tracking-[-0.02em]">{value}</p>
    </div>
  );
}

function LogSection({ icon: Icon, title, options }: { icon: typeof Activity; title: string; options: string[] }) {
  const [chosen, setChosen] = useState(options[0]);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold lowercase tracking-[0.16em]"><Icon className="size-4 text-coral" />{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Button key={o} type="button" variant="ghost" size="sm" onClick={() => setChosen(o)} className={cn("rounded-full px-4 text-porcelain hover:text-porcelain", chosen === o ? "bg-coral hover:bg-coral" : "bg-muted-foreground/70 hover:bg-muted-foreground")}>{o}</Button>
        ))}
      </div>
    </div>
  );
}
