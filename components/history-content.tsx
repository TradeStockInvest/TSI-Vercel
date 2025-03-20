"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrders } from "@/lib/api/alpaca"

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
  asset_class?: string
}

export function HistoryContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sideFilter, setSideFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("all")

  // Fetch orders from Alpaca API
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
          asset_class: order.asset_class || "us_equity",
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

  // Filter orders based on search term, status, side, and time range
  const filteredOrders = orders.filter((order) => {
    // Search term filter
    if (searchTerm && !order.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    // Side filter
    if (sideFilter !== "all" && order.side !== sideFilter) {
      return false
    }

    // Time range filter
    if (timeRange !== "all") {
      const orderDate = new Date(order.created_at)
      const now = new Date()

      switch (timeRange) {
        case "today":
          return orderDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date()
          weekAgo.setDate(now.getDate() - 7)
          return orderDate >= weekAgo
        case "month":
          const monthAgo = new Date()
          monthAgo.setMonth(now.getMonth() - 1)
          return orderDate >= monthAgo
        default:
          return true
      }
    }

    return true
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">View and analyze your past trading activity</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="partially_filled">Partially Filled</SelectItem>
              <SelectItem value="new">Pending</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sideFilter} onValueChange={setSideFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sides</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="buy">Buy Orders</TabsTrigger>
          <TabsTrigger value="sell">Sell Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrdersTable orders={filteredOrders} loading={loading} error={error} getStatusBadge={getStatusBadge} />
        </TabsContent>

        <TabsContent value="stocks">
          <OrdersTable
            orders={filteredOrders.filter((o) => o.asset_class === "us_equity")}
            loading={loading}
            error={error}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="crypto">
          <OrdersTable
            orders={filteredOrders.filter((o) => o.asset_class === "crypto")}
            loading={loading}
            error={error}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="buy">
          <OrdersTable
            orders={filteredOrders.filter((o) => o.side === "buy")}
            loading={loading}
            error={error}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="sell">
          <OrdersTable
            orders={filteredOrders.filter((o) => o.side === "sell")}
            loading={loading}
            error={error}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  error: string | null
  getStatusBadge: (status: Order["status"]) => React.ReactNode
}

function OrdersTable({ orders, loading, error, getStatusBadge }: OrdersTableProps) {
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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No orders to display</p>
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
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filled Price</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell className={order.side === "buy" ? "buy-text" : "sell-text"}>
                    {order.side.charAt(0).toUpperCase() + order.side.slice(1)}
                  </TableCell>
                  <TableCell>{order.qty}</TableCell>
                  <TableCell>{order.type.charAt(0).toUpperCase() + order.type.slice(1)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.filled_price ? `$${order.filled_price.toFixed(2)}` : "-"}</TableCell>
                  <TableCell>{order.filled_price ? `$${(order.filled_price * order.qty).toFixed(2)}` : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

