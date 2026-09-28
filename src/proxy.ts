import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from './lib/session'

// Optimistic check only — protected pages verify the session again on the server.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)

  if (pathname === '/login') {
    return session ? NextResponse.redirect(new URL('/dashboard', request.url)) : NextResponse.next()
  }

  if (!session) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/map/:path*'],
}
