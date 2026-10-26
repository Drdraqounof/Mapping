'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { logout } from '../app/actions/auth'
import { useRoutes } from '../lib/useRoutes'
import RoutePanel, { type Filter } from './RoutePanel'

const BostonMap = dynamic(() => import('./BostonMap'), { ssr: false })

function AccountMenu({ user }: { user: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a73e8] text-[16px] font-medium uppercase text-white shadow-[0_1px_3px_rgba(60,64,67,0.3)] ring-2 ring-white hover:bg-[#1765cc]"
      >
        {user.charAt(0)}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl bg-white py-2 shadow-[0_4px_16px_rgba(60,64,67,0.25)]">
          <p className="truncate px-4 pb-2 pt-1 text-[14px] text-[#5f6368]" title={user}>
            {user}
          </p>
          <div className="border-t border-[#e8eaed] pt-1">
            <Link href="/" className="block px-4 py-2.5 text-[14px] text-[#202124] hover:bg-[#f1f3f4]">
              Home page
            </Link>
            <form action={logout}>
              <button type="submit" className="block w-full px-4 py-2.5 text-left text-[14px] text-[#202124] hover:bg-[#f1f3f4]">
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Legend() {
  return (
    <div className="pointer-events-none flex items-center gap-4 rounded-lg bg-white/95 px-3 py-2 text-[13px] text-[#3c4043] shadow-[0_1px_4px_rgba(60,64,67,0.3)]">
      <span className="flex items-center gap-2">
        <span className="h-1 w-5 rounded-full bg-[#e8710a]" /> Truck
      </span>
      <span className="flex items-center gap-2">
        <span className="w-5 border-t-[3px] border-dotted border-[#188038]" /> Bike
      </span>
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full border-2 border-white bg-[#e8710a] shadow" /> Start (Lynn)
      </span>
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full border-2 border-white bg-[#1a73e8] shadow" /> Hub
      </span>
    </div>
  )
}

export default function FleetDashboard({ user }: { user: string }) {
  const { routes, toggleRoute, gasPrice } = useRoutes()
  const [filter, setFilter] = useState<Filter>('all')
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  // The side panel only collapses on desktop; reopen it if the window shrinks to the bottom-sheet layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (!mq.matches) setPanelOpen(true)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const select = (id: string | null) => {
    setSelected(id)
    setHoveredRoute(null)
    panelRef.current?.scrollTo({ top: 0 })
  }

  if (!routes) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#f8f9fa] text-[15px] text-[#5f6368]">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#d2e3fc] border-t-[#1a73e8]" />
        Loading routes…
      </div>
    )
  }

  const visibleRoutes = routes.filter(r => r.active && (filter === 'all' || r.type === filter))
  // A selected route stays on the map even if it's inactive or filtered out.
  const selectedRoute = routes.find(r => r.id === selected)
  const mapRoutes = selectedRoute && !visibleRoutes.includes(selectedRoute) ? [...visibleRoutes, selectedRoute] : visibleRoutes

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-[#e5e3df] text-[#202124]"
      data-sheet={sheetExpanded ? 'expanded' : 'collapsed'}
      style={{ '--sheet-height': sheetExpanded ? '85dvh' : '45dvh' } as React.CSSProperties}
    >
      <div className="absolute inset-0">
        <BostonMap
          routes={mapRoutes}
          hoveredNode={hoveredNode}
          hoveredRoute={hoveredRoute}
          selected={selected}
          panelOpen={panelOpen}
          onHoverNode={setHoveredNode}
          onSelect={select}
        />
      </div>

      {/* Top bar: brand on phones (the panel carries it on desktop), account on the right */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-[1100] flex items-start justify-between gap-3 p-3 lg:p-4 ${
          panelOpen ? 'lg:left-[408px]' : 'lg:left-0'
        }`}
      >
        <div className="pointer-events-auto flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 shadow-[0_2px_6px_rgba(60,64,67,0.3)] lg:hidden">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e8710a]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="truncate text-[16px] text-[#202124]">Boston Fleet Optimizer</span>
        </div>
        <div className="hidden lg:block" />
        <div className="pointer-events-auto">
          <AccountMenu user={user} />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute bottom-6 z-[1000] hidden transition-[left] duration-300 lg:block ${
          panelOpen ? 'left-[432px]' : 'left-6'
        }`}
      >
        <Legend />
      </div>

      {/* Collapse tab on the panel's right edge (desktop only) */}
      <button
        type="button"
        onClick={() => setPanelOpen(o => !o)}
        aria-label={panelOpen ? 'Collapse side panel' : 'Expand side panel'}
        aria-expanded={panelOpen}
        aria-controls="route-panel"
        title={panelOpen ? 'Collapse side panel' : 'Expand side panel'}
        className={`absolute top-4 z-[1060] hidden h-12 w-6 items-center justify-center rounded-r-lg border border-l-0 border-[#dadce0] bg-white text-[#5f6368] shadow-[2px_1px_4px_rgba(60,64,67,0.2)] transition-[left] duration-300 hover:bg-[#f1f3f4] hover:text-[#202124] lg:flex ${
          panelOpen ? 'left-[408px]' : 'left-0'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={panelOpen ? '' : 'rotate-180'}>
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Route panel: full-height side panel on desktop, bottom sheet on phones/tablets */}
      <aside
        id="route-panel"
        className={`absolute inset-x-0 bottom-0 z-[1050] flex flex-col rounded-t-2xl bg-white shadow-[0_-2px_10px_rgba(60,64,67,0.3)] transition-[max-height,transform] duration-300 lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:max-h-none lg:w-[408px] lg:rounded-none lg:border-r lg:border-[#dadce0] lg:shadow-[2px_0_8px_rgba(60,64,67,0.15)] ${
          sheetExpanded ? 'max-h-[85dvh]' : 'max-h-[45dvh]'
        } ${panelOpen ? '' : 'lg:invisible lg:-translate-x-full'}`}
        aria-label="Routes"
      >
        <button
          type="button"
          onClick={() => setSheetExpanded(e => !e)}
          aria-label={sheetExpanded ? 'Collapse panel' : 'Expand panel'}
          aria-expanded={sheetExpanded}
          className="flex w-full shrink-0 justify-center pb-1 pt-2.5 lg:hidden"
        >
          <span className="h-1.5 w-10 rounded-full bg-[#dadce0]" />
        </button>

        <header className="hidden shrink-0 items-center gap-3 px-5 pb-2 pt-5 lg:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8710a]">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h1 className="text-[18px] font-medium leading-tight text-[#202124]">Boston Fleet Optimizer</h1>
            <p className="text-[13px] text-[#5f6368]">
              {routes.filter(r => r.active).length} of {routes.length} routes active
            </p>
          </div>
        </header>

        <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <RoutePanel
            routes={routes}
            filter={filter}
            selectedRoute={selectedRoute}
            gasPrice={gasPrice}
            onFilterChange={setFilter}
            onSelect={select}
            onToggle={toggleRoute}
            onHoverRoute={setHoveredRoute}
          />
        </div>
      </aside>
    </div>
  )
}
