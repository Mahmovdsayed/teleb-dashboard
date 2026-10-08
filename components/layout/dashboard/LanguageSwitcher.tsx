"use client"

import { Check, Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { usePathname, useRouter } from "@/i18n/navigation"

const LanguageSwitcher = () => {
    const locale = useLocale()
    const t = useTranslations("LanguageSwitcher")
    const router = useRouter()
    const pathname = usePathname()

    const changeLocale = (nextLocale: "en" | "ar") => {
        if (nextLocale === locale) return

        router.replace(pathname, {
            locale: nextLocale
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        size="icon"
                        className="border shadow-none transition-all duration-300"
                    />
                }
            >
                <Languages className="h-4 w-4" />

                <span className="sr-only">
                    {t("label")}
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-30 p-1 shadow-lg"
            >
                <DropdownMenuItem
                    className="font-medium"
                    onClick={() => changeLocale("en")}
                >
                    <span>English</span>

                    {locale === "en" && (
                        <Check className="ms-auto h-4 w-4" />
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="font-medium"
                    onClick={() => changeLocale("ar")}
                >
                    <span>العربية</span>

                    {locale === "ar" && (
                        <Check className="ms-auto h-4 w-4" />
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageSwitcher