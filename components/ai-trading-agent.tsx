"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ArrowUpDown, Brain, Clock, Heart, LineChart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useProAccess } from "@/hooks/use-subscription"

interface AITradingAgentProps {
  onActivate?: (active: boolean) => void
  onConfigChange?: (config: any) => void
  initialConfig?: any
  className?: string
}

export function AITradingAgent({
  onActivate,
  onConfigChange,
  initialConfig = {
    riskLevel: 50,
    tradeFrequency: 60,
    maxPositions: 5,
    continuousOperation: false,
    favoriteSymbols: ["AAPL", "MSFT", "GOOGL"],
  },
  className,
}: AITradingAgentProps) {
  const [isActive, setIsActive] = useState(false)
  const [config, setConfig] = useState(initialConfig)
  const [positions, setPositions] = useState<any[]>([])
  const [tradeHistory, setTradeHistory] = useState<any[]>([])
  const { hasPro, isLoading, requirePro } = useProAccess()
  const { toast } = useToast()

  // Call requirePro to redirect if not a Pro user
  requirePro()

  // Add this effect to show a message when Pro features are accessed
  useEffect(() => {
    if (hasPro === true) {
      // User has Pro access, component will render normally
    } else if (hasPro === false) {
      // This should not happen due to requirePro, but just in case
      toast({
        title: "Pro Plan Required",
        description: "The AI Trading Agent is only available with a Pro subscription",
        variant: "destructive",
      })
    }
    // Don't show anything while loading
  }, [hasPro, toast])

  // If still loading or not Pro, show a loading state
  if (isLoading || hasPro === false) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    )
  }

  // Mock data for demonstration
  useEffect(() => {
    let mockPositions: any[] = []
    let mockHistory: any[] = []

    if (isActive) {
      mockPositions = [
        {
          id: 1,
          symbol: "AAPL",
          type: "buy",
          price: 187.32,
          quantity: 10,
          timestamp: new Date().getTime() - 3600000,
          profit: 2.34,
        },
        {
          id: 2,
          symbol: "MSFT",
          type: "buy",
          price: 412.65,
          quantity: 5,
          timestamp: new Date().getTime() - 7200000,
          profit: -1.21,
        },
      ]

      mockHistory = [
        {
          id: 101,
          symbol: "GOOGL",
          type: "buy",
          price: 142.89,
          quantity: 8,
          timestamp: new Date().getTime() - 86400000,
          profit: 3.45,
          closed: true,
        },
        {
          id: 102,
          symbol: "AMZN",
          type: "sell",
          price: 178.12,
          quantity: 12,
          timestamp: new Date().getTime() - 172800000,
          profit: 5.67,
          closed: true,
        },
        {
          id: 103,
          symbol: "TSLA",
          type: "buy",
          price: 245.67,
          quantity: 4,
          timestamp: new Date().getTime() - 259200000,
          profit: -2.18,
          closed: true,
        },
      ]
    }

    setPositions(mockPositions)
    setTradeHistory(mockHistory)
  }, [isActive])

  const handleActivate = (value: boolean) => {
    setIsActive(value)
    if (onActivate) onActivate(value)

    toast({
      title: value ? "AI Trading Agent Activated" : "AI Trading Agent Deactivated",
      description: value
        ? "The AI will now analyze the market and execute trades based on your configuration."
        : "The AI has stopped trading. Your positions remain unchanged.",
      variant: value ? "default" : "destructive",
    })

    // Store active AI trades status in localStorage
    if (value) {
      localStorage.setItem("hasActiveAITrades", "true")
    } else {
      localStorage.removeItem("hasActiveAITrades")
    }
  }

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    if (onConfigChange) onConfigChange(newConfig)
  }

  const toggleFavorite = (symbol: string) => {
    const favorites = [...config.favoriteSymbols]
    const index = favorites.indexOf(symbol)

    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push(symbol)
    }

    handleConfigChange("favoriteSymbols", favorites)
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Trading Agent
            </CardTitle>
            <CardDescription>Let AI analyze the market and execute trades for you</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="ai-active"
              className={cn("text-sm font-medium", isActive ? "text-primary" : "text-muted-foreground")}
            >
              {isActive ? "Active" : "Inactive"}
            </Label>
            <Switch id="ai-active" checked={isActive} onCheckedChange={handleActivate} />
          </div>
        </div>
      </CardHeader>
      <Tabs defaultValue="positions" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mb-2 grid grid-cols-3">
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>
        <CardContent className="p-0 flex-1 flex flex-col">
          <TabsContent value="positions" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <h4 className="text-sm font-medium">Active Positions</h4>
              <Badge variant={isActive ? "default" : "outline"} className="text-xs">
                {isActive ? "Trading" : "Paused"}
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              {positions.length > 0 ? (
                <div className="divide-y">
                  {positions.map((position) => (
                    <div key={position.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={position.type === "buy" ? "default" : "destructive"}
                            className="uppercase text-xs"
                          >
                            {position.type}
                          </Badge>
                          <span className="font-medium">{position.symbol}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleFavorite(position.symbol)}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                config.favoriteSymbols.includes(position.symbol)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              position.profit > 0 ? "text-green-500" : "text-red-500",
                            )}
                          >
                            {position.profit > 0 ? "+" : ""}
                            {position.profit}%
                          </span>
                          <Button variant="outline" size="sm" className="h-7">
                            <LineChart className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                          <span className="mr-2">${position.price.toFixed(2)}</span>
                          <span>× {position.quantity}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{formatTimestamp(position.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                  <ArrowUpDown className="h-12 w-12 mb-4 opacity-20" />
                  <p className="mb-2">No active positions</p>
                  <p className="text-sm max-w-[250px]">
                    {isActive
                      ? "The AI is analyzing the market and will execute trades based on your configuration."
                      : "Activate the AI Trading Agent to start automated trading."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="history" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <div className="px-6 py-3 flex items-center justify-between border-b">
              <h4 className="text-sm font-medium">Trade History</h4>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
            <ScrollArea className="flex-1">
              {tradeHistory.length > 0 ? (
                <div className="divide-y">
                  {tradeHistory.map((trade) => (
                    <div key={trade.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={trade.type === "buy" ? "default" : "destructive"}
                            className="uppercase text-xs"
                          >
                            {trade.type}
                          </Badge>
                          <span className="font-medium">{trade.symbol}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleFavorite(trade.symbol)}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                config.favoriteSymbols.includes(trade.symbol)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground",
                              )}
                            />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn("text-sm font-medium", trade.profit > 0 ? "text-green-500" : "text-red-500")}
                          >
                            {trade.profit > 0 ? "+" : ""}
                            {trade.profit}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                          <span className="mr-2">${trade.price.toFixed(2)}</span>
                          <span>× {trade.quantity}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{formatTimestamp(trade.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mb-4 opacity-20" />
                  <p className="mb-2">No trade history</p>
                  <p className="text-sm max-w-[250px]">Your completed trades will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="config" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="risk-level">Risk Level</Label>
                    <span className="text-sm font-medium">{config.riskLevel}%</span>
                  </div>
                  <Slider
                    id="risk-level"
                    min={10}
                    max={90}
                    step={10}
                    value={[config.riskLevel]}
                    onValueChange={(value) => handleConfigChange("riskLevel", value[0])}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher risk may lead to higher returns but with increased volatility.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trade-frequency">Trade Frequency (minutes)</Label>
                    <span className="text-sm font-medium">{config.tradeFrequency}</span>
                  </div>
                  <Slider
                    id="trade-frequency"
                    min={15}
                    max={120}
                    step={15}
                    value={[config.tradeFrequency]}
                    onValueChange={(value) => handleConfigChange("tradeFrequency", value[0])}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    How often the AI will analyze the market and potentially execute trades.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-positions">Maximum Positions</Label>
                    <span className="text-sm font-medium">{config.maxPositions}</span>
                  </div>
                  <Slider
                    id="max-positions"
                    min={1}
                    max={10}
                    step={1}
                    value={[config.maxPositions]}
                    onValueChange={(value) => handleConfigChange("maxPositions", value[0])}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of simultaneous positions the AI can hold.
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="continuous-operation">Continuous Operation</Label>
                    <p className="text-xs text-muted-foreground">Keep AI trading when you're logged out</p>
                  </div>
                  <Switch
                    id="continuous-operation"
                    checked={config.continuousOperation}
                    onCheckedChange={(value) => handleConfigChange("continuousOperation", value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Favorite Symbols</Label>
                  <div className="flex flex-wrap gap-2">
                    {config.favoriteSymbols.map((symbol: string) => (
                      <Badge key={symbol} variant="secondary" className="flex items-center gap-1">
                        {symbol}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => toggleFavorite(symbol)}
                        >
                          <Heart className="h-3 w-3 fill-current" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The AI will prioritize these symbols for analysis and trading.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
        <CardFooter className="border-t p-3 flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            <span>AI predictions are not financial advice</span>
          </div>
          <Button variant="outline" size="sm" className="h-7">
            <Settings className="h-3.5 w-3.5 mr-1" />
            Advanced
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  )
}

