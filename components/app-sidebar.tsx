"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  Brain,
  CreditCard,
  DollarSign,
  Globe,
  Home,
  LineChart,
  PieChart,
  Settings,
  TrendingUp,
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="border-r">
      <SidebarHeader className="border-b px-6 py-3">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/trading"}>
              <Link href="/dashboard/trading" className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                <span>Trading</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/portfolio"}>
              <Link href="/dashboard/portfolio" className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                <span>Portfolio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/ai-trading"}>
              <Link href="/dashboard/ai-trading" className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                <span>AI Trading</span>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-primary">
                  PRO
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/market"}>
              <Link href="/dashboard/market" className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>Market</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/analytics"}>
              <Link href="/dashboard/analytics" className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="my-2 border-t"></div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/transactions"}>
              <Link href="/dashboard/transactions" className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <span>Transactions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/billing"}>
              <Link href="/dashboard/billing" className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="my-2 border-t"></div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Upgrade to Pro</span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Unlock advanced features and AI-powered trading strategies.
          </p>
          <Link
            href="/subscription"
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Upgrade Now
          </Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

