"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import TradeLockers API
import { getOrders } from "@/lib/api/tradelocker"

interface Order {
  id: string
  symbol: string
  side: "buy" | "sell"
  qty: number
  type: string
  status: "filled" | "pending" | "rejected" | "canceled" | "new" | "partially_filled" | "done_for_day"
  filled_price?: number | null
  filled_qty?: number | null
  filled_avg_price?: number | null
  created_at: string
  updated_at?: string
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch orders from TradeLockers API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const ordersData = await getOrders()

        // Transform the data to match our component's expected format
        const formattedOrders = ordersData.map((order: any) => ({
          id: order.id,
          symbol: order.symbol,
          side: order.side,
          qty: Number.parseFloat(order.qty),
          type: order.type,
          status: order.status,
          filled_price: order.filled_avg_price ? Number.parseFloat(order.filled_avg_price) : null,
          filled_qty: order.filled_qty ? Number.parseFloat(order.filled_qty) : null,
          created_at: order.created_at,
          updated_at: order.updated_at,
        }))

        setOrders(formattedOrders)
        setError(null)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load order history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "filled":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Filled
          </Badge>
        )
      case "partially_filled":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Partially Filled
          </Badge>
        )
      case "new":
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
            Rejected
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            Canceled
          </Badge>
        )
      case "done_for_day":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Done
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
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

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <MoreHorizontal className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">No order history</p>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          Your order history will appear here once you make a trade. Use the trading panel to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table className="table-hover">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Filled Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="group">
              <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
              <TableCell className="font-medium">
                <Badge variant="outline" className="bg-secondary/10 border-secondary/20">
                  {order.symbol}
                </Badge>
              </TableCell>
              <TableCell className={order.side === "buy" ? "buy-text" : "sell-text"}>
                <Badge
                  variant="outline"
                  className={
                    order.side === "buy"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }
                >
                  {order.side.charAt(0).toUpperCase() + order.side.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{order.qty}</TableCell>
              <TableCell>{order.type.charAt(0).toUpperCase() + order.type.slice(1)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{order.filled_price ? `$${order.filled_price.toFixed(2)}` : "-"}</TableCell>
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Export to CSV</DropdownMenuItem>
                      {order.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-500">Cancel order</DropdownMenuItem>
                        </>
                      )}
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

