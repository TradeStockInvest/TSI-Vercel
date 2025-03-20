"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Plus, X, Star, StarOff, Search } from "lucide-react"

interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  isFavorite: boolean
}

export function WatchlistCard() {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample watchlist data
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 182.68,
      change: 1.45,
      changePercent: 0.8,
      isFavorite: true,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 389.56,
      change: 4.23,
      changePercent: 1.1,
      isFavorite: true,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.89,
      change: -0.56,
      changePercent: -0.39,
      isFavorite: false,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 154.72,
      change: 2.18,
      changePercent: 1.43,
      isFavorite: false,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 218.89,
      change: -5.67,
      changePercent: -2.53,
      isFavorite: true,
    },
  ])

  // Filter watchlist based on search term
  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Toggle favorite status
  const toggleFavorite = (symbol: string) => {
    setWatchlist(watchlist.map((item) => (item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item)))
  }

  // Remove item from watchlist
  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Watchlist</CardTitle>
            <CardDescription>Track your favorite securities</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            Add Symbol
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search symbols..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWatchlist.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No symbols found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWatchlist.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.name}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1 ${
                          item.change >= 0
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {item.change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {item.change >= 0 ? "+" : ""}
                        {item.changePercent.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleFavorite(item.symbol)}
                        >
                          {item.isFavorite ? (
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeFromWatchlist(item.symbol)}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

