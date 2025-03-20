"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, TrendingUp, TrendingDown, BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react"

export function AITradingStrategy() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trading Strategy</CardTitle>
        <CardDescription>Current market analysis and trading strategy</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="1min">
                <Clock className="h-3 w-3 mr-1" />
                1m
              </TabsTrigger>
              <TabsTrigger value="5min">
                <Clock className="h-3 w-3 mr-1" />
                5m
              </TabsTrigger>
              <TabsTrigger value="15min">
                <Clock className="h-3 w-3 mr-1" />
                15m
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Market Sentiment</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bearish</span>
                  <span className="text-sm text-muted-foreground">Bullish</span>
                </div>
                <Progress value={65} className="h-2" />
                <div className="flex justify-end">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Moderately Bullish
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Multi-Timeframe Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">1 Minute</span>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Bearish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">5 Minutes</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Bullish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">15 Minutes</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Strongly Bullish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        <span className="text-sm">Daily</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Bullish
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Technical Indicators</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">RSI (14)</span>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      >
                        58.3 - Neutral
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">MACD</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        Bullish Crossover
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moving Averages</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        8/12 Bullish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Volume</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      >
                        Above Average
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Strategy</h3>
                <div className="p-3 border rounded-md">
                  <p className="text-sm">
                    The AI is currently employing a <strong>momentum-based strategy</strong> with a focus on 5-minute
                    and 15-minute timeframes. Looking for pullbacks to key support levels for entry points. Using RSI
                    and MACD for confirmation signals.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Key Levels</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-md">
                    <h4 className="text-xs font-medium text-muted-foreground">Support Levels</h4>
                    <ul className="mt-1 space-y-1">
                      <li className="text-sm">$148.50 (Strong)</li>
                      <li className="text-sm">$146.75</li>
                      <li className="text-sm">$144.20</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-md">
                    <h4 className="text-xs font-medium text-muted-foreground">Resistance Levels</h4>
                    <ul className="mt-1 space-y-1">
                      <li className="text-sm">$152.30 (Current)</li>
                      <li className="text-sm">$154.80</li>
                      <li className="text-sm">$158.25 (Strong)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="1min" className="mt-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">1-Minute Timeframe Analysis</h3>
                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Bearish
                </Badge>
              </div>

              <div className="p-3 border rounded-md bg-yellow-50 dark:bg-yellow-900/10">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Short-term bearish momentum detected. Price is below the 20-period moving average with increasing
                    volume.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Key Indicators</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">RSI (14)</span>
                    <p className="text-sm font-medium">42.8 - Bearish</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">MACD</span>
                    <p className="text-sm font-medium">Bearish Crossover</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <p className="text-sm font-medium">Increasing</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">Price Action</span>
                    <p className="text-sm font-medium">Lower Highs</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">AI Decision</h4>
                <div className="p-3 border rounded-md">
                  <p className="text-sm">
                    The AI is <strong>avoiding new long positions</strong> on the 1-minute timeframe due to bearish
                    momentum. Waiting for reversal confirmation or alignment with higher timeframes.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="5min" className="mt-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">5-Minute Timeframe Analysis</h3>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Bullish
                </Badge>
              </div>

              <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/10">
                <div className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Bullish trend confirmed. Price is above all major moving averages with strong momentum.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Key Indicators</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">RSI (14)</span>
                    <p className="text-sm font-medium">62.5 - Bullish</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">MACD</span>
                    <p className="text-sm font-medium">Bullish Crossover</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <p className="text-sm font-medium">Above Average</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">Price Action</span>
                    <p className="text-sm font-medium">Higher Lows</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">AI Decision</h4>
                <div className="p-3 border rounded-md">
                  <p className="text-sm">
                    The AI is <strong>looking for buying opportunities</strong> on the 5-minute timeframe. Targeting
                    pullbacks to the 20-period EMA for potential entries.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="15min" className="mt-0">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">15-Minute Timeframe Analysis</h3>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Strongly Bullish
                </Badge>
              </div>

              <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/10">
                <div className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Strong bullish trend with potential breakout. Price is testing key resistance levels with increasing
                    volume.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Key Indicators</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">RSI (14)</span>
                    <p className="text-sm font-medium">68.2 - Bullish</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">MACD</span>
                    <p className="text-sm font-medium">Strong Bullish</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">Volume</span>
                    <p className="text-sm font-medium">Increasing</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <span className="text-xs text-muted-foreground">Price Action</span>
                    <p className="text-sm font-medium">Higher Highs</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">AI Decision</h4>
                <div className="p-3 border rounded-md">
                  <p className="text-sm">
                    The AI is <strong>actively seeking buying opportunities</strong> on the 15-minute timeframe.
                    Considering breakout trades with tight stop losses.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

