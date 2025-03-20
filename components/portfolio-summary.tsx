"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChevronDown, ChevronUp, DollarSign, PieChartIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PortfolioSummaryProps {
  className?: string
}

export function PortfolioSummary({ className }: PortfolioSummaryProps) {
  // Mock data for demonstration
  const portfolioValue = 125432.67
  const portfolioChange = 1234.56
  const portfolioChangePercent = 0.99

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", value: 32450.78, change: 1.45, allocation: 25.87 },
    { symbol: "MSFT", name: "Microsoft Corp.", value: 28765.32, change: 0.87, allocation: 22.93 },
    { symbol: "GOOGL", name: "Alphabet Inc.", value: 21345.67, change: 0.32, allocation: 17.02 },
    { symbol: "AMZN", name: "Amazon.com Inc.", value: 18765.43, change: 0.56, allocation: 14.96 },
    { symbol: "TSLA", name: "Tesla Inc.", value: 12345.67, change: -2.34, allocation: 9.84 },
    { symbol: "NVDA", name: "NVIDIA Corp.", value: 11759.8, change: 3.21, allocation: 9.38 },
  ]

  const pieData = holdings.map((holding) => ({
    name: holding.symbol,
    value: holding.allocation,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Portfolio Summary
            </CardTitle>
            <CardDescription>Track your investments and performance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Deposit
            </Button>
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mb-2 grid grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
        </TabsList>
        <CardContent className="p-0 flex-1 flex flex-col">
          <TabsContent value="overview" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">${portfolioValue.toLocaleString()}</span>
                </div>
                <div
                  className={cn("flex items-center text-sm", portfolioChange > 0 ? "text-green-500" : "text-red-500")}
                >
                  {portfolioChange > 0 ? (
                    <ChevronUp className="h-3.5 w-3.5 mr-0.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 mr-0.5" />
                  )}
                  ${Math.abs(portfolioChange).toLocaleString()} ({Math.abs(portfolioChangePercent).toFixed(2)}%) Today
                </div>
              </div>
              <Badge variant={portfolioChange > 0 ? "default" : "destructive"} className="text-xs">
                {portfolioChange > 0 ? "Profit" : "Loss"}
              </Badge>
            </div>
            <div className="flex-1 p-4">
              <ChartContainer className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)}%`, "Allocation"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Total Gain/Loss</div>
                  <div className={cn("text-xl font-bold", portfolioChange > 0 ? "text-green-500" : "text-red-500")}>
                    ${(portfolioValue * 0.12).toLocaleString()}
                  </div>
                  <div className={cn("text-sm", portfolioChange > 0 ? "text-green-500" : "text-red-500")}>+12.34%</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Cash Balance</div>
                  <div className="text-xl font-bold">${(portfolioValue * 0.08).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">8.12% of portfolio</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="holdings" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <h4 className="text-sm font-medium">Your Holdings</h4>
              <span className="text-xs text-muted-foreground">{holdings.length} Assets</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{holding.symbol}</span>
                        <span className="text-xs text-muted-foreground">{holding.name}</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center text-sm",
                          holding.change > 0 ? "text-green-500" : "text-red-500",
                        )}
                      >
                        {holding.change > 0 ? (
                          <ChevronUp className="h-3.5 w-3.5 mr-0.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 mr-0.5" />
                        )}
                        {Math.abs(holding.change).toFixed(2)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">${holding.value.toLocaleString()}</div>
                      <div className="text-muted-foreground">{holding.allocation.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

