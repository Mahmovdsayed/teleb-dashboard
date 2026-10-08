import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { verifyAccessToken } from "./lib/auth"
const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const locale = routing.locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))

  if (!locale) return intlMiddleware(request)

  const pathnameWithoutLocale = pathname === `/${locale}` ? "/" : pathname.slice(`/${locale}`.length)
  const isDashboard = pathnameWithoutLocale === "/"
  const isLogin = pathnameWithoutLocale === "/login"

  if (!isDashboard && !isLogin) return intlMiddleware(request)

  const token = request.cookies.get("access_token")?.value
  const result = token ? await verifyAccessToken(token) : null

  if (token && !result?.valid) {
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    response.cookies.delete("access_token")
    return response
  }

  const user = token ? await verifyAccessToken(token) : null

  if (isDashboard && !user) return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  if (isLogin && user) return NextResponse.redirect(new URL(`/${locale}`, request.url))

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
}
