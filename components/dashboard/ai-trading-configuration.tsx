"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Star, Info, AlertTriangle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSubscription } from "@/contexts/subscription-context"
import { ProFeatureLock } from "@/components/ui/pro-feature-lock"
import { RISK_LEVELS } from "@/services/ai-trading-service"
import { TradingBot, type TradingBotSettings } from "@/services/trading-bot"
import { useAuth } from "@/contexts/auth-context"

export function AITradingConfiguration({
  onAnalysisUpdate,
  onPositionUpdate,
  onTradeExecuted,
  stopLossEnabled,
  takeProfitEnabled,
  onStopLossToggle,
  onTakeProfitToggle,
}) {
  const { user } = useAuth()
  const { checkFeatureAccess } = useSubscription()
  const { toast } = useToast()

  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tradingBot, setTradingBot] = useState<TradingBot | null>(null)
  const [botStatus, setBotStatus] = useState({ running: false, message: "" })

  const [settings, setSettings] = useState<TradingBotSettings>({
    enabled: false,
    riskLevel: 3,
    maxPositions: 5,
    maxLoss: 5,
    timeframes: ["1h"],
    scalpingMode: false,
    useHistoricalData: false,
    continuousOperation: false,
    favoriteSymbols: [],
    stopLossPercent: 5,
    takeProfitPercent: 10,
    stopLossEnabled: stopLossEnabled,
    takeProfitEnabled: takeProfitEnabled,
  })

  // Update settings when props change
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      stopLossEnabled,
      takeProfitEnabled,
    }))

    // Update trading bot settings if it exists
    if (tradingBot) {
      tradingBot.updateSettings({
        stopLossEnabled,
        takeProfitEnabled,
      })
    }
  }, [stopLossEnabled, takeProfitEnabled, tradingBot])

  // Initialize trading bot
  useEffect(() => {
    if (!user?.id) return

    const initBot = async () => {
      try {
        // Create trading bot instance
        const bot = new TradingBot(user.id, settings, {
          onPositionUpdate,
          onTradeExecuted,
          onAnalysisUpdate,
          onStatusUpdate: (status) => {
            setBotStatus(status)

            // Show toast for status changes
            if (status.running && !botStatus.running) {
              toast({
                title: "AI Trading Started",
                description: "The AI trading bot is now active and analyzing the market.",
              })
            } else if (!status.running && botStatus.running) {
              toast({
                title: "AI Trading Stopped",
                description: "The AI trading bot has been deactivated.",
              })
            }
          },
          onError: (error) => {
            toast({
              title: "AI Trading Error",
              description: error,
              variant: "destructive",
            })
          },
        })

        setTradingBot(bot)
      } catch (error) {
        console.error("Failed to initialize trading bot:", error)
        toast({
          title: "Initialization Error",
          description: "Failed to initialize the AI trading bot.",
          variant: "destructive",
        })
      }
    }

    initBot()

    // Cleanup
    return () => {
      if (tradingBot) {
        tradingBot.stop()
      }
    }
  }, [user?.id])

  // Toggle AI trading
  const handleToggle = async (enabled: boolean) => {
    if (!tradingBot) return

    setIsLoading(true)

    try {
      if (enabled) {
        // Update settings and start bot
        tradingBot.updateSettings({ ...settings, enabled: true })
      } else {
        // Stop bot
        tradingBot.stop()
      }

      setIsEnabled(enabled)
    } catch (error) {
      console.error("Failed to toggle AI trading:", error)
      toast({
        title: "Error",
        description: "Failed to toggle AI trading.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle settings change
  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Save settings
  const handleSaveSettings = () => {
    if (!tradingBot) return

    setIsLoading(true)

    try {
      // Update bot settings
      tradingBot.updateSettings(settings)

      toast({
        title: "Settings Saved",
        description: "AI trading settings have been updated.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save AI trading settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset settings
  const handleReset = () => {
    setSettings({
      ...settings,
      riskLevel: 3,
      maxPositions: 5,
      maxLoss: 5,
      timeframes: ["1h"],
      scalpingMode: false,
      useHistoricalData: false,
    })

    toast({
      title: "Settings Reset",
      description: "AI trading settings have been reset to default values.",
    })
  }

  // Reset all settings
  const handleResetAll = () => {
    const newSettings = {
      enabled: false,
      riskLevel: 3,
      maxPositions: 5,
      maxLoss: 5,
      timeframes: ["1h"],
      scalpingMode: false,
      useHistoricalData: false,
      continuousOperation: false,
      favoriteSymbols: [],
      stopLossPercent: 5,
      takeProfitPercent: 10,
      stopLossEnabled: true,
      takeProfitEnabled: true,
    }

    setSettings(newSettings)

    // Update parent component toggles
    if (onStopLossToggle) onStopLossToggle(true)
    if (onTakeProfitToggle) onTakeProfitToggle(true)

    // Stop the bot
    if (tradingBot && isEnabled) {
      tradingBot.stop()
      setIsEnabled(false)
    }

    toast({
      title: "All Settings Reset",
      description: "All AI trading settings have been reset and the bot has been stopped.",
    })
  }

  // Toggle timeframe selection
  const toggleTimeframe = (timeframe) => {
    const isProFeature = timeframe !== "1h" && !checkFeatureAccess("multi_timeframe")
    if (isProFeature) return

    const currentTimeframes = [...settings.timeframes]
    const index = currentTimeframes.indexOf(timeframe)

    if (index === -1) {
      currentTimeframes.push(timeframe)
    } else if (currentTimeframes.length > 1) {
      // Don't remove if it's the last one
      currentTimeframes.splice(index, 1)
    }

    handleSettingChange("timeframes", currentTimeframes)
  }

  // Toggle favorite symbol
  const toggleFavorite = (symbol) => {
    if (!checkFeatureAccess("favorites")) return

    const favorites = [...settings.favoriteSymbols]
    const index = favorites.indexOf(symbol)

    if (index === -1) {
      favorites.push(symbol)
    } else {
      favorites.splice(index, 1)
    }

    handleSettingChange("favoriteSymbols", favorites)
  }

  // Get risk level details
  const currentRiskLevel = RISK_LEVELS[settings.riskLevel] || RISK_LEVELS[3]

  // Available timeframes
  const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Trading Configuration</span>
          <Switch checked={isEnabled} onCheckedChange={handleToggle} disabled={isLoading} />
        </CardTitle>
        <CardDescription>Configure how the AI trading agent operates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="risk-level" className="text-base font-medium">
              Risk Level: {settings.riskLevel} - {currentRiskLevel.name}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{currentRiskLevel.description}</p>
                  <ul className="mt-2 text-xs">
                    <li>Max Positions: {currentRiskLevel.maxPositions}</li>
                    <li>Stop Loss: {currentRiskLevel.stopLossPercent}%</li>
                    <li>Take Profit: {currentRiskLevel.takeProfitPercent}%</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            id="risk-level"
            min={1}
            max={5}
            step={1}
            value={[settings.riskLevel]}
            onValueChange={(value) => handleSettingChange("riskLevel", value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Cautious</span>
            <span>Moderate</span>
            <span>Aggressive</span>
            <span>Maximum</span>
          </div>
        </div>

        {/* Stop Loss */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="stop-loss" className="text-base font-medium">
              Stop Loss: {settings.stopLossPercent}%
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Percentage loss at which the AI will automatically sell a position</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            id="stop-loss"
            min={1}
            max={20}
            step={0.5}
            value={[settings.stopLossPercent]}
            onValueChange={(value) => handleSettingChange("stopLossPercent", value[0])}
            className={`w-full ${!settings.stopLossEnabled ? "opacity-50" : ""}`}
            disabled={!settings.stopLossEnabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>10%</span>
            <span>20%</span>
          </div>
          {!settings.stopLossEnabled && (
            <p className="text-xs text-muted-foreground italic">Stop loss disabled. AI will use risk level defaults.</p>
          )}
        </div>

        {/* Take Profit */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="take-profit" className="text-base font-medium">
              Take Profit: {settings.takeProfitPercent}%
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Percentage gain at which the AI will automatically sell a position</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            id="take-profit"
            min={1}
            max={50}
            step={1}
            value={[settings.takeProfitPercent]}
            onValueChange={(value) => handleSettingChange("takeProfitPercent", value[0])}
            className={`w-full ${!settings.takeProfitEnabled ? "opacity-50" : ""}`}
            disabled={!settings.takeProfitEnabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
          {!settings.takeProfitEnabled && (
            <p className="text-xs text-muted-foreground italic">
              Take profit disabled. AI will use risk level defaults.
            </p>
          )}
        </div>

        {/* Max Positions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-positions" className="text-base font-medium">
              Max Positions: {settings.maxPositions}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Maximum number of positions the AI can hold simultaneously</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            id="max-positions"
            min={1}
            max={10}
            step={1}
            value={[settings.maxPositions]}
            onValueChange={(value) => handleSettingChange("maxPositions", value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Max Loss */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-loss" className="text-base font-medium">
              Max Loss: {settings.maxLoss}%
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Maximum percentage loss before AI stops trading</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            id="max-loss"
            min={1}
            max={20}
            step={1}
            value={[settings.maxLoss]}
            onValueChange={(value) => handleSettingChange("maxLoss", value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>10%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Timeframes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Timeframes</Label>
            {!checkFeatureAccess("multi_timeframe") && <ProFeatureLock feature="multi_timeframe" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {timeframes.map((timeframe) => {
              const isSelected = settings.timeframes.includes(timeframe)
              const isProFeature = timeframe !== "1h" && !checkFeatureAccess("multi_timeframe")

              return (
                <Badge
                  key={timeframe}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer ${isProFeature ? "opacity-50" : ""}`}
                  onClick={() => toggleTimeframe(timeframe)}
                >
                  {timeframe}
                  {isProFeature && <span className="ml-1 text-xs">PRO</span>}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4 rounded-md border p-4">
          <h4 className="font-medium">Advanced Options</h4>

          {/* Scalping Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="scalping-mode" className="text-sm">
                Scalping Mode
              </Label>
              <p className="text-xs text-muted-foreground">Close positions for small profits</p>
            </div>
            <Switch
              id="scalping-mode"
              checked={settings.scalpingMode}
              onCheckedChange={(value) => handleSettingChange("scalpingMode", value)}
            />
          </div>

          {/* Historical Data */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="historical-data" className="text-sm">
                Use Historical Data
              </Label>
              <p className="text-xs text-muted-foreground">Consider past market behavior</p>
            </div>
            {!checkFeatureAccess("historical_data") ? (
              <ProFeatureLock feature="historical_data" />
            ) : (
              <Switch
                id="historical-data"
                checked={settings.useHistoricalData}
                onCheckedChange={(value) => handleSettingChange("useHistoricalData", value)}
              />
            )}
          </div>

          {/* Continuous Operation */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="continuous-operation" className="text-sm">
                Continuous Operation
              </Label>
              <p className="text-xs text-muted-foreground">Keep trading when you're logged out</p>
            </div>
            {!checkFeatureAccess("continuous_operation") ? (
              <ProFeatureLock feature="continuous_operation" />
            ) : (
              <Switch
                id="continuous-operation"
                checked={settings.continuousOperation}
                onCheckedChange={(value) => handleSettingChange("continuousOperation", value)}
              />
            )}
          </div>
        </div>

        {/* Favorite Symbols */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Favorite Symbols</Label>
            {!checkFeatureAccess("favorites") && <ProFeatureLock feature="favorites" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"].map((symbol) => {
              const isFavorite = settings.favoriteSymbols.includes(symbol)
              return (
                <Badge
                  key={symbol}
                  variant="outline"
                  className={`cursor-pointer ${!checkFeatureAccess("favorites") ? "opacity-50" : ""}`}
                  onClick={() => toggleFavorite(symbol)}
                >
                  {symbol}
                  <Star
                    className={`ml-1 h-3 w-3 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                </Badge>
              )
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Reset
          </Button>
          <Button variant="destructive" onClick={handleResetAll} disabled={isLoading}>
            Reset All
          </Button>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

