"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, X, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface Position {
  id: string
  symbol: string
  type: "buy" | "sell"
  entryPrice: number
  currentPrice: number
  quantity: number
  entryTime: Date
  pl: number
  plPercentage: number
  status: "open" | "closed"
}

interface AIPositionsProps {
  onViewPosition?: (symbol: string) => void
  onClosePosition?: (id: string) => void
}

export function AIManagedPositions({ onViewPosition, onClosePosition }: AIPositionsProps) {
  const [positions, setPositions] = useState<Position[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const { toast } = useToast()

  // Simulate fetching positions from an API
  const fetchPositions = useCallback(() => {
    // In a real app, this would be an API call
    // For now, we'll just use the existing positions and update their prices
    setPositions((prevPositions) =>
      prevPositions.map((position) => {
        if (position.status === "closed") return position

        // Simulate price movement
        const priceChange = (Math.random() - 0.48) * 0.1 * position.entryPrice
        const newPrice = position.currentPrice + priceChange

        // Calculate new P/L values
        const pl = (newPrice - position.entryPrice) * position.quantity * (position.type === "buy" ? 1 : -1)
        const plPercentage =
          ((newPrice - position.entryPrice) / position.entryPrice) * 100 * (position.type === "buy" ? 1 : -1)

        return {
          ...position,
          currentPrice: newPrice,
          pl,
          plPercentage,
        }
      }),
    )
    setLastUpdate(new Date())
  }, [])

  // Initial positions (in a real app, these would come from an API)
  useEffect(() => {
    // Sample data
    const initialPositions: Position[] = [
      {
        id: "pos-1",
        symbol: "AAPL",
        type: "buy",
        entryPrice: 175.23,
        currentPrice: 175.23,
        quantity: 10,
        entryTime: new Date(Date.now() - 3600000), // 1 hour ago
        pl: 0,
        plPercentage: 0,
        status: "open",
      },
      {
        id: "pos-2",
        symbol: "MSFT",
        type: "buy",
        entryPrice: 328.45,
        currentPrice: 328.45,
        quantity: 5,
        entryTime: new Date(Date.now() - 7200000), // 2 hours ago
        pl: 0,
        plPercentage: 0,
        status: "open",
      },
      {
        id: "pos-3",
        symbol: "TSLA",
        type: "sell",
        entryPrice: 245.12,
        currentPrice: 245.12,
        quantity: 8,
        entryTime: new Date(Date.now() - 10800000), // 3 hours ago
        pl: 0,
        plPercentage: 0,
        status: "open",
      },
    ]

    setPositions(initialPositions)
  }, [])

  // Update positions at a high refresh rate (20ms)
  useEffect(() => {
    const intervalId = setInterval(fetchPositions, 20)
    return () => clearInterval(intervalId)
  }, [fetchPositions])

  // Handle view position
  const handleViewPosition = (symbol: string) => {
    if (onViewPosition) {
      onViewPosition(symbol)
    } else {
      toast({
        title: "View Position",
        description: `Viewing position for ${symbol}`,
      })
    }
  }

  // Handle close position
  const handleClosePosition = (id: string) => {
    if (onClosePosition) {
      onClosePosition(id)
    } else {
      setPositions((prevPositions) =>
        prevPositions.map((position) => (position.id === id ? { ...position, status: "closed" } : position)),
      )

      toast({
        title: "Position Closed",
        description: "The position has been closed successfully.",
      })
    }
  }

  // Get color based on P/L
  const getPLColor = (pl: number) => {
    if (pl > 0) return "text-green-500"
    if (pl < 0) return "text-red-500"
    return "text-gray-500"
  }

  // Get background color based on P/L for row highlighting
  const getRowBgColor = (pl: number) => {
    if (pl > 0) return "bg-green-50 dark:bg-green-900/10"
    if (pl < 0) return "bg-red-50 dark:bg-red-900/10"
    return ""
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Managed Positions</CardTitle>
            <CardDescription>Positions currently managed by the AI trading bot</CardDescription>
          </div>
          <div className="text-xs text-muted-foreground">
            <Clock className="inline-block w-3 h-3 mr-1" />
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>P/L %</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions
                .filter((p) => p.status === "open")
                .map((position) => (
                  <TableRow key={position.id} className={getRowBgColor(position.pl)}>
                    <TableCell className="font-medium">{position.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={position.type === "buy" ? "default" : "secondary"}>
                        {position.type === "buy" ? (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" /> Buy
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 mr-1" /> Sell
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(position.entryPrice)}</TableCell>
                    <TableCell>{formatCurrency(position.currentPrice)}</TableCell>
                    <TableCell>{position.quantity}</TableCell>
                    <TableCell>{position.entryTime.toLocaleTimeString()}</TableCell>
                    <TableCell className={getPLColor(position.pl)}>{formatCurrency(position.pl)}</TableCell>
                    <TableCell className={getPLColor(position.plPercentage)}>
                      {formatPercentage(position.plPercentage)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewPosition(position.symbol)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleClosePosition(position.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {positions.filter((p) => p.status === "open").length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    No active positions. The AI is waiting for optimal entry points.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

