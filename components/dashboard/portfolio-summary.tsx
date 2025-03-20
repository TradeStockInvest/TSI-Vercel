"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Percent } from "lucide-react"

interface PortfolioData {
  totalValue: number
  cashBalance: number
  invested: number
  dayChange: number
  dayChangePercent: number
  totalReturn: number
  totalReturnPercent: number
  allocation: {
    category: string
    value: number
    percent: number
    color: string
  }[]
}

export function PortfolioSummary() {
  // Sample portfolio data
  const portfolioData: PortfolioData = {
    totalValue: 124568.92,
    cashBalance: 15432.18,
    invested: 109136.74,
    dayChange: 1243.67,
    dayChangePercent: 1.01,
    totalReturn: 24568.92,
    totalReturnPercent: 24.56,
    allocation: [
      {
        category: "Technology",
        value: 42568.45,
        percent: 39,
        color: "bg-blue-500",
      },
      {
        category: "Healthcare",
        value: 18456.23,
        percent: 17,
        color: "bg-green-500",
      },
      {
        category: "Financial",
        value: 15789.65,
        percent: 14,
        color: "bg-purple-500",
      },
      {
        category: "Consumer",
        value: 12568.78,
        percent: 12,
        color: "bg-yellow-500",
      },
      {
        category: "Energy",
        value: 10987.45,
        percent: 10,
        color: "bg-red-500",
      },
      {
        category: "Other",
        value: 8766.18,
        percent: 8,
        color: "bg-gray-500",
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription>Overview of your investment portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Day Change</p>
                <p
                  className={`text-xl font-bold flex items-center ${portfolioData.dayChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {portfolioData.dayChange >= 0 ? (
                    <TrendingUp className="mr-1 h-5 w-5" />
                  ) : (
                    <TrendingDown className="mr-1 h-5 w-5" />
                  )}
                  {portfolioData.dayChange >= 0 ? "+" : ""}${portfolioData.dayChange.toLocaleString()}
                  <span className="ml-1 text-sm">
                    ({portfolioData.dayChange >= 0 ? "+" : ""}
                    {portfolioData.dayChangePercent.toFixed(2)}%)
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cash Balance</p>
                <p className="text-xl font-bold">${portfolioData.cashBalance.toLocaleString()}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Invested</p>
                <p className="text-xl font-bold">${portfolioData.invested.toLocaleString()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="allocation">
            <div className="space-y-4">
              {portfolioData.allocation.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">
                      ${item.value.toLocaleString()} ({item.percent}%)
                    </span>
                  </div>
                  <Progress value={item.percent} className={item.color} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p
                      className={`text-2xl font-bold ${portfolioData.totalReturn >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {portfolioData.totalReturn >= 0 ? "+" : ""}${portfolioData.totalReturn.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
                    <Percent
                      className={`h-8 w-8 ${portfolioData.totalReturnPercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                    />
                  </div>
                </div>
                <p
                  className={`mt-2 text-center text-lg font-semibold ${portfolioData.totalReturnPercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {portfolioData.totalReturnPercent >= 0 ? "+" : ""}
                  {portfolioData.totalReturnPercent.toFixed(2)}%
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Performance calculated since account opening</p>
                <p>Past performance is not indicative of future results</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

