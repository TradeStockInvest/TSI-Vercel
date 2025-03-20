"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  X,
  RefreshCw,
  Search,
  Clock,
  AlertCircle,
  DollarSign,
  Star,
  StarOff,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TradingViewChart } from "@/components/charts/trading-view-chart"

interface AITrade {
  id: string
  symbol: string
  side: "buy" | "sell"
  quantity: number
  price: number
  timestamp: string
  status: "open" | "closed"
  profit?: number
  profitPercentage?: number
  reasoning: string
  assetClass: string
  isResetMarker?: boolean
}

interface AIPosition {
  id: string
  symbol: string
  qty: number
  avg_entry_price: number
  current_price: number
  unrealized_pl: number
  unrealized_plpc: number
  ai_managed: boolean
  assetClass: string
  entry_time: string
  side: "buy" | "sell" // Add position side
  lastUpdated?: string // Add timestamp for last update
}

interface AIInsight {
  id: string
  timestamp: string
  content: string
  assetClass: string
  symbol: string
  sentiment: "bullish" | "bearish" | "neutral"
  confidence: number
  metrics: {
    name: string
    value: string
    trend: "up" | "down" | "neutral"
  }[]
}

interface MarketInstrument {
  symbol: string
  name: string
  assetClass: string
  bid: number
  ask: number
  spread: number
  dayHigh: number
  dayLow: number
  leverage: number
  isOpen: boolean
  isFavorite: boolean
  lastUpdated: string
}

// Helper function to safely access localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const value = localStorage.getItem(key)
    if (value === null) {
      return defaultValue
    }
    return JSON.parse(value)
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

// Helper function to safely set localStorage
const setLocalStorage = (key: string, value: any) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
  }
}

export function AIAgentContent() {
  // AI Agent state
  const [isAIEnabled, setIsAIEnabled] = useState(false)
  const [isDeepLearningActive, setIsDeepLearningActive] = useState(false)
  const [maxTradeAmount, setMaxTradeAmount] = useState(1000)
  const [stopLossPercentage, setStopLossPercentage] = useState(5)
  const [takeProfitPercentage, setTakeProfitPercentage] = useState(10)
  const [maxPositions, setMaxPositions] = useState(5)
  const [riskLevel, setRiskLevel] = useState(3)
  const [aiTrades, setAiTrades] = useState<AITrade[]>([])
  const [aiPositions, setAiPositions] = useState<AIPosition[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [closingPositions, setClosingPositions] = useState(false)
  const [selectedAssetClass, setSelectedAssetClass] = useState("all")
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [symbolSearch, setSymbolSearch] = useState("")
  const [learningProgress, setLearningProgress] = useState(0)
  const [lastInsightUpdate, setLastInsightUpdate] = useState<Date | null>(null)
  const [nextInsightUpdate, setNextInsightUpdate] = useState<Date | null>(null)
  const [aiPerformance, setAiPerformance] = useState({
    totalTrades: 0,
    successfulTrades: 0,
    totalProfit: 0,
    winRate: 0,
    averageReturn: 0,
  })
  const [deepLearningData, setDeepLearningData] = useState<{
    patterns: { [key: string]: number }
    insights: { [key: string]: string[] }
    lastUpdated: string
  }>({
    patterns: {},
    insights: {},
    lastUpdated: new Date().toISOString(),
  })
  const [chartAnnotations, setChartAnnotations] = useState<{
    trendLines: { start: [number, number]; end: [number, number]; color: string }[]
    buyPoints: [number, number][]
    sellPoints: [number, number][]
  }>({
    trendLines: [],
    buyPoints: [],
    sellPoints: [],
  })
  const [marketInstruments, setMarketInstruments] = useState<MarketInstrument[]>([])
  const [favoriteInstruments, setFavoriteInstruments] = useState<string[]>([])

  const [hasShownInitialPrediction, setHasShownInitialPrediction] = useState(false)
  const [marketPrediction, setMarketPrediction] = useState<{
    symbol: string
    direction: "buy" | "sell"
    confidence: number
    reasoning: string
  } | null>(null)
  const [showPredictionAlert, setShowPredictionAlert] = useState(false)

  // Add this near the top of the file, after the existing state variables
  const [continuousOperation, setContinuousOperation] = useState(false)

  // Refs for intervals
  const positionUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const deepLearningIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const insightUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const marketUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add a ref to track last position update time
  const lastUpdateRef = useRef<number>(Date.now())

  // Available symbols by asset class
  const availableSymbols = {
    stocks: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "WMT"],
    crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "ADA-USD", "DOT-USD", "AVAX-USD", "MATIC-USD"],
    forex: ["EUR-USD", "GBP-USD", "USD-JPY", "AUD-USD", "USD-CAD", "NZD-USD", "USD-CHF"],
    indices: ["SPX", "NDX", "DJI", "RUT", "VIX", "FTSE", "DAX"],
    commodities: ["UKOIL", "USOIL", "NGAS", "XAUUSD", "XAGUSD", "XPTUSD", "XPDUSD"],
  }

  // Initialize market instruments
  useEffect(() => {
    const instruments: MarketInstrument[] = []

    Object.entries(availableSymbols).forEach(([assetClass, symbols]) => {
      symbols.forEach((symbol) => {
        // Generate realistic market data
        const basePrice =
          assetClass === "crypto"
            ? Math.random() * 50000 + 100
            : assetClass === "forex"
              ? Math.random() * 2 + 0.5
              : assetClass === "commodities" && symbol.includes("XAU")
                ? Math.random() * 1000 + 1500
                : Math.random() * 200 + 50

        const bid = Number.parseFloat(basePrice.toFixed(2))
        const spread = Number.parseFloat((Math.random() * 0.01 * basePrice).toFixed(2))
        const ask = Number.parseFloat((bid + spread).toFixed(2))
        const dayHigh = Number.parseFloat((ask + Math.random() * 0.05 * ask).toFixed(2))
        const dayLow = Number.parseFloat((bid - Math.random() * 0.05 * bid).toFixed(2))

        // Determine if market is open based on asset class and time
        const now = new Date()
        const hour = now.getUTCHours()
        const day = now.getUTCDay()

        // Crypto markets are always open
        // Stock markets are open 9:30-16:00 EST (14:30-21:00 UTC) Monday-Friday
        // Forex markets are open 24/5 (closed weekends)
        let isOpen = true

        if (assetClass === "stocks" || assetClass === "indices") {
          isOpen = day >= 1 && day <= 5 && hour >= 14 && hour < 21
        } else if (assetClass === "forex" || assetClass === "commodities") {
          isOpen = day >= 1 && day <= 5
        }

        instruments.push({
          symbol,
          name: getInstrumentName(symbol, assetClass),
          assetClass,
          bid,
          ask,
          spread,
          dayHigh,
          dayLow,
          leverage: assetClass === "crypto" ? 5 : assetClass === "stocks" ? 2 : 100,
          isOpen,
          isFavorite: favoriteInstruments.includes(symbol),
          lastUpdated: new Date().toISOString(),
        })
      })
    })

    setMarketInstruments(instruments)
  }, [favoriteInstruments])

  // Get instrument name
  const getInstrumentName = (symbol: string, assetClass: string): string => {
    const names: Record<string, string> = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corporation",
      GOOGL: "Alphabet Inc.",
      AMZN: "Amazon.com Inc.",
      TSLA: "Tesla Inc.",
      META: "Meta Platforms Inc.",
      NVDA: "NVIDIA Corporation",
      JPM: "JPMorgan Chase & Co.",
      V: "Visa Inc.",
      WMT: "Walmart Inc.",
      "BTC-USD": "Bitcoin",
      "ETH-USD": "Ethereum",
      "SOL-USD": "Solana",
      "ADA-USD": "Cardano",
      "DOT-USD": "Polkadot",
      "AVAX-USD": "Avalanche",
      "MATIC-USD": "Polygon",
      "EUR-USD": "Euro vs US Dollar",
      "GBP-USD": "British Pound vs US Dollar",
      "USD-JPY": "US Dollar vs Japanese Yen",
      "AUD-USD": "Australian Dollar vs US Dollar",
      "USD-CAD": "US Dollar vs Canadian Dollar",
      "NZD-USD": "New Zealand Dollar vs US Dollar",
      "USD-CHF": "US Dollar vs Swiss Franc",
      SPX: "S&P 500 Index",
      NDX: "Nasdaq 100 Index",
      DJI: "Dow Jones Industrial Average",
      RUT: "Russell 2000 Index",
      VIX: "CBOE Volatility Index",
      FTSE: "FTSE 100 Index",
      DAX: "DAX 40 Index",
      UKOIL: "Brent Crude Oil",
      USOIL: "US Light Sweet Oil",
      NGAS: "Natural Gas",
      XAUUSD: "Gold vs US Dollar",
      XAGUSD: "Silver vs US Dollar",
      XPTUSD: "Platinum vs US Dollar",
      XPDUSD: "Palladium vs US Dollar",
    }

    return names[symbol] || `${symbol} (${assetClass})`
  }

  // Update market data periodically
  useEffect(() => {
    const updateMarketData = () => {
      setMarketInstruments((prev) =>
        prev.map((instrument) => {
          // Only update prices for open markets
          if (!instrument.isOpen) return instrument

          const priceChange = (Math.random() * 0.002 - 0.001) * instrument.bid
          const newBid = Number.parseFloat((instrument.bid + priceChange).toFixed(2))
          const newAsk = Number.parseFloat((newBid + instrument.spread).toFixed(2))

          // Update day high/low if needed
          const newDayHigh = Math.max(instrument.dayHigh, newAsk)
          const newDayLow = Math.min(instrument.dayLow, newBid)

          return {
            ...instrument,
            bid: newBid,
            ask: newAsk,
            dayHigh: newDayHigh,
            dayLow: newDayLow,
            lastUpdated: new Date().toISOString(),
          }
        }),
      )
    }

    marketUpdateIntervalRef.current = setInterval(updateMarketData, 2000)

    return () => {
      if (marketUpdateIntervalRef.current) {
        clearInterval(marketUpdateIntervalRef.current)
      }
    }
  }, [])

  // Load saved settings from localStorage - moved to useEffect
  useEffect(() => {
    // Load favorites from localStorage
    setFavoriteInstruments(getLocalStorage("favoriteInstruments", []))

    // Load deep learning data from localStorage
    setDeepLearningData(
      getLocalStorage("aiDeepLearningData", {
        patterns: {},
        insights: {},
        lastUpdated: new Date().toISOString(),
      }),
    )

    // Load continuous operation setting
    setContinuousOperation(getLocalStorage("continuousAIEnabled", false))

    const savedSettings = getLocalStorage("aiAgentSettings", null)
    if (savedSettings) {
      try {
        setIsAIEnabled(savedSettings.isAIEnabled || false)
        setMaxTradeAmount(savedSettings.maxTradeAmount || 1000)
        setStopLossPercentage(savedSettings.stopLossPercentage || 5)
        setTakeProfitPercentage(savedSettings.takeProfitPercentage || 10)
        setMaxPositions(savedSettings.maxPositions || 5)
        setRiskLevel(savedSettings.riskLevel || 3)
        setSelectedAssetClass(savedSettings.selectedAssetClass || "all")
        setSelectedSymbol(savedSettings.selectedSymbol || "AAPL")
      } catch (e) {
        console.error("Error parsing saved AI settings:", e)
      }
    }

    // Load AI trades from localStorage - no sample trades
    const savedTrades = getLocalStorage("aiTrades", [])
    setAiTrades(savedTrades)

    // Load AI positions from localStorage - no sample positions
    const savedPositions = getLocalStorage("aiPositions", [])
    setAiPositions(savedPositions)

    // Load AI insights from localStorage
    const savedInsights = getLocalStorage("aiInsights", [])
    setAiInsights(savedInsights)

    // Set last and next insight update times
    const now = new Date()
    setLastInsightUpdate(new Date(now.getTime() - 15 * 60 * 1000)) // 15 minutes ago
    setNextInsightUpdate(new Date(now.getTime() + 15 * 60 * 1000)) // 15 minutes from now

    // Finish loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => {
      // Clean up intervals on unmount
      if (positionUpdateIntervalRef.current) clearInterval(positionUpdateIntervalRef.current)
      if (deepLearningIntervalRef.current) clearInterval(deepLearningIntervalRef.current)
      if (insightUpdateIntervalRef.current) clearInterval(insightUpdateIntervalRef.current)
      if (marketUpdateIntervalRef.current) clearInterval(marketUpdateIntervalRef.current)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = {
        isAIEnabled,
        maxTradeAmount,
        stopLossPercentage,
        takeProfitPercentage,
        maxPositions,
        riskLevel,
        selectedAssetClass,
        selectedSymbol,
        continuousOperation,
      }
      localStorage.setItem("aiAgentSettings", JSON.stringify(settings))
    }
  }, [
    isAIEnabled,
    maxTradeAmount,
    stopLossPercentage,
    takeProfitPercentage,
    maxPositions,
    riskLevel,
    selectedAssetClass,
    selectedSymbol,
    continuousOperation,
  ])

  // Save AI trades to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && aiTrades.length > 0) {
      localStorage.setItem("aiTrades", JSON.stringify(aiTrades))
    }
  }, [aiTrades])

  // Save AI positions to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aiPositions", JSON.stringify(aiPositions))
    }
  }, [aiPositions])

  // Save AI insights to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && aiInsights.length > 0) {
      localStorage.setItem("aiInsights", JSON.stringify(aiInsights))
    }
  }, [aiInsights])

  // Save deep learning data
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aiDeepLearningData", JSON.stringify(deepLearningData))
    }
  }, [deepLearningData])

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favoriteInstruments", JSON.stringify(favoriteInstruments))
    }
  }, [favoriteInstruments])

  // Add this effect to save the continuous operation state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("continuousAIEnabled", continuousOperation.toString())
    }
  }, [continuousOperation])

  // Calculate AI performance metrics
  useEffect(() => {
    if (aiTrades.length > 0) {
      // Find the most recent reset marker
      const resetIndex = aiTrades.findIndex((trade) => trade.isResetMarker)

      // Get trades after the reset (or all trades if no reset)
      const relevantTrades = resetIndex >= 0 ? aiTrades.slice(0, resetIndex) : aiTrades

      const closedTrades = relevantTrades.filter((trade) => trade.status === "closed" && !trade.isResetMarker)
      const successfulTrades = closedTrades.filter((trade) => (trade.profit || 0) > 0)
      const totalProfit = closedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0)

      setAiPerformance({
        totalTrades: closedTrades.length,
        successfulTrades: successfulTrades.length,
        totalProfit,
        winRate: closedTrades.length > 0 ? (successfulTrades.length / closedTrades.length) * 100 : 0,
        averageReturn: closedTrades.length > 0 ? totalProfit / closedTrades.length : 0,
      })
    } else {
      // Reset performance metrics if no trades
      setAiPerformance({
        totalTrades: 0,
        successfulTrades: 0,
        totalProfit: 0,
        winRate: 0,
        averageReturn: 0,
      })
    }
  }, [aiTrades])

  // Set up real-time position updates when AI is enabled
  useEffect(() => {
    if (isAIEnabled) {
      // Update positions less frequently to reduce flickering
      positionUpdateIntervalRef.current = setInterval(() => {
        updatePositionPrices()
      }, 2000) // Change from 1000ms to 2000ms

      // Set up deep learning interval if enabled
      if (isDeepLearningActive) {
        deepLearningIntervalRef.current = setInterval(() => {
          updateDeepLearning()
        }, 15000) // Every 15 seconds
      }

      // Set up insight update interval
      insightUpdateIntervalRef.current = setInterval(
        () => {
          updateAIInsights()
        },
        15 * 60 * 1000,
      ) // Every 15 minutes
    } else {
      // Clear intervals when AI is disabled
      if (positionUpdateIntervalRef.current) {
        clearInterval(positionUpdateIntervalRef.current)
        positionUpdateIntervalRef.current = null
      }
      if (deepLearningIntervalRef.current) {
        clearInterval(deepLearningIntervalRef.current)
        deepLearningIntervalRef.current = null
      }
      if (insightUpdateIntervalRef.current) {
        clearInterval(insightUpdateIntervalRef.current)
        insightUpdateIntervalRef.current = null
      }
    }

    return () => {
      // Clean up intervals on unmount or when AI is disabled
      if (positionUpdateIntervalRef.current) clearInterval(positionUpdateIntervalRef.current)
      if (deepLearningIntervalRef.current) clearInterval(deepLearningIntervalRef.current)
      if (insightUpdateIntervalRef.current) clearInterval(insightUpdateIntervalRef.current)
    }
  }, [isAIEnabled, isDeepLearningActive])

  // Update countdown timer for next insight update
  useEffect(() => {
    if (nextInsightUpdate) {
      const timer = setInterval(() => {
        setNextInsightUpdate((prev) => {
          if (!prev) return null

          // If we've reached the update time, generate a new insight
          const now = new Date()
          if (prev <= now) {
            updateAIInsights()
            return new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes from now
          }
          return prev
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [nextInsightUpdate])

  // Add this function to handle window close/refresh events
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // If AI is enabled and there are open positions, but continuous operation is not enabled
      if (isAIEnabled && aiPositions.length > 0 && !continuousOperation) {
        // Show confirmation dialog
        const message =
          "You have active AI trades. Positions will be closed if you leave. Enable continuous operation to keep AI trading."
        e.returnValue = message
        return message
      }
    }

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isAIEnabled, aiPositions.length, continuousOperation])

  // Add this function to handle user logout
  useEffect(() => {
    if (typeof window === "undefined") return

    // Function to check if user is logged out
    const checkLoginStatus = () => {
      const userLoggedIn =
        localStorage.getItem("userLoggedIn") === "true" || sessionStorage.getItem("userLoggedIn") === "true"

      // If user was logged in but now is logged out, and continuous operation is not enabled
      if (!userLoggedIn && !continuousOperation && aiPositions.length > 0) {
        // Close all AI positions
        closeAllAIPositions()
      }
    }

    // Check login status when component mounts and when relevant state changes
    // Don't run this check until component has fully initialized
    const timer = setTimeout(checkLoginStatus, 2000)

    // Set up interval to periodically check login status
    const intervalId = setInterval(checkLoginStatus, 60000) // Check every minute

    return () => {
      clearTimeout(timer)
      clearInterval(intervalId)
    }
  }, [continuousOperation, aiPositions.length])

  // Add this effect to track active AI trades
  useEffect(() => {
    if (typeof window === "undefined") return

    // Update localStorage when AI positions change
    const hasActivePositions = aiPositions.length > 0
    localStorage.setItem("hasActiveAITrades", hasActivePositions.toString())

    // Clean up when component unmounts
    return () => {
      if (!continuousOperation) {
        // Close all AI positions if continuous operation is not enabled
        closeAllAIPositions()
      }
    }
  }, [aiPositions, continuousOperation])

  // Update position prices in real-time
  const updatePositionPrices = () => {
    if (aiPositions.length === 0 || !isAIEnabled) return

    // Use a debounce technique to limit updates
    const now = Date.now()
    if (now - lastUpdateRef.current < 500) {
      return // Skip update if less than 500ms since last update
    }
    lastUpdateRef.current = now

    setAiPositions((prevPositions) =>
      prevPositions.map((position) => {
        // Find the corresponding instrument to get real-time price
        const instrument = marketInstruments.find((i) => i.symbol === position.symbol)

        if (!instrument) {
          // If instrument not found, use random price movement
          const priceChange = (Math.random() * 0.01 - 0.005) * position.avg_entry_price // -0.5% to +0.5%
          const newPrice = Number.parseFloat((position.current_price + priceChange).toFixed(2))
          const newPL = (newPrice - position.avg_entry_price) * position.qty
          const newPLPC = (newPL / (position.avg_entry_price * position.qty)) * 100

          return {
            ...position,
            current_price: newPrice,
            unrealized_pl: Number.parseFloat(newPL.toFixed(2)),
            unrealized_plpc: Number.parseFloat(newPLPC.toFixed(2)),
            lastUpdated: new Date().toISOString(), // Add timestamp for last update
          }
        } else {
          // Use real-time price from instrument
          const newPrice = position.side === "buy" ? instrument.bid : instrument.ask // Use appropriate price based on position side
          const newPL =
            position.side === "buy"
              ? (newPrice - position.avg_entry_price) * position.qty
              : (position.avg_entry_price - newPrice) * position.qty
          const newPLPC = (newPL / (position.avg_entry_price * position.qty)) * 100

          return {
            ...position,
            current_price: newPrice,
            unrealized_pl: Number.parseFloat(newPL.toFixed(2)),
            unrealized_plpc: Number.parseFloat(newPLPC.toFixed(2)),
            lastUpdated: new Date().toISOString(), // Add timestamp for last update
          }
        }
      }),
    )

    // Update performance metrics in real-time
    updatePerformanceMetrics()
  }

  // Add this function to close all AI positions
  const closeAllAIPositions = async () => {
    // Don't do anything if there are no positions or we're already closing
    if (aiPositions.length === 0 || closingPositions) {
      return
    }

    setClosingPositions(true)

    try {
      // In a real implementation, this would close actual positions
      // For demo purposes, we'll just simulate it with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update AI trades to mark positions as closed
      const updatedTrades = aiTrades.map((trade) => {
        if (trade.status === "open") {
          const position = aiPositions.find((p) => p.id === `pos-${trade.id}`)
          const randomProfit = position
            ? position.unrealized_pl
            : Number.parseFloat((Math.random() * 200 - 50).toFixed(2))
          const randomProfitPercentage = position
            ? position.unrealized_plpc
            : Number.parseFloat(((randomProfit / (trade.price * trade.quantity)) * 100).toFixed(2))

          return {
            ...trade,
            status: "closed",
            profit: randomProfit,
            profitPercentage: randomProfitPercentage,
          }
        }
        return trade
      })

      setAiTrades(updatedTrades)
      setAiPositions([])
    } catch (error) {
      console.error("Error closing AI positions:", error)
    } finally {
      setClosingPositions(false)
    }
  }

  // Add this new function to update performance metrics
  const updatePerformanceMetrics = () => {
    if (aiTrades.length > 0) {
      // Find the most recent reset marker
      const resetIndex = aiTrades.findIndex((trade) => trade.isResetMarker)

      // Get trades after the reset (or all trades if no reset)
      const relevantTrades = resetIndex >= 0 ? aiTrades.slice(0, resetIndex) : aiTrades

      const closedTrades = relevantTrades.filter((trade) => trade.status === "closed" && !trade.isResetMarker)
      const successfulTrades = closedTrades.filter((trade) => (trade.profit || 0) > 0)
      const totalProfit = closedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0)

      // Add unrealized profits from current positions
      const unrealizedProfit = aiPositions.reduce((sum, position) => sum + position.unrealized_pl, 0)

      setAiPerformance({
        totalTrades: closedTrades.length,
        successfulTrades: successfulTrades.length,
        totalProfit: totalProfit + unrealizedProfit,
        winRate: closedTrades.length > 0 ? (successfulTrades.length / closedTrades.length) * 100 : 0,
        averageReturn: closedTrades.length > 0 ? totalProfit / closedTrades.length : 0,
      })
    }
  }

  // Reset AI performance metrics
  const resetAIPerformance = () => {
    if (
      typeof window !== "undefined" &&
      confirm("Are you sure you want to reset performance metrics? Trade history will be preserved.")
    ) {
      // Add a reset marker to trades
      const resetMarker: AITrade = {
        id: `reset-${Date.now()}`,
        symbol: "RESET",
        side: "buy",
        quantity: 0,
        price: 0,
        timestamp: new Date().toISOString(),
        status: "closed",
        reasoning: "Performance metrics reset by user",
        assetClass: "reset",
        isResetMarker: true,
      }

      setAiTrades((prev) => [resetMarker, ...prev])

      // Reset performance metrics
      setAiPerformance({
        totalTrades: 0,
        successfulTrades: 0,
        totalProfit: 0,
        winRate: 0,
        averageReturn: 0,
      })
    }
  }

  // Update deep learning model
  const updateDeepLearning = () => {
    // Simulate deep learning progress
    setLearningProgress((prev) => {
      const newProgress = prev + Math.random() * 5
      return newProgress > 100 ? 0 : newProgress
    })

    // Update deep learning data with new patterns
    if (learningProgress > 95) {
      const newPatterns = { ...deepLearningData.patterns }
      const newInsights = { ...deepLearningData.insights }

      // Add new pattern for current symbol
      const patternKey = `${selectedAssetClass}-${selectedSymbol}`
      newPatterns[patternKey] = (newPatterns[patternKey] || 0) + 1

      // Add new insight
      if (!newInsights[patternKey]) {
        newInsights[patternKey] = []
      }
      if (newInsights[patternKey].length > 20) {
        newInsights[patternKey].shift() // Remove oldest insight if we have too many
      }
      newInsights[patternKey].push(`Pattern detected at ${new Date().toLocaleString()}`)

      // Update deep learning data
      setDeepLearningData({
        patterns: newPatterns,
        insights: newInsights,
        lastUpdated: new Date().toISOString(),
      })
    }

    // Simulate AI analyzing market before making decisions
    if (isAIEnabled && !hasShownInitialPrediction) {
      // After analysis is complete, show prediction
      if (learningProgress > 95) {
        setHasShownInitialPrediction(true)
        generateMarketPrediction()
      }
      return
    }

    // Simulate AI making trading decisions - only after showing prediction
    if (isAIEnabled && hasShownInitialPrediction && aiPositions.length < maxPositions && Math.random() > 0.7) {
      // 30% chance to open a new position if below max positions
      openNewAIPosition()
    }

    // Simulate AI closing positions based on take profit/stop loss or scalping
    if (isAIEnabled && aiPositions.length > 0) {
      aiPositions.forEach((position) => {
        // Check if the market for this position is still open
        const instrument = marketInstruments.find((i) => i.symbol === position.symbol)

        if (!instrument || !instrument.isOpen) {
          // Market is closed, don't take any action
          return
        }

        if (
          position.unrealized_plpc <= -stopLossPercentage || // Stop loss hit
          position.unrealized_plpc >= takeProfitPercentage || // Take profit hit
          (position.unrealized_pl > 0 && Math.random() > 0.5) || // Scalping - any profit with 50% chance to close
          Math.random() > 0.95 // Random chance to close (5%)
        ) {
          closeAIPosition(position.id)
          // Show notification when position is closed for profit
          if (position.unrealized_pl > 0) {
            setShowPredictionAlert(true)
            setMarketPrediction({
              symbol: position.symbol,
              direction: "sell",
              confidence: 95,
              reasoning: `Scalping opportunity - taking profit of $${position.unrealized_pl.toFixed(2)} (${position.unrealized_plpc.toFixed(2)}%)`,
            })
            setTimeout(() => setShowPredictionAlert(false), 5000)
          }
        }
      })
    }
  }

  // Generate market prediction before trading
  const generateMarketPrediction = () => {
    // Only generate predictions for open markets
    const openInstruments = marketInstruments.filter((i) => i.isOpen)

    if (openInstruments.length === 0) {
      console.log("No open markets available for trading")
      return
    }

    // Select a random open instrument
    const randomInstrument = openInstruments[Math.floor(Math.random() * openInstruments.length)]

    const prediction = {
      symbol: randomInstrument.symbol,
      direction: Math.random() > 0.5 ? "buy" : "sell",
      confidence: Math.round(Math.random() * 30 + 70),
      reasoning:
        Math.random() > 0.5
          ? `Detected strong ${Math.random() > 0.5 ? "bullish" : "bearish"} pattern with increasing volume`
          : `${Math.random() > 0.5 ? "Oversold" : "Overbought"} conditions with RSI ${Math.random() > 0.5 ? "divergence" : "convergence"}`,
    }

    setMarketPrediction(prediction)

    // Update chart annotations for this symbol
    if (randomInstrument.symbol === selectedSymbol) {
      generateChartAnnotations()
    }

    // Show prediction alert
    setShowPredictionAlert(true)
    setTimeout(() => setShowPredictionAlert(false), 5000)
  }

  // Update AI insights
  const updateAIInsights = () => {
    const now = new Date()
    setLastInsightUpdate(now)
    setNextInsightUpdate(new Date(now.getTime() + 15 * 60 * 1000)) // 15 minutes from now

    // Generate new insight for the currently selected symbol
    const newInsight = generateInsightForSymbol(selectedSymbol, selectedAssetClass)

    setAiInsights((prev) => [newInsight, ...prev])
  }

  // Generate a new insight for a specific symbol
  const generateInsightForSymbol = (symbol: string, assetClass: string) => {
    const insightTemplates = [
      {
        content: `After analyzing recent price action for ${symbol}, I've detected a strong momentum shift with increasing volume. The 50-day moving average has crossed above the 200-day moving average, forming a golden cross pattern. This typically signals the potential for continued upward movement. RSI indicates the asset is not yet overbought, suggesting room for further growth.`,
        sentiment: "bullish" as const,
        metrics: [
          { name: "RSI", value: `${Math.floor(Math.random() * 20 + 60)}`, trend: "up" as const },
          { name: "MACD", value: `${(Math.random() * 3 + 1).toFixed(2)}`, trend: "up" as const },
          { name: "Volume", value: `+${Math.floor(Math.random() * 30 + 15)}%`, trend: "up" as const },
        ],
      },
      {
        content: `My analysis of ${symbol} shows concerning technical weakness. The price has broken below key support levels with increasing selling volume. The death cross formation (50-day MA crossing below 200-day MA) has materialized, and momentum indicators are trending downward. I'm detecting distribution patterns suggesting institutional selling.`,
        sentiment: "bearish" as const,
        metrics: [
          { name: "RSI", value: `${Math.floor(Math.random() * 15 + 20)}`, trend: "down" as const },
          { name: "MACD", value: `-${(Math.random() * 3 + 1).toFixed(2)}`, trend: "down" as const },
          { name: "Volume", value: `+${Math.floor(Math.random() * 40 + 10)}%`, trend: "up" as const },
        ],
      },
      {
        content: `${symbol} is currently in a consolidation phase with decreasing volatility. Price is trading within a well-defined range between support at ${(Math.random() * 50 + 100).toFixed(2)} and resistance at ${(Math.random() * 50 + 150).toFixed(2)}. Volume has been declining during this consolidation, which is typical. I'm waiting for a high-volume breakout from this range to determine direction.`,
        sentiment: "neutral" as const,
        metrics: [
          { name: "RSI", value: `${Math.floor(Math.random() * 10 + 45)}`, trend: "neutral" as const },
          { name: "MACD", value: `${(Math.random() * 0.5 - 0.25).toFixed(2)}`, trend: "neutral" as const },
          { name: "Volume", value: `-${Math.floor(Math.random() * 15 + 5)}%`, trend: "down" as const },
        ],
      },
    ]

    const template = insightTemplates[Math.floor(Math.random() * insightTemplates.length)]

    return {
      id: `insight-${assetClass}-${symbol}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      content: template.content,
      assetClass: assetClass,
      symbol: symbol,
      sentiment: template.sentiment,
      confidence: Math.round(Math.random() * 30 + 70), // 70-100%
      metrics: template.metrics,
    }
  }

  // Open a new AI position
  const openNewAIPosition = () => {
    // Check if we've reached maximum positions
    if (aiPositions.length >= maxPositions) {
      return
    }

    // Get only open markets
    const openInstruments = marketInstruments.filter((i) => i.isOpen)

    if (openInstruments.length === 0) {
      console.log("No open markets available for trading")
      return
    }

    // Select a random open instrument
    const randomInstrument = openInstruments[Math.floor(Math.random() * openInstruments.length)]
    const symbol = randomInstrument.symbol
    const assetClass = randomInstrument.assetClass

    // Determine side (buy/sell) - support short selling
    const side = Math.random() > 0.5 ? "buy" : "sell"

    // Use actual price from the instrument
    const price = side === "buy" ? randomInstrument.ask : randomInstrument.bid

    // Calculate quantity based on max trade amount
    const quantity = Math.max(1, Math.floor(maxTradeAmount / price))

    // Generate reasoning
    const reasons = [
      `${side === "buy" ? "Bullish" : "Bearish"} pattern detected on 4-hour chart with increasing volume`,
      `${side === "buy" ? "Positive" : "Negative"} momentum confirmed by MACD crossover`,
      `Price ${side === "buy" ? "bounced off support" : "rejected at resistance"} with strong confirmation`,
      `${side === "buy" ? "Oversold" : "Overbought"} conditions with RSI ${side === "buy" ? "divergence" : "convergence"}`,
      `${side === "buy" ? "Accumulation" : "Distribution"} pattern detected with institutional activity`,
      `Unusual options activity suggesting ${side === "buy" ? "upside" : "downside"} potential`,
      `Mean reversion strategy after excessive ${side === "buy" ? "selloff" : "rally"}`,
      `${side === "sell" ? "Short selling opportunity" : "Long position opportunity"} based on market conditions`,
      `Scalping opportunity detected with ${side === "buy" ? "upward" : "downward"} momentum`,
    ]
    const reasoning = reasons[Math.floor(Math.random() * reasons.length)]

    // Create new trade
    const newTrade: AITrade = {
      id: `ai-trade-${Date.now()}`,
      symbol,
      side,
      quantity,
      price,
      timestamp: new Date().toISOString(),
      status: "open",
      reasoning,
      assetClass,
    }

    // Create new position with initial P/L values
    const initialPriceChange = (Math.random() * 0.01 - 0.005) * price // Small initial change
    const initialPrice = price + initialPriceChange
    const initialPL = (initialPrice - price) * quantity
    const initialPLPC = (initialPL / (price * quantity)) * 100

    const newPosition: AIPosition = {
      id: `pos-${newTrade.id}`,
      symbol,
      qty: quantity,
      avg_entry_price: price,
      current_price: initialPrice,
      unrealized_pl: Number.parseFloat(initialPL.toFixed(2)),
      unrealized_plpc: Number.parseFloat(initialPLPC.toFixed(2)),
      ai_managed: true,
      assetClass,
      entry_time: newTrade.timestamp,
      side: side, // Add the side
      lastUpdated: new Date().toISOString(), // Add timestamp
    }

    // Update state
    setAiTrades((prev) => [newTrade, ...prev])
    setAiPositions((prev) => [newPosition, ...prev])

    // Generate new chart annotations if this is for the currently selected symbol
    if (symbol === selectedSymbol) {
      generateChartAnnotations()
    }

    // Show notification
    setShowPredictionAlert(true)
    setMarketPrediction({
      symbol,
      direction: side,
      confidence: Math.round(Math.random() * 20 + 75),
      reasoning,
    })
    setTimeout(() => setShowPredictionAlert(false), 5000)
  }

  // Close an AI position
  const closeAIPosition = (positionId: string) => {
    // Only allow closing positions if AI is enabled and not in the process of closing positions
    if (!isAIEnabled || closingPositions) {
      return
    }

    // Find the position
    const position = aiPositions.find((p) => p.id === positionId)
    if (!position) return

    // Find the corresponding trade
    const tradeId = positionId.replace("pos-", "")

    // Update the trade
    setAiTrades((prev) =>
      prev.map((trade) => {
        if (trade.id === tradeId) {
          const profit = position.unrealized_pl
          const profitPercentage = position.unrealized_plpc

          return {
            ...trade,
            status: "closed",
            profit,
            profitPercentage,
          }
        }
        return trade
      }),
    )

    // Remove the position
    setAiPositions((prev) => prev.filter((p) => p.id !== positionId))
  }

  // Handle toggling the AI agent on/off
  const handleToggleAI = async (enabled: boolean) => {
    if (!enabled && aiPositions.length > 0) {
      if (
        typeof window !== "undefined" &&
        confirm("Turning off the AI will close all AI-managed positions. Continue?")
      ) {
        setClosingPositions(true)

        try {
          // In a real implementation, this would close actual positions
          // For demo purposes, we'll just simulate it with a delay
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Update AI trades to mark positions as closed
          const updatedTrades = aiTrades.map((trade) => {
            if (trade.status === "open") {
              const position = aiPositions.find((p) => p.id === `pos-${trade.id}`)
              const randomProfit = position
                ? position.unrealized_pl
                : Number.parseFloat((Math.random() * 200 - 50).toFixed(2))
              const randomProfitPercentage = position
                ? position.unrealized_plpc
                : Number.parseFloat(((randomProfit / (trade.price * trade.quantity)) * 100).toFixed(2))

              return {
                ...trade,
                status: "closed",
                profit: randomProfit,
                profitPercentage: randomProfitPercentage,
              }
            }
            return trade
          })

          setAiTrades(updatedTrades)
          setAiPositions([])
          setIsAIEnabled(false)
          setIsDeepLearningActive(false)
        } catch (error) {
          console.error("Error closing AI positions:", error)
          if (typeof window !== "undefined") {
            alert("Failed to close all AI positions. Please try again.")
          }
        } finally {
          setClosingPositions(false)
        }
      } else {
        // User canceled, keep AI enabled
        return
      }
    } else {
      setIsAIEnabled(enabled)
      if (enabled) {
        setIsDeepLearningActive(true)
      } else {
        setIsDeepLearningActive(false)
      }
    }
  }

  // Format time remaining until next insight update
  const formatTimeRemaining = () => {
    if (!nextInsightUpdate) return "Unknown"

    const now = new Date()
    const diff = nextInsightUpdate.getTime() - now.getTime()

    if (diff <= 0) return "Updating..."

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const generateChartAnnotations = () => {
    // Get the current instrument
    const instrument = marketInstruments.find((i) => i.symbol === selectedSymbol)
    if (!instrument) return

    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000

    // Generate AI prediction trend lines
    const trendLines = Array(3)
      .fill(0)
      .map(() => {
        const startX = now - Math.random() * 7 * dayInMs // Random date in last 7 days
        const startY = instrument.bid * (0.95 + Math.random() * 0.1) // Random price near current
        const endX = startX + Math.random() * 5 * dayInMs // Random date 1-5 days later
        const endY = startY * (0.9 + Math.random() * 0.2) // Random price change
        const color = endY > startY ? "#22c55e" : "#ef4444" // Green if up, red if down

        return {
          start: [startX, startY],
          end: [endX, endY],
          color,
        }
      })

    // Generate AI buy signals
    const buyPoints = Array(5)
      .fill(0)
      .map(() => {
        const x = now - Math.random() * 7 * dayInMs
        const y = instrument.bid * (0.9 + Math.random() * 0.2)
        return [x, y] as [number, number]
      })

    // Generate AI sell signals
    const sellPoints = Array(5)
      .fill(0)
      .map(() => {
        const x = now - Math.random() * 7 * dayInMs
        const y = instrument.ask * (0.9 + Math.random() * 0.2)
        return [x, y] as [number, number]
      })

    setChartAnnotations({
      trendLines,
      buyPoints,
      sellPoints,
    })
  }

  // Call this function when the component mounts and when the symbol changes
  useEffect(() => {
    generateChartAnnotations()
  }, [selectedSymbol, marketInstruments])

  // Handle position click to update chart
  const handlePositionClick = (symbol: string) => {
    setSelectedSymbol(symbol)

    // Find the asset class for this symbol
    const instrument = marketInstruments.find((i) => i.symbol === symbol)
    if (instrument) {
      setSelectedAssetClass(instrument.assetClass)
    }

    // Generate new chart annotations
    generateChartAnnotations()
  }

  // Filter instruments based on selected asset class and search
  const getFilteredInstruments = () => {
    let filtered = marketInstruments

    // Filter by asset class if not "all"
    if (selectedAssetClass !== "all") {
      filtered = filtered.filter((i) => i.assetClass === selectedAssetClass)
    }

    // Filter by search term if provided
    if (symbolSearch) {
      filtered = filtered.filter(
        (i) =>
          i.symbol.toLowerCase().includes(symbolSearch.toLowerCase()) ||
          i.name.toLowerCase().includes(symbolSearch.toLowerCase()),
      )
    }

    // Sort by favorites first, then by symbol
    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return a.symbol.localeCompare(b.symbol)
    })
  }

  // Toggle favorite status
  const toggleFavorite = (symbol: string) => {
    setFavoriteInstruments((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((s) => s !== symbol)
      } else {
        return [...prev, symbol]
      }
    })
  }

  // Reset all AI data
  const resetAllData = () => {
    if (
      typeof window !== "undefined" &&
      confirm("Are you sure you want to reset all AI data? This cannot be undone.")
    ) {
      // Clear all AI data from localStorage
      localStorage.removeItem("aiTrades")
      localStorage.removeItem("aiPositions")
      localStorage.removeItem("aiInsights")
      localStorage.removeItem("aiDeepLearningData")
      localStorage.removeItem("aiAgentSettings")
      localStorage.removeItem("favoriteInstruments")
      localStorage.removeItem("hasActiveAITrades")
      localStorage.removeItem("continuousAIEnabled")

      // Reset state
      setAiTrades([])
      setAiPositions([])
      setAiInsights([])
      setDeepLearningData({
        patterns: {},
        insights: {},
        lastUpdated: new Date().toISOString(),
      })
      setFavoriteInstruments([])
      setIsAIEnabled(false)
      setIsDeepLearningActive(false)
      setAiPerformance({
        totalTrades: 0,
        successfulTrades: 0,
        totalProfit: 0,
        winRate: 0,
        averageReturn: 0,
      })

      alert("All AI data has been reset successfully.")
    }
  }

  // Replace the main return statement with a resizable layout

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Trading Agent</h1>
        <p className="text-muted-foreground">Configure and monitor your automated trading assistant</p>
      </div>

      {showPredictionAlert && marketPrediction && (
        <Alert className="mb-4" variant={marketPrediction.direction === "buy" ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Trading Signal</AlertTitle>
          <AlertDescription>
            {marketPrediction.direction === "buy" ? "BUY" : "SELL"} signal detected for {marketPrediction.symbol} with{" "}
            {marketPrediction.confidence}% confidence. Reasoning: {marketPrediction.reasoning}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className={`col-span-1 ${isAIEnabled ? "border-primary" : "border-muted"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Status</CardTitle>
            <Brain className={`h-4 w-4 ${isAIEnabled ? "text-primary" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{isAIEnabled ? "Active" : "Inactive"}</span>
                <span className="text-xs text-muted-foreground">
                  {isAIEnabled ? "AI is trading autonomously" : "AI trading is paused"}
                </span>
              </div>
              <div>
                <Switch checked={isAIEnabled} onCheckedChange={handleToggleAI} disabled={closingPositions} />
              </div>
            </div>
            {closingPositions && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-500">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
                <span>Closing positions...</span>
              </div>
            )}
            {isDeepLearningActive && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Deep Learning</span>
                  <span className="text-primary">{Math.round(learningProgress)}%</span>
                </div>
                <Progress value={learningProgress} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{aiPositions.length}</span>
              <span>/</span>
              <span>{maxPositions}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${maxTradeAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Maximum per trade</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Management</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stop Loss:</span>
                <span className="text-sm font-medium text-rose-500">{stopLossPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Take Profit:</span>
                <span className="text-sm font-medium text-emerald-500">{takeProfitPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Performance</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetAIPerformance} className="h-8">
                Reset Stats
              </Button>
              <Button variant="destructive" size="sm" onClick={resetAllData} className="h-8">
                Reset All
              </Button>
            </div>
          </CardHeader>
          <CardDescription>Trading statistics and metrics</CardDescription>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Win Rate:</span>
              <span
                className={`text-sm font-medium ${aiPerformance.winRate >= 50 ? "text-emerald-500" : "text-rose-500"}`}
              >
                {aiPerformance.winRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Profit:</span>
              <span
                className={`text-sm font-medium ${aiPerformance.totalProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                ${aiPerformance.totalProfit.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resizable layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart section - takes 2/3 of the space on large screens */}
        <Card className="lg:col-span-2 h-[600px] flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>AI Trading Analysis for {selectedSymbol}</CardTitle>
            <CardDescription>Real-time market data with AI predictions and strategies</CardDescription>
          </CardHeader>
          <CardContent className="relative flex-1 min-h-0">
            <TradingViewChart symbol={selectedSymbol} showAIPredictions={true} />
          </CardContent>
        </Card>

        {/* Trading configuration - takes 1/3 of the space on large screens */}
        <Card className="lg:col-span-1 h-[600px] flex flex-col overflow-hidden">
          <CardHeader className="flex-none">
            <CardTitle>AI Trading Configuration</CardTitle>
            <CardDescription>Customize how your AI agent trades on your behalf</CardDescription>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1 min-h-0">
            <div className="space-y-6">
              {/* Trading Parameters Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary">Trading Parameters</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-trade-amount">Maximum Trade Amount ($)</Label>
                    <span className="text-sm font-medium">
                      ${Number.parseFloat(maxTradeAmount.toString()).toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="max-trade-amount"
                      type="number"
                      placeholder="1000"
                      className="pl-8"
                      value={maxTradeAmount}
                      onChange={(e) => setMaxTradeAmount(Number.parseFloat(e.target.value) || 0)}
                      disabled={!isAIEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-positions">Maximum Positions</Label>
                    <span className="text-sm font-medium">{maxPositions}</span>
                  </div>
                  <Slider
                    id="max-positions"
                    min={1}
                    max={10}
                    step={1}
                    value={[maxPositions]}
                    onValueChange={(value) => setMaxPositions(value[0])}
                    disabled={!isAIEnabled}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                      <span className="text-sm font-medium text-rose-500">{stopLossPercentage}%</span>
                    </div>
                    <Slider
                      id="stop-loss"
                      min={1}
                      max={20}
                      step={0.5}
                      value={[stopLossPercentage]}
                      onValueChange={(value) => setStopLossPercentage(value[0])}
                      disabled={!isAIEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="take-profit">Take Profit (%)</Label>
                      <span className="text-sm font-medium text-emerald-500">{takeProfitPercentage}%</span>
                    </div>
                    <Slider
                      id="take-profit"
                      min={1}
                      max={50}
                      step={0.5}
                      value={[takeProfitPercentage]}
                      onValueChange={(value) => setTakeProfitPercentage(value[0])}
                      disabled={!isAIEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="risk-level">Risk Level</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 w-6 rounded-sm ${level <= riskLevel ? "bg-primary" : "bg-muted"}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <Slider
                    id="risk-level"
                    min={1}
                    max={5}
                    step={1}
                    value={[riskLevel]}
                    onValueChange={(value) => setRiskLevel(value[0])}
                    disabled={!isAIEnabled}
                  />
                </div>
                {/* Add this to the AI Trading Configuration section, right after the Risk Level slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="continuous-operation">Continuous Operation</Label>
                    <Switch
                      id="continuous-operation"
                      checked={continuousOperation}
                      onCheckedChange={setContinuousOperation}
                      disabled={!isAIEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, AI will continue trading even when you're logged out or close the browser.
                    {continuousOperation && (
                      <span className="text-amber-500 block mt-1">
                        Note: AI will keep managing positions until you manually disable it.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Symbol Selection Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary">Market Selection</h3>

                <div>
                  <Label htmlFor="asset-class" className="mb-2 block">
                    Asset Class
                  </Label>
                  <Select
                    value={selectedAssetClass}
                    onValueChange={setSelectedAssetClass}
                    disabled={!isAIEnabled}
                    defaultValue="all"
                  >
                    <SelectTrigger id="asset-class">
                      <SelectValue placeholder="Select asset class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assets</SelectItem>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="indices">Indices</SelectItem>
                      <SelectItem value="commodities">Commodities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="symbol-search">Symbol</Label>
                    <div className="relative w-full max-w-[200px]">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="symbol-search"
                        placeholder="Search..."
                        className="pl-8"
                        value={symbolSearch}
                        onChange={(e) => setSymbolSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Current Symbol Display */}
                  {selectedSymbol && (
                    <div className="mb-2 p-2 bg-muted rounded-md flex items-center justify-between">
                      <div>
                        <span className="font-medium">{selectedSymbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {marketInstruments.find((i) => i.symbol === selectedSymbol)?.name || ""}
                        </span>
                      </div>
                      <Badge
                        variant={
                          marketInstruments.find((i) => i.symbol === selectedSymbol)?.isOpen ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {marketInstruments.find((i) => i.symbol === selectedSymbol)?.isOpen
                          ? "Market Open"
                          : "Market Closed"}
                      </Badge>
                    </div>
                  )}

                  <div className="rounded-md border max-h-[200px] overflow-y-auto">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30px] p-2"></TableHead>
                          <TableHead className="p-2">Symbol</TableHead>
                          <TableHead className="p-2">Bid</TableHead>
                          <TableHead className="p-2">Ask</TableHead>
                          <TableHead className="p-2">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredInstruments().map((instrument) => (
                          <TableRow
                            key={instrument.symbol}
                            className={`cursor-pointer ${selectedSymbol === instrument.symbol ? "bg-primary/10" : ""}`}
                            onClick={() => setSelectedSymbol(instrument.symbol)}
                          >
                            <TableCell className="p-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(instrument.symbol)
                                }}
                              >
                                {instrument.isFavorite ? (
                                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                ) : (
                                  <StarOff className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium p-2">{instrument.symbol}</TableCell>
                            <TableCell className="p-2">${instrument.bid.toFixed(2)}</TableCell>
                            <TableCell className="p-2">${instrument.ask.toFixed(2)}</TableCell>
                            <TableCell className="p-2">
                              <Badge
                                variant={instrument.isOpen ? "default" : "secondary"}
                                className="text-[10px] px-1 py-0"
                              >
                                {instrument.isOpen ? "Open" : "Closed"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-none justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setMaxTradeAmount(1000)
                setStopLossPercentage(5)
                setTakeProfitPercentage(10)
                setMaxPositions(5)
                setRiskLevel(3)
              }}
            >
              Reset
            </Button>
            <Button
              disabled={!isAIEnabled}
              onClick={() => {
                if (typeof window !== "undefined") {
                  alert("Settings saved successfully!")
                }
                // Simulate the AI opening a position based on new settings
                if (Math.random() > 0.5 && aiPositions.length < maxPositions) {
                  openNewAIPosition()
                }
              }}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Positions section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI-Managed Positions</CardTitle>
              <CardDescription>Current positions opened by the AI trading agent</CardDescription>
            </div>
            {aiPositions.length > 0 && (
              <div className="text-xs text-muted-foreground flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                Real-time updates active
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : aiPositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No AI-managed positions currently open</p>
              <p className="text-sm text-muted-foreground">
                {isAIEnabled
                  ? "The AI is analyzing the market for opportunities"
                  : "Enable the AI agent to start automated trading"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Asset Class</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>P/L</TableHead>
                    <TableHead>P/L %</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiPositions.map((position) => (
                    <TableRow
                      key={position.id}
                      className="cursor-pointer"
                      onClick={() => handlePositionClick(position.symbol)}
                    >
                      <TableCell className="font-medium">{position.symbol}</TableCell>
                      <TableCell className="capitalize">{position.assetClass}</TableCell>
                      <TableCell className={position.side === "buy" ? "buy-text" : "sell-text"}>
                        {position.side?.charAt(0).toUpperCase() + position.side?.slice(1) || "Buy"}
                      </TableCell>
                      <TableCell>{position.qty}</TableCell>
                      <TableCell>${position.avg_entry_price.toFixed(2)}</TableCell>
                      <TableCell>${position.current_price.toFixed(2)}</TableCell>
                      <TableCell className={position.unrealized_pl >= 0 ? "profit-text" : "loss-text"}>
                        ${position.unrealized_pl.toFixed(2)}
                      </TableCell>
                      <TableCell className={position.unrealized_plpc >= 0 ? "profit-text" : "loss-text"}>
                        {position.unrealized_plpc.toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        {position.lastUpdated ? new Date(position.lastUpdated).toLocaleTimeString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            closeAIPosition(position.id)
                          }}
                          title="Close position"
                          disabled={!isAIEnabled}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close position</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trade History and Insights tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>AI Trade History</CardTitle>
              <CardDescription>Past trades executed by the AI trading agent</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : aiTrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No AI trade history available</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Asset Class</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>P/L</TableHead>
                        <TableHead>Reasoning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiTrades.map((trade) => (
                        <TableRow
                          key={trade.id}
                          className={`${trade.isResetMarker ? "bg-muted/50" : ""} ${!trade.isResetMarker ? "cursor-pointer" : ""}`}
                          onClick={() => !trade.isResetMarker && handlePositionClick(trade.symbol)}
                        >
                          {trade.isResetMarker ? (
                            <TableCell colSpan={9} className="text-center font-medium">
                              --- Performance metrics reset on {new Date(trade.timestamp).toLocaleString()} ---
                            </TableCell>
                          ) : (
                            <>
                              <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                              <TableCell className="font-medium">{trade.symbol}</TableCell>
                              <TableCell className="capitalize">{trade.assetClass}</TableCell>
                              <TableCell className={trade.side === "buy" ? "buy-text" : "sell-text"}>
                                {trade.side.charAt(0).toUpperCase() + trade.side.slice(1)}
                              </TableCell>
                              <TableCell>{trade.quantity}</TableCell>
                              <TableCell>${trade.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    trade.status === "open"
                                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                  }
                                >
                                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell
                                className={
                                  trade.status === "open" ? "" : (trade.profit || 0) >= 0 ? "profit-text" : "loss-text"
                                }
                              >
                                {trade.status === "open"
                                  ? "-"
                                  : `${(trade.profit || 0) >= 0 ? "+" : ""}$${trade.profit?.toFixed(2)} (${(trade.profit || 0) >= 0 ? "+" : ""}${trade.profitPercentage?.toFixed(2)}%)`}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={trade.reasoning}>
                                {trade.reasoning}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>AI Trading Insights</CardTitle>
                <CardDescription>Market analysis and trading recommendations</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {lastInsightUpdate
                    ? `Last updated: ${new Date(lastInsightUpdate).toLocaleTimeString()}`
                    : "Not updated yet"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 gap-1"
                  onClick={updateAIInsights}
                  disabled={!isAIEnabled}
                >
                  <RefreshCw className="h-3 w-3" />
                  Update Now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiInsights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No AI insights available yet</p>
                    <p className="text-sm text-muted-foreground">
                      Enable the AI agent to start generating market insights
                    </p>
                  </div>
                ) : (
                  <>
                    {aiInsights
                      .filter(
                        (insight) => insight.symbol === selectedSymbol && insight.assetClass === selectedAssetClass,
                      )
                      .slice(0, 1)
                      .map((insight) => (
                        <div key={insight.id} className="rounded-md border p-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Brain className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  {insight.symbol} Analysis
                                  <Badge
                                    variant="outline"
                                    className={`ml-2 ${
                                      insight.sentiment === "bullish"
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        : insight.sentiment === "bearish"
                                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    }`}
                                  >
                                    {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
                                  </Badge>
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(insight.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">{insight.content}</p>

                              <div className="mt-4 grid grid-cols-3 gap-4">
                                {insight.metrics.map((metric, idx) => (
                                  <div key={idx} className="rounded-md bg-muted p-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium">{metric.name}</span>
                                      <span
                                        className={`text-xs ${
                                          metric.trend === "up"
                                            ? "text-emerald-500"
                                            : metric.trend === "down"
                                              ? "text-rose-500"
                                              : "text-muted-foreground"
                                        }`}
                                      >
                                        {metric.value}
                                        {metric.trend === "up" && <ArrowUpRight className="ml-1 inline h-3 w-3" />}
                                        {metric.trend === "down" && <ArrowDownRight className="ml-1 inline h-3 w-3" />}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

