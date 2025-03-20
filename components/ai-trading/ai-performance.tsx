"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { ArrowUpRight, ArrowDownRight, RotateCcw, RefreshCw, TrendingUp, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface PerformanceData {
  date: string
  profit: number
  trades: number
  winRate: number
}

export function AIPerformance() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalTrades, setTotalTrades] = useState(0)
  const [winRate, setWinRate] = useState(0)
  const [activeTab, setActiveTab] = useState("daily")
  const [isResetting, setIsResetting] = useState(false)
  const { toast } = useToast()

  // Generate sample performance data
  useEffect(() => {
    generatePerformanceData()
  }, [activeTab])

  const generatePerformanceData = () => {
    const data: PerformanceData[] = []
    const now = new Date()
    let totalProfit = 0
    let totalTrades = 0
    let winningTrades = 0

    // Generate different data based on the active tab
    const dataPoints = activeTab === "daily" ? 7 : activeTab === "weekly" ? 4 : 12
    const dateFormat = activeTab === "daily" ? "day" : activeTab === "weekly" ? "week" : "month"

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date()
      if (dateFormat === "day") {
        date.setDate(now.getDate() - i)
      } else if (dateFormat === "week") {
        date.setDate(now.getDate() - i * 7)
      } else {
        date.setMonth(now.getMonth() - i)
      }

      // Generate random profit between -500 and 1500
      const profit = Math.random() * 2000 - 500

      // Generate random number of trades between 5 and 30
      const trades = Math.floor(Math.random() * 25) + 5

      // Generate random win rate between 40% and 80%
      const winRate = Math.random() * 40 + 40

      totalProfit += profit
      totalTrades += trades
      winningTrades += Math.floor(trades * (winRate / 100))

      data.push({
        date: date.toLocaleDateString("en-US", {
          day: dateFormat === "day" ? "numeric" : undefined,
          month: "short",
          year: dateFormat === "month" ? "numeric" : undefined,
        }),
        profit,
        trades,
        winRate,
      })
    }

    setPerformanceData(data)
    setTotalProfit(totalProfit)
    setTotalTrades(totalTrades)
    setWinRate((winningTrades / totalTrades) * 100)
  }

  const handleReset = () => {
    setIsResetting(true)

    // Simulate reset operation
    setTimeout(() => {
      setPerformanceData([])
      setTotalProfit(0)
      setTotalTrades(0)
      setWinRate(0)

      toast({
        title: "Performance Reset",
        description: "Performance data has been reset successfully.",
      })

      // Generate new data after a brief delay
      setTimeout(() => {
        generatePerformanceData()
        setIsResetting(false)
      }, 500)
    }, 1000)
  }

  const handleResetAll = () => {
    setIsResetting(true)

    // Simulate reset all operation
    setTimeout(() => {
      setPerformanceData([])
      setTotalProfit(0)
      setTotalTrades(0)
      setWinRate(0)

      toast({
        title: "All Data Reset",
        description: "All performance data and trading history has been reset.",
      })

      // Generate new data after a brief delay
      setTimeout(() => {
        generatePerformanceData()
        setIsResetting(false)
      }, 500)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>AI Performance</CardTitle>
            <CardDescription>Track the performance of your AI trading bot</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isResetting} className="h-8">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetAll} disabled={isResetting} className="h-8">
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">
                <Calendar className="h-4 w-4 mr-1" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <Calendar className="h-4 w-4 mr-1" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly">
                <Calendar className="h-4 w-4 mr-1" />
                Monthly
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="mt-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                        <h3 className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatCurrency(totalProfit)}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-full ${totalProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                        {totalProfit >= 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                        <h3 className="text-2xl font-bold">{totalTrades}</h3>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                        <h3 className="text-2xl font-bold">{formatPercentage(winRate)}</h3>
                      </div>
                      <div className={`p-2 rounded-full ${winRate >= 50 ? "bg-green-100" : "bg-yellow-100"}`}>
                        {winRate >= 50 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" activeDot={{ r: 8 }} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Same cards as daily but with weekly data */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                        <h3 className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatCurrency(totalProfit)}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-full ${totalProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                        {totalProfit >= 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                        <h3 className="text-2xl font-bold">{totalTrades}</h3>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                        <h3 className="text-2xl font-bold">{formatPercentage(winRate)}</h3>
                      </div>
                      <div className={`p-2 rounded-full ${winRate >= 50 ? "bg-green-100" : "bg-yellow-100"}`}>
                        {winRate >= 50 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit"]}
                      labelFormatter={(label) => `Week: ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" activeDot={{ r: 8 }} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Same cards as daily but with monthly data */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                        <h3 className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatCurrency(totalProfit)}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-full ${totalProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                        {totalProfit >= 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
                        <h3 className="text-2xl font-bold">{totalTrades}</h3>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                        <h3 className="text-2xl font-bold">{formatPercentage(winRate)}</h3>
                      </div>
                      <div className={`p-2 rounded-full ${winRate >= 50 ? "bg-green-100" : "bg-yellow-100"}`}>
                        {winRate >= 50 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" activeDot={{ r: 8 }} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-6">
        <p className="text-sm text-muted-foreground">
          Performance data is updated in real-time as the AI makes trades.
        </p>
      </CardFooter>
    </Card>
  )
}

