'use client'

import { NODES } from '../data/nodes'
import { BIKE_SPEED_KMH, inefficiencyFactor } from '../lib/theme'
import { formatDuration, formatKm, formatUsd } from '../lib/format'
import type { GasPriceResponse } from '../app/api/gas-price/route'
import type { Route, RouteType } from '../lib/types'

export type Filter = 'all' | RouteType

const TYPE_STYLE: Record<RouteType, { color: string; bg: string; label: string }> = {
  truck: { color: '#e8710a', bg: '#fef0e5', label: 'Truck route' },
  bike: { color: '#188038', bg: '#e6f4ea', label: 'Bike route' },
}

function TypeIcon({ type, size = 40 }: { type: RouteType; size?: number }) {
  const s = TYPE_STYLE[type]
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: s.bg, color: s.color }}
      aria-hidden
    >
      {type === 'truck' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10 2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
        </svg>
      )}
    </span>
  )
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={checked ? 'Active — click to turn off' : 'Inactive — click to turn on'}
      onClick={e => {
        e.stopPropagation()
        onChange()
      }}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 ${
        checked ? 'bg-[#1a73e8]' : 'bg-[#bdc1c6]'
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-1'}`}
      />
    </button>
  )
}

function routeSummaryLine(route: Route) {
  return `${formatDuration(route.duration)} · ${formatKm(route.distance)}`
}

function FleetSummary({ routes, gasPrice }: { routes: Route[]; gasPrice: GasPriceResponse | null }) {
  const active = routes.filter(r => r.active)
  const time = active.reduce((s, r) => s + r.savings.time, 0)
  const fuel = active.reduce((s, r) => s + r.savings.fuel, 0)
  const co2 = active.reduce((s, r) => s + r.savings.co2, 0)

  return (
    <section className="mx-4 rounded-xl border border-[#dadce0] p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-medium text-[#202124]">Today&apos;s estimated savings</h2>
        <span className="text-[13px] text-[#5f6368]">{active.length} active</span>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-[#e8f0fe] px-2 py-2.5">
          <dd className="text-[18px] font-medium text-[#1967d2]">{formatDuration(time)}</dd>
          <dt className="text-[12px] text-[#5f6368]">time</dt>
        </div>
        <div className="rounded-lg bg-[#fef0e5] px-2 py-2.5">
          <dd className="text-[18px] font-medium text-[#b45309]">{formatUsd(fuel)}</dd>
          <dt className="text-[12px] text-[#5f6368]">fuel</dt>
        </div>
        <div className="rounded-lg bg-[#e6f4ea] px-2 py-2.5">
          <dd className="text-[18px] font-medium text-[#137333]">{co2.toFixed(1)} kg</dd>
          <dt className="text-[12px] text-[#5f6368]">CO₂</dt>
        </div>
      </dl>
      {gasPrice && (
        <p className="mt-3 text-[13px] text-[#5f6368]">
          Gas {gasPrice.isFallback && '≈ '}
          <span className="font-medium text-[#202124]">${gasPrice.pricePerGallon.toFixed(2)}/gal</span>
          {gasPrice.isFallback ? ' · estimate, live price unavailable' : ` · New England avg, week of ${gasPrice.period}`}
        </p>
      )}
    </section>
  )
}

function RouteList({
  routes,
  filter,
  onFilterChange,
  onSelect,
  onToggle,
  onHoverRoute,
  gasPrice,
}: {
  routes: Route[]
  filter: Filter
  onFilterChange: (f: Filter) => void
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onHoverRoute: (id: string | null) => void
  gasPrice: GasPriceResponse | null
}) {
  const visible = routes.filter(r => filter === 'all' || r.type === filter)
  const count = (t: Filter) => (t === 'all' ? routes.length : routes.filter(r => r.type === t).length)

  return (
    <>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
        {(['all', 'truck', 'bike'] as const).map(f => {
          const on = filter === f
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => onFilterChange(f)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[14px] font-medium transition-colors ${
                on
                  ? 'border-[#d2e3fc] bg-[#e8f0fe] text-[#1967d2]'
                  : 'border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'truck' ? 'Trucks' : 'Bikes'} <span className="opacity-70">{count(f)}</span>
            </button>
          )
        })}
      </div>

      <FleetSummary routes={routes} gasPrice={gasPrice} />

      <ul className="mt-2 divide-y divide-[#e8eaed]" onMouseLeave={() => onHoverRoute(null)}>
        {visible.map(route => (
          <li key={route.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(route.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(route.id))}
              onMouseEnter={() => onHoverRoute(route.id)}
              className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#f8f9fa] focus:bg-[#f1f3f4] focus:outline-none"
            >
              <TypeIcon type={route.type} />
              <div className={`min-w-0 flex-1 ${route.active ? '' : 'opacity-60'}`}>
                <p className="truncate text-[15px] font-medium text-[#202124]">{route.name}</p>
                <p className="text-[14px] text-[#3c4043]">
                  {routeSummaryLine(route)}
                  {route.isFallbackGeometry && <span title="Live routing unavailable, straight-line estimate"> ≈</span>}
                </p>
                <p className="text-[13px] text-[#5f6368]">
                  {route.active ? (
                    <>
                      <span className="text-[#137333]">Saves {formatDuration(route.savings.time)}</span>
                      {route.type === 'truck' && ` · ${formatUsd(route.fuelCost)} fuel`}
                    </>
                  ) : (
                    'Inactive'
                  )}
                </p>
              </div>
              <Switch checked={route.active} label={`${route.active ? 'Deactivate' : 'Activate'} ${route.name}`} onChange={() => onToggle(route.id)} />
            </div>
          </li>
        ))}
      </ul>

      <p className="px-4 py-4 text-[12px] text-[#5f6368]">Adding routes isn&apos;t available yet.</p>
    </>
  )
}

function RouteDetail({ route, onBack, onToggle }: { route: Route; onBack: () => void; onToggle: (id: string) => void }) {
  const style = TYPE_STYLE[route.type]
  const stops = route.stops.filter(s => NODES[s])
  const pct = Math.round(inefficiencyFactor(route.type) * 100)

  return (
    <div className="pb-4">
      <div className="flex items-center gap-1 px-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to all routes"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <span className="text-[14px] text-[#5f6368]">All routes</span>
      </div>

      <div className="px-5 pt-2">
        <div className="flex items-start gap-3">
          <TypeIcon type={route.type} size={44} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[22px] font-normal leading-tight text-[#202124]">{route.name}</h2>
            <p className="mt-0.5 text-[14px]" style={{ color: style.color }}>
              {style.label}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f8f9fa] px-4 py-3">
          <div>
            <p className="text-[24px] font-medium leading-none text-[#137333]">{formatDuration(route.duration)}</p>
            <p className="mt-1.5 text-[14px] text-[#5f6368]">
              {formatKm(route.distance)} · {stops.length} stops
            </p>
          </div>
          <label className="flex items-center gap-2 text-[14px] text-[#3c4043]">
            {route.active ? 'Active' : 'Inactive'}
            <Switch checked={route.active} label={`${route.active ? 'Deactivate' : 'Activate'} ${route.name}`} onChange={() => onToggle(route.id)} />
          </label>
        </div>
        <p className="mt-2 text-[12px] text-[#5f6368]">
          {route.isFallbackGeometry
            ? `≈ Routing service unavailable — straight-line estimate at ${route.type === 'bike' ? BIKE_SPEED_KMH : 25} km/h.`
            : route.type === 'bike'
              ? `Street route from OSRM. Time assumes an average cargo-bike speed of ${BIKE_SPEED_KMH} km/h.`
              : 'Street route from OSRM. Times don’t include live traffic.'}
        </p>

        {route.type === 'truck' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#dadce0] px-4 py-3">
              <p className="text-[13px] text-[#5f6368]">Fuel cost</p>
              <p className="text-[18px] font-medium text-[#202124]">{formatUsd(route.fuelCost)}</p>
            </div>
            <div className="rounded-xl border border-[#dadce0] px-4 py-3">
              <p className="text-[13px] text-[#5f6368]">CO₂ output</p>
              <p className="text-[18px] font-medium text-[#202124]">{route.co2.toFixed(1)} kg</p>
            </div>
          </div>
        )}

        <h3 className="mt-6 text-[15px] font-medium text-[#202124]">Estimated savings</h3>
        <p className="text-[12px] text-[#5f6368]">Compared with an unoptimized stop order, assumed {pct}% longer.</p>
        <ul className="mt-2 space-y-1.5 text-[14px]">
          <li className="flex justify-between">
            <span className="text-[#3c4043]">Time</span>
            <span className="font-medium text-[#137333]">{formatDuration(route.savings.time)}</span>
          </li>
          {route.type === 'truck' && (
            <>
              <li className="flex justify-between">
                <span className="text-[#3c4043]">Fuel</span>
                <span className="font-medium text-[#137333]">{formatUsd(route.savings.fuel)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#3c4043]">CO₂</span>
                <span className="font-medium text-[#137333]">{route.savings.co2.toFixed(1)} kg</span>
              </li>
            </>
          )}
        </ul>

        <h3 className="mt-6 text-[15px] font-medium text-[#202124]">Stops</h3>
        <ol className="mt-3">
          {stops.map((stop, i) => {
            const isEnd = i === 0 || i === stops.length - 1
            return (
              <li key={`${stop}-${i}`} className="relative flex gap-4 pb-4 last:pb-0">
                {i < stops.length - 1 && (
                  <span className="absolute left-[11px] top-6 h-full w-0 border-l-2 border-dotted border-[#bdc1c6]" aria-hidden />
                )}
                <span
                  className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-medium"
                  style={
                    isEnd
                      ? { background: style.color, color: '#fff' }
                      : { background: '#fff', color: '#3c4043', border: '2px solid #5f6368' }
                  }
                >
                  {i === 0 ? 'A' : i === stops.length - 1 ? 'B' : i}
                </span>
                <div className="pt-0.5">
                  <p className="text-[14px] text-[#202124]">{NODES[stop].label}</p>
                  {isEnd && <p className="text-[12px] text-[#5f6368]">{i === 0 ? 'Start' : 'Finish'}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default function RoutePanel(props: {
  routes: Route[]
  filter: Filter
  selectedRoute: Route | undefined
  gasPrice: GasPriceResponse | null
  onFilterChange: (f: Filter) => void
  onSelect: (id: string | null) => void
  onToggle: (id: string) => void
  onHoverRoute: (id: string | null) => void
}) {
  if (props.selectedRoute) {
    return <RouteDetail route={props.selectedRoute} onBack={() => props.onSelect(null)} onToggle={props.onToggle} />
  }
  return (
    <RouteList
      routes={props.routes}
      filter={props.filter}
      onFilterChange={props.onFilterChange}
      onSelect={props.onSelect}
      onToggle={props.onToggle}
      onHoverRoute={props.onHoverRoute}
      gasPrice={props.gasPrice}
    />
  )
}
