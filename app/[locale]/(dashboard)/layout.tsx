import { AppSidebar } from "@/components/layout/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader"
import { Suspense } from "react"

interface Props {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Suspense fallback={<div className="mb-5 h-16 shrink-0 border-b" />}>
                    <DashboardHeader />
                </Suspense>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}