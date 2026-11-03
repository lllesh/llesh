import { useMemo } from "react";
import { median, sum } from "d3-array";
import { patients as allPatients, hasSeverePain, indexFourWeeksAgo, type Patient } from "../data/patients";
import { daysUntil, formatSigned } from "../lib/cycle-color";

function Stat({
  label,
  value,
  sub,
  bad,
}: {
  label: string;
  value: string;
  sub: string;
  bad?: boolean;
}) {
  return (
    <div className="px-6 py-5 text-center">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">{label}</div>
      <div className="mt-2 font-mono text-[44px] leading-none tracking-tight text-ink tabular-nums">
        {value}
      </div>
      <div
        className={`mt-2 font-mono text-[11px] tabular-nums ${bad ? "text-alarm" : "text-ink-faint"}`}
      >
        {sub}
      </div>
    </div>
  );
}

export function StatRow({ patients = allPatients }: { patients?: Patient[] }) {
  const stats = useMemo(() => {
    const atAttention = patients.filter((p) => p.healthScore < 50);
    const atAttentionThen = patients.filter((p) => indexFourWeeksAgo(p) < 50);

    const countDelta = atAttention.length - atAttentionThen.length;

    const med = median(patients, (p) => p.healthScore) ?? 0;
    const medThen = median(patients, (p) => indexFourWeeksAgo(p)) ?? 0;
    const medDelta = med - medThen;

    const severe = patients.filter(hasSeverePain);

    const soon = patients.filter((p) => {
      const d = daysUntil(p.nextAppointment);
      return d >= 0 && d <= 90;
    });

    return {
      count: atAttention.length,
      countDelta,
      med,
      medDelta,
      severeCount: severe.length,
      severeShare: patients.length ? severe.length / patients.length : 0,
      soonCount: soon.length,
      soonCycles: sum(soon, (p) => p.cycles),
    };
  }, [patients]);

  return (
    <section className="mt-5 grid grid-cols-2 divide-x divide-rule border-y-2 border-ink-muted sm:grid-cols-4">
      <Stat
        label="Pacientes em atenção"
        value={String(stats.count)}
        sub={`${formatSigned(stats.countDelta)} vs. 4 semanas atrás`}
        bad={stats.countDelta > 0}
      />
      <Stat
        label="Índice mediano"
        value={stats.med.toFixed(0)}
        sub={`${formatSigned(stats.medDelta)} vs. 4 semanas atrás`}
        bad={stats.medDelta < 0}
      />
      <Stat
        label="Dor incapacitante"
        value={String(stats.severeCount)}
        sub={`${Math.round(stats.severeShare * 100)}% das pacientes`}
      />
      <Stat
        label="Consultas · 90 dias"
        value={String(stats.soonCount)}
        sub={`${stats.soonCycles} ciclos em seguimento`}
      />
    </section>
  );
}
