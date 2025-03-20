"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle, TrendingUp } from "lucide-react"

interface TradingControlsProps {
  stopLossEnabled: boolean
  takeProfitEnabled: boolean
  onStopLossToggle: (enabled: boolean) => void
  onTakeProfitToggle: (enabled: boolean) => void
}

export function TradingControls({
  stopLossEnabled,
  takeProfitEnabled,
  onStopLossToggle,
  onTakeProfitToggle,
}: TradingControlsProps) {
  return (
    <Card className="w-full shadow-lg border-2 border-gray-200">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-xl">Risk Management Controls</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stop Loss Control */}
        <div className={`p-4 rounded-lg border-2 ${stopLossEnabled ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertTriangle className={`mr-2 h-6 w-6 ${stopLossEnabled ? "text-red-500" : "text-gray-400"}`} />
              <Label htmlFor="stop-loss-toggle" className="text-lg font-medium">
                Stop Loss
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${stopLossEnabled ? "text-green-600" : "text-gray-400"}`}>
                {stopLossEnabled ? "ON" : "OFF"}
              </span>
              <Switch
                id="stop-loss-toggle"
                checked={stopLossEnabled}
                onCheckedChange={onStopLossToggle}
                className="data-[state=checked]:bg-red-500 h-6 w-12"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stopLossEnabled
              ? "Stop loss is active. The AI will automatically sell positions when they reach your defined loss threshold."
              : "Stop loss is disabled. Enable to protect your positions from significant losses."}
          </p>
        </div>

        {/* Take Profit Control */}
        <div
          className={`p-4 rounded-lg border-2 ${takeProfitEnabled ? "border-green-500 bg-green-50" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingUp className={`mr-2 h-6 w-6 ${takeProfitEnabled ? "text-green-500" : "text-gray-400"}`} />
              <Label htmlFor="take-profit-toggle" className="text-lg font-medium">
                Take Profit
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${takeProfitEnabled ? "text-green-600" : "text-gray-400"}`}>
                {takeProfitEnabled ? "ON" : "OFF"}
              </span>
              <Switch
                id="take-profit-toggle"
                checked={takeProfitEnabled}
                onCheckedChange={onTakeProfitToggle}
                className="data-[state=checked]:bg-green-500 h-6 w-12"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {takeProfitEnabled
              ? "Take profit is active. The AI will automatically sell positions when they reach your defined profit target."
              : "Take profit is disabled. Enable to automatically lock in profits when targets are reached."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

