"use client"

import * as React from "react"

import { NavMain } from "@/components/layout/dashboard/nav-main"
import { NavProjects } from "@/components/layout/dashboard/nav-projects"
import { NavUser } from "@/components/layout/dashboard/nav-user"
import { TeamSwitcher } from "@/components/layout/dashboard/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, PackageIcon, ShoppingCartIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"
import { useStore } from "@/store"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  navMain: [
    {
      title: "dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "products",
      url: "/products",
      icon: <PackageIcon />,
    },
    {
      title: "orders",
      url: "#",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "settings",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale()
  const user = useStore((state) => state.user)
  const t = useTranslations("dashboard")
  const navMain = data.navMain.map((item) => ({
    ...item,
    title: t(`navigation.${item.title}`),
  }))
  return (
    <Sidebar side={locale === "ar" ? "right" : "left"} collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher name={t("brand")} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={t("navigation.title")} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
