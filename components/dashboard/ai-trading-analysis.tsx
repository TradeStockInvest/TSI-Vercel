"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TradingViewChart } from "./trading-view-chart"
import { RISK_LEVELS } from "@/services/ai-trading-service"

export function AITradingAnalysis({
  symbol = "AAPL",
  analysis = null,
  riskLevel = 3,
  onSymbolChange,
  isLoading = false,
}) {
  const [activeTab, setActiveTab] = useState("overview")

  // Get risk parameters
  const riskParams = RISK_LEVELS[riskLevel] || RISK_LEVELS[3]

  // Format confidence as percentage
  const confidencePercent = analysis?.confidence ? Math.round(analysis.confidence * 100) : 0

  // Determine recommendation color
  const getRecommendationColor = (rec) => {
    if (!rec) return "bg-gray-500"
    switch (rec.toUpperCase()) {
      case "BUY":
        return "bg-green-500"
      case "SELL":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Trading Analysis: {symbol}</span>
          <Badge variant="outline" className="ml-2">
            Risk Level: {riskLevel} - {riskParams.name}
          </Badge>
        </CardTitle>
        <CardDescription>AI-powered market analysis and trading recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="signals" className="flex-1">
              Signals
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex-1">
              Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Analyzing market...</p>
                </div>
              </div>
            ) : analysis ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Recommendation</h3>
                    <div className="flex items-center mt-1">
                      <div
                        className={`h-4 w-4 rounded-full ${getRecommendationColor(analysis.recommendation)} mr-2`}
                      ></div>
                      <span className="text-2xl font-bold">{analysis.recommendation}</span>
                      <Badge className="ml-3">{confidencePercent}% Confidence</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-medium">Risk Parameters</h3>
                    <div className="text-sm text-muted-foreground">
                      <div>Stop Loss: {riskParams.stopLossPercent}%</div>
                      <div>Take Profit: {riskParams.takeProfitPercent}%</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Analysis</h3>
                  <p className="mt-1 text-muted-foreground">{analysis.reason}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Strategy</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {riskParams.allowedStrategies.map((strategy) => (
                      <Badge key={strategy} variant="secondary">
                        {strategy
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">No analysis available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="signals" className="pt-4">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Analyzing signals...</p>
                </div>
              </div>
            ) : analysis?.signals?.length ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Technical Signals</h3>
                <ul className="space-y-2">
                  {analysis.signals.map((signal, index) => (
                    <li key={index} className="rounded-md border p-3">
                      {signal}
                    </li>
                  ))}
                </ul>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="font-medium">Risk Level Impact</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    At risk level {riskLevel} ({riskParams.name}), the AI{" "}
                    {riskLevel < 3
                      ? "is more conservative"
                      : riskLevel > 3
                        ? "is more aggressive"
                        : "takes a balanced approach"}{" "}
                    in its trading decisions.
                  </p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• Trade Frequency: {riskParams.tradeFrequency.split("_").join(" ")}</li>
                    <li>• Max Positions: {riskParams.maxPositions}</li>
                    <li>• Leverage: up to {riskParams.maxLeverageRatio}x</li>
                    <li>• Diversification: {riskParams.diversificationRequired ? "Required" : "Optional"}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">No signals available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chart" className="pt-4">
            <div className="h-[400px] w-full">
              <TradingViewChart symbol={symbol} showAIPredictions={true} theme="dark" riskLevel={riskLevel} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

