"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MarketData } from "@/types/trading"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { TrendingUp, TrendingDown, BarChart3, LineChart, PieChart } from "lucide-react"

interface MarketAnalysisCardProps {
  marketData: MarketData
}

export function MarketAnalysisCard({ marketData }: MarketAnalysisCardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const isPositive = marketData.change >= 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{marketData.symbol}</CardTitle>
            <CardDescription>{marketData.name}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(marketData.price)}</div>
            <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
              <span>{formatCurrency(marketData.change)}</span>
              <span className="ml-1">({formatPercentage(marketData.changePercent)})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="fundamental" className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              Fundamental
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Open</h4>
                <p className="text-lg font-semibold">{formatCurrency(marketData.open)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Previous Close</h4>
                <p className="text-lg font-semibold">{formatCurrency(marketData.previousClose)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Day's Range</h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(marketData.low)} - {formatCurrency(marketData.high)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Volume</h4>
                <p className="text-lg font-semibold">{marketData.volume.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">Market Cap</h4>
              <p className="text-lg font-semibold">{formatCurrency(marketData.marketCap, true)}</p>
            </div>
            <div className="mt-6 h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Price chart would render here</p>
            </div>
          </TabsContent>
          <TabsContent value="technical" className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Moving Averages</h4>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-muted p-2 text-center">
                    <div className="text-xs text-muted-foreground">MA 50</div>
                    <div className="font-medium">{formatCurrency(marketData.price * 0.98)}</div>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-center">
                    <div className="text-xs text-muted-foreground">MA 100</div>
                    <div className="font-medium">{formatCurrency(marketData.price * 0.97)}</div>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-center">
                    <div className="text-xs text-muted-foreground">MA 200</div>
                    <div className="font-medium">{formatCurrency(marketData.price * 0.95)}</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Technical Indicators</h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-muted p-2">
                    <div className="text-xs text-muted-foreground">RSI (14)</div>
                    <div className="font-medium">58.24</div>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="text-xs text-muted-foreground">MACD</div>
                    <div className="font-medium">1.25</div>
                  </div>
                </div>
              </div>
              <div className="h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Technical chart would render here</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="fundamental" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">P/E Ratio</h4>
                  <p className="text-lg font-semibold">28.5</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">EPS</h4>
                  <p className="text-lg font-semibold">{formatCurrency(marketData.price / 28.5)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Dividend Yield</h4>
                  <p className="text-lg font-semibold">0.85%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">52-Week Range</h4>
                  <p className="text-lg font-semibold">
                    {formatCurrency(marketData.price * 0.8)} - {formatCurrency(marketData.price * 1.2)}
                  </p>
                </div>
              </div>
              <div className="h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Fundamental data visualization would render here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

