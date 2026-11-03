import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Stethoscope, Activity, Pill, FlaskConical,
  ScanLine, Syringe, CalendarDays, ListTodo, Bell, MessageSquare,
  Folder, FileText, LayoutTemplate, Briefcase, Settings,
} from "lucide-react";

const items = [
  { to: "/fertify", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fertify/pacientes", label: "Pacientes", icon: Users },
  { to: "/fertify/fertilistas", label: "Fertilistas", icon: Stethoscope },
  { to: "/fertify/ciclos", label: "Ciclos de Tratamento", icon: Activity },
  { to: "/fertify/medicacoes", label: "Medicações", icon: Pill },
  { to: "/fertify/exames", label: "Exames", icon: FlaskConical },
  { to: "/fertify/ultrassons", label: "Ultrassons", icon: ScanLine },
  { to: "/fertify/procedimentos", label: "Procedimentos", icon: Syringe },
  { to: "/fertify/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/fertify/tarefas", label: "Tarefas", icon: ListTodo },
  { to: "/fertify/alertas", label: "Alertas", icon: Bell },
  { to: "/fertify/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/fertify/arquivos", label: "Arquivos", icon: Folder },
  { to: "/fertify/protocolos", label: "Protocolos", icon: FileText },
  { to: "/fertify/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/fertify/crm", label: "CRM / Comercial", icon: Briefcase },
  { to: "/fertify/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-stroke1 bg-b-surface2 p-4 sticky top-0 h-screen overflow-y-auto scrollbar-thin">
      <Link to="/fertify" className="px-2 py-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-b-primary text-white grid place-items-center font-bold">F</div>
          <div>
            <div className="font-bold tracking-tight text-t-primary">FERTIFY Care</div>
            <div className="text-[11px] text-t-tertiary -mt-0.5">Centro de comando</div>
          </div>
        </div>
      </Link>
      <nav className="flex-1 mt-2 flex flex-col gap-0.5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/fertify" ? path === "/fertify" || path === "/fertify" : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] font-medium transition ${
                active
                  ? "bg-b-surface3 text-t-primary"
                  : "text-t-secondary hover:bg-b-highlight hover:text-t-primary"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
