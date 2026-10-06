'use client'

import { Languages } from 'lucide-react'
import { useLocale } from 'next-intl'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from './ui/button'

export const LocaleSwitcher = () => {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    function switchLocale(nextLocale: 'en' | 'ar') {
        if (nextLocale === locale) return

        router.replace(pathname, {
            locale: nextLocale
        })
    }

    return (
        <DropdownMenu >
            <DropdownMenuTrigger
                render={
                    <Button
                        size="icon-lg"
                        variant="outline"
                        aria-label="Switch language"
                    >
                        <Languages />
                    </Button>
                }
            >
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchLocale('en')}>
                    English
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => switchLocale('ar')}>
                    العربية
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}