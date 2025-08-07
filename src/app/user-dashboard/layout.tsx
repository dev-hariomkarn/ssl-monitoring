"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { DashboardHeader } from "@/components/DashboardHeader"

export default function UserDashboard({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  // if (userData.isLoading) {
  //   return <h2>Loading...</h2>
  // }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

