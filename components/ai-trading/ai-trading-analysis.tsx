"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TradingViewChart } from "@/components/charts/trading-view-chart"
import { FallbackChart } from "@/components/charts/fallback-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AITradingAnalysis() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [timeframe, setTimeframe] = useState("D")
  const [chartError, setChartError] = useState<string | null>(null)

  const availableSymbols = [
    { value: "AAPL", label: "Apple Inc." },
    { value: "MSFT", label: "Microsoft Corporation" },
    { value: "GOOGL", label: "Alphabet Inc." },
    { value: "AMZN", label: "Amazon.com Inc." },
    { value: "TSLA", label: "Tesla Inc." },
    { value: "META", label: "Meta Platforms Inc." },
    { value: "NVDA", label: "NVIDIA Corporation" },
  ]

  const timeframes = [
    { value: "1", label: "1 Minute" },
    { value: "5", label: "5 Minutes" },
    { value: "15", label: "15 Minutes" },
    { value: "30", label: "30 Minutes" },
    { value: "60", label: "1 Hour" },
    { value: "D", label: "1 Day" },
    { value: "W", label: "1 Week" },
    { value: "M", label: "1 Month" },
  ]

  // Reset chart error when symbol or timeframe changes
  useEffect(() => {
    setChartError(null)
  }, [selectedSymbol, timeframe])

  // Error handler for chart
  const handleChartError = (error: string) => {
    console.error("Chart error:", error)
    setChartError(error)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Trading Analysis</h1>
        <p className="text-muted-foreground">Advanced market analysis with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>AI Trading Analysis for {selectedSymbol}</CardTitle>
                  <CardDescription>Real-time market data with AI predictions</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full sm:w-48">
                    <Label htmlFor="symbol-select" className="sr-only">
                      Symbol
                    </Label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger id="symbol-select">
                        <SelectValue placeholder="Select symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSymbols.map((symbol) => (
                          <SelectItem key={symbol.value} value={symbol.value}>
                            {symbol.label} ({symbol.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-40">
                    <Label htmlFor="timeframe-select" className="sr-only">
                      Timeframe
                    </Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger id="timeframe-select">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map((tf) => (
                          <SelectItem key={tf.value} value={tf.value}>
                            {tf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative flex-1 min-h-0">
              {chartError ? (
                <div className="h-full flex flex-col">
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Chart Error</AlertTitle>
                    <AlertDescription>
                      There was an error loading the TradingView chart. Using fallback chart instead.
                    </AlertDescription>
                  </Alert>
                  <div className="flex-1">
                    <FallbackChart symbol={selectedSymbol} />
                  </div>
                </div>
              ) : (
                <TradingViewChart
                  symbol={selectedSymbol}
                  interval={timeframe}
                  showAIPredictions={true}
                  container={`tradingview_analysis`}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Market analysis for {selectedSymbol}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-sm">Technical Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    RSI indicates {selectedSymbol} is currently neutral at 52.3. MACD shows bullish momentum with
                    positive divergence.
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-sm">Support & Resistance</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Key support at $145.20 and resistance at $152.80. Price is currently testing the upper resistance
                    level.
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-sm">Volume Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Volume is 15% above 20-day average, indicating strong buying interest. OBV is trending upward.
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-sm">AI Prediction</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The AI model predicts a 65% probability of upward movement in the next 24 hours based on current
                    market conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

