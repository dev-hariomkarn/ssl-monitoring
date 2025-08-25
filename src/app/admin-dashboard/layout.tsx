"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminAppSidebar } from "@/components/AdminAppSidebar";
import { AdminDashboardHeader } from "@/components/AdminDashboardHeader";

export default function AdminDashboard({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <AdminDashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

