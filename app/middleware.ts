import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect root to /ideal-three for the Railway preview
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/ideal-three', request.url))
  }
}

export const config = {
  matcher: '/',
}
