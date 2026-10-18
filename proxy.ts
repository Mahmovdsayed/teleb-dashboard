import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { authenticateRequest, verifyAccessToken } from "./lib/auth"
const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/api/")) {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, message: auth.error || "Unauthorized" }, { status: 401 })
    }
    return NextResponse.next()
  }

  const locale = routing.locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))

  if (!locale) return intlMiddleware(request)

  const pathnameWithoutLocale = pathname === `/${locale}` ? "/" : pathname.slice(`/${locale}`.length)
  const isLogin = pathnameWithoutLocale === "/login" || pathnameWithoutLocale.startsWith("/login/")

  const token = request.cookies.get("access_token")?.value
  const result = token ? await verifyAccessToken(token) : null
  const isAuthenticated = Boolean(result?.valid)

  if (token && !isAuthenticated) {
    if (isLogin) {
      const response = intlMiddleware(request)
      response.cookies.delete("access_token")
      return response
    }

    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    response.cookies.delete("access_token")
    return response
  }

  if (!isAuthenticated && !isLogin) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (isAuthenticated && isLogin) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!trpc|_next|_vercel|.*\\..*).*)"],
}
