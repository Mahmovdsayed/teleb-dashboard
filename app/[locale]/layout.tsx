import { Cairo, Montserrat } from "next/font/google"
import { hasLocale } from "next-intl"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import Provider from "@/provider/Provider"
import "../globals.css"
import { Metadata } from "next"

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

export const metadata: Metadata = {
  title: "Teleb Furniture",
  description: "Teleb Furniture is one of very few companies in Egypt who are designing and producing knocked down furniture. Using modern machinery has allowed Teleb Furniture to produce products with the highest quality at competitive prices, while the highly skilled craftsmen have contributed to high level of differentiation by adding the ethnic hand-made touch to different furniture items.",
};

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