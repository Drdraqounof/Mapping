'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '../actions/auth'

export default function LoginForm({ next, devHint }: { next?: string; devHint?: { email: string; password: string } }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <form className="space-y-5" action={formAction} noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      {state.error && (
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email ?? ''}
          placeholder="you@company.com"
          className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          name="remember"
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-500"
        />
        Keep me signed in for 30 days
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      {devHint && (
        <p className="rounded-2xl border border-dashed border-slate-700 px-4 py-3 text-xs text-slate-400">
          Dev mode: sign in with <span className="font-mono text-slate-200">{devHint.email}</span> /{' '}
          <span className="font-mono text-slate-200">{devHint.password}</span>. Set <span className="font-mono">AUTH_EMAIL</span>{' '}
          and <span className="font-mono">AUTH_PASSWORD</span> to replace them.
        </p>
      )}
    </form>
  )
}
