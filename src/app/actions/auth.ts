'use server'

import { timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCredentials } from '../../lib/auth'
import { SESSION_COOKIE, SESSION_TTL_LONG, SESSION_TTL_SHORT, signSession } from '../../lib/session'

export interface LoginState {
  error?: string
  email?: string
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

// Only allow redirects back to in-app paths.
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === 'string' ? value : ''
  return next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const remember = formData.get('remember') === 'on'

  if (!email || !password) {
    return { error: 'Enter your email and password.', email }
  }

  const creds = getCredentials()
  if (!creds) {
    return { error: 'Sign-in is not configured on this server.', email }
  }

  // Evaluate both comparisons so timing doesn't reveal which one failed.
  const emailOk = safeEqual(email, creds.email.toLowerCase())
  const passwordOk = safeEqual(password, creds.password)
  if (!emailOk || !passwordOk) {
    return { error: 'Incorrect email or password.', email }
  }

  const ttl = remember ? SESSION_TTL_LONG : SESSION_TTL_SHORT
  const token = await signSession({ sub: email, exp: Math.floor(Date.now() / 1000) + ttl })

  ;(await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Without "remember me", omit maxAge so it's a browser-session cookie.
    ...(remember ? { maxAge: ttl } : {}),
  })

  redirect(safeNext(formData.get('next')))
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/login')
}
