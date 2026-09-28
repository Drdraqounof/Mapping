'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { logout } from '../app/actions/auth'
import { ROUTE_DEFINITIONS } from '../data/routes'
import { useRoutes } from '../lib/useRoutes'
import Sidebar from './Sidebar'
import RouteDetailPanel from './RouteDetailPanel'
import type { RouteType } from '../lib/types'

const BostonMap = dynamic(() => import('./BostonMap'), { ssr: false })

type Filter = 'all' | RouteType

export default function FleetDashboard({ user }: { user: string }) {
  const { routes, toggleRoute, gasPrice } = useRoutes()
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
  const activeCount = routes.filter(r => r.active).length

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#0a0c0f] text-[#e2e8f0] lg:overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 sm:px-6 py-3 border-b border-[#1f2530] bg-[#111318] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-medium text-[#64748b] hover:text-[#e2e8f0] transition-all pr-2 border-r border-[#1f2530] mr-1"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </Link>
          <div className="w-7 h-7 rounded bg-[#f97316] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide truncate">Boston Fleet Optimizer</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#64748b]">
          {gasPrice && (
            <span
              className="whitespace-nowrap"
              title={gasPrice.isFallback ? 'Live gas price unavailable — using fallback estimate' : `EIA New England avg, week of ${gasPrice.period}`}
            >
              Gas<span className="hidden sm:inline"> (New England avg)</span>:{' '}
              <span className="text-[#f97316] font-mono font-semibold">${gasPrice.pricePerGallon.toFixed(2)}/gal</span>
              {gasPrice.isFallback && <span className="ml-1 text-[#4b5563]">≈</span>}
            </span>
          )}
          <span className="whitespace-nowrap">
            Active routes:{' '}
            <span className="text-[#22c55e] font-mono font-semibold">
              {activeCount} / {routes.length}
            </span>
          </span>
          <form action={logout} className="flex items-center gap-2">
            <span className="hidden md:inline text-[#4b5563] max-w-[16ch] truncate" title={user}>
              {user}
            </span>
            <button
              type="submit"
              className="rounded border border-[#1f2530] px-2 py-1 text-[11px] font-medium text-[#94a3b8] hover:border-[#2d3748] hover:text-[#e2e8f0] transition-all"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row lg:flex-1 lg:overflow-hidden">
        <main className="relative h-[55vh] min-h-[320px] lg:h-auto lg:min-h-0 lg:flex-1 overflow-hidden lg:order-2">
          <BostonMap
            routes={visibleRoutes}
            hovered={hovered}
            selected={selected}
            onHover={setHovered}
            onSelect={setSelected}
          />

          <div className="absolute top-3 right-3 z-[1000] pointer-events-none">
            <div className="bg-[#111318]/90 border border-[#1f2530] rounded-lg px-3 py-2 text-[11px]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-0.5 bg-[#f97316]"></div>
                <span className="text-[#64748b]">Truck routes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0 border-t-2 border-dashed border-[#22c55e]"></div>
                <span className="text-[#64748b]">Bike routes</span>
              </div>
            </div>
          </div>
        </main>

        <div className="lg:order-1 lg:flex">
          <Sidebar
            routes={routes}
            filter={filter}
            selected={selected}
            onFilterChange={setFilter}
            onSelect={setSelected}
            onToggle={toggleRoute}
          />
        </div>

        <div className="lg:order-3 lg:flex">
          <RouteDetailPanel routes={routes} selectedRoute={selectedRoute} totalRouteCounts={totalRouteCounts} />
        </div>
      </div>
    </div>
  )
}
