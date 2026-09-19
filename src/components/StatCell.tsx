export default function StatCell({
  icon,
  label,
  value,
  total,
  color,
}: {
  icon: string
  label: string
  value: number
  total: number
  color: string
}) {
  return (
    <div className="rounded-lg bg-[#181c23] border border-[#1f2530] p-3">
      <div className="text-base mb-1">{icon}</div>
      <div className="font-mono text-xl font-bold" style={{ color }}>
        {value}
        <span className="text-[#2d3748] text-sm">/{total}</span>
      </div>
      <div className="text-[10px] text-[#64748b]">{label} active</div>
    </div>
  )
}
