import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySession } from './session'

export const DEV_CREDENTIALS = { email: 'ops@routes.io', password: 'password123' }

// Single operator account configured via env. Outside production, falls back to demo credentials.
export function getCredentials(): { email: string; password: string } | null {
  const email = process.env.AUTH_EMAIL
  const password = process.env.AUTH_PASSWORD
  if (email && password) return { email, password }
  if (process.env.NODE_ENV === 'production') return null
  return DEV_CREDENTIALS
}

export function usingDevCredentials(): boolean {
  return process.env.NODE_ENV !== 'production' && !(process.env.AUTH_EMAIL && process.env.AUTH_PASSWORD)
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return verifySession(token)
}
