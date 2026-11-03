import { useMemo, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarHeart } from "lucide-react";
import { sum } from "d3-array";
import { Beeswarm, type BeeswarmView } from "@/imports/paciente/components/chart/Beeswarm";
import { PatientPanel } from "@/imports/paciente/components/PatientPanel";
import { StatRow } from "@/imports/paciente/components/StatRow";
import { Watchlist } from "@/imports/paciente/components/Watchlist";
import {
  SegmentFilter,
  ViewToggle,
  type SegmentFilterValue,
} from "@/imports/paciente/components/SegmentFilter";
import { ThemeToggle } from "@/imports/paciente/components/ThemeToggle";
import { TemplateGuide } from "@/imports/paciente/components/TemplateGuide";
import { patients } from "@/imports/paciente/data/patients";
import { formatCyclesTotal } from "@/imports/paciente/lib/cycle-color";

export const Route = createFileRoute("/paciente/")({
  head: () => ({
    meta: [
      { title: "Painel de saúde do ciclo menstrual" },
      {
        name: "description",
        content:
          "Um painel editorial da saúde menstrual: cada paciente posicionada pelo índice de regularidade do ciclo, com sinais clínicos explicados.",
      },
      { property: "og:title", content: "Painel de saúde do ciclo menstrual" },
      {
        property: "og:description",
        content:
          "Um painel editorial da saúde menstrual: cada paciente posicionada pelo índice de regularidade do ciclo, com sinais clínicos explicados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [segment, setSegment] = useState<SegmentFilterValue>("All");
  const [view, setView] = useState<BeeswarmView>("combined");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cyclesTotal = useMemo(() => sum(patients, (p) => p.cycles), []);

  const highlightedCount =
    segment === "All"
      ? patients.length
      : patients.filter((p) => p.segment === segment).length;
  const selected = patients.find((p) => p.id === selectedId) ?? null;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <header
          className="page-rise flex items-baseline justify-between"
          style={{ "--rise-delay": "0s" } as CSSProperties}
        >
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink">
              <CalendarHeart
                className="mr-2.5 inline-block h-6 w-6 -translate-y-0.5 text-ink"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              Saúde do ciclo
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint tabular-nums">
              {patients.length} pacientes / {formatCyclesTotal(cyclesTotal)} ciclos registrados
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <TemplateGuide />
            <ThemeToggle />
          </div>
        </header>

        <div className="page-rise" style={{ "--rise-delay": "0.12s" } as CSSProperties}>
          <StatRow patients={patients} />
        </div>

        <section
          className="page-rise mt-12"
          style={{ "--rise-delay": "0.24s" } as CSSProperties}
        >
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-10">
              <ViewToggle value={view} onChange={setView} />
              <SegmentFilter value={segment} onChange={setSegment} />
            </div>
            {segment !== "All" && (
              <span className="font-mono text-[11px] text-ink-faint tabular-nums">
                {highlightedCount} pacientes
              </span>
            )}
          </div>
          <div className="mt-4">
            <Beeswarm
              patients={patients}
              view={view}
              highlight={segment}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <p className="mt-1 text-center text-[11px] tracking-tight text-ink-faint">
              Índice de regularidade do ciclo
            </p>
          </div>
        </section>

        <div className="page-rise" style={{ "--rise-delay": "0.38s" } as CSSProperties}>
          <Watchlist patients={patients} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <PatientPanel patient={selected} onClose={() => setSelectedId(null)} />
      </div>
    </main>
  );
}
