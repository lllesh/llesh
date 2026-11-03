import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Layout, Card } from "@/imports/fertify/components/fc/Layout";
import { listCalendars, listEvents, createEvent } from "@/imports/fertify/lib/gcal.functions";
import { CalendarDays, Plus, ExternalLink, MapPin, RefreshCw } from "lucide-react";

type EventType = "exame" | "procedimento" | "transferencia" | "outro";

const TYPE_META: Record<EventType, { label: string; dot: string }> = {
  exame: { label: "Exame", dot: "bg-emerald-500" },
  procedimento: { label: "Procedimento", dot: "bg-violet-500" },
  transferencia: { label: "Transferência", dot: "bg-rose-500" },
  outro: { label: "Outro", dot: "bg-slate-400" },
};

function fmtRange(start?: string, end?: string, allDay?: boolean) {
  if (!start) return "";
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const dOpts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
  const tOpts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  const date = s.toLocaleDateString("pt-BR", dOpts);
  if (allDay) return `${date} · dia inteiro`;
  return `${date} · ${s.toLocaleTimeString("pt-BR", tOpts)}${e ? " – " + e.toLocaleTimeString("pt-BR", tOpts) : ""}`;
}

function CalendarioPage() {
  const qc = useQueryClient();
  const fetchCalendars = useServerFn(listCalendars);
  const fetchEvents = useServerFn(listEvents);
  const createEv = useServerFn(createEvent);

  const [calendarId, setCalendarId] = useState<string>("primary");
  const [filter, setFilter] = useState<"all" | EventType>("all");
  const [open, setOpen] = useState(false);

  const cals = useQuery({ queryKey: ["gcal", "calendars"], queryFn: () => fetchCalendars() });
  const events = useQuery({
    queryKey: ["gcal", "events", calendarId],
    queryFn: () => fetchEvents({ data: { calendarId } }),
  });

  const filtered = useMemo(() => {
    const all = events.data ?? [];
    if (filter === "all") return all;
    return all.filter((e: any) => {
      const s = `${e.summary} ${e.description}`.toLowerCase();
      if (filter === "exame") return /exame|ultrassom|us |beta|hcg|sangue/.test(s);
      if (filter === "procedimento") return /punç|puncao|coleta|procedimento|fiv/.test(s);
      if (filter === "transferencia") return /transfer|embri/.test(s);
      return true;
    });
  }, [events.data, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const e of filtered) {
      const k = new Date(e.start).toISOString().slice(0, 10);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const create = useMutation({
    mutationFn: (data: any) => createEv({ data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gcal", "events"] });
      setOpen(false);
    },
  });

  return (
    <Layout
      title="Calendário"
      subtitle="Sincronizado com Google Calendar"
      actions={
        <>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["gcal"] })}
            className="h-11 w-11 grid place-items-center rounded-full border-[1.5px] border-stroke1 bg-b-surface2 text-t-secondary hover:text-t-primary transition"
            title="Atualizar"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="h-11 px-5 rounded-full bg-b-dark1 text-t-light text-[13px] font-bold inline-flex items-center gap-2 hover:opacity-90 transition"
          >
            <Plus size={16} /> Novo evento
          </button>
        </>
      }
    >
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={calendarId}
          onChange={(e) => setCalendarId(e.target.value)}
          className="h-11 rounded-full border-[1.5px] border-stroke1 bg-b-surface2 px-4 text-[13px] font-medium"
        >
          {cals.isLoading && <option>Carregando agendas…</option>}
          {!cals.isLoading && (cals.data ?? []).length === 0 && <option value="primary">Agenda principal</option>}
          {(cals.data ?? []).map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.summary}{c.primary ? " (principal)" : ""}
            </option>
          ))}
        </select>
        <div className="flex gap-1 p-1 rounded-full border-[1.5px] border-stroke1 bg-b-surface2">
          {(["all", "exame", "procedimento", "transferencia"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`h-9 px-4 rounded-full text-[12px] font-bold transition ${
                filter === k ? "bg-b-dark1 text-t-light" : "text-t-secondary hover:text-t-primary"
              }`}
            >
              {k === "all" ? "Todos" : TYPE_META[k].label}
            </button>
          ))}
        </div>
      </div>

      {events.isLoading && (
        <Card><div className="py-12 text-center text-t-secondary text-[13px]">Carregando eventos do Google Calendar…</div></Card>
      )}

      {events.isError && (
        <Card>
          <div className="py-8 text-center">
            <div className="text-[16px] font-bold mb-1">Não foi possível carregar a agenda</div>
            <p className="text-[13px] text-t-secondary">{(events.error as Error).message}</p>
          </div>
        </Card>
      )}

      {!events.isLoading && !events.isError && grouped.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <CalendarDays className="mx-auto mb-3 text-t-tertiary" size={32} />
            <div className="text-[16px] font-bold mb-1">Nenhum evento no período</div>
            <p className="text-[13px] text-t-secondary">Crie um exame, procedimento ou transferência para começar.</p>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {grouped.map(([day, items]) => (
          <Card key={day}>
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-[15px] font-bold">
                {new Date(day + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
              </div>
              <div className="text-[12px] text-t-tertiary">{items.length} evento(s)</div>
            </div>
            <ul className="divide-y divide-stroke1">
              {items.map((e: any) => {
                const t: EventType = /exame|ultrassom|beta|hcg/i.test(e.summary)
                  ? "exame"
                  : /transfer|embri/i.test(e.summary)
                  ? "transferencia"
                  : /punç|puncao|coleta|procedimento|fiv/i.test(e.summary)
                  ? "procedimento"
                  : "outro";
                return (
                  <li key={e.id} className="py-3 flex items-start gap-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${TYPE_META[t].dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-[14px] font-bold truncate">{e.summary}</div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-b-surface2 text-t-secondary">{TYPE_META[t].label}</span>
                      </div>
                      <div className="text-[12px] text-t-secondary">{fmtRange(e.start, e.end, e.allDay)}</div>
                      {e.location && (
                        <div className="text-[12px] text-t-tertiary inline-flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {e.location}
                        </div>
                      )}
                    </div>
                    {e.htmlLink && (
                      <a href={e.htmlLink} target="_blank" rel="noreferrer" className="text-t-tertiary hover:text-t-primary" title="Abrir no Google">
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>

      {open && <NewEventModal calendarId={calendarId} onClose={() => setOpen(false)} onCreate={(d) => create.mutate(d)} pending={create.isPending} error={create.error as Error | null} />}
    </Layout>
  );
}

function NewEventModal({
  calendarId,
  onClose,
  onCreate,
  pending,
  error,
}: {
  calendarId: string;
  onClose: () => void;
  onCreate: (d: any) => void;
  pending: boolean;
  error: Error | null;
}) {
  const [type, setType] = useState<EventType>("exame");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const defStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours() + 1)}:00`;
  const [start, setStart] = useState(defStart);
  const [end, setEnd] = useState(defStart);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-b-surface1 border-[1.5px] border-stroke1 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-[18px] font-bold mb-4">Novo evento</div>
        <div className="space-y-3">
          <div>
            <label className="text-[12px] text-t-secondary font-medium">Tipo</label>
            <div className="flex gap-2 mt-1">
              {(Object.keys(TYPE_META) as EventType[]).map((k) => (
                <button key={k} onClick={() => setType(k)} className={`h-9 px-4 rounded-full text-[12px] font-bold border-[1.5px] ${type === k ? "bg-b-dark1 text-t-light border-transparent" : "border-stroke1 text-t-secondary"}`}>
                  {TYPE_META[k].label}
                </button>
              ))}
            </div>
          </div>
          <Field label="Título" value={summary} onChange={setSummary} placeholder="Ex.: Ultrassom — Joana Silva" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Início" type="datetime-local" value={start} onChange={setStart} />
            <Field label="Fim" type="datetime-local" value={end} onChange={setEnd} />
          </div>
          <Field label="Local" value={location} onChange={setLocation} placeholder="Clínica / sala" />
          <Field label="Observações" value={description} onChange={setDescription} placeholder="Notas clínicas (não substitui prescrição médica)" textarea />
          {error && <div className="text-[12px] text-rose-500">{error.message}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="h-10 px-5 rounded-full border-[1.5px] border-stroke1 text-[13px] font-bold">Cancelar</button>
            <button
              disabled={pending || !summary || !start || !end}
              onClick={() => onCreate({ calendarId, summary, description, location, start, end, type })}
              className="h-10 px-5 rounded-full bg-b-dark1 text-t-light text-[13px] font-bold disabled:opacity-50"
            >
              {pending ? "Criando…" : "Criar evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-[12px] text-t-secondary font-medium">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="mt-1 w-full rounded-2xl border-[1.5px] border-stroke1 bg-b-surface2 px-4 py-2 text-[13px] outline-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full h-11 rounded-full border-[1.5px] border-stroke1 bg-b-surface2 px-4 text-[13px] outline-none" />
      )}
    </div>
  );
}

export const Route = createFileRoute("/fertify/calendario")({
  head: () => ({ meta: [{ title: "Calendário — FERTIFY Care" }] }),
  component: CalendarioPage,
});
