"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, TrendingDown, MoreHorizontal, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import TradeLockers API
import { getPositions, closePosition } from "@/lib/api/tradelocker"

interface Position {
  id?: string
  symbol: string
  qty: number
  avg_entry_price: number
  current_price: number
  unrealized_pl: number
  unrealized_plpc?: number
  market_value?: number
  cost_basis?: number
}

export function PositionsTable() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch positions from TradeLockers API
  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true)
        const positionsData = await getPositions()

        // Transform the data to match our component's expected format
        const formattedPositions = positionsData.map((pos: any) => ({
          symbol: pos.symbol,
          qty: Number.parseFloat(pos.qty),
          avg_entry_price: Number.parseFloat(pos.avg_entry_price),
          current_price: Number.parseFloat(pos.current_price),
          unrealized_pl: Number.parseFloat(pos.unrealized_pl),
          unrealized_plpc: Number.parseFloat(pos.unrealized_plpc) * 100, // Convert to percentage
          market_value: Number.parseFloat(pos.market_value),
          cost_basis: Number.parseFloat(pos.cost_basis),
        }))

        setPositions(formattedPositions)
        setError(null)
      } catch (err) {
        console.error("Error fetching positions:", err)
        // Show a more user-friendly error message
        setError("Unable to load positions. Using demo data instead.")

        // Set some demo positions so the UI isn't empty
        const demoPositions = [
          {
            symbol: "AAPL",
            qty: 10,
            avg_entry_price: 150.25,
            current_price: 155.75,
            unrealized_pl: 55.0,
            unrealized_plpc: 3.66,
            market_value: 1557.5,
            cost_basis: 1502.5,
          },
          {
            symbol: "MSFT",
            qty: 5,
            avg_entry_price: 290.5,
            current_price: 305.25,
            unrealized_pl: 73.75,
            unrealized_plpc: 5.08,
            market_value: 1526.25,
            cost_basis: 1452.5,
          },
        ]
        setPositions(demoPositions)
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()

    // Set up interval to refresh positions every 30 seconds
    const intervalId = setInterval(fetchPositions, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const handleClosePosition = async (symbol: string) => {
    // Check if quickSell is enabled
    const quickSellEnabled = localStorage.getItem("quickSell") === "true"

    // If quickSell is not enabled, show confirmation dialog
    if (!quickSellEnabled && !confirm(`Are you sure you want to close your position in ${symbol}?`)) {
      return
    }

    try {
      await closePosition(symbol)

      // Only show alert if quickSell is not enabled
      if (!quickSellEnabled) {
        alert(`Position in ${symbol} closed successfully`)
      }

      // Update the positions list
      setPositions(positions.filter((pos) => pos.symbol !== symbol))
    } catch (err) {
      console.error("Error closing position:", err)
      alert(`Failed to close position in ${symbol}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">No open positions</p>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          Your positions will appear here once you make a trade. Use the trading panel to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table className="table-hover">
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Market Value</TableHead>
            <TableHead>P/L</TableHead>
            <TableHead>P/L %</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.symbol} className="group">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {position.symbol}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{position.qty}</TableCell>
              <TableCell>${position.avg_entry_price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  ${position.current_price.toFixed(2)}
                  {position.current_price > position.avg_entry_price ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-rose-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                ${position.market_value?.toFixed(2) || (position.qty * position.current_price).toFixed(2)}
              </TableCell>
              <TableCell className={position.unrealized_pl >= 0 ? "profit-text" : "loss-text"}>
                ${position.unrealized_pl.toFixed(2)}
              </TableCell>
              <TableCell className={position.unrealized_pl >= 0 ? "profit-text" : "loss-text"}>
                {position.unrealized_plpc?.toFixed(2) ||
                  ((position.unrealized_pl / (position.avg_entry_price * position.qty)) * 100).toFixed(2)}
                %
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleClosePosition(position.symbol)}
                          className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Close position</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Set stop loss</DropdownMenuItem>
                      <DropdownMenuItem>Set take profit</DropdownMenuItem>
                      <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-rose-500">Close position</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

