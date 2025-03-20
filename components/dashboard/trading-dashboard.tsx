"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserAccount, type UserAccount } from "@/services/user-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatPercentage } from "@/utils/format"

export function TradingDashboard() {
  const { user } = useAuth()
  const [accountData, setAccountData] = useState<UserAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAccountData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const account = await getUserAccount(user.id)

        // If account exists, use it; otherwise use default zero values
        if (account) {
          setAccountData(account)
        } else {
          // Set default zero values for new accounts
          setAccountData({
            id: user.id,
            email: user.email || "",
            name: user.name || "",
            accountBalance: 0,
            buyingPower: 0,
            totalProfitLoss: 0,
            totalProfitLossPercent: 0,
            positions: [],
            tradeHistory: [],
            aiEnabled: false,
            aiSettings: {
              enabled: false,
              riskLevel: "medium",
              maxPositions: 5,
              maxLoss: 5,
              timeframes: ["1D"],
              scalpingMode: false,
              useHistoricalData: false,
              continuousOperation: false,
              favoriteSymbols: [],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      } catch (err) {
        console.error("Failed to load account data:", err)
        setError("Failed to load account data")
      } finally {
        setLoading(false)
      }
    }

    loadAccountData()
  }, [user?.id])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <DashboardError error={error} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(accountData?.accountBalance || 0)}</div>
          <p className="text-xs text-muted-foreground">Total value of your account</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buying Power</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(accountData?.buyingPower || 0)}</div>
          <p className="text-xs text-muted-foreground">Available funds for trading</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${(accountData?.totalProfitLoss || 0) > 0 ? "text-green-500" : (accountData?.totalProfitLoss || 0) < 0 ? "text-red-500" : ""}`}
          >
            {formatCurrency(accountData?.totalProfitLoss || 0)} (
            {formatPercentage(accountData?.totalProfitLossPercent || 0)})
          </div>
          <p className="text-xs text-muted-foreground">Overall profit/loss</p>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-3 w-[150px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DashboardError({ error }: { error: string }) {
  return (
    <Card className="border-red-300">
      <CardHeader>
        <CardTitle className="text-red-500">Error Loading Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error}</p>
        <p className="mt-2">Please try refreshing the page or contact support if the issue persists.</p>
      </CardContent>
    </Card>
  )
}

