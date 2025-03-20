"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X, ArrowUpRight, ArrowDownRight, Percent, DollarSign, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getPositions, closePosition } from "@/lib/api/alpaca"

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
  asset_class?: string
  asset_marginable?: boolean
  change_today?: number
}

export function PortfolioContent() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalValue, setTotalValue] = useState(0)
  const [totalProfitLoss, setTotalProfitLoss] = useState(0)
  const [totalProfitLossPercent, setTotalProfitLossPercent] = useState(0)

  // Fetch positions from Alpaca API
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
          asset_class: pos.asset_class || "us_equity",
          asset_marginable: pos.asset_marginable || false,
          change_today: Number.parseFloat(pos.change_today || 0) * 100,
        }))

        // Calculate totals
        const totalMarketValue = formattedPositions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
        const totalPL = formattedPositions.reduce((sum, pos) => sum + pos.unrealized_pl, 0)
        const totalCostBasis = formattedPositions.reduce((sum, pos) => sum + (pos.cost_basis || 0), 0)
        const totalPLPercent = totalCostBasis > 0 ? (totalPL / totalCostBasis) * 100 : 0

        setTotalValue(totalMarketValue)
        setTotalProfitLoss(totalPL)
        setTotalProfitLossPercent(totalPLPercent)
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
            asset_class: "us_equity",
            asset_marginable: true,
            change_today: 1.2,
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
            asset_class: "us_equity",
            asset_marginable: true,
            change_today: 0.8,
          },
        ]

        // Calculate totals for demo data
        const totalMarketValue = demoPositions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
        const totalPL = demoPositions.reduce((sum, pos) => sum + pos.unrealized_pl, 0)
        const totalCostBasis = demoPositions.reduce((sum, pos) => sum + (pos.cost_basis || 0), 0)
        const totalPLPercent = totalCostBasis > 0 ? (totalPL / totalCostBasis) * 100 : 0

        setTotalValue(totalMarketValue)
        setTotalProfitLoss(totalPL)
        setTotalProfitLossPercent(totalPLPercent)
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
    if (!confirm(`Are you sure you want to close your position in ${symbol}?`)) {
      return
    }

    try {
      await closePosition(symbol)
      alert(`Position in ${symbol} closed successfully`)

      // Update the positions list
      setPositions(positions.filter((pos) => pos.symbol !== symbol))
    } catch (err) {
      console.error("Error closing position:", err)
      alert(`Failed to close position in ${symbol}`)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground">Detailed view of your current positions and performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
            {totalProfitLoss >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              ${totalProfitLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Unrealized profit/loss</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P/L %</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfitLossPercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {totalProfitLossPercent.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Positions</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="profitable">Profitable</TabsTrigger>
          <TabsTrigger value="losing">Losing</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PositionsTable positions={positions} loading={loading} error={error} onClose={handleClosePosition} />
        </TabsContent>

        <TabsContent value="stocks">
          <PositionsTable
            positions={positions.filter((p) => p.asset_class === "us_equity")}
            loading={loading}
            error={error}
            onClose={handleClosePosition}
          />
        </TabsContent>

        <TabsContent value="crypto">
          <PositionsTable
            positions={positions.filter((p) => p.asset_class === "crypto")}
            loading={loading}
            error={error}
            onClose={handleClosePosition}
          />
        </TabsContent>

        <TabsContent value="profitable">
          <PositionsTable
            positions={positions.filter((p) => p.unrealized_pl > 0)}
            loading={loading}
            error={error}
            onClose={handleClosePosition}
          />
        </TabsContent>

        <TabsContent value="losing">
          <PositionsTable
            positions={positions.filter((p) => p.unrealized_pl < 0)}
            loading={loading}
            error={error}
            onClose={handleClosePosition}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
          <CardDescription>Distribution of your investments by asset</CardDescription>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No positions to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => {
                const percentage = ((position.market_value || 0) / totalValue) * 100
                return (
                  <div key={position.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">${position.market_value?.toFixed(2)}</div>
                      </div>
                      <div className="text-sm font-medium">{percentage.toFixed(2)}%</div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface PositionsTableProps {
  positions: Position[]
  loading: boolean
  error: string | null
  onClose: (symbol: string) => void
}

function PositionsTable({ positions, loading, error, onClose }: PositionsTableProps) {
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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No positions to display</p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Market Value</TableHead>
                <TableHead>Today's Change</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>P/L %</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.symbol}>
                  <TableCell className="font-medium">{position.symbol}</TableCell>
                  <TableCell>{position.qty}</TableCell>
                  <TableCell>${position.avg_entry_price.toFixed(2)}</TableCell>
                  <TableCell>${position.current_price.toFixed(2)}</TableCell>
                  <TableCell>
                    ${position.market_value?.toFixed(2) || (position.qty * position.current_price).toFixed(2)}
                  </TableCell>
                  <TableCell className={position.change_today >= 0 ? "profit-text" : "loss-text"}>
                    {position.change_today >= 0 ? "+" : ""}
                    {position.change_today?.toFixed(2)}%
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
                    <Button variant="ghost" size="icon" onClick={() => onClose(position.symbol)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close position</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

