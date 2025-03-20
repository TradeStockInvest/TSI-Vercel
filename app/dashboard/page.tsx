"use client"

import type React from "react"

import { Suspense } from "react"
import { AITradingAgent } from "@/components/ai-trading-agent"
import { MarketOverview } from "@/components/market-overview"
import { TradingAnalysis } from "@/components/trading-analysis"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PositionsTable } from "@/components/dashboard/positions-table"
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table"
import { MarketAnalysisCard } from "@/components/dashboard/market-analysis-card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Users, Activity } from "lucide-react"

// Mock data
const positions = [
  {
    id: "pos1",
    symbol: "AAPL",
    quantity: 10,
    entryPrice: 187.32,
    currentPrice: 191.45,
    profitLoss: 41.3,
    profitLossPercentage: 2.2,
    isAIGenerated: false,
  },
  {
    id: "pos2",
    symbol: "MSFT",
    quantity: 5,
    entryPrice: 412.65,
    currentPrice: 408.33,
    profitLoss: -21.6,
    profitLossPercentage: -1.05,
    isAIGenerated: true,
  },
]

const tradeHistory = [
  {
    id: "trade1",
    symbol: "GOOGL",
    action: "BUY",
    quantity: 8,
    price: 142.89,
    date: new Date().getTime() - 86400000,
    isAIGenerated: true,
  },
  {
    id: "trade2",
    symbol: "AMZN",
    action: "SELL",
    quantity: 12,
    price: 178.12,
    date: new Date().getTime() - 172800000,
    isAIGenerated: false,
  },
]

const marketData = [
  {
    symbol: "SPY",
    name: "S&P 500 ETF",
    price: 512.34,
    change: 3.45,
    changePercent: 0.68,
    recommendation: "buy",
  },
  {
    symbol: "QQQ",
    name: "Nasdaq 100 ETF",
    price: 437.89,
    change: 5.67,
    changePercent: 1.31,
    recommendation: "buy",
  },
  {
    symbol: "DIA",
    name: "Dow Jones ETF",
    price: 387.65,
    change: -1.23,
    changePercent: -0.32,
    recommendation: "hold",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="grid flex-1 gap-4 md:grid-cols-3">
          <StatsCard
            title="Portfolio Value"
            value="$125,432.67"
            change={2.34}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatsCard title="Today's P/L" value="$1,234.56" change={0.99} icon={<Activity className="h-5 w-5" />} />
          <StatsCard
            title="Active Traders"
            value="12,345"
            change={5.67}
            icon={<Users className="h-5 w-5" />}
            valuePrefix=""
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Live market data and trends</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[400px] overflow-hidden rounded-b-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10"></div>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <TradingAnalysis className="h-full border-0 shadow-none" />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>AI-powered market analysis</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <MarketAnalysisCard title="Top Recommendations" data={marketData} showRecommendations={true} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Positions & History</CardTitle>
            <CardDescription>Your active positions and recent trades</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="positions">
              <TabsList className="mb-4">
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="positions">
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <PositionsTable
                    positions={positions}
                    onClose={(id) => console.log("Close position", id)}
                    onSelect={(symbol) => console.log("Select symbol", symbol)}
                  />
                </Suspense>
              </TabsContent>
              <TabsContent value="history">
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <TradeHistoryTable trades={tradeHistory} />
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Asset distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <PortfolioSummary className="border-0 shadow-none" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Movers</CardTitle>
            <CardDescription>Top gainers and losers</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <MarketOverview className="border-0 shadow-none" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Trading Agent</CardTitle>
            <CardDescription>Automated trading assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <AITradingAgent className="border-0 shadow-none" />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  valuePrefix?: string
}

function StatsCard({ title, value, change, icon, valuePrefix = "$" }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-muted p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs">
          {change > 0 ? (
            <>
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+{change}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              <span className="text-red-500">{change}%</span>
            </>
          )}
          <span className="ml-1 text-muted-foreground">from last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

