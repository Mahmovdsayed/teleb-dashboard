import { AppSidebar } from "@/components/layout/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader"

interface Props {
    children: React.ReactNode
}

export default function DashboardLayout({
    children
}: Props) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashboardHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}