'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ROUTE_DEFINITIONS } from '@/data/routes'
import { useRoutes } from '@/lib/useRoutes'
import Sidebar from '@/components/Sidebar'
import RouteDetailPanel from '@/components/RouteDetailPanel'
import type { RouteType } from '@/lib/types'

const BostonMap = dynamic(() => import('@/components/BostonMap'), { ssr: false })

type Filter = 'all' | RouteType

export default function FleetDashboard() {
  const { routes, toggleRoute, gasPrice } = useRoutes()
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>('r1')

  const totalRouteCounts = useMemo(
    () => ({
      truck: ROUTE_DEFINITIONS.filter(r => r.type === 'truck').length,
      bike: ROUTE_DEFINITIONS.filter(r => r.type === 'bike').length,
    }),
    [],
  )

  if (!routes) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0c0f] text-[#64748b] text-sm">
        Loading routes…
      </div>
    )
  }

  const visibleRoutes = routes.filter(r => r.active && (filter === 'all' || r.type === filter))
  const selectedRoute = routes.find(r => r.id === selected)

  return (
    <div className="flex flex-col h-screen bg-[#0a0c0f] text-[#e2e8f0] overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1f2530] bg-[#111318] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-1 text-[11px] font-medium text-[#64748b] hover:text-[#e2e8f0] transition-all pr-2 border-r border-[#1f2530] mr-1"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <div className="w-7 h-7 rounded bg-[#f97316] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide">Boston Fleet Optimizer</span>
          <span className="text-[10px] font-mono text-[#4b5563] bg-[#1f2530] px-2 py-0.5 rounded">v2.4.1</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[#64748b]">
          {gasPrice && (
            <span title={gasPrice.isFallback ? 'Live gas price unavailable — using fallback estimate' : `EIA New England avg, week of ${gasPrice.period}`}>
              Gas (New England avg): <span className="text-[#f97316] font-mono font-semibold">${gasPrice.pricePerGallon.toFixed(2)}/gal</span>
              {gasPrice.isFallback && <span className="ml-1 text-[#4b5563]">≈</span>}
            </span>
          )}
          <span>
            Vehicles online: <span className="text-[#22c55e] font-mono font-semibold">12 / 15</span>
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></div>
            <span className="text-[#22c55e]">Live</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          routes={routes}
          filter={filter}
          selected={selected}
          onFilterChange={setFilter}
          onSelect={setSelected}
          onToggle={toggleRoute}
        />

        <main className="flex-1 relative overflow-hidden">
          <BostonMap
            routes={visibleRoutes}
            hovered={hovered}
            selected={selected}
            onHover={setHovered}
            onSelect={setSelected}
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
            <div className="bg-[#111318]/90 border border-[#1f2530] rounded-lg px-3 py-2 text-[11px]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-0.5 bg-[#f97316]"></div>
                <span className="text-[#64748b]">Truck routes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#22c55e]" style={{ borderTop: '2px dashed #22c55e' }}></div>
                <span className="text-[#64748b]">Bike routes</span>
              </div>
            </div>
          </div>
        </main>

        <RouteDetailPanel routes={routes} selectedRoute={selectedRoute} totalRouteCounts={totalRouteCounts} />
      </div>
    </div>
  )
}
