"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, StarOff, AlertTriangle, Info, Clock, BarChart3, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AITradingConfigurationProps {
  onConfigChange?: (config: any) => void
}

export function AITradingConfiguration({ onConfigChange }: AITradingConfigurationProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [riskLevel, setRiskLevel] = useState(3)
  const [maxPositions, setMaxPositions] = useState(5)
  const [maxLoss, setMaxLoss] = useState(5)
  const [continuousOperation, setContinuousOperation] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(["5"])
  const [activeTab, setActiveTab] = useState("basic")
  const [maxDrawdown, setMaxDrawdown] = useState(10)
  const [profitTarget, setProfitTarget] = useState(15)
  const [useHistoricalData, setUseHistoricalData] = useState(true)
  const [scalping, setScalping] = useState(false)
  const { toast } = useToast()

  // Available timeframes
  const timeframes = [
    { value: "1", label: "1 Minute" },
    { value: "5", label: "5 Minutes" },
    { value: "15", label: "15 Minutes" },
    { value: "30", label: "30 Minutes" },
    { value: "60", label: "1 Hour" },
    { value: "D", label: "1 Day" },
  ]

  // Update config when values change
  useEffect(() => {
    // Enable scalping mode automatically when risk level is 5
    if (riskLevel === 5 && !scalping) {
      setScalping(true)
      toast({
        title: "Scalping Mode Enabled",
        description: "Risk level 5 automatically enables scalping mode for quick trades.",
      })
    }

    // Notify about configuration changes
    if (onConfigChange) {
      onConfigChange({
        isEnabled,
        riskLevel,
        maxPositions,
        maxLoss,
        continuousOperation,
        selectedTimeframes,
        maxDrawdown,
        profitTarget,
        useHistoricalData,
        scalping,
      })
    }
  }, [
    isEnabled,
    riskLevel,
    maxPositions,
    maxLoss,
    continuousOperation,
    selectedTimeframes,
    maxDrawdown,
    profitTarget,
    useHistoricalData,
    scalping,
    onConfigChange,
    toast,
  ])

  // Toggle timeframe selection
  const toggleTimeframe = (timeframe: string) => {
    setSelectedTimeframes((prev) => {
      if (prev.includes(timeframe)) {
        // Don't allow removing the last timeframe
        if (prev.length === 1) {
          toast({
            title: "Cannot Remove",
            description: "At least one timeframe must be selected.",
            variant: "destructive",
          })
          return prev
        }
        return prev.filter((t) => t !== timeframe)
      } else {
        return [...prev, timeframe]
      }
    })
  }

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite
        ? "This configuration has been removed from your favorites."
        : "This configuration has been added to your favorites.",
    })
  }

  // Toggle AI
  const toggleAI = () => {
    setIsEnabled(!isEnabled)
    toast({
      title: isEnabled ? "AI Trading Disabled" : "AI Trading Enabled",
      description: isEnabled
        ? "The AI trading bot has been disabled."
        : "The AI trading bot is now active and will begin analyzing the market.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Trading Configuration</CardTitle>
            <CardDescription>Configure how the AI trading bot operates</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleFavorite} className="h-8 w-8">
            {isFavorite ? (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
            <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="ai-trading-switch" className="text-base">
              AI Trading
            </Label>
            <p className="text-sm text-muted-foreground">Enable or disable the AI trading bot</p>
          </div>
          <Switch id="ai-trading-switch" checked={isEnabled} onCheckedChange={toggleAI} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="timeframes">Timeframes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="risk-level">Risk Level: {riskLevel}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Risk level info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Higher risk levels may yield higher returns but with increased volatility.</p>
                        <p className="mt-1">Level 5 enables scalping mode for quick trades.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Slider
                  id="risk-level"
                  min={1}
                  max={5}
                  step={1}
                  value={[riskLevel]}
                  onValueChange={(value) => setRiskLevel(value[0])}
                />
                {riskLevel === 5 && (
                  <div className="flex items-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Maximum risk level enables aggressive trading strategies.</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-positions">Maximum Positions: {maxPositions}</Label>
                <Slider
                  id="max-positions"
                  min={1}
                  max={10}
                  step={1}
                  value={[maxPositions]}
                  onValueChange={(value) => setMaxPositions(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-loss">Maximum Loss (%): {maxLoss}%</Label>
                <Slider
                  id="max-loss"
                  min={1}
                  max={20}
                  step={1}
                  value={[maxLoss]}
                  onValueChange={(value) => setMaxLoss(value[0])}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="continuous-operation"
                  checked={continuousOperation}
                  onCheckedChange={(checked) => setContinuousOperation(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="continuous-operation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Continuous Operation
                  </Label>
                  <p className="text-sm text-muted-foreground">Keep trading even when you're logged out</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-drawdown">Maximum Drawdown (%): {maxDrawdown}%</Label>
                <Slider
                  id="max-drawdown"
                  min={5}
                  max={30}
                  step={1}
                  value={[maxDrawdown]}
                  onValueChange={(value) => setMaxDrawdown(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profit-target">Profit Target (%): {profitTarget}%</Label>
                <Slider
                  id="profit-target"
                  min={5}
                  max={50}
                  step={1}
                  value={[profitTarget]}
                  onValueChange={(value) => setProfitTarget(value[0])}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="historical-data"
                  checked={useHistoricalData}
                  onCheckedChange={(checked) => setUseHistoricalData(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="historical-data"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use Historical Data
                  </Label>
                  <p className="text-sm text-muted-foreground">Consider previous highs and lows in analysis</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scalping-mode"
                  checked={scalping}
                  onCheckedChange={(checked) => setScalping(checked as boolean)}
                  disabled={riskLevel === 5} // Disabled when risk level is 5 as it's automatically enabled
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="scalping-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Scalping Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">Make quick trades for small profits</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeframes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-sm">Selected Timeframes</Label>
              <p className="text-sm text-muted-foreground mb-2">
                The AI will analyze these timeframes for trading decisions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={selectedTimeframes.includes(tf.value) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => toggleTimeframe(tf.value)}
                  >
                    {tf.value === "1" && <Clock className="mr-2 h-4 w-4" />}
                    {tf.value === "5" && <Clock className="mr-2 h-4 w-4" />}
                    {tf.value === "15" && <Clock className="mr-2 h-4 w-4" />}
                    {tf.value === "30" && <Clock className="mr-2 h-4 w-4" />}
                    {tf.value === "60" && <BarChart3 className="mr-2 h-4 w-4" />}
                    {tf.value === "D" && <BarChart3 className="mr-2 h-4 w-4" />}
                    {tf.label}
                  </Button>
                ))}
              </div>
              {selectedTimeframes.includes("1") && riskLevel >= 4 && (
                <div className="flex items-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm mt-2">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>1-minute timeframe with high risk level may result in frequent trades.</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button className="w-full" onClick={toggleAI} variant={isEnabled ? "destructive" : "default"}>
          {isEnabled ? (
            <>Disable AI Trading</>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" /> Enable AI Trading
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

