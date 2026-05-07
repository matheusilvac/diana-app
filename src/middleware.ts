import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl.clone()

  // Check if it's a subdomain like salon.diana.app
  // In development, localhost:3000/salon won't have subdomain, so we skip
  const subdomain = hostname.split(".")[0]

  // If accessing root path and it's not a known slug, render normally (login page)
  if (url.pathname === "/") {
    return NextResponse.next()
  }

  // If already accessing a path with slug like /salon-beleza-cia/agenda, allow
  if (url.pathname.startsWith("/") && !url.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
