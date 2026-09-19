import type { Route, RouteType } from '@/lib/types'

type Filter = 'all' | RouteType

export default function Sidebar({
  routes,
  filter,
  selected,
  onFilterChange,
  onSelect,
  onToggle,
}: {
  routes: Route[]
  filter: Filter
  selected: string | null
  onFilterChange: (f: Filter) => void
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}) {
  const visible = routes.filter(r => filter === 'all' || r.type === filter)

  return (
    <aside className="w-72 border-r border-[#1f2530] bg-[#111318] flex flex-col overflow-hidden shrink-0">
      <div className="flex gap-1 p-3 border-b border-[#1f2530]">
        {(['all', 'truck', 'bike'] as const).map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`flex-1 text-[11px] font-medium py-1.5 rounded transition-all ${
              filter === f
                ? f === 'truck'
                  ? 'bg-[#f97316] text-white'
                  : f === 'bike'
                    ? 'bg-[#22c55e] text-[#0a0c0f]'
                    : 'bg-[#3b82f6] text-white'
                : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1f2530]'
            }`}
          >
            {f === 'all' ? 'All Routes' : f === 'truck' ? 'Trucks' : 'Bikes'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {visible.map(route => (
          <div
            key={route.id}
            onClick={() => onSelect(route.id)}
            className={`rounded-lg border cursor-pointer transition-all p-3 ${
              selected === route.id
                ? route.type === 'truck'
                  ? 'border-[#f97316]/50 bg-[#f97316]/5'
                  : 'border-[#22c55e]/50 bg-[#22c55e]/5'
                : 'border-[#1f2530] bg-[#181c23] hover:border-[#2d3748]'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase ${
                  route.type === 'truck' ? 'bg-[#f97316]/15 text-[#f97316]' : 'bg-[#22c55e]/15 text-[#22c55e]'
                }`}
              >
                {route.type}
              </span>
              <button
                role="switch"
                aria-checked={route.active}
                aria-label={`Toggle ${route.name}`}
                onClick={e => {
                  e.stopPropagation()
                  onToggle(route.id)
                }}
                className={`w-8 h-4 rounded-full transition-all relative ${
                  route.active ? (route.type === 'truck' ? 'bg-[#f97316]' : 'bg-[#22c55e]') : 'bg-[#2d3748]'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                    route.active ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-[12px] font-medium leading-tight mb-2">{route.name}</p>
            <div className="flex gap-3 text-[10px] font-mono text-[#64748b]">
              <span>{route.distance.toFixed(1)} km</span>
              <span>{route.duration.toFixed(0)} min</span>
              {route.type === 'truck' && <span>${route.fuelCost.toFixed(2)}</span>}
              {route.isFallbackGeometry && <span title="Live routing unavailable, showing straight-line estimate">≈</span>}
            </div>
            {route.active && (
              <div className="mt-2 pt-2 border-t border-[#1f2530] flex gap-3 text-[10px]">
                <span className="text-[#3b82f6]">-{route.savings.time.toFixed(0)}min</span>
                <span className="text-[#f97316]">-${route.savings.fuel.toFixed(0)}</span>
                <span className="text-[#22c55e]">-{route.savings.co2.toFixed(1)}kg CO₂</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[#1f2530]">
        <button className="w-full text-[11px] font-medium py-2 rounded border border-dashed border-[#2d3748] text-[#64748b] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all">
          + Add Route
        </button>
      </div>
    </aside>
  )
}
