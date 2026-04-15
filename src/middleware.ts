import { NextRequest, NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  // Auth bypass — open demo for portfolio display
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
