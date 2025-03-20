import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Overview
      </Link>
      <Link
        href="/dashboard/ai-trading"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        AI Trading
      </Link>
      <Link
        href="/dashboard/ai-trading/analysis"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Analysis
      </Link>
      <Link
        href="/dashboard/portfolio"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Portfolio
      </Link>
      <Link
        href="/dashboard/settings"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Settings
      </Link>
    </nav>
  )
}

