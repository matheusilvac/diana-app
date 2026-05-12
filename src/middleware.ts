import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function getHostname(request: NextRequest) {
  const hostHeader = request.headers.get("host")
  const forwardedHostHeader = request.headers.get("x-forwarded-host")

  const raw = (hostHeader || forwardedHostHeader || "").split(",")[0]?.trim() ?? ""
  return raw.split(":")[0].toLowerCase()
}

function getTenantSlugFromHostname(hostname: string) {
  if (!hostname) return null

  if (hostname === "localhost") return null
  if (hostname.endsWith(".localhost")) {
    const slug = hostname.slice(0, -".localhost".length)
    return slug ? slug : null
  }

  const rootDomain = "diana.app"
  if (hostname === rootDomain) return null
  if (hostname === `www.${rootDomain}`) return null

  if (hostname.endsWith(`.${rootDomain}`)) {
    const slug = hostname.slice(0, -`.${rootDomain}`.length)
    return slug ? slug : null
  }

  return null
}

export function middleware(request: NextRequest) {
  const hostname = getHostname(request)
  const tenantSlug = getTenantSlugFromHostname(hostname)
  const url = request.nextUrl.clone()

  const requestHeaders = new Headers(request.headers)
  if (tenantSlug) requestHeaders.set("x-tenant-slug", tenantSlug)

  if (!tenantSlug) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const pathname = url.pathname
  if (pathname === "/selecionar-empresa") {
    return NextResponse.redirect(new URL("/dashboard", request.url), {
      headers: requestHeaders,
    })
  }
  const shouldSkipRewrite =
    pathname === "/" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith(`/${tenantSlug}`)

  if (shouldSkipRewrite) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  url.pathname = `/${tenantSlug}${pathname}`
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
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
