import { useState } from "react";
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
      { id: "cremoso", label: "Cremoso", icon: Waves },
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
      <div className="min-h-screen bg-background p-0 lg:p-5">
        <div className="mx-auto flex min-h-screen max-w-[1600px] gap-5 lg:min-h-[calc(100vh-2.5rem)]">
          {/* Ilha flutuante rosa */}
          <aside className={cn("sticky top-5 hidden h-[calc(100vh-2.5rem)] shrink-0 flex-col overflow-hidden rounded-[32px] bg-coral shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--coral)_80%,transparent)] transition-[width] duration-500 ease-in-out lg:flex", collapsed ? "w-[96px]" : "w-[272px]")}>
            <div className={cn("flex h-28 items-center", collapsed ? "justify-center px-3" : "px-7")}>
              {collapsed ? (
                <span className="font-display text-2xl font-black leading-none text-porcelain">M!</span>
              ) : (
                <div className="font-display font-black uppercase leading-[0.85] text-porcelain">
                  <div className="text-[28px] tracking-[-0.02em]">Menstru</div>
                  <div className="text-[28px] tracking-[-0.02em]">App!</div>
                </div>
              )}
            </div>

            <div className={cn("pb-4", collapsed ? "px-4" : "px-7")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label={collapsed ? "Expandir menu" : "Recolher menu"} variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className={cn("flex size-11 justify-center rounded-[15px] bg-porcelain/20 text-porcelain hover:bg-porcelain/30 hover:text-porcelain", collapsed && "mx-auto")}>
                    <span className="block size-[18px] rounded-[6px] border-2 border-porcelain" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{collapsed ? "Expandir menu" : "Recolher menu"}</TooltipContent>
              </Tooltip>
            </div>

            <nav className={cn("flex-1 space-y-2", collapsed ? "px-4" : "px-5")} aria-label="Navegação principal">
              {navItems.map((item) => {
                const Icon = item.icon;
                const selected = active === item.label;
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" onClick={() => setActive(item.label)} className={cn("h-12 w-full justify-start rounded-full px-5 text-left text-porcelain transition-all hover:text-porcelain", selected ? "bg-mauve hover:bg-mauve" : "hover:bg-porcelain/15", collapsed && "justify-center px-0")}>
                        <Icon className="size-[19px] shrink-0" />
                        <span className={cn("overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300", collapsed ? "w-0 opacity-0" : "ml-1 w-40 opacity-100")}>{item.label}</span>
                      </Button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                );
              })}
            </nav>

            <div className={cn("space-y-2 pb-5", collapsed ? "px-4" : "px-5")}>
              <Button variant="ghost" className={cn("h-12 w-full justify-start rounded-full px-5 text-left text-porcelain hover:bg-porcelain/15 hover:text-porcelain", collapsed && "justify-center px-0")}>
                <Settings className="size-[19px] shrink-0" />
                <span className={cn("overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] transition-all", collapsed ? "w-0 opacity-0" : "ml-1 w-40 opacity-100")}>Configurações</span>
              </Button>
              <div className={cn("flex h-14 items-center rounded-full bg-mauve pl-2 pr-5", collapsed && "justify-center px-0")}>
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-porcelain/25 text-porcelain"><CircleUserRound className="size-5" /></div>
                <div className={cn("overflow-hidden transition-all", collapsed ? "w-0 opacity-0" : "ml-3 w-36 opacity-100")}>
                  <p className="whitespace-nowrap text-sm font-bold text-porcelain">Letícia Motta</p>
                  <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-porcelain/80">Plano Essencial</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-x-hidden pb-28 lg:pb-0">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-background/90 px-5 backdrop-blur-xl lg:h-20 lg:px-8">
              <span className="font-display text-xl font-black uppercase tracking-[-0.02em] text-coral lg:hidden">Menstru App!</span>
              <div className="hidden items-center gap-2 lg:flex">
                <span className="rounded-full bg-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-porcelain">{totalObjects} objetos guardados hoje</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden gap-1.5 sm:flex" aria-label="Objetivo atual">
                  {["Acompanhar", "Engravidar", "Evitar"].map((item) => (
                    <Button key={item} variant="ghost" size="sm" onClick={() => setObjective(item)} className={cn("h-9 rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-porcelain hover:text-porcelain", objective === item ? "bg-coral hover:bg-coral" : "bg-muted-foreground/70 hover:bg-muted-foreground")}>{item}</Button>
                  ))}
                </div>
                <Button onClick={() => setLogOpen(true)} className="h-10 rounded-full bg-foreground px-5 text-porcelain hover:bg-foreground/90"><Plus /><span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.14em]">Registrar</span></Button>
              </div>
            </header>

            <div className="mx-auto max-w-[1360px] space-y-5 p-5 md:p-7 lg:p-8">
              {/* Hero monumental */}
              <section className="relative overflow-hidden rounded-[36px] bg-foreground px-7 pb-8 pt-7 md:px-10 md:pt-9">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-apricot px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-porcelain">Fase ovulatória</span>
                  <span className="rounded-full bg-porcelain/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-porcelain">Pico de LH hoje</span>
                </div>
                <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                  <h1 className="font-display text-[88px] font-black uppercase leading-[0.82] tracking-[-0.05em] text-porcelain md:text-[140px] xl:text-[180px]">
                    Dia<br />14<span className="text-coral">.</span>
                  </h1>
                  <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
                    <Stat icon={Thermometer} label="Temperatura" value="36,8°" tone="bg-salmon" />
                    <Stat icon={Heart} label="Chance hoje" value="32%" tone="bg-sage" />
                    <Stat icon={CalendarDays} label="Próxima menstruação" value="14 dias" tone="bg-periwinkle" />
                    <Stat icon={Activity} label="Ciclo médio" value="28 dias" tone="bg-mauve" />
                  </div>
                </div>
                <div className="mt-8 flex h-3 gap-1">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <div key={d} title={`Dia ${d}`} className={cn("flex-1 rounded-full", d <= 5 ? "bg-coral" : d < 10 ? "bg-porcelain/20" : d <= 16 ? "bg-apricot" : "bg-periwinkle", d === 14 && "scale-y-[2.2] bg-porcelain")} />
                  ))}
                </div>
              </section>

              {/* Bolsinhos */}
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {pockets.map((p) => (
                  <Pocket key={p.key} def={p} stored={stored[p.key] ?? []} onToggle={(id) => toggle(p.key, id)} />
                ))}

                <article className="rounded-[32px] bg-apricot p-7 text-porcelain md:col-span-2 xl:col-span-2">
                  <PocketHead eyebrow="Bolsinho hormonal" title="Ovulação" />
                  <div className="mt-4 h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cycleData} margin={{ top: 18, right: 4, left: 4, bottom: 0 }}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} ticks={[1, 7, 14, 21, 28]} tickFormatter={(v) => `D${v}`} tick={{ fill: "var(--porcelain)", fontSize: 10, fontWeight: 700 }} />
                        <ChartTooltip contentStyle={{ border: 0, borderRadius: 999, background: "var(--foreground)", color: "var(--porcelain)", fontSize: 12 }} labelFormatter={(l) => `Dia ${l}`} />
                        <ReferenceLine x={14} stroke="var(--porcelain)" strokeWidth={2} strokeDasharray="4 4" />
                        <Area isAnimationActive={false} type="monotone" dataKey="estrogen" name="Estrogênio" stroke="var(--porcelain)" strokeWidth={3} fill="var(--porcelain)" fillOpacity={0.18} />
                        <Area isAnimationActive={false} type="monotone" dataKey="progesterone" name="Progesterona" stroke="var(--coral)" strokeWidth={3} fill="var(--coral)" fillOpacity={0.25} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-porcelain/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">Estrogênio</span>
                    <span className="rounded-full bg-coral px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">Progesterona</span>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-[32px] bg-mauve p-7 text-porcelain md:col-span-2 xl:col-span-2">
                  <PocketHead eyebrow="Bolsinho clínico" title="Insight" />
                  <p className="mt-6 font-display text-2xl font-bold leading-tight md:text-3xl">
                    Muco em clara de ovo + LH positivo + temperatura subindo. Janela fértil aberta agora.
                  </p>
                  <Button variant="ghost" className="mt-6 h-11 w-fit rounded-full bg-porcelain/20 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-porcelain hover:bg-porcelain/30 hover:text-porcelain">
                    Ver análise completa <ArrowUpRight />
                  </Button>
                </article>
              </section>
            </div>
          </main>

          <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-full bg-coral px-2 py-2 shadow-lg lg:hidden" aria-label="Navegação móvel">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.label} variant="ghost" onClick={() => setActive(item.label)} className={cn("h-12 flex-col gap-0.5 rounded-full px-1 text-[9px] font-bold uppercase tracking-[0.08em] text-porcelain hover:text-porcelain", active === item.label ? "bg-mauve hover:bg-mauve" : "hover:bg-porcelain/15")}>
                  <Icon className="size-4" /><span className="truncate">{item.label}</span>
                </Button>
              );
            })}
            <Button variant="ghost" className="h-12 flex-col gap-0.5 rounded-full px-1 text-[9px] font-bold uppercase text-porcelain hover:bg-porcelain/15 hover:text-porcelain"><Menu className="size-4" /><span>Mais</span></Button>
          </nav>
        </div>
      </div>

      <Sheet open={logOpen} onOpenChange={setLogOpen}>
        <SheetContent side="right" className="w-full bg-background sm:max-w-md">
          <SheetHeader className="pr-8 text-left">
            <SheetTitle className="font-display text-4xl font-black uppercase leading-none tracking-[-0.03em]">Hoje.</SheetTitle>
            <SheetDescription>Dia 14 · Fase ovulatória</SheetDescription>
          </SheetHeader>
          <div className="mt-8 space-y-7">
            <LogSection icon={Droplets} title="Fluxo" options={["Sem fluxo", "Leve", "Moderado", "Intenso"]} />
            <LogSection icon={MoonStar} title="Humor" options={["Tranquila", "Sensível", "Animada", "Irritada"]} />
            <LogSection icon={Heart} title="Relação sexual" options={["Não", "Com proteção", "Sem proteção"]} />
          </div>
          <Button onClick={saveLog} className="mt-8 h-12 w-full rounded-full bg-coral text-[11px] font-bold uppercase tracking-[0.16em] text-porcelain hover:bg-coral/90">
            {saved ? <><Check /> Registro salvo</> : "Salvar registro"}
          </Button>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

function PocketHead({ eyebrow, title, count }: { eyebrow: string; title: string; count?: number }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-porcelain/85">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl font-black uppercase leading-none tracking-[-0.03em] 2xl:text-5xl break-words">{title}</h2>
      </div>
      {count !== undefined && <span className="grid size-11 shrink-0 place-items-center rounded-full bg-porcelain/25 font-display text-lg font-black">{count}</span>}
    </div>
  );
}

function Pocket({ def, stored, onToggle }: { def: PocketDef; stored: string[]; onToggle: (id: string) => void }) {
  const inside = def.objects.filter((o) => stored.includes(o.id));
  return (
    <article className={cn("flex flex-col rounded-[32px] p-7 text-porcelain", def.tone, def.span)}>
      <PocketHead eyebrow={def.eyebrow} title={def.title} count={inside.length} />
      {/* O bolsinho */}
      <div className="mt-5 flex min-h-[92px] flex-wrap content-start gap-2 rounded-[28px] bg-porcelain/20 p-3">
        {inside.length === 0 && <span className="m-auto text-[10px] font-bold uppercase tracking-[0.16em] text-porcelain/80">Bolsinho vazio</span>}
        {inside.map((o) => {
          const Icon = o.icon;
          return (
            <button key={o.id} onClick={() => onToggle(o.id)} aria-label={`Tirar ${o.label}`} className="flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-porcelain transition-transform animate-in zoom-in-50 hover:scale-105">
              <Icon className="size-4" />{o.label}
            </button>
          );
        })}
      </div>
      {/* Objetos para guardar */}
      <div className="mt-4 flex flex-wrap gap-2">
        {def.objects.filter((o) => !stored.includes(o.id)).map((o) => (
          <button key={o.id} onClick={() => onToggle(o.id)} aria-label={`Guardar ${o.label}`} className="flex h-9 items-center gap-1.5 rounded-full bg-porcelain/25 px-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-porcelain transition hover:bg-porcelain/35">
            <Plus className="size-3.5" />{o.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone: string }) {
  return (
    <div className={cn("rounded-[24px] p-4 text-porcelain", tone)}>
      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-porcelain/90"><Icon className="size-3.5" />{label}</div>
      <p className="mt-2 font-display text-2xl font-black tracking-[-0.02em]">{value}</p>
    </div>
  );
}

function LogSection({ icon: Icon, title, options }: { icon: typeof Activity; title: string; options: string[] }) {
  const [chosen, setChosen] = useState(options[0]);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em]"><Icon className="size-4 text-coral" />{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Button key={o} type="button" variant="ghost" size="sm" onClick={() => setChosen(o)} className={cn("rounded-full px-4 text-porcelain hover:text-porcelain", chosen === o ? "bg-coral hover:bg-coral" : "bg-muted-foreground/70 hover:bg-muted-foreground")}>{o}</Button>
        ))}
      </div>
    </div>
  );
}
