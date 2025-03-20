"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts"
import { Brain, ChevronDown, ChevronUp, Clock, LineChartIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TradingAnalysisProps {
  className?: string
}

export function TradingAnalysis({ className }: TradingAnalysisProps) {
  const [timeframe, setTimeframe] = useState("1d")
  const [symbol, setSymbol] = useState("AAPL")

  // Mock data for demonstration
  const priceData = [
    { time: "9:30", price: 187.32, volume: 1200000, aiSignal: "neutral" },
    { time: "10:00", price: 187.45, volume: 980000, aiSignal: "neutral" },
    { time: "10:30", price: 187.89, volume: 870000, aiSignal: "buy" },
    { time: "11:00", price: 188.12, volume: 760000, aiSignal: "buy" },
    { time: "11:30", price: 188.34, volume: 650000, aiSignal: "buy" },
    { time: "12:00", price: 188.21, volume: 540000, aiSignal: "neutral" },
    { time: "12:30", price: 188.05, volume: 430000, aiSignal: "neutral" },
    { time: "13:00", price: 187.89, volume: 520000, aiSignal: "neutral" },
    { time: "13:30", price: 187.67, volume: 610000, aiSignal: "sell" },
    { time: "14:00", price: 187.32, volume: 700000, aiSignal: "sell" },
    { time: "14:30", price: 187.56, volume: 790000, aiSignal: "neutral" },
    { time: "15:00", price: 187.89, volume: 880000, aiSignal: "buy" },
    { time: "15:30", price: 188.23, volume: 970000, aiSignal: "buy" },
    { time: "16:00", price: 188.45, volume: 1060000, aiSignal: "buy" },
  ]

  const indicators = [
    { name: "RSI", value: 62, status: "neutral" },
    { name: "MACD", value: 0.23, status: "bullish" },
    { name: "Stochastic", value: 78, status: "bullish" },
    { name: "Bollinger", value: "Upper", status: "bullish" },
    { name: "Moving Avg", value: "Above", status: "bullish" },
  ]

  const aiPredictions = [
    { name: "Short-term", value: "Bullish", confidence: 78 },
    { name: "Medium-term", value: "Bullish", confidence: 65 },
    { name: "Long-term", value: "Neutral", confidence: 52 },
  ]

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "rgba(34, 197, 94, 0.2)"
      case "sell":
        return "rgba(239, 68, 68, 0.2)"
      default:
        return "transparent"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bullish":
        return "text-green-500"
      case "bearish":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "bullish":
        return <ChevronUp className="h-3.5 w-3.5" />
      case "bearish":
        return <ChevronDown className="h-3.5 w-3.5" />
      default:
        return <Clock className="h-3.5 w-3.5" />
    }
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Trading Analysis
            </CardTitle>
            <CardDescription>Advanced chart analysis and AI predictions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="MSFT">MSFT</SelectItem>
                <SelectItem value="GOOGL">GOOGL</SelectItem>
                <SelectItem value="AMZN">AMZN</SelectItem>
                <SelectItem value="TSLA">TSLA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1D</SelectItem>
                <SelectItem value="1w">1W</SelectItem>
                <SelectItem value="1m">1M</SelectItem>
                <SelectItem value="3m">3M</SelectItem>
                <SelectItem value="1y">1Y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="price" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mb-2 grid grid-cols-3">
          <TabsTrigger value="price">Price</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>
        <CardContent className="p-0 flex-1 flex flex-col">
          <TabsContent value="price" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{symbol}</h4>
                <span className="text-2xl font-bold">${priceData[priceData.length - 1].price}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1",
                    priceData[priceData.length - 1].price > priceData[0].price ? "text-green-500" : "text-red-500",
                  )}
                >
                  {priceData[priceData.length - 1].price > priceData[0].price ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(
                    ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100,
                  ).toFixed(2)}
                  %
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Indicators
                </Button>
                <Button variant="outline" size="sm">
                  Compare
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                    {priceData.map((entry, index) => (
                      <rect
                        key={`signal-${index}`}
                        x={`${index * (100 / (priceData.length - 1))}%`}
                        y="0%"
                        width={`${100 / (priceData.length - 1)}%`}
                        height="100%"
                        fill={getSignalColor(entry.aiSignal)}
                        fillOpacity={0.5}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="indicators" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <h4 className="text-sm font-medium">Technical Indicators</h4>
              <Badge variant="outline" className="text-xs">
                {timeframe.toUpperCase()} Timeframe
              </Badge>
            </div>
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Indicator Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {indicators.map((indicator) => (
                      <div key={indicator.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="font-medium">{indicator.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{indicator.value}</span>
                          <span className={cn("flex items-center", getStatusColor(indicator.status))}>
                            {getStatusIcon(indicator.status)}
                            {indicator.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Volume Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 h-[200px]">
                  <ChartContainer className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Bar dataKey="volume" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="ai" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">AI Analysis</h4>
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs">
                Updated 5 min ago
              </Badge>
            </div>
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">AI Predictions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    {aiPredictions.map((prediction) => (
                      <div key={prediction.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{prediction.name}</span>
                          <Badge
                            variant={
                              prediction.value === "Bullish"
                                ? "default"
                                : prediction.value === "Bearish"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {prediction.value}
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              prediction.value === "Bullish"
                                ? "bg-green-500"
                                : prediction.value === "Bearish"
                                  ? "bg-red-500"
                                  : "bg-yellow-500",
                            )}
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          Confidence: {prediction.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">AI Trading Signals</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 h-[200px]">
                  <ChartContainer className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" dot={false} />
                        {priceData.map((entry, index) => {
                          if (entry.aiSignal === "buy") {
                            return (
                              <circle
                                key={`buy-${index}`}
                                cx={`${index * (100 / (priceData.length - 1))}%`}
                                cy={`${
                                  100 -
                                  (
                                    (entry.price - Math.min(...priceData.map((d) => d.price)) + 0.5) /
                                      (Math.max(...priceData.map((d) => d.price)) -
                                        Math.min(...priceData.map((d) => d.price)) +
                                        1)
                                  ) *
                                    100
                                }%`}
                                r="4"
                                fill="rgb(34, 197, 94)"
                              />
                            )
                          } else if (entry.aiSignal === "sell") {
                            return (
                              <circle
                                key={`sell-${index}`}
                                cx={`${index * (100 / (priceData.length - 1))}%`}
                                cy={`${
                                  100 -
                                  (
                                    (entry.price - Math.min(...priceData.map((d) => d.price)) + 0.5) /
                                      (Math.max(...priceData.map((d) => d.price)) -
                                        Math.min(...priceData.map((d) => d.price)) +
                                        1)
                                  ) *
                                    100
                                }%`}
                                r="4"
                                fill="rgb(239, 68, 68)"
                              />
                            )
                          }
                          return null
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

