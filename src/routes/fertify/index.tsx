import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, Card, Pill } from "@/imports/fertify/components/fc/Layout";
import { doctors, patients, proximosEventos } from "@/imports/fertify/data/mock";
import { Plus, ArrowUpRight, AlertTriangle, ActivitySquare, Users, Stethoscope, HeartPulse, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/fertify/")({
  head: () => ({ meta: [
    { title: "Dashboard — FERTIFY Care" },
    { name: "description", content: "Centro de comando da medicina reprodutiva — pacientes, ciclos, exames e procedimentos." },
  ]}),
  component: Dashboard,
});

function Dashboard() {
  const totalPacientes = doctors.reduce((a, d) => a + d.pacientes, 0);
  const ciclosAtivos = doctors.reduce((a, d) => a + d.ciclosAtivos, 0);
  const diretos = patients.filter(p => p.modeloCuidado === "direto").length;
  const totalDoutores = doctors.filter(d => d.id !== "founder").length;

  const kpis = [
    { label: "Pacientes (ecossistema)", value: totalPacientes, icon: Users, tone: "blue" as const, sub: `${diretos} sob seu cuidado direto` },
    { label: "Fertilistas", value: totalDoutores, icon: Stethoscope, tone: "neutral" as const, sub: `${doctors.filter(d=>d.status==="supervisao").length} em supervisão` },
    { label: "Ciclos ativos", value: ciclosAtivos, icon: ActivitySquare, tone: "green" as const, sub: "Estimulação, preparo e luteal" },
    { label: "Eventos nos próximos 7 dias", value: proximosEventos.length, icon: CalendarClock, tone: "amber" as const, sub: "USG, punções e transferências" },
  ];

  return (
    <Layout
      title="Bom dia, Doutora 👋"
      subtitle="Visão geral do ecossistema FERTIFY Care"
      actions={
        <Link to="/fertify/pacientes" className="btn-pill btn-primary"><Plus size={16} className="mr-2" />Nova paciente</Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="!p-5">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-2xl bg-b-surface3 grid place-items-center"><k.icon size={18} className="text-t-secondary" /></div>
              <Pill tone={k.tone}>↑</Pill>
            </div>
            <div className="mt-5 text-[34px] font-bold leading-none tracking-tight">{k.value}</div>
            <div className="mt-2 text-[13px] text-t-secondary">{k.label}</div>
            <div className="mt-1 text-[11.5px] text-t-tertiary">{k.sub}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-[15px]">Próximos eventos clínicos</div>
              <div className="text-[12px] text-t-secondary">Exames, ultrassons, punções e transferências</div>
            </div>
            <Link to="/fertify/calendario" className="text-[12px] text-t-blue inline-flex items-center gap-1">Abrir calendário <ArrowUpRight size={13} /></Link>
          </div>
          <div className="divide-y divide-stroke1">
            {proximosEventos.map(e => (
              <Link to="/fertify/pacientes/$id" params={{ id: e.id }} key={e.id} className="flex items-center gap-4 py-3 hover:bg-b-highlight rounded-2xl px-2 -mx-2 transition">
                <div className="h-12 w-14 rounded-2xl bg-b-surface3 grid place-items-center text-center">
                  <div className="text-[10px] text-t-tertiary uppercase">data</div>
                  <div className="text-[12px] font-bold leading-none">{e.data}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold truncate">{e.titulo}</div>
                  <div className="text-[12px] text-t-secondary truncate">{e.paciente} · {e.medico}</div>
                </div>
                <Pill tone="blue">agendado</Pill>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="font-bold text-[15px] mb-1">Alertas</div>
          <div className="text-[12px] text-t-secondary mb-4">Pendências que precisam de você</div>
          <ul className="space-y-3">
            {patients.flatMap(p => p.alertas.map(a => ({ p, a }))).map(({ p, a }, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-stroke1 bg-b-surface1 p-3">
                <div className="h-8 w-8 rounded-full bg-[color:var(--color-primary3)]/10 text-[color:var(--color-primary3)] grid place-items-center"><AlertTriangle size={15} /></div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate">{a}</div>
                  <Link to="/fertify/pacientes/$id" params={{ id: p.id }} className="text-[11.5px] text-t-secondary hover:text-t-blue">{p.nome}</Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="font-bold text-[15px] mb-1">Pacientes por médico</div>
          <div className="text-[12px] text-t-secondary mb-4">Volume sob cada fertilista da rede</div>
          <div className="space-y-3">
            {doctors.map(d => {
              const max = Math.max(...doctors.map(x => x.pacientes));
              const pct = (d.pacientes / max) * 100;
              return (
                <div key={d.id}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-medium">{d.nome}</span>
                    <span className="text-t-secondary">{d.pacientes} pacientes · {d.ciclosAtivos} ciclos</span>
                  </div>
                  <div className="h-2 rounded-full bg-b-surface3 overflow-hidden">
                    <div className="h-full bg-b-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="font-bold text-[15px] mb-1">Status comercial</div>
          <div className="text-[12px] text-t-secondary mb-4">Snapshot B2B + B2C</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Médicos clientes (B2B)", v: 4, t: "blue" as const },
              { l: "Pacientes pagantes (B2C)", v: 14, t: "green" as const },
              { l: "Pagamentos pendentes", v: 2, t: "amber" as const },
              { l: "Contratos a renovar", v: 1, t: "red" as const },
            ].map(s => (
              <div key={s.l} className="rounded-2xl border border-stroke1 bg-b-surface1 p-4">
                <Pill tone={s.t}><HeartPulse size={11} className="mr-1" />FERTIFY</Pill>
                <div className="mt-2 text-[26px] font-bold leading-none">{s.v}</div>
                <div className="mt-1 text-[11.5px] text-t-secondary">{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
