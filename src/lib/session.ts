// Stateless session tokens: base64url(JSON payload) + "." + base64url(HMAC-SHA256).
// Uses Web Crypto only, so it runs in both proxy.ts and server code.

export const SESSION_COOKIE = 'routes_session'
export const SESSION_TTL_SHORT = 60 * 60 * 12 // 12 hours
export const SESSION_TTL_LONG = 60 * 60 * 24 * 30 // 30 days ("remember me")

export interface SessionPayload {
  sub: string
  exp: number // unix seconds
}

const DEV_SECRET = 'dev-only-insecure-session-secret-change-me'

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production')
  }
  return DEV_SECRET
}

const encoder = new TextEncoder()

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4))
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ])
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(body))
  return `${body}.${toBase64Url(new Uint8Array(sig))}`
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null

  try {
    const valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(),
      fromBase64Url(sig) as BufferSource,
      encoder.encode(body),
    )
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload
    if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') return null
    if (payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
