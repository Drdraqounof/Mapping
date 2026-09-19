import { NODES } from '@/data/nodes'
import { KPI_COLOR, KPI_MAX } from '@/lib/theme'
import type { Route } from '@/lib/types'
import KpiBar from '@/components/KpiBar'
import StatCell from '@/components/StatCell'

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-[#64748b]">{label}</span>
      <span className="font-mono text-[#e2e8f0]">{value}</span>
    </div>
  )
}

function SavingRow({
  label,
  saving,
  unit,
  color,
  prefix = '',
}: {
  label: string
  saving: number
  unit: string
  color: string
  prefix?: string
}) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-[#64748b]">{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>
        -{prefix}
        {saving.toFixed(saving < 10 ? 1 : 0)}
        {unit}
      </span>
    </div>
  )
}

export default function RouteDetailPanel({
  routes,
  selectedRoute,
  totalRouteCounts,
}: {
  routes: Route[]
  selectedRoute: Route | undefined
  totalRouteCounts: { truck: number; bike: number }
}) {
  const active = routes.filter(r => r.active)
  const totals = {
    timeSaved: active.reduce((s, r) => s + r.savings.time, 0),
    fuelSaved: active.reduce((s, r) => s + r.savings.fuel, 0),
    co2Saved: active.reduce((s, r) => s + r.savings.co2, 0),
    activeTrucks: active.filter(r => r.type === 'truck').length,
    activeBikes: active.filter(r => r.type === 'bike').length,
  }

  const stops = selectedRoute?.stops.filter(s => NODES[s]) ?? []

  return (
    <aside className="w-72 border-l border-[#1f2530] bg-[#111318] flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b border-[#1f2530]">
        <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mb-3">Today's Savings</p>
        <div className="space-y-3">
          <KpiBar label="Time Saved" value={totals.timeSaved} unit="min" max={KPI_MAX.time} color={KPI_COLOR.time} />
          <KpiBar label="Fuel Saved" value={totals.fuelSaved} unit="USD" max={KPI_MAX.fuel} color={KPI_COLOR.fuel} prefix="$" />
          <KpiBar label="CO₂ Avoided" value={totals.co2Saved} unit="kg" max={KPI_MAX.co2} color={KPI_COLOR.co2} />
        </div>
      </div>

      <div className="p-4 border-b border-[#1f2530]">
        <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mb-3">Fleet Status</p>
        <div className="grid grid-cols-2 gap-2">
          <StatCell icon="🚛" label="Trucks" value={totals.activeTrucks} total={totalRouteCounts.truck} color="#f97316" />
          <StatCell icon="🚲" label="Bikes" value={totals.activeBikes} total={totalRouteCounts.bike} color="#22c55e" />
        </div>
      </div>

      {selectedRoute && (
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mb-3">Route Detail</p>
          <div
            className={`rounded-lg border p-3 mb-3 ${
              selectedRoute.type === 'truck' ? 'border-[#f97316]/30 bg-[#f97316]/5' : 'border-[#22c55e]/30 bg-[#22c55e]/5'
            }`}
          >
            <p className="text-[12px] font-semibold mb-1">{selectedRoute.name}</p>
            <p className="text-[10px] text-[#64748b]">
              {stops.length} stops · {selectedRoute.distance.toFixed(1)} km
              {selectedRoute.isFallbackGeometry && ' · straight-line estimate'}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <MetricRow label="Duration" value={`${selectedRoute.duration.toFixed(0)} min`} />
            {selectedRoute.type === 'truck' && (
              <>
                <MetricRow label="Fuel Cost" value={`$${selectedRoute.fuelCost.toFixed(2)}`} />
                <MetricRow label="CO₂ Output" value={`${selectedRoute.co2.toFixed(1)} kg`} />
              </>
            )}
          </div>

          <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mb-2">vs. Unoptimized</p>
          <div className="space-y-2">
            <SavingRow label="Time" saving={selectedRoute.savings.time} unit="min" color={KPI_COLOR.time} />
            <SavingRow label="Fuel" saving={selectedRoute.savings.fuel} unit="" prefix="$" color={KPI_COLOR.fuel} />
            <SavingRow label="CO₂" saving={selectedRoute.savings.co2} unit=" kg" color={KPI_COLOR.co2} />
          </div>

          <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mt-4 mb-2">Stop Sequence</p>
          <div className="space-y-1">
            {stops.map((stop, i) => (
              <div key={`${stop}-${i}`} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2 h-2 rounded-full border ${
                      i === 0 || i === stops.length - 1
                        ? selectedRoute.type === 'truck'
                          ? 'bg-[#f97316] border-[#f97316]'
                          : 'bg-[#22c55e] border-[#22c55e]'
                        : 'bg-transparent border-[#4b5563]'
                    }`}
                  />
                  {i < stops.length - 1 && <div className="w-px h-4 bg-[#1f2530]" />}
                </div>
                <span className="text-[11px] text-[#94a3b8] pb-1">{NODES[stop]?.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
