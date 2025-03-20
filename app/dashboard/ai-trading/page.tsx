"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AITradingConfiguration } from "@/components/dashboard/ai-trading-configuration"
import { TradingViewChart } from "@/components/dashboard/trading-view-chart"
import { PositionsTable } from "@/components/dashboard/positions-table"
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table"
import { MarketAnalysisCard } from "@/components/dashboard/market-analysis-card"
import { TradingControls } from "@/components/dashboard/trading-controls"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import type { TradingBotPosition, TradingBotTrade, MarketAnalysis } from "@/services/trading-bot"

export default function AITradingPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [positions, setPositions] = useState<TradingBotPosition[]>([])
  const [tradeHistory, setTradeHistory] = useState<TradingBotTrade[]>([])
  const [marketAnalysis, setMarketAnalysis] = useState<Record<string, MarketAnalysis>>({})
  const [selectedSymbol, setSelectedSymbol] = useState<string>("NASDAQ:AAPL")
  const [stopLossEnabled, setStopLossEnabled] = useState(true)
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(true)

  // Handle position updates
  const handlePositionUpdate = (updatedPositions: TradingBotPosition[]) => {
    setPositions(updatedPositions)
  }

  // Handle trade execution
  const handleTradeExecuted = (trade: TradingBotTrade) => {
    setTradeHistory((prev) => [trade, ...prev])

    // Show toast notification
    toast({
      title: `${trade.action} ${trade.symbol}`,
      description: `${trade.quantity} shares at $${trade.price.toFixed(2)}`,
      variant: trade.action === "BUY" ? "default" : "destructive",
    })

    // Update selected symbol to the traded one
    if (trade.action === "BUY") {
      setSelectedSymbol(`NASDAQ:${trade.symbol}`)
    }
  }

  // Handle market analysis update
  const handleAnalysisUpdate = (analysis: Record<string, MarketAnalysis>) => {
    setMarketAnalysis(analysis)
  }

  // Handle symbol selection
  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(`NASDAQ:${symbol}`)
  }

  // Handle stop loss toggle
  const handleStopLossToggle = (enabled: boolean) => {
    console.log("Stop Loss toggled:", enabled)
    setStopLossEnabled(enabled)

    toast({
      title: enabled ? "Stop Loss Enabled" : "Stop Loss Disabled",
      description: enabled
        ? "The AI will use your defined stop loss percentage"
        : "The AI will use its own risk management",
      duration: 3000,
    })
  }

  // Handle take profit toggle
  const handleTakeProfitToggle = (enabled: boolean) => {
    console.log("Take Profit toggled:", enabled)
    setTakeProfitEnabled(enabled)

    toast({
      title: enabled ? "Take Profit Enabled" : "Take Profit Disabled",
      description: enabled
        ? "The AI will use your defined take profit percentage"
        : "The AI will use its own risk management",
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Trading Controls - Prominently displayed at the top */}
      <TradingControls
        stopLossEnabled={stopLossEnabled}
        takeProfitEnabled={takeProfitEnabled}
        onStopLossToggle={handleStopLossToggle}
        onTakeProfitToggle={handleTakeProfitToggle}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TradingViewChart symbol={selectedSymbol} />
        </div>
        <div>
          <MarketAnalysisCard analysis={marketAnalysis} onSymbolSelect={handleSymbolSelect} />
        </div>
      </div>

      <Tabs defaultValue="positions">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="config">AI Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="positions">
          <PositionsTable positions={positions} onSymbolSelect={handleSymbolSelect} />
        </TabsContent>
        <TabsContent value="history">
          <TradeHistoryTable trades={tradeHistory} onSymbolSelect={handleSymbolSelect} />
        </TabsContent>
        <TabsContent value="config">
          <AITradingConfiguration
            onPositionUpdate={handlePositionUpdate}
            onTradeExecuted={handleTradeExecuted}
            onAnalysisUpdate={handleAnalysisUpdate}
            stopLossEnabled={stopLossEnabled}
            takeProfitEnabled={takeProfitEnabled}
            onStopLossToggle={handleStopLossToggle}
            onTakeProfitToggle={handleTakeProfitToggle}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

