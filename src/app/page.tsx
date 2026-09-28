import Link from 'next/link'
import { ROUTE_DEFINITIONS } from '../data/routes'
import { NODES } from '../data/nodes'
import { getSession } from '../lib/auth'
import RouteSketch from '../components/RouteSketch'

const FEATURES = [
  {
    title: 'Street-accurate routes',
    body: 'Every truck and bike loop follows real Boston streets, routed through OSRM with the right driving or cycling profile.',
    accent: '#3b82f6',
  },
  {
    title: 'Real fuel costs',
    body: "Truck costs use this week's New England retail gas price from the U.S. Energy Information Administration.",
    accent: '#f97316',
  },
  {
    title: 'Savings you can see',
    body: 'Time, fuel and CO₂ saved against an unoptimized run, per route and across the whole active fleet.',
    accent: '#22c55e',
  },
  {
    title: 'Trucks and bikes together',
    body: 'Filter by fleet type, switch routes on or off, and see how the mix changes your totals instantly.',
    accent: '#a78bfa',
  },
]

const STEPS = [
  { n: '01', title: 'Sign in', body: 'Operators sign in with their fleet account.' },
  { n: '02', title: 'Review the network', body: 'Every route loads onto a live map of Boston with distance, duration and stops.' },
  { n: '03', title: 'Plan the day', body: 'Toggle routes to see what the day costs and what optimization saves.' },
]

export default async function Home() {
  const session = await getSession()
  const cta = session ? { href: '/dashboard', label: 'Open dashboard' } : { href: '/login', label: 'Sign in' }
  const trucks = ROUTE_DEFINITIONS.filter(r => r.type === 'truck').length
  const bikes = ROUTE_DEFINITIONS.filter(r => r.type === 'bike').length

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#050816]/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/30">
              <span className="text-base font-bold text-cyan-200">R</span>
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-100/80">Routes</span>
          </Link>
          <div className="flex items-center gap-2 text-sm sm:gap-6">
            <a href="#features" className="hidden text-slate-400 transition hover:text-white sm:inline">
              Features
            </a>
            <a href="#how" className="hidden text-slate-400 transition hover:text-white sm:inline">
              How it works
            </a>
            <Link
              href={cta.href}
              className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {cta.label}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(249,115,22,0.10),transparent_35%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-5 inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/90">
                Boston fleet optimizer
              </p>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                Plan every delivery loop in one view.
              </h1>
              <p className="mt-6 max-w-xl text-base text-slate-300 md:text-lg">
                Routes maps your truck and bike fleet across Boston, prices each run with real gas prices, and shows what
                optimization saves in minutes, dollars and CO₂.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={cta.href}
                  className="rounded-2xl bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  {cta.label}
                </Link>
                <a
                  href="#features"
                  className="rounded-2xl border border-slate-700 px-6 py-3 text-base font-medium text-slate-200 transition hover:border-slate-500"
                >
                  See what it does
                </a>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Truck routes</dt>
                  <dd className="mt-1 text-2xl font-semibold text-[#f97316]">{trucks}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Bike routes</dt>
                  <dd className="mt-1 text-2xl font-semibold text-[#22c55e]">{bikes}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">Locations</dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">{Object.keys(NODES).length}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0a0c0f] p-3 shadow-[0_30px_80px_rgba(2,6,23,0.8)]">
              <div className="flex items-center justify-between px-3 pb-3 pt-1 text-[11px] font-mono text-slate-500">
                <span>boston · route network</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3 bg-[#f97316]" /> truck
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-0 w-3 border-t-2 border-dashed border-[#22c55e]" /> bike
                  </span>
                </span>
              </div>
              <RouteSketch className="h-auto w-full rounded-2xl bg-[#0d1016]" />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 border-t border-white/5">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Built on real routing and real prices.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-400">
              No made-up averages. Distances, durations and costs come from live services, with clear estimates when a
              service is unavailable.
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {FEATURES.map(f => (
                <article key={f.title} className="rounded-3xl border border-white/10 bg-slate-900/40 p-6">
                  <span className="block h-1 w-10 rounded-full" style={{ background: f.accent }} />
                  <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-t border-white/5">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">How it works</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map(s => (
                <li key={s.n} className="border-t border-white/10 pt-6">
                  <span className="font-mono text-sm text-cyan-300">{s.n}</span>
                  <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/5">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Ready to plan today&apos;s routes?</h2>
              <p className="mt-2 text-slate-400">Sign in to open the fleet dashboard.</p>
            </div>
            <Link
              href={cta.href}
              className="rounded-2xl bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {cta.label}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6">
          <span>Routes · Boston Fleet Optimizer</span>
          <span>Map data © OpenStreetMap contributors · Routing by OSRM · Gas prices from EIA</span>
        </div>
      </footer>
    </div>
  )
}
