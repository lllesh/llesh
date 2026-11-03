import { useEffect, useRef } from "react";
import { drawdown, HEALTH_BASE, type Patient } from "../data/patients";
import {
  daysSince,
  formatCycles,
  formatDate,
  formatPct,
} from "../lib/cycle-color";
import { weeksToRisk } from "../lib/runway";
import { Trajectory } from "./chart/Trajectory";
import { ScoreWaterfall } from "./chart/ScoreWaterfall";

function Fact({ label, value, alarm }: { label: string; value: React.ReactNode; alarm?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">{label}</div>
      <div
        className={`mt-1.5 font-mono text-[14px] tabular-nums ${alarm ? "text-alarm" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

const dash = (title?: string) => (
  <span className="text-ink-faint" title={title}>
    —
  </span>
);

export function PatientPanel({
  patient,
  onClose,
}: {
  patient: Patient | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const open = patient !== null;

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnTo.current?.focus?.();
    };
  }, [open, onClose]);

  const dd = patient ? drawdown(patient) : 0;
  const runway = patient ? weeksToRisk(patient.healthHistory, patient.healthScore) : null;
  const since = patient ? daysSince(patient.lastVisit) : 0;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-scrim transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={patient ? `Detalhes de ${patient.name}` : "Detalhes da paciente"}
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto border-l border-ink-muted bg-background sm:w-[480px] ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        style={{ transition: "translate 300ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {patient && (
          <div className="px-7 py-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="font-serif text-2xl leading-[1.05] tracking-tight text-ink">
                  {patient.name}
                </h2>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint tabular-nums">
                  {patient.segment} · {patient.age} anos · consulta em{" "}
                  {formatDate(patient.nextAppointment)}
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="font-mono text-[40px] leading-none text-ink tabular-nums">
                  {patient.healthScore}
                </span>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Fechar detalhes da paciente"
                  className="-mr-1 mt-1 px-1 text-ink-faint transition-colors hover:text-ink"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-7">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Últimas 13 semanas
              </div>
              <div className="mt-2">
                <Trajectory values={patient.healthHistory} alarm={dd > 15} />
              </div>
            </div>

            <div className="mt-7">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Composição do índice
              </div>
              <div className="mt-3">
                <ScoreWaterfall
                  base={HEALTH_BASE}
                  drivers={patient.drivers}
                  total={patient.healthScore}
                />
              </div>
            </div>

            <div className="mt-8 h-px w-full bg-rule" />
            <div className="mt-5 grid grid-cols-3 gap-x-6 gap-y-5">
              <Fact label="Ciclos acompanhados" value={formatCycles(patient.cycles)} />
              <Fact
                label="Diário do ciclo"
                value={
                  patient.diaryAdherence === null
                    ? dash("Paciente sem diário do ciclo")
                    : formatPct(patient.diaryAdherence)
                }
              />
              <Fact label="Última consulta" value={`${since}d`} alarm={since > 60} />
              <Fact
                label="Queda do índice"
                value={
                  dd <= 1 ? dash("Paciente está no pico das últimas 13 semanas") : `−${dd}`
                }
                alarm={dd > 15}
              />
              <Fact
                label="Projeção"
                value={
                  runway === null
                    ? dash("Sem tendência de queda para extrapolar")
                    : `~${runway} sem`
                }
                alarm={runway !== null && runway < 8}
              />
            </div>
            <p className="mt-6 text-[11px] text-ink-faint">
              Um traço significa que a medida não se aplica a esta paciente, não que ela tenha pontuação zero.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
