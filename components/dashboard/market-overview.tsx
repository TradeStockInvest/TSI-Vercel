"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap?: string
}

export function MarketOverview() {
  // Sample market data
  const marketData: MarketData[] = [
    {
      symbol: "SPX",
      name: "S&P 500",
      price: 4783.45,
      change: 32.68,
      changePercent: 0.69,
      volume: "2.3B",
      marketCap: "38.2T",
    },
    {
      symbol: "NDX",
      name: "NASDAQ",
      price: 16740.83,
      change: 203.55,
      changePercent: 1.23,
      volume: "5.1B",
      marketCap: "21.5T",
    },
    {
      symbol: "DJI",
      name: "Dow Jones",
      price: 37468.61,
      change: -118.04,
      changePercent: -0.31,
      volume: "345M",
      marketCap: "11.8T",
    },
    {
      symbol: "VIX",
      name: "Volatility Index",
      price: 13.25,
      change: -0.86,
      changePercent: -6.09,
      volume: "N/A",
    },
    {
      symbol: "BTC-USD",
      name: "Bitcoin",
      price: 42568.12,
      change: 1243.67,
      changePercent: 3.01,
      volume: "28.5B",
      marketCap: "834.2B",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Real-time market indices and major assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.symbol}</span>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Vol: {item.volume}
                  {item.marketCap && ` • Cap: ${item.marketCap}`}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-medium">${item.price.toLocaleString()}</div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${
                      item.change >= 0
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    }`}
                  >
                    {item.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)} ({item.change >= 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%)
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

