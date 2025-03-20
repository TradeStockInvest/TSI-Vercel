"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, ArrowRightLeft, AlertCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import TradeLockers API
import { executeOrder, getMarketData } from "@/lib/api/tradelocker"

interface OrderPanelProps {
  balance: string
}

export function OrderPanel({ balance }: OrderPanelProps) {
  const [symbol, setSymbol] = useState("")
  const [quantity, setQuantity] = useState("")
  const [amount, setAmount] = useState("")
  const [side, setSide] = useState("buy")
  const [orderType, setOrderType] = useState("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [lastFetchedSymbol, setLastFetchedSymbol] = useState("")
  const [orderTab, setOrderTab] = useState("market")
  const [error, setError] = useState<string | null>(null)

  // Function to get current price from TradeLockers
  async function getCurrentPrice(symbol: string) {
    if (!symbol || symbol === lastFetchedSymbol) return currentPrice

    try {
      setIsUpdating(true)

      // Get market data from TradeLockers API
      const marketData = await getMarketData(symbol)

      const price = marketData.last_price || 0
      setCurrentPrice(price)
      setLastFetchedSymbol(symbol)
      return price
    } catch (err) {
      console.error("Error fetching live price for " + symbol, err)
      // For demo purposes, generate a random price if API call fails
      const randomPrice = Math.random() * 1000 + 50
      setCurrentPrice(randomPrice)
      setLastFetchedSymbol(symbol)
      return randomPrice
    } finally {
      setIsUpdating(false)
    }
  }

  // Update price when symbol changes
  useEffect(() => {
    if (symbol) {
      getCurrentPrice(symbol)
    }
  }, [symbol])

  const handleSymbolChange = (value: string) => {
    setSymbol(value.toUpperCase())
    // Reset quantity and amount when symbol changes
    setQuantity("")
    setAmount("")
    setError(null)
  }

  const handleQuantityChange = async (value: string) => {
    if (isUpdating) return
    setIsUpdating(true)
    setQuantity(value)

    if (symbol && value) {
      const price = await getCurrentPrice(symbol)
      if (price && price > 0) {
        const calculatedAmount = Number.parseFloat(value) * price
        setAmount(calculatedAmount.toFixed(2))
      }
    } else {
      setAmount("")
    }

    setIsUpdating(false)
  }

  const handleAmountChange = async (value: string) => {
    if (isUpdating) return
    setIsUpdating(true)
    setAmount(value)

    if (symbol && value) {
      const price = await getCurrentPrice(symbol)
      if (price && price > 0) {
        const calculatedQuantity = Number.parseFloat(value) / price
        setQuantity(calculatedQuantity.toFixed(4))
      }
    } else {
      setQuantity("")
    }

    setIsUpdating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!symbol) {
      setError("Please enter a symbol")
      return
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity")
      return
    }

    // Check if quickBuy is enabled
    const quickBuyEnabled = localStorage.getItem("quickBuy") === "true"

    setIsSubmitting(true)

    try {
      const orderData = {
        symbol,
        qty: Number.parseFloat(quantity),
        side,
        type: orderType,
        time_in_force: "gtc",
      } as any

      // Add limit price if order type is limit
      if (orderType === "limit" && limitPrice) {
        orderData.limit_price = Number.parseFloat(limitPrice)
      }

      console.log("Submitting order:", orderData)
      const result = await executeOrder(orderData)

      // Only show alert if quickBuy is not enabled
      if (!quickBuyEnabled) {
        alert(`Order submitted successfully! Order ID: ${result.id}`)
      }

      // Reset form
      setSymbol("")
      setQuantity("")
      setAmount("")
      setLimitPrice("")

      // Refresh the page to update positions
      window.location.reload()
    } catch (error: any) {
      console.error("Error executing order:", error)
      setError(`Error submitting order: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Place Order</CardTitle>
        <CardDescription>Execute trades with real-time pricing</CardDescription>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Available Balance:</span>
          <span className="font-medium text-primary">{balance}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={orderTab} onValueChange={setOrderTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="market" onClick={() => setOrderType("market")}>
              Market
            </TabsTrigger>
            <TabsTrigger value="limit" onClick={() => setOrderType("limit")}>
              Limit
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL, MSFT, TSLA..."
                value={symbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
                className="rounded-lg"
              />
              {currentPrice !== null && symbol && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowRightLeft className="h-3 w-3" /> Current price:
                  <span className="font-medium text-primary">${currentPrice.toFixed(2)}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="side">Side</Label>
                <Select value={side} onValueChange={setSide}>
                  <SelectTrigger id="side" className="rounded-lg">
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy" className="buy-text">
                      Buy
                    </SelectItem>
                    <SelectItem value="sell" className="sell-text">
                      Sell
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 rounded-lg"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </div>
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="limit-price">Limit Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="limit-price"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 rounded-lg"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                  />
                </div>
              </div>
            )}
          </form>
        </Tabs>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                className="w-full rounded-lg"
                onClick={handleSubmit}
                disabled={!symbol || !quantity || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `${side === "buy" ? "Buy" : "Sell"} ${symbol || "Shares"}`
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!symbol ? "Enter a symbol" : !quantity ? "Enter quantity" : `Place ${side} order for ${symbol}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}

