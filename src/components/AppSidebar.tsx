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

// Navigation items
const navItems = [
  {
    title: "Dashboard",
    url: "/user-dashboard",
    icon: BarChart3,
  },
  {
    title: "Domains",
    url: "/user-dashboard/domains",
    icon: Globe,
  },
  {
    title: "Account Detail",
    url: "/user-dashboard/account",
    icon: User,
  },
  {
    title: "Subscription",
    url: "/user-dashboard/subscription",
    icon: CreditCard,
  },
  {
    title: "Security",
    url: "/user-dashboard/security",
    icon: Shield,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
