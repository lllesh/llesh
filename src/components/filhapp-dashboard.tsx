import { useState } from "react";
import {
  Activity, Baby, BarChart3, BookOpen, CalendarDays, Check, ChevronLeft,
  ChevronRight, CircleUserRound, Droplets, Heart, Home, Menu, MoonStar,
  Plus, Settings, Sparkles, Target, Thermometer, TrendingUp, X, Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Visão geral", icon: Home },
  { label: "Meu ciclo", icon: CalendarDays },
  { label: "Fertilidade", icon: Activity },
  { label: "Plano de filhos", icon: Baby },
  { label: "Bio-dados", icon: BarChart3 },
  { label: "Conteúdos", icon: BookOpen },
];

const cycleData = Array.from({ length: 28 }, (_, index) => {
  const day = index + 1;
  const estrogen = 35 + 57 * Math.exp(-Math.pow(day - 13, 2) / 18) + 16 * Math.exp(-Math.pow(day - 21, 2) / 20);
  const progesterone = 18 + (day > 13 ? 57 * Math.exp(-Math.pow(day - 21, 2) / 30) : 0);
  const temperature = 36.25 + (day > 14 ? 0.38 : 0.03 * Math.sin(day));
  return { day, estrogen: Math.round(estrogen), progesterone: Math.round(progesterone), temperature };
});

const days = Array.from({ length: 28 }, (_, i) => i + 1);

export function FilhappDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Visão geral");
  const [objective, setObjective] = useState("Engravidar");
  const [logOpen, setLogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveLog = () => {
    setSaved(true);
    window.setTimeout(() => { setLogOpen(false); setSaved(false); }, 900);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-stone p-0 lg:p-5 xl:p-8">
        <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-background shadow-[0_30px_80px_-28px_color-mix(in_oklab,var(--sage)_45%,transparent)] lg:min-h-[calc(100vh-2.5rem)] lg:rounded-3xl lg:border lg:border-porcelain xl:min-h-[calc(100vh-4rem)]">
          <aside className={cn("relative hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-500 ease-in-out lg:flex", collapsed ? "w-[88px]" : "w-[260px]")}>
            <div className={cn("flex h-24 items-center", collapsed ? "justify-center px-3" : "px-6")}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_24px_-10px_color-mix(in_oklab,var(--coral)_75%,transparent)]">
                <Baby className="size-5" />
              </div>
              <div className={cn("ml-3 overflow-hidden transition-all duration-300", collapsed ? "w-0 opacity-0" : "w-40 opacity-100")}>
                <div className="font-display text-xl font-bold tracking-[0.24em] text-foreground">FILHAPP</div>
                <div className="whitespace-nowrap text-[10px] font-semibold uppercase text-muted-foreground">Saúde reprodutiva</div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label={collapsed ? "Expandir menu" : "Recolher menu"} variant="ghost" onClick={() => setCollapsed(!collapsed)} className={cn("h-10 w-full rounded-xl border border-sidebar-border bg-porcelain/60 text-muted-foreground hover:bg-muted hover:text-foreground", collapsed ? "justify-center px-0" : "justify-between px-3")}>
                    {!collapsed && <span className="text-[10px] font-bold uppercase tracking-[0.16em]">Recolher</span>}
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{collapsed ? "Expandir menu" : "Recolher menu"}</TooltipContent>
              </Tooltip>
            </div>

            <nav className="flex-1 space-y-2 px-4" aria-label="Navegação principal">
              {navItems.map((item) => {
                const Icon = item.icon;
                const selected = active === item.label;
                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" onClick={() => setActive(item.label)} className={cn("h-12 w-full justify-start rounded-xl px-4 transition-all", selected ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground", collapsed && "justify-center px-0")}>
                        <Icon className="size-[19px] shrink-0" />
                        <span className={cn("overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] transition-all duration-300", collapsed ? "w-0 opacity-0" : "ml-1 w-40 opacity-100")}>{item.label}</span>
                      </Button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                );
              })}
            </nav>

            <div className="space-y-3 border-t border-sidebar-border p-4">
              <Button variant="ghost" className={cn("h-11 w-full justify-start rounded-xl text-muted-foreground", collapsed && "justify-center px-0")}><Settings /><span className={cn("overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] transition-all", collapsed ? "w-0 opacity-0" : "ml-1 w-36 opacity-100")}>Configurações</span></Button>
              <div className={cn("flex items-center rounded-xl bg-porcelain p-3", collapsed && "justify-center p-2")}>
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-mauve/25 text-mauve"><CircleUserRound className="size-5" /></div>
                <div className={cn("ml-3 overflow-hidden transition-all", collapsed ? "w-0 opacity-0" : "w-36 opacity-100")}><p className="whitespace-nowrap text-sm font-bold">Letícia Motta</p><p className="whitespace-nowrap text-xs text-sage">Plano Essencial</p></div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-x-hidden pb-24 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto lg:pb-0 xl:max-h-[calc(100vh-4rem)]">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-xl lg:h-20 lg:px-8 xl:px-10">
              <div className="flex items-center gap-3 lg:hidden"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Baby className="size-4" /></div><span className="font-display text-lg font-bold tracking-[0.22em]">FILHAPP</span></div>
              <div className="hidden items-center gap-2 lg:flex"><span className="size-2 rounded-full bg-sage"/><span className="text-xs font-semibold text-muted-foreground">Seus dados estão atualizados</span></div>
              <div className="flex items-center gap-2">
                <div className="hidden rounded-xl bg-muted p-1 sm:flex" aria-label="Objetivo atual">
                  {["Acompanhar", "Engravidar", "Evitar"].map((item) => <Button key={item} variant="ghost" size="sm" onClick={() => setObjective(item)} className={cn("rounded-lg px-3 text-xs", objective === item && "bg-card text-foreground shadow-sm")}>{item}</Button>)}
                </div>
                <Button onClick={() => setLogOpen(true)} className="h-10 rounded-xl px-4 shadow-[0_10px_22px_-10px_color-mix(in_oklab,var(--coral)_85%,transparent)]"><Plus /> <span className="hidden sm:inline">Registrar hoje</span></Button>
              </div>
            </header>

            <div className="mx-auto max-w-[1340px] space-y-6 p-5 md:p-7 lg:p-8 xl:p-10">
              <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div><div className="mb-3 flex items-center gap-2"><span className="rounded-full bg-apricot/20 px-3 py-1 text-[10px] font-bold uppercase text-apricot">Fase ovulatória</span><span className="text-xs font-semibold text-muted-foreground">Dia 14 de 28</span></div><h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl xl:text-5xl">Sua janela mais fértil</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">Hoje sua probabilidade de concepção está no ponto mais alto deste ciclo.</p></div>
                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <Metric icon={Thermometer} label="Temperatura" value="36,8 °C" tone="salmon" />
                  <Metric icon={TrendingUp} label="Chance hoje" value="Alta · 32%" tone="sage" />
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-border p-5 md:flex-row md:items-center lg:p-6">
                  <div><h2 className="font-display text-lg font-semibold">Panorama do ciclo</h2><p className="mt-1 text-xs text-muted-foreground">Projeção hormonal baseada nos seus últimos 6 ciclos</p></div>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground"><Legend color="bg-periwinkle" label="Estrogênio"/><Legend color="bg-mauve" label="Progesterona"/><Legend color="bg-apricot" label="Ovulação prevista"/></div>
                </div>
                <div className="h-[260px] p-3 pr-5 md:h-[320px] md:p-5">
                  <ResponsiveContainer width="100%" height="100%"><AreaChart data={cycleData} margin={{ top: 15, right: 8, left: -22, bottom: 0 }}><defs><linearGradient id="estrogen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--periwinkle)" stopOpacity={0.32}/><stop offset="100%" stopColor="var(--periwinkle)" stopOpacity={0.02}/></linearGradient><linearGradient id="progesterone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--mauve)" stopOpacity={0.28}/><stop offset="100%" stopColor="var(--mauve)" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 6"/><XAxis dataKey="day" axisLine={false} tickLine={false} ticks={[1,7,14,21,28]} tickFormatter={(v) => `D${v}`} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}/><ChartTooltip contentStyle={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", fontSize: 12 }} labelFormatter={(label) => `Dia ${label}`}/><ReferenceLine x={14} stroke="var(--apricot)" strokeWidth={2} strokeDasharray="4 4" label={{ value: "Pico LH", position: "top", fill: "var(--apricot)", fontSize: 11, fontWeight: 700 }}/><Area isAnimationActive={false} type="monotone" dataKey="estrogen" stroke="var(--periwinkle)" strokeWidth={2.5} fill="url(#estrogen)"/><Area isAnimationActive={false} type="monotone" dataKey="progesterone" stroke="var(--mauve)" strokeWidth={2.5} fill="url(#progesterone)"/></AreaChart></ResponsiveContainer>
                </div>
                <div className="border-t border-border px-5 py-4"><div className="flex h-9 gap-1">{days.map(day => <div key={day} title={`Dia ${day}`} className={cn("min-w-0 flex-1 rounded-md", day <= 5 && "bg-coral/45", day > 5 && day < 10 && "bg-sage/25", day >= 10 && day <= 16 && "bg-apricot/65", day > 16 && "bg-periwinkle/30", day === 14 && "ring-2 ring-apricot ring-offset-2")} />)}</div><div className="mt-3 flex justify-between text-[10px] font-bold uppercase text-muted-foreground"><span>Menstruação</span><span>Janela fértil</span><span>Fase lútea</span></div></div>
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InsightCard icon={Target} title="Plano de concepção" eyebrow="Meta: próximos 6 meses" tone="coral"><p className="text-sm leading-relaxed text-muted-foreground">Seu timing está alinhado. Priorize relações hoje e nas próximas 24 horas.</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-coral"><Check className="size-4"/> 4 de 6 hábitos em dia</div></InsightCard>
                <InsightCard icon={Zap} title="Energia em alta" eyebrow="92% do seu padrão" tone="periwinkle"><p className="text-sm leading-relaxed text-muted-foreground">O pico hormonal favorece disposição, libido e desempenho cognitivo.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[92%] rounded-full bg-periwinkle"/></div></InsightCard>
                <InsightCard icon={Heart} title="Sinais férteis" eyebrow="3 sinais confirmados" tone="sage"><div className="space-y-2 text-sm text-muted-foreground"><Signal label="Muco cervical" value="Ideal"/><Signal label="Temperatura basal" value="Elevada"/><Signal label="Teste de LH" value="Positivo"/></div></InsightCard>
                <InsightCard icon={Sparkles} title="Insight clínico" eyebrow="Personalizado para você" tone="salmon"><p className="text-sm leading-relaxed text-muted-foreground">Seu padrão sugere ovulação regular. Mantenha hidratação e descanso para apoiar esta fase.</p><Button variant="link" className="mt-3 h-auto p-0 text-salmon">Ver análise completa <ChevronRight/></Button></InsightCard>
              </section>
            </div>
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="Navegação móvel">
            {navItems.slice(0, 4).map((item) => { const Icon=item.icon; return <Button key={item.label} variant="ghost" onClick={() => setActive(item.label)} className={cn("h-14 flex-col gap-1 rounded-xl px-1 text-[10px]", active===item.label ? "text-primary" : "text-muted-foreground")}><Icon className="size-5"/><span>{item.label.replace("Plano de filhos","Planos")}</span></Button> })}
            <Button variant="ghost" className="h-14 flex-col gap-1 rounded-xl px-1 text-[10px] text-muted-foreground"><Menu className="size-5"/><span>Mais</span></Button>
          </nav>
        </div>
      </div>

      <Sheet open={logOpen} onOpenChange={setLogOpen}><SheetContent side="right" className="w-full border-l border-border bg-background sm:max-w-md"><SheetHeader className="pr-8 text-left"><SheetTitle className="font-display text-2xl">Como você está hoje?</SheetTitle><SheetDescription>Dia 14 · Fase ovulatória</SheetDescription></SheetHeader><div className="mt-8 space-y-7"><LogSection icon={Droplets} title="Fluxo" options={["Sem fluxo","Leve","Moderado","Intenso"]}/><LogSection icon={MoonStar} title="Humor" options={["Tranquila","Sensível","Animada","Irritada"]}/><LogSection icon={Heart} title="Relação sexual" options={["Não","Com proteção","Sem proteção"]}/><div><label className="text-sm font-bold">Observações</label><textarea className="mt-3 min-h-28 w-full resize-none rounded-xl border border-input bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Algo diferente para registrar?" /></div></div><Button onClick={saveLog} className="mt-8 h-12 w-full rounded-xl">{saved ? <><Check/> Registro salvo</> : "Salvar registro"}</Button></SheetContent></Sheet>
    </TooltipProvider>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone: "salmon" | "sage" }) { return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-3 sm:min-w-44"><div className={cn("grid size-9 shrink-0 place-items-center rounded-lg", tone === "salmon" ? "bg-salmon/15 text-salmon" : "bg-sage/15 text-sage")}><Icon className="size-4"/></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase text-muted-foreground">{label}</p><p className="truncate text-sm font-bold">{value}</p></div></div> }
function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-2"><span className={cn("size-2.5 rounded-full", color)}/>{label}</span> }
function InsightCard({ icon: Icon, title, eyebrow, tone, children }: { icon: typeof Activity; title: string; eyebrow: string; tone: "coral"|"periwinkle"|"sage"|"salmon"; children: React.ReactNode }) { const tones={coral:"bg-coral/15 text-coral",periwinkle:"bg-periwinkle/15 text-periwinkle",sage:"bg-sage/15 text-sage",salmon:"bg-salmon/15 text-salmon"}; return <article className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className={cn("mb-5 grid size-10 place-items-center rounded-xl", tones[tone])}><Icon className="size-5"/></div><p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p><h3 className="mb-3 mt-1 font-display text-lg font-semibold">{title}</h3>{children}</article> }
function Signal({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-border pb-2 last:border-0"><span>{label}</span><span className="font-bold text-sage">{value}</span></div> }
function LogSection({ icon: Icon, title, options }: { icon: typeof Activity; title: string; options: string[] }) { const [chosen,setChosen]=useState(options[0]); return <div><div className="mb-3 flex items-center gap-2 text-sm font-bold"><Icon className="size-4 text-primary"/>{title}</div><div className="flex flex-wrap gap-2">{options.map(option=><Button key={option} type="button" variant={chosen===option?"default":"outline"} size="sm" onClick={()=>setChosen(option)} className="rounded-full">{option}</Button>)}</div></div> }