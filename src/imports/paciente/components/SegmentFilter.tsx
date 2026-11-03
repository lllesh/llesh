import type { Segment } from "../data/patients";
import type { BeeswarmView } from "./chart/Beeswarm";

export type SegmentFilterValue = "All" | Segment;
const OPTIONS: { value: SegmentFilterValue; label: string }[] = [
  { value: "All", label: "Todas" },
  { value: "Adolescente", label: "Adolescentes" },
  { value: "Adulta", label: "Adultas" },
  { value: "Perimenopausa", label: "Perimenopausa" },
];

const cls = (active: boolean) =>
  `text-[13px] tracking-tight transition-colors ${
    active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
  }`;

export function ViewToggle({
  value,
  onChange,
}: {
  value: BeeswarmView;
  onChange: (v: BeeswarmView) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange("combined")} className={cls(value === "combined")}>
        Unificado
      </button>
      <span className="text-[13px] text-ink-faint">·</span>
      <button onClick={() => onChange("segment")} className={cls(value === "segment")}>
        Por faixa etária
      </button>
    </div>
  );
}

export function SegmentFilter({
  value,
  onChange,
}: {
  value: SegmentFilterValue;
  onChange: (v: SegmentFilterValue) => void;
}) {
  return (
    <div className="flex items-center gap-6">
      {OPTIONS.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={cls(value === o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
