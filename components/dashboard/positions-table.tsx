"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Position } from "@/types/trading"
import { closePosition } from "@/services/user-service"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface PositionsTableProps {
  positions: Position[]
  onPositionSelect?: (position: Position) => void
  onPositionsChange?: () => void
}

export function PositionsTable({ positions = [], onPositionSelect, onPositionsChange }: PositionsTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Position>("symbol")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: keyof Position) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedPositions = [...positions].sort((a, b) => {
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

  const handleClosePosition = async (position: Position) => {
    try {
      await closePosition("current-user", position.id)
      if (onPositionsChange) {
        onPositionsChange()
      }
    } catch (error) {
      console.error("Failed to close position:", error)
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Open Positions</h3>
        <p className="text-sm text-muted-foreground">Manage your active trading positions</p>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("symbol")} className="cursor-pointer">
                Symbol
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("type")} className="cursor-pointer">
                Type
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("entryPrice")} className="cursor-pointer">
                Entry Price
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("currentPrice")} className="cursor-pointer">
                Current Price
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer">
                Quantity
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("pnl")} className="cursor-pointer">
                P&L
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort("pnlPercentage")} className="cursor-pointer">
                P&L %
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPositions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No open positions
                </TableCell>
              </TableRow>
            ) : (
              sortedPositions.map((position) => (
                <TableRow
                  key={position.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onPositionSelect && onPositionSelect(position)}
                >
                  <TableCell className="font-medium">{position.symbol}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        position.type === "long"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }`}
                    >
                      {position.type === "long" ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {position.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(position.entryPrice)}</TableCell>
                  <TableCell>{formatCurrency(position.currentPrice)}</TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell className={position.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(position.pnl)}
                  </TableCell>
                  <TableCell className={position.pnlPercentage >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatPercentage(position.pnlPercentage)}
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
                            onPositionSelect && onPositionSelect(position)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClosePosition(position)
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          Close Position
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

