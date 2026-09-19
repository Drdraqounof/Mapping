export default function KpiBar({
  label,
  value,
  unit,
  max,
  color,
  prefix = '',
}: {
  label: string
  value: number
  unit: string
  max: number
  color: string
  prefix?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[11px] text-[#94a3b8]">{label}</span>
        <span className="text-[13px] font-mono font-semibold" style={{ color }}>
          {prefix}
          {value.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-1 rounded-full bg-[#1f2530]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
