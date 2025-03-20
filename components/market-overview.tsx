"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketItem {
  symbol: string
  name: string
  price: number
  change: number
  volume: number
}

interface MarketOverviewProps {
  className?: string
}

export function MarketOverview({ className }: MarketOverviewProps) {
  // Mock data for demonstration
  const indices = [
    { symbol: "SPY", name: "S&P 500", price: 5123.12, change: 0.75, volume: 4521000 },
    { symbol: "QQQ", name: "Nasdaq", price: 17823.45, change: 1.25, volume: 3245000 },
    { symbol: "DIA", name: "Dow Jones", price: 38765.32, change: -0.32, volume: 2876000 },
    { symbol: "IWM", name: "Russell 2000", price: 2012.87, change: -0.45, volume: 1987000 },
    { symbol: "VIX", name: "Volatility Index", price: 14.32, change: 2.15, volume: 1245000 },
  ]

  const trending = [
    { symbol: "AAPL", name: "Apple Inc.", price: 187.32, change: 1.45, volume: 32450000 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 412.65, change: 0.87, volume: 21345000 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 824.18, change: 3.21, volume: 45678000 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 178.54, change: -2.34, volume: 34567000 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.12, change: 0.56, volume: 23456000 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.89, change: 0.32, volume: 12345000 },
    { symbol: "META", name: "Meta Platforms", price: 485.67, change: 1.78, volume: 19876000 },
  ]

  const sectors = [
    { symbol: "XLK", name: "Technology", price: 187.32, change: 1.23, volume: 12345000 },
    { symbol: "XLF", name: "Financials", price: 39.87, change: -0.45, volume: 9876000 },
    { symbol: "XLE", name: "Energy", price: 87.65, change: 0.67, volume: 8765000 },
    { symbol: "XLV", name: "Healthcare", price: 142.32, change: -0.23, volume: 7654000 },
    { symbol: "XLC", name: "Communication", price: 76.54, change: 0.89, volume: 6543000 },
  ]

  const renderMarketItems = (items: MarketItem[]) => (
    <div className="divide-y">
      {items.map((item) => (
        <div
          key={item.symbol}
          className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.symbol}</span>
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">Vol: {(item.volume / 1000000).toFixed(1)}M</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-medium">${item.price.toFixed(2)}</div>
            <div className={cn("flex items-center text-sm", item.change > 0 ? "text-green-500" : "text-red-500")}>
              {item.change > 0 ? (
                <ChevronUp className="h-3.5 w-3.5 mr-0.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 mr-0.5" />
              )}
              {Math.abs(item.change).toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Market Overview
            </CardTitle>
            <CardDescription>Track market trends and top movers</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className={cn("h-2 w-2 rounded-full", indices[0].change > 0 ? "bg-green-500" : "bg-red-500")} />
              Market {indices[0].change > 0 ? "Up" : "Down"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="indices" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mb-2 grid grid-cols-3">
          <TabsTrigger value="indices">Indices</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
        </TabsList>
        <CardContent className="p-0 flex-1 flex flex-col">
          <TabsContent value="indices" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <ScrollArea className="flex-1">{renderMarketItems(indices)}</ScrollArea>
          </TabsContent>
          <TabsContent value="trending" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <ScrollArea className="flex-1">{renderMarketItems(trending)}</ScrollArea>
          </TabsContent>
          <TabsContent value="sectors" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <ScrollArea className="flex-1">{renderMarketItems(sectors)}</ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

