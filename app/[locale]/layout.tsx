import { Cairo, Montserrat } from "next/font/google"
import { hasLocale } from "next-intl"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import Provider from "@/provider/Provider"
import "./globals.css"

interface Props {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap"
})

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  variable: "--font-cairo",
  display: "swap"
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const direction = locale === "ar" ? "rtl" : "ltr"

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        montserrat.variable,
        cairo.variable,
      )}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <Provider>
            {children}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}