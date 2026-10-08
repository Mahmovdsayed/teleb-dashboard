"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SparklesIcon
} from "lucide-react"

import { useLocale, useTranslations } from "next-intl"
import { useStore } from "@/store"
import { toast } from "@/components/ui/toast"
import { useRouter } from "@/i18n/navigation"
import { useState } from "react"
import { logout } from "@/services/auth"

interface NavUserProps {
  user: {
    id: number
    name: string
    email: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()

  const locale = useLocale()
  const t = useTranslations("dashboard.user")
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const clearUser = useStore((state) => state.clearUser)
  const isArabic = locale === "ar"

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await logout(locale)
      clearUser()
      toast.add({ title: t("logoutSuccess"), type: "success" })
      router.replace("/login")
    } catch (error) {
      const message =
        error instanceof Error && !(error instanceof TypeError)
          ? error.message
          : t("logoutError")
      toast.add({ title: message || t("logoutError"), type: "error" })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-muted"
              />
            }
          >
            <Avatar>
              <AvatarImage
                src=""
                alt={user.name}
              />

              <AvatarFallback>
                {user.name
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name}
              </span>

              <span className="truncate text-xs">
                {user.email}
              </span>
            </div>

            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56"
            side={
              isMobile
                ? "bottom"
                : isArabic
                  ? "left"
                  : "right"
            }
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar>
                    <AvatarImage
                      src=""
                      alt={user.name}
                    />

                    <AvatarFallback>
                      {user.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.name}
                    </span>

                    <span className="truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOutIcon />
              {isLoggingOut ? t("loggingOut") : t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
