import { NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import createMiddleware from "next-intl/middleware"

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
//   const pathname = request.nextUrl.pathname
  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
}
