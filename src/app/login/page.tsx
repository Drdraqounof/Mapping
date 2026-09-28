import type { Metadata } from 'next'
import Link from 'next/link'
import { ROUTE_DEFINITIONS } from '../../data/routes'
import { NODES } from '../../data/nodes'
import { DEV_CREDENTIALS, usingDevCredentials } from '../../lib/auth'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Sign in · Routes' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const stats = [
    { label: 'Routes', value: String(ROUTE_DEFINITIONS.length) },
    { label: 'Locations', value: String(Object.keys(NODES).length) },
    { label: 'Fleet types', value: '2' },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-slate-950 p-8 md:p-12">
            <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <Link href="/" className="flex items-center gap-3 self-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="text-lg font-bold text-cyan-200">R</span>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-100/80">Routes</p>
              </Link>

              <div className="mt-10 max-w-xl">
                <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100/80">
                  Boston fleet optimizer
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Move faster with smarter routing.
                </h1>
                <p className="mt-5 max-w-lg text-base text-slate-200/80 md:text-lg">
                  Street-accurate truck and bike routes, real fuel costs from this week&apos;s New England gas price, and the
                  savings from every optimized loop.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                {stats.map(stat => (
                  <div key={stat.label} className="rounded-2xl border border-white/15 bg-slate-950/20 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-200/70 sm:text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-950/70 p-8 md:p-12">
            <div className="w-full">
              <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300/80">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to Routes</h2>
              </div>

              <LoginForm next={next} devHint={usingDevCredentials() ? DEV_CREDENTIALS : undefined} />

              <p className="mt-8 text-center text-sm text-slate-400">
                Need access? Ask your fleet administrator for an account.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
