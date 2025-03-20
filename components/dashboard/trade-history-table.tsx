"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Trade } from "@/types/trading"
import { formatCurrency, formatDate } from "@/lib/utils"

interface TradeHistoryTableProps {
  trades: Trade[]
  onTradeSelect?: (trade: Trade) => void
}

export function TradeHistoryTable({ trades = [], onTradeSelect }: TradeHistoryTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Trade>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (column: keyof Trade) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedTrades = [...trades].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Trade History</h3>
        <p className="text-sm text-muted-foreground">View your recent trading activity</p>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                Date & Time
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("symbol")} className="cursor-pointer">
                Symbol
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("action")} className="cursor-pointer">
                Action
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                Price
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer">
                Quantity
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("total")} className="cursor-pointer">
                Total
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No trade history
                </TableCell>
              </TableRow>
            ) : (
              sortedTrades.map((trade) => (
                <TableRow
                  key={trade.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onTradeSelect && onTradeSelect(trade)}
                >
                  <TableCell>{formatDate(new Date(trade.timestamp))}</TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trade.action === "buy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {trade.action === "buy" ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {trade.action.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(trade.price)}</TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell>{formatCurrency(trade.total)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(trade.status)}
                      <span className="ml-2 capitalize">{trade.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onTradeSelect && onTradeSelect(trade)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

