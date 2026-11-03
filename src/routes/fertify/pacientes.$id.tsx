import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout, Card, Pill } from "@/imports/fertify/components/fc/Layout";
import { patients, type Patient } from "@/imports/fertify/data/mock";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Activity, Pill as PillIcon, FlaskConical, ScanLine, Syringe, ListTodo, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/fertify/pacientes/$id")({
  loader: ({ params }): Patient => {
    const p = patients.find(x => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.nome ?? "Paciente"} — FERTIFY Care` },
    { name: "description", content: `Prontuário e ciclo atual de ${loaderData?.nome ?? "paciente"} no FERTIFY Care.` },
  ]}),
  component: PatientDetail,
  notFoundComponent: () => (
    <Layout title="Paciente não encontrada"><Card>Não encontramos essa paciente. <Link to="/fertify/pacientes" className="text-t-blue">Voltar à lista</Link></Card></Layout>
  ),
  errorComponent: ({ error }) => (
    <Layout title="Erro"><Card>{error.message}</Card></Layout>
  ),
});

const tabs = [
  { id: "resumo", label: "Resumo" },
  { id: "ciclo", label: "Ciclo atual", icon: Activity },
  { id: "med", label: "Medicações", icon: PillIcon },
  { id: "exames", label: "Exames", icon: FlaskConical },
  { id: "usg", label: "Ultrassons", icon: ScanLine },
  { id: "proc", label: "Procedimentos", icon: Syringe },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "tarefas", label: "Tarefas & Alertas", icon: ListTodo },
] as const;

function PatientDetail() {
  const p = Route.useLoaderData() as Patient;
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("resumo");

  return (
    <Layout
      title={p.nome}
      subtitle={`${p.idade} anos · ${p.cidade}/${p.uf} · ${p.medicoNome}`}
      actions={<Link to="/fertify/pacientes" className="btn-pill btn-stroke"><ArrowLeft size={16} className="mr-2" />Pacientes</Link>}
    >
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-b-surface3 grid place-items-center font-bold text-[15px]">{p.nome.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
              <div className="min-w-0">
                <div className="font-bold truncate">{p.nome}</div>
                <Pill tone={p.modeloCuidado === "direto" ? "blue" : "neutral"}>{p.modeloCuidado === "direto" ? "Cuidado direto" : "B2B2C"}</Pill>
              </div>
            </div>
            <dl className="mt-5 space-y-2.5 text-[13px]">
              <Item icon={Calendar} label="Nascimento">{new Date(p.nascimento).toLocaleDateString("pt-BR")} ({p.idade} a)</Item>
              <Item label="CPF">{p.cpf}</Item>
              <Item icon={Phone} label="Telefone">{p.telefone}</Item>
              <Item icon={Mail} label="E-mail">{p.email}</Item>
              <Item icon={MapPin} label="Cidade">{p.cidade}/{p.uf}</Item>
              <Item label="Parceiro(a)">{p.parceiro || "—"}</Item>
            </dl>
          </Card>

          <Card>
            <div className="text-[12px] uppercase tracking-wide text-t-tertiary mb-2">Objetivo</div>
            <div className="text-[14px] font-semibold">{p.objetivo}</div>
            <div className="mt-4 text-[12px] uppercase tracking-wide text-t-tertiary mb-2">Diagnósticos</div>
            <div className="flex flex-wrap gap-2">{p.diagnosticos.map(d => <Pill key={d}>{d}</Pill>)}</div>
          </Card>

          {p.alertas.length > 0 && (
            <Card>
              <div className="font-bold text-[14px] mb-2">Alertas ativos</div>
              <ul className="space-y-2">
                {p.alertas.map(a => (
                  <li key={a} className="flex items-start gap-2 text-[13px]">
                    <AlertTriangle size={14} className="mt-0.5 text-[color:var(--color-primary3)]" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`btn-pill ${tab === t.id ? "btn-primary" : "btn-stroke"} !h-10 !px-4 !text-[12.5px]`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "resumo" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <div className="text-[12px] uppercase tracking-wide text-t-tertiary mb-2">Ciclo atual</div>
                <div className="font-bold text-[16px]">{p.ciclo.tipo}</div>
                <div className="text-[13px] text-t-secondary mt-1">D{p.ciclo.diaCiclo} · {p.ciclo.status}</div>
                <div className="mt-3 text-[13px]"><span className="text-t-secondary">Protocolo:</span> {p.ciclo.protocolo}</div>
                <div className="mt-1 text-[13px]"><span className="text-t-secondary">Próximo passo:</span> {p.ciclo.proximoPasso}</div>
              </Card>
              <Card>
                <div className="text-[12px] uppercase tracking-wide text-t-tertiary mb-2">Resumo clínico</div>
                <ul className="text-[13px] space-y-1.5">
                  <li>{p.medicacoes.length} medicações ativas</li>
                  <li>{p.exames.length} exames no ciclo</li>
                  <li>{p.ultrassons.length} ultrassons realizados</li>
                  <li>{p.procedimentos.length} procedimentos previstos</li>
                </ul>
              </Card>
            </div>
          )}

          {tab === "ciclo" && (
            <Card>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Tipo">{p.ciclo.tipo}</Field>
                <Field label="Dia do ciclo">D{p.ciclo.diaCiclo}</Field>
                <Field label="Status">{p.ciclo.status}</Field>
                <Field label="Protocolo">{p.ciclo.protocolo}</Field>
                <Field label="Objetivo" className="md:col-span-2">{p.ciclo.objetivo}</Field>
                <Field label="Próximo passo" className="md:col-span-2">{p.ciclo.proximoPasso}</Field>
              </div>
            </Card>
          )}

          {tab === "med" && (
            <Card className="!p-0 overflow-hidden">
              <Table head={["Medicação","Dose","Via","Frequência","Início","Status"]}>
                {p.medicacoes.map(m => (
                  <tr key={m.nome} className="border-t border-stroke1">
                    <td className="px-4 py-3 font-semibold">{m.nome}</td>
                    <td className="px-4 py-3">{m.dose}</td>
                    <td className="px-4 py-3">{m.via}</td>
                    <td className="px-4 py-3">{m.frequencia}</td>
                    <td className="px-4 py-3">{new Date(m.inicio).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3"><Pill tone={m.confirmada ? "green" : "amber"}>{m.confirmada ? "Confirmada" : "Pendente"}</Pill></td>
                  </tr>
                ))}
              </Table>
            </Card>
          )}

          {tab === "exames" && (
            <Card className="!p-0 overflow-hidden">
              <Table head={["Exame","Categoria","Agendado","Realizado","Resultado","Status"]}>
                {p.exames.map(e => (
                  <tr key={e.nome} className="border-t border-stroke1">
                    <td className="px-4 py-3 font-semibold">{e.nome}</td>
                    <td className="px-4 py-3">{e.categoria}</td>
                    <td className="px-4 py-3">{e.agendado ? new Date(e.agendado).toLocaleDateString("pt-BR") : "—"}</td>
                    <td className="px-4 py-3">{e.realizado ? new Date(e.realizado).toLocaleDateString("pt-BR") : "—"}</td>
                    <td className="px-4 py-3">{e.resultado || "—"}</td>
                    <td className="px-4 py-3"><Pill tone={e.status === "Concluído" ? "green" : "blue"}>{e.status}</Pill></td>
                  </tr>
                ))}
                {p.exames.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-t-secondary text-[13px]">Sem exames neste ciclo.</td></tr>}
              </Table>
            </Card>
          )}

          {tab === "usg" && (
            <div className="grid gap-4">
              {p.ultrassons.map(u => (
                <Card key={u.data}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold">USG · {new Date(u.data).toLocaleDateString("pt-BR")}</div>
                    <Pill tone="blue">D{u.diaCiclo}</Pill>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="Endométrio">{u.endometrio}</Field>
                    <Field label="Folículos OD">{u.folOD}</Field>
                    <Field label="Folículos OE">{u.folOE}</Field>
                    <Field label="Maior folículo">{u.maior}</Field>
                    <Field label="Interpretação" className="md:col-span-4">{u.interpretacao}</Field>
                  </div>
                </Card>
              ))}
              {p.ultrassons.length === 0 && <Card><div className="text-t-secondary text-[13px]">Nenhum ultrassom registrado.</div></Card>}
            </div>
          )}

          {tab === "proc" && (
            <Card className="!p-0 overflow-hidden">
              <Table head={["Procedimento","Data","Status"]}>
                {p.procedimentos.map(pr => (
                  <tr key={pr.nome+pr.data} className="border-t border-stroke1">
                    <td className="px-4 py-3 font-semibold">{pr.nome}</td>
                    <td className="px-4 py-3">{new Date(pr.data).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3"><Pill tone="blue">{pr.status}</Pill></td>
                  </tr>
                ))}
                {p.procedimentos.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-t-secondary text-[13px]">Sem procedimentos previstos.</td></tr>}
              </Table>
            </Card>
          )}

          {tab === "timeline" && (
            <Card>
              <ol className="relative border-l-2 border-stroke1 ml-2 space-y-5">
                {p.timeline.map((ev, i) => (
                  <li key={i} className="pl-5 relative">
                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-b-primary border-2 border-b-surface2" />
                    <div className="text-[11.5px] text-t-tertiary uppercase tracking-wide">{new Date(ev.data).toLocaleDateString("pt-BR")} · {ev.tipo}</div>
                    <div className="text-[14px] font-semibold mt-0.5">{ev.titulo}</div>
                    {ev.descricao && <div className="text-[12.5px] text-t-secondary mt-1">{ev.descricao}</div>}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {tab === "tarefas" && (
            <Card>
              <div className="font-bold mb-3">Tarefas</div>
              <ul className="space-y-2">
                {p.tarefas.map(t => (
                  <li key={t.titulo} className="flex items-center gap-3 rounded-2xl border border-stroke1 bg-b-surface1 p-3">
                    <input type="checkbox" className="h-4 w-4 accent-[color:var(--color-primary1)]" />
                    <div className="flex-1 text-[13.5px]">{t.titulo}</div>
                    <Pill tone={t.prioridade === "alta" ? "red" : t.prioridade === "media" ? "amber" : "neutral"}>{t.prioridade}</Pill>
                    <div className="text-[12px] text-t-secondary">{t.prazo}</div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Item({ icon: Icon, label, children }: { icon?: React.ComponentType<{ size?: number; className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon size={14} className="mt-0.5 text-t-tertiary" />}
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-t-tertiary">{label}</div>
        <div className="text-[13px] truncate">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-[11px] uppercase tracking-wide text-t-tertiary mb-1">{label}</div>
      <div className="text-[14px] font-medium">{children}</div>
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr className="bg-b-surface1">
          {head.map(h => <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wide text-t-tertiary font-semibold">{h}</th>)}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
