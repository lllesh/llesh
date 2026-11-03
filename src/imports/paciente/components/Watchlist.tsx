import { useMemo } from "react";
import {
  patients as allPatients,
  drawdown,
  weekDelta,
  type Patient,
} from "../data/patients";
import {
  daysSince,
  formatCycles,
  formatDateShort,
  formatPct,
  formatSigned,
} from "../lib/cycle-color";
import { weeksToRisk } from "../lib/runway";
import { Sparkline } from "./chart/Sparkline";

const HEAD = [
  "Paciente",
  "Ciclos",
  "Índice",
  "13 sem",
  "Queda",
  "Projeção",
  "Diário",
  "Δ sem",
  "Últ. consul.",
  "Próxima",
];

/**
 * Attention blends follow-up weight with trajectory:
 *   cycles × (1 − index/100)          — always-irregular follow-up
 * + cycles × (drawdown/100) × 1.4     — a patient sliding off a recent peak
 * The 1.4 weight means a long-followed patient that has fallen 20 points
 * outranks an equally long-followed patient that has simply always sat low.
 */
const exposure = (p: Patient) =>
  p.cycles * (1 - p.healthScore / 100) + p.cycles * (drawdown(p) / 100) * 1.4;

export function Watchlist({
  patients = allPatients,
  selectedId,
  onSelect,
}: {
  patients?: Patient[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const rows = useMemo(
    () => [...patients].sort((a, b) => exposure(b) - exposure(a)).slice(0, 8),
    [patients],
  );

  return (
    <section className="mt-12 bg-surface px-6 py-6 sm:px-8">
      <h2 className="font-serif text-xl tracking-tight text-ink">Pacientes sob atenção</h2>
      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr>
            {HEAD.map((h, i) => (
              <th
                key={h}
                className={`pb-2 text-[10px] font-normal uppercase tracking-[0.16em] text-ink-faint ${
                  i > 0 ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const d = weekDelta(p);
            const dd = drawdown(p);
            const ddAlarm = dd > 15;
            const runway = weeksToRisk(p.healthHistory, p.healthScore);
            const since = daysSince(p.lastVisit);
            const isSelected = selectedId === p.id;
            return (
              <tr
                key={p.id}
                onClick={() => onSelect(isSelected ? null : p.id)}
                className={`cursor-pointer border-t border-rule transition-colors hover:bg-background/60 ${
                  isSelected ? "bg-background" : ""
                }`}
              >
                <td className="py-2.5 pr-4">
                  <span className="text-[13px] text-ink">{p.name}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                    {p.segment}
                  </span>
                </td>
                <td className="py-2.5 pl-4 text-right font-mono text-[13px] text-ink tabular-nums">
                  {formatCycles(p.cycles)}
                </td>
                <td className="py-2.5 pl-4 text-right font-mono text-[13px] text-ink tabular-nums">
                  {p.healthScore}
                </td>
                <td className="py-2.5 pl-4 text-right">
                  <span className="inline-block align-middle">
                    <Sparkline values={p.healthHistory} alarm={ddAlarm} />
                  </span>
                </td>
                <td
                  className={`py-2.5 pl-4 text-right font-mono text-[13px] tabular-nums ${
                    ddAlarm ? "text-alarm" : "text-ink-muted"
                  }`}
                >
                  {dd <= 1 ? <span className="text-ink-faint">—</span> : `−${dd}`}
                </td>
                <td
                  className={`py-2.5 pl-4 text-right font-mono text-[13px] tabular-nums ${
                    runway !== null && runway < 8 ? "text-alarm" : "text-ink-muted"
                  }`}
                >
                  {runway === null ? (
                    <span className="text-ink-faint">—</span>
                  ) : (
                    `~${runway} sem`
                  )}
                </td>
                <td className="py-2.5 pl-4 text-right font-mono text-[13px] text-ink-muted tabular-nums">
                  {p.diaryAdherence === null ? (
                    <span className="text-ink-faint" title="Paciente sem diário do ciclo">
                      —
                    </span>
                  ) : (
                    formatPct(p.diaryAdherence)
                  )}
                </td>
                <td
                  className={`py-2.5 pl-4 text-right font-mono text-[13px] tabular-nums ${
                    d < 0 ? "text-alarm" : "text-ink-muted"
                  }`}
                >
                  {formatSigned(d)}
                </td>
                <td
                  className={`py-2.5 pl-4 text-right font-mono text-[13px] tabular-nums ${
                    since > 60 ? "text-alarm" : "text-ink-muted"
                  }`}
                >
                  {since}d
                </td>
                <td className="py-2.5 pl-4 text-right font-mono text-[13px] text-ink-muted tabular-nums">
                  {formatDateShort(p.nextAppointment)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink-faint">
        Um traço significa que a medida não se aplica a esta paciente, não que ela tenha pontuação zero.
      </p>
    </section>
  );
}
