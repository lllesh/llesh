import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, Card, Pill } from "@/imports/fertify/components/fc/Layout";
import { patients, doctors } from "@/imports/fertify/data/mock";
import { Plus, Search, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/fertify/pacientes")({
  head: () => ({ meta: [
    { title: "Pacientes — FERTIFY Care" },
    { name: "description", content: "Lista de pacientes do ecossistema FERTIFY Care, com filtros por médico, ciclo e status." },
  ]}),
  component: Pacientes,
});

function Pacientes() {
  const [q, setQ] = useState("");
  const [modelo, setModelo] = useState<"todos"|"direto"|"medico">("todos");
  const [medico, setMedico] = useState<string>("todos");

  const list = useMemo(() => patients.filter(p => {
    if (modelo !== "todos" && p.modeloCuidado !== modelo) return false;
    if (medico !== "todos" && p.medicoId !== medico) return false;
    if (q && !(p.nome.toLowerCase().includes(q.toLowerCase()) || p.cpf.includes(q))) return false;
    return true;
  }), [q, modelo, medico]);

  return (
    <Layout
      title="Pacientes"
      subtitle={`${list.length} pacientes encontradas`}
      actions={<button className="btn-pill btn-primary"><Plus size={16} className="mr-2" />Nova paciente</button>}
    >
      <Card className="!p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 h-11 rounded-full border-[1.5px] border-stroke1 bg-b-surface1 px-4 text-[13px] flex-1 min-w-[220px]">
            <Search size={15} className="text-t-secondary" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome ou CPF..." className="bg-transparent outline-none flex-1 placeholder:text-t-tertiary" />
          </div>
          <select value={modelo} onChange={e => setModelo(e.target.value as never)} className="h-11 rounded-full border-[1.5px] border-stroke1 bg-b-surface1 px-4 text-[13px] outline-none">
            <option value="todos">Todos os modelos</option>
            <option value="direto">Cuidado direto (meu)</option>
            <option value="medico">De um fertilista</option>
          </select>
          <select value={medico} onChange={e => setMedico(e.target.value)} className="h-11 rounded-full border-[1.5px] border-stroke1 bg-b-surface1 px-4 text-[13px] outline-none">
            <option value="todos">Todos os médicos</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wide text-t-tertiary border-b border-stroke1">
          <div className="col-span-4">Paciente</div>
          <div className="col-span-3">Médico responsável</div>
          <div className="col-span-3">Ciclo atual</div>
          <div className="col-span-2 text-right">Próximo evento</div>
        </div>
        <div className="divide-y divide-stroke1">
          {list.map(p => (
            <Link to="/fertify/pacientes/$id" params={{ id: p.id }} key={p.id} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-b-highlight transition">
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-b-surface3 grid place-items-center font-bold text-[13px]">{p.nome.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold truncate">{p.nome}</div>
                  <div className="text-[12px] text-t-secondary truncate">{p.idade} anos · {p.cidade}/{p.uf}</div>
                </div>
              </div>
              <div className="col-span-3 min-w-0">
                <div className="text-[13px] truncate">{p.medicoNome}</div>
                <Pill tone={p.modeloCuidado === "direto" ? "blue" : "neutral"}>{p.modeloCuidado === "direto" ? "Cuidado direto" : "B2B2C"}</Pill>
              </div>
              <div className="col-span-3 min-w-0">
                <div className="text-[13px] truncate">{p.ciclo.tipo}</div>
                <div className="text-[12px] text-t-secondary">D{p.ciclo.diaCiclo} · {p.ciclo.status}</div>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <div className="text-right">
                  <div className="text-[13px] font-semibold">{p.proximoEvento.titulo}</div>
                  <div className="text-[11.5px] text-t-secondary">{p.proximoEvento.data}</div>
                </div>
                <ArrowUpRight size={16} className="text-t-tertiary" />
              </div>
            </Link>
          ))}
          {list.length === 0 && <div className="p-8 text-center text-t-secondary text-[13px]">Nenhuma paciente encontrada com esses filtros.</div>}
        </div>
      </Card>
    </Layout>
  );
}
