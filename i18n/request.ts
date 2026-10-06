import { getRequestConfig } from "next-intl/server"

import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  return {
    locale: routing.locales.includes(locale as "en" | "ar") ? (locale as "en" | "ar") : routing.defaultLocale,
    messages: (await import(`../messages/${routing.locales.includes(locale as "en" | "ar") ? locale : routing.defaultLocale}.json`)).default,
  }
})
