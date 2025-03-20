"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock data for trade history
const mockTradeHistory = [
  { id: 1, symbol: "AAPL", type: "buy", price: 187.68, quantity: 10, date: "2023-11-15T14:30:00", profit: null },
  { id: 2, symbol: "MSFT", type: "buy", price: 337.42, quantity: 5, date: "2023-11-15T13:45:00", profit: null },
  { id: 3, symbol: "NVDA", type: "buy", price: 416.2, quantity: 8, date: "2023-11-15T11:20:00", profit: null },
  { id: 4, symbol: "TSLA", type: "sell", price: 234.3, quantity: 12, date: "2023-11-14T15:45:00", profit: 126.48 },
  { id: 5, symbol: "AMZN", type: "sell", price: 178.75, quantity: 7, date: "2023-11-14T14:20:00", profit: -42.35 },
  { id: 6, symbol: "GOOGL", type: "buy", price: 136.93, quantity: 15, date: "2023-11-14T10:15:00", profit: null },
  { id: 7, symbol: "META", type: "sell", price: 329.75, quantity: 6, date: "2023-11-13T16:30:00", profit: 87.24 },
]

export function TradeHistory() {
  // Use useRef to track if component is mounted to prevent memory leaks
  const isMounted = useRef(true)

  // Use state to store trade history data
  const [tradeHistory, setTradeHistory] = useState<typeof mockTradeHistory>([])

  // Use state to track loading state
  const [isLoading, setIsLoading] = useState(true)

  // Fetch trade history data only once on component mount
  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true

    // Simulate API fetch with a slight delay
    const fetchData = async () => {
      setIsLoading(true)

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Only update state if component is still mounted
      if (isMounted.current) {
        setTradeHistory(mockTradeHistory)
        setIsLoading(false)
      }
    }

    fetchData()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false
    }
  }, []) // Empty dependency array ensures this runs only once

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>Your recent trading activity</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Show loading state
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex animate-pulse items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <div className="h-4 w-16 rounded bg-muted"></div>
                  <div className="h-3 w-24 rounded bg-muted"></div>
                </div>
                <div className="h-4 w-20 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        ) : (
          // Show trade history data
          <div className="space-y-3">
            {tradeHistory.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium">{trade.symbol}</span>
                    <Badge variant={trade.type === "buy" ? "default" : "secondary"} className="ml-2">
                      {trade.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(trade.date)} • {trade.quantity} shares @ ${trade.price.toFixed(2)}
                  </div>
                </div>
                {trade.profit !== null && (
                  <div className="flex items-center">
                    <span className={trade.profit >= 0 ? "text-green-500" : "text-red-500"}>
                      ${Math.abs(trade.profit).toFixed(2)}
                    </span>
                    {trade.profit >= 0 ? (
                      <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="ml-1 h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

