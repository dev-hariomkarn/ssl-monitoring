import type * as React from "react"
import { BarChart3, Globe, User, CreditCard, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Navigation items
const navItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: BarChart3,
  },
  {
    title: "Domains",
    url: "/admin-dashboard/domains",
    icon: Globe,
  },
  {
    title: "Account Detail",
    url: "/admin-dashboard/account",
    icon: User,
  },
  {
    title: "Subscription",
    url: "/admin-dashboard/subscription",
    icon: CreditCard,
  },
  {
    title: "Security",
    url: "/admin-dashboard/security",
    icon: Shield,
  },
]

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
