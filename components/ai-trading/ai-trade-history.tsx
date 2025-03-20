"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Trade {
  id: string
  symbol: string
  side: "buy" | "sell"
  quantity: number
  price: number
  timestamp: string
  status: "open" | "closed"
  profit?: number
  profitPercentage?: number
  reasoning: string
  assetClass: string
  isResetMarker?: boolean
}

export function AITradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading trades from an API or local storage
    setTimeout(() => {
      const sampleTrades: Trade[] = [
        {
          id: "1",
          symbol: "AAPL",
          side: "buy",
          quantity: 10,
          price: 170.5,
          timestamp: "2024-01-01T10:00:00",
          status: "closed",
          profit: 50.0,
          profitPercentage: 2.93,
          reasoning: "Bullish trend detected",
          assetClass: "stock",
        },
        {
          id: "2",
          symbol: "MSFT",
          side: "sell",
          quantity: 5,
          price: 380.2,
          timestamp: "2024-01-02T14:30:00",
          status: "closed",
          profit: -25.0,
          profitPercentage: -1.31,
          reasoning: "Bearish signal confirmed",
          assetClass: "stock",
        },
        {
          id: "3",
          symbol: "BTC",
          side: "buy",
          quantity: 1,
          price: 42000,
          timestamp: "2024-01-03T09:15:00",
          status: "open",
          reasoning: "Anticipating price increase",
          assetClass: "crypto",
        },
      ]
      setTrades(sampleTrades)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trade History</CardTitle>
        <CardDescription>Past trades executed by the AI trading bot</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading trade history...</p>
        ) : trades.length === 0 ? (
          <p>No trade history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Reasoning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>{trade.side}</TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell>{trade.price}</TableCell>
                    <TableCell>{trade.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={trade.status === "open" ? "secondary" : "default"}>{trade.status}</Badge>
                    </TableCell>
                    <TableCell>{trade.profit ? trade.profit.toFixed(2) : "-"}</TableCell>
                    <TableCell>{trade.reasoning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

