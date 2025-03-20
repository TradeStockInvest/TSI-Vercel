"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { UserNav } from "@/components/user-nav"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, HelpCircle, Search } from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState("Dashboard")

  useEffect(() => {
    // Set page title based on pathname
    const path = pathname.split("/").pop() || "dashboard"
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "))
  }, [pathname])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <AppSidebar />
        <SidebarInset className="noise-bg gradient-bg">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1 h-9 w-9" />
            <div className="flex items-center gap-2 md:hidden">
              <Logo />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex md:w-64 lg:w-80">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-full bg-muted py-2 pl-8 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    3
                  </span>
                </Button>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <ModeToggle />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 noise-bg">
            <div className="relative z-10">{children}</div>
          </main>
          <footer className="border-t py-3 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} TradeStockInvest. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                  Terms
                </a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                  Privacy
                </a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

