'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/dashboard')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <section className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-sky-500 to-slate-950 p-8 md:p-12">
            <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="text-lg font-bold text-cyan-200">R</span>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-100/80">
                    Routes
                  </p>
                </div>
              </div>

              <div className="mt-10 max-w-xl">
                <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100/80">
                  Fleet intelligence
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Move faster with smarter routing.
                </h1>
                <p className="mt-5 max-w-lg text-base text-slate-200/80 md:text-lg">
                  Monitor live vehicle movement, balance dispatch demand, and keep every route on schedule from one streamlined control center.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Active routes', value: '128' },
                  { label: 'Avg. ETA', value: '12m' },
                  { label: 'On time', value: '96%' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/15 bg-slate-950/20 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-200/70">
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
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300/80">
                  Welcome back
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to Routes</h2>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue="ops@routes.io"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    defaultValue="password123"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-cyan-300 transition hover:text-cyan-200">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                >
                  Sign in
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                <div className="h-px flex-1 bg-slate-700" />
                or continue with
                <div className="h-px flex-1 bg-slate-700" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500">
                  Google
                </button>
                <button className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500">
                  SSO
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-slate-400">
                Need access?{' '}
                <a href="#" className="font-medium text-cyan-300 hover:text-cyan-200">
                  Request an invite
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
