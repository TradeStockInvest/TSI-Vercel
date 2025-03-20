"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountSummaryProps {
  accountInfo: {
    account_number: string
    buying_power: string
    cash: string
    equity: string
    pnl: string
    pnl_percent: string
  }
  loading?: boolean
}

export function AccountSummary({ accountInfo, loading = false }: AccountSummaryProps) {
  const [profitLoss, setProfitLoss] = useState(0)
  const [pnlPercent, setPnlPercent] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Extract the numeric value from the pnl string
    const pnlValue = Number.parseFloat(accountInfo.pnl.replace(/[^\d.-]/g, ""))
    setProfitLoss(pnlValue)

    // Extract the numeric value from the pnl_percent string
    const pnlPercentValue = Number.parseFloat(accountInfo.pnl_percent.replace(/[^\d.-]/g, ""))
    setPnlPercent(pnlPercentValue)

    // Set up interval to update profit/loss every 2 minutes
    const intervalId = setInterval(() => {
      // Simulate fetching new profit/loss data
      const newPnlValue = Number.parseFloat((Math.random() * 3000 - 1500).toFixed(2))
      const newPnlPercentValue = Number.parseFloat((Math.random() * 5 - 2.5).toFixed(2))

      setProfitLoss(newPnlValue)
      setPnlPercent(newPnlPercentValue)
      setLastUpdated(new Date())
    }, 120000) // 2 minutes in milliseconds

    return () => clearInterval(intervalId) // Clean up interval on unmount
  }, [accountInfo.pnl, accountInfo.pnl_percent])

  const isPnlPositive = profitLoss >= 0

  if (loading) {
    return (
      <>
        <Card className="stat-card shimmer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
            <div className="mt-2 h-4 w-16 animate-pulse rounded bg-muted"></div>
          </CardContent>
        </Card>
        <Card className="stat-card shimmer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buying Power</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted"></div>
          </CardContent>
        </Card>
        <Card className="stat-card shimmer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-6 w-24 animate-pulse rounded bg-muted"></div>
            <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted"></div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
          <DollarSign className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accountInfo.equity}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Account #{accountInfo.account_number}</p>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buying Power</CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accountInfo.buying_power}</div>
          <p className="text-xs text-muted-foreground">Available for trading</p>
        </CardContent>
      </Card>
      <Card className={cn("stat-card", isPnlPositive ? "hover:shadow-emerald-100/20" : "hover:shadow-rose-100/20")}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
          {isPnlPositive ? (
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-5 w-5 text-rose-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPnlPositive ? "text-emerald-500" : "text-rose-500"}`}>
            {isPnlPositive ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`}
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${isPnlPositive ? "text-emerald-500/70" : "text-rose-500/70"}`}>
              {pnlPercent >= 0 ? "+" : ""}
              {pnlPercent.toFixed(2)}% today
            </p>
            <p className="text-xs text-muted-foreground">Updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

