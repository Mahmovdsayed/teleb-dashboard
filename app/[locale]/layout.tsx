import { Cairo, Montserrat } from "next/font/google"
import { hasLocale } from "next-intl"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import Provider from "@/provider/Provider"
import "../globals.css"
import { Metadata, Viewport } from "next"

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

const siteUrl = "https://dashboard.teleb-furniture.com"


export const metadata: Metadata = {
  title: "Teleb Furniture",
  description: "Teleb Furniture is one of very few companies in Egypt who are designing and producing knocked down furniture. Using modern machinery has allowed Teleb Furniture to produce products with the highest quality at competitive prices, while the highly skilled craftsmen have contributed to high level of differentiation by adding the ethnic hand-made touch to different furniture items.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    url: siteUrl,
    siteName: "Teleb Furniture",
    title: 'Teleb Furniture',
    description: "Teleb Furniture is one of very few companies in Egypt who are designing and producing knocked down furniture. Using modern machinery has allowed Teleb Furniture to produce products with the highest quality at competitive prices, while the highly skilled craftsmen have contributed to high level of differentiation by adding the ethnic hand-made touch to different furniture items.",
    images: [
      {
        url: `/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Teleb Furniture',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teleb Furniture - Premium Furniture in Egypt | طلب للأثاث',
    description: "Teleb Furniture is one of very few companies in Egypt who are designing and producing knocked down furniture. Using modern machinery has allowed Teleb Furniture to produce products with the highest quality at competitive prices, while the highly skilled craftsmen have contributed to high level of differentiation by adding the ethnic hand-made touch to different furniture items.",
    images: [`/og-image.png`],
    creator: '@teleb',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': `${siteUrl}/en`,
      'ar': `${siteUrl}/ar`,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};


export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
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