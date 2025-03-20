import Link from "next/link"
import { TrendingUp } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/dashboard" className={className}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none tracking-tight">TradeStock</span>
          <span className="text-xs font-medium text-primary">INVEST</span>
        </div>
      </div>
    </Link>
  )
}

