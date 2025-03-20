// AI Trading Bot Service

import { toast } from "@/hooks/use-toast"

// Types
export interface TradePosition {
  id: string
  symbol: string
  type: "buy" | "sell"
  entryPrice: number
  currentPrice: number
  quantity: number
  entryTime: Date
  pl: number
  plPercentage: number
  status: "open" | "closed"
}

export interface TradingConfig {
  isEnabled: boolean
  riskLevel: number
  maxPositions: number
  maxLoss: number
  continuousOperation: boolean
  selectedTimeframes: string[]
  maxDrawdown: number
  profitTarget: number
  useHistoricalData: boolean
  scalping: boolean
}

export interface MarketData {
  symbol: string
  price: number
  volume: number
  high: number
  low: number
  open: number
  close: number
  timestamp: Date
  timeframe: string
}

// Singleton instance
let instance: AITradingBot | null = null

export class AITradingBot {
  private isRunning = false
  private config: TradingConfig | null = null
  private positions: TradePosition[] = []
  private marketData: Record<string, MarketData[]> = {}
  private analysisResults: Record<string, any> = {}
  private intervalIds: NodeJS.Timeout[] = []
  private totalProfit = 0
  private totalTrades = 0
  private winningTrades = 0

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): AITradingBot {
    if (!instance) {
      instance = new AITradingBot()
    }
    return instance
  }

  public start(config: TradingConfig): void {
    if (this.isRunning) {
      this.stop()
    }

    this.config = config
    this.isRunning = true

    // Start data collection for each timeframe
    if (config.selectedTimeframes.includes("1")) {
      this.startDataCollection("1")
    }
    if (config.selectedTimeframes.includes("5")) {
      this.startDataCollection("5")
    }
    if (config.selectedTimeframes.includes("15")) {
      this.startDataCollection("15")
    }

    // Start trading algorithm
    this.startTradingAlgorithm()

    toast({
      title: "AI Trading Bot Started",
      description: `Trading bot started with risk level ${config.riskLevel}`,
    })
  }

  public stop(): void {
    this.isRunning = false

    // Clear all intervals
    this.intervalIds.forEach((id) => clearInterval(id))
    this.intervalIds = []

    toast({
      title: "AI Trading Bot Stopped",
      description: "Trading bot has been stopped",
    })
  }

  public getPositions(): TradePosition[] {
    return [...this.positions]
  }

  public getAnalysis(): Record<string, any> {
    return { ...this.analysisResults }
  }

  public getPerformance(): { totalProfit: number; totalTrades: number; winRate: number } {
    const winRate = this.totalTrades > 0 ? (this.winningTrades / this.totalTrades) * 100 : 0
    return {
      totalProfit: this.totalProfit,
      totalTrades: this.totalTrades,
      winRate,
    }
  }

  public closePosition(positionId: string): boolean {
    const positionIndex = this.positions.findIndex((p) => p.id === positionId)
    if (positionIndex === -1) return false

    const position = this.positions[positionIndex]
    position.status = "closed"

    // Update performance metrics
    this.totalProfit += position.pl
    this.totalTrades += 1
    if (position.pl > 0) {
      this.winningTrades += 1
    }

    // Update the position in the array
    this.positions[positionIndex] = position

    toast({
      title: "Position Closed",
      description: `Closed ${position.type} position for ${position.symbol} with P/L: ${position.pl.toFixed(2)}`,
    })

    return true
  }

  public closeAllPositions(): void {
    this.positions.forEach((position) => {
      if (position.status === "open") {
        this.closePosition(position.id)
      }
    })
  }

  public resetPerformance(): void {
    this.totalProfit = 0
    this.totalTrades = 0
    this.winningTrades = 0

    toast({
      title: "Performance Reset",
      description: "Trading performance metrics have been reset",
    })
  }

  public resetAll(): void {
    this.stop()
    this.positions = []
    this.marketData = {}
    this.analysisResults = {}
    this.totalProfit = 0
    this.totalTrades = 0
    this.winningTrades = 0

    toast({
      title: "Complete Reset",
      description: "All trading data and performance metrics have been reset",
    })
  }

  private startDataCollection(timeframe: string): void {
    const interval = Number.parseInt(timeframe) * 60 * 1000 || 60000 // Default to 1 minute

    const intervalId = setInterval(() => {
      if (!this.isRunning) return

      // Simulate collecting market data for different symbols
      const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

      symbols.forEach((symbol) => {
        if (!this.marketData[symbol]) {
          this.marketData[symbol] = []
        }

        // Generate simulated market data
        const lastPrice = this.getLastPrice(symbol) || 100 + Math.random() * 100
        const priceChange = (Math.random() - 0.5) * 2 * (lastPrice * 0.01) // +/- 1%
        const newPrice = lastPrice + priceChange

        const data: MarketData = {
          symbol,
          price: newPrice,
          volume: Math.random() * 10000,
          high: newPrice * (1 + Math.random() * 0.005),
          low: newPrice * (1 - Math.random() * 0.005),
          open: lastPrice,
          close: newPrice,
          timestamp: new Date(),
          timeframe,
        }

        this.marketData[symbol].push(data)

        // Keep only the last 100 data points for each symbol and timeframe
        const timeframeData = this.marketData[symbol].filter((d) => d.timeframe === timeframe)
        if (timeframeData.length > 100) {
          const oldestIndex = this.marketData[symbol].findIndex((d) => d.timeframe === timeframe)
          if (oldestIndex !== -1) {
            this.marketData[symbol].splice(oldestIndex, 1)
          }
        }
      })

      // Analyze the new data
      this.analyzeMarketData(timeframe)
    }, interval)

    this.intervalIds.push(intervalId)
  }

  private startTradingAlgorithm(): void {
    // Trading algorithm runs every 100ms for high-frequency trading when in scalping mode
    const interval = this.config?.scalping ? 100 : 1000

    const intervalId = setInterval(() => {
      if (!this.isRunning || !this.config?.isEnabled) return

      // Check if we can open new positions
      if (this.positions.filter((p) => p.status === "open").length >= (this.config?.maxPositions || 5)) {
        return
      }

      // Get the latest analysis results
      const analysis = this.getAnalysis()

      // Make trading decisions based on analysis
      Object.keys(analysis).forEach((symbol) => {
        const symbolAnalysis = analysis[symbol]

        // Skip if no analysis available
        if (!symbolAnalysis) return

        // Check if market is closed
        if (symbolAnalysis.marketClosed) {
          return
        }

        // Determine if we should enter a position
        const shouldEnter = this.shouldEnterPosition(symbol, symbolAnalysis)

        if (shouldEnter.enter) {
          this.openPosition(symbol, shouldEnter.type)
        }

        // Check if we should exit any existing positions
        this.positions.forEach((position) => {
          if (position.status === "open" && position.symbol === symbol) {
            const shouldExit = this.shouldExitPosition(position, symbolAnalysis)

            if (shouldExit) {
              this.closePosition(position.id)
            }
          }
        })
      })

      // Update existing positions
      this.updatePositions()
    }, interval)

    this.intervalIds.push(intervalId)
  }

  private analyzeMarketData(timeframe: string): void {
    Object.keys(this.marketData).forEach((symbol) => {
      const symbolData = this.marketData[symbol].filter((d) => d.timeframe === timeframe)

      if (symbolData.length < 10) return // Need enough data points

      // Initialize analysis object for this symbol if it doesn't exist
      if (!this.analysisResults[symbol]) {
        this.analysisResults[symbol] = {}
      }

      // Perform technical analysis
      const rsi = this.calculateRSI(symbolData)
      const macd = this.calculateMACD(symbolData)
      const movingAverages = this.calculateMovingAverages(symbolData)
      const support = this.calculateSupport(symbolData)
      const resistance = this.calculateResistance(symbolData)

      // Store analysis results
      this.analysisResults[symbol][`rsi_${timeframe}`] = rsi
      this.analysisResults[symbol][`macd_${timeframe}`] = macd
      this.analysisResults[symbol][`ma_${timeframe}`] = movingAverages
      this.analysisResults[symbol][`support_${timeframe}`] = support
      this.analysisResults[symbol][`resistance_${timeframe}`] = resistance

      // Determine overall sentiment for this timeframe
      let sentiment = "neutral"

      if (rsi > 70) sentiment = "overbought"
      else if (rsi < 30) sentiment = "oversold"
      else if (rsi > 50 && macd.histogram > 0) sentiment = "bullish"
      else if (rsi < 50 && macd.histogram < 0) sentiment = "bearish"

      this.analysisResults[symbol][`sentiment_${timeframe}`] = sentiment

      // Check if market is closed (simulated)
      const now = new Date()
      const hour = now.getHours()
      const day = now.getDay()

      // Simulate market closed on weekends and outside of trading hours
      const marketClosed = day === 0 || day === 6 || hour < 9 || hour >= 16

      this.analysisResults[symbol].marketClosed = marketClosed

      // Store the latest price
      this.analysisResults[symbol].currentPrice = symbolData[symbolData.length - 1].price
    })
  }

  private shouldEnterPosition(symbol: string, analysis: any): { enter: boolean; type: "buy" | "sell" } {
    if (!this.config) return { enter: false, type: "buy" }

    // Default result
    const result = { enter: false, type: "buy" as "buy" | "sell" }

    // Get sentiments from different timeframes
    const sentiments: string[] = []

    this.config.selectedTimeframes.forEach((timeframe) => {
      const sentiment = analysis[`sentiment_${timeframe}`]
      if (sentiment) {
        sentiments.push(sentiment)
      }
    })

    // Count bullish and bearish signals
    const bullishCount = sentiments.filter((s) => s === "bullish" || s === "oversold").length
    const bearishCount = sentiments.filter((s) => s === "bearish" || s === "overbought").length

    // Decision logic based on risk level
    if (this.config.riskLevel === 5 && this.config.scalping) {
      // Aggressive scalping strategy - enter on any slight edge
      if (bullishCount > bearishCount) {
        result.enter = true
        result.type = "buy"
      } else if (bearishCount > bullishCount) {
        result.enter = true
        result.type = "sell"
      }
    } else if (this.config.riskLevel >= 4) {
      // Aggressive strategy - enter when majority of timeframes agree
      if (bullishCount > sentiments.length / 2) {
        result.enter = true
        result.type = "buy"
      } else if (bearishCount > sentiments.length / 2) {
        result.enter = true
        result.type = "sell"
      }
    } else if (this.config.riskLevel >= 2) {
      // Moderate strategy - enter when strong consensus
      if (bullishCount >= sentiments.length * 0.7) {
        result.enter = true
        result.type = "buy"
      } else if (bearishCount >= sentiments.length * 0.7) {
        result.enter = true
        result.type = "sell"
      }
    } else {
      // Conservative strategy - enter only on very strong consensus
      if (bullishCount >= sentiments.length * 0.9) {
        result.enter = true
        result.type = "buy"
      } else if (bearishCount >= sentiments.length * 0.9) {
        result.enter = true
        result.type = "sell"
      }
    }

    // Random factor to simulate real-world conditions (less likely at lower risk levels)
    const randomFactor = Math.random() * 10
    if (randomFactor > 10 - this.config.riskLevel) {
      result.enter = result.enter && true // Keep true if already true
    } else {
      result.enter = false // Otherwise don't enter
    }

    return result
  }

  private shouldExitPosition(position: TradePosition, analysis: any): boolean {
    if (!this.config) return false

    // Exit if profit target reached
    if (position.plPercentage >= this.config.profitTarget) {
      return true
    }

    // Exit if max loss reached
    if (position.plPercentage <= -this.config.maxLoss) {
      return true
    }

    // For scalping mode, exit quickly on any profit
    if (this.config.scalping && this.config.riskLevel === 5 && position.pl > 0) {
      // Exit even on small profits for scalping
      return true
    }

    // Check if sentiment has changed against position
    let sentimentAgainst = 0
    let totalSentiments = 0

    this.config.selectedTimeframes.forEach((timeframe) => {
      const sentiment = analysis[`sentiment_${timeframe}`]
      if (sentiment) {
        totalSentiments++

        if (position.type === "buy" && (sentiment === "bearish" || sentiment === "overbought")) {
          sentimentAgainst++
        } else if (position.type === "sell" && (sentiment === "bullish" || sentiment === "oversold")) {
          sentimentAgainst++
        }
      }
    })

    // Exit if majority of timeframes show sentiment against position
    if (sentimentAgainst > totalSentiments / 2) {
      return true
    }

    return false
  }

  private openPosition(symbol: string, type: "buy" | "sell"): void {
    const price = this.getLastPrice(symbol)
    if (!price) return

    // Generate a random quantity based on risk level
    const quantity = Math.floor(Math.random() * 10) + 1

    const position: TradePosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      symbol,
      type,
      entryPrice: price,
      currentPrice: price,
      quantity,
      entryTime: new Date(),
      pl: 0,
      plPercentage: 0,
      status: "open",
    }

    this.positions.push(position)

    toast({
      title: "New Position",
      description: `Opened ${type} position for ${symbol} at ${price.toFixed(2)}`,
    })
  }

  private updatePositions(): void {
    this.positions.forEach((position, index) => {
      if (position.status === "closed") return

      const currentPrice = this.getLastPrice(position.symbol)
      if (!currentPrice) return

      position.currentPrice = currentPrice

      // Calculate P/L
      const pl = (currentPrice - position.entryPrice) * position.quantity * (position.type === "buy" ? 1 : -1)
      const plPercentage =
        ((currentPrice - position.entryPrice) / position.entryPrice) * 100 * (position.type === "buy" ? 1 : -1)

      position.pl = pl
      position.plPercentage = plPercentage

      this.positions[index] = position
    })
  }

  private getLastPrice(symbol: string): number | null {
    if (!this.marketData[symbol] || this.marketData[symbol].length === 0) {
      return null
    }

    return this.marketData[symbol][this.marketData[symbol].length - 1].price
  }

  // Technical analysis methods
  private calculateRSI(data: MarketData[]): number {
    if (data.length < 14) return 50

    // Simple RSI calculation
    const prices = data.map((d) => d.close)
    const changes = []

    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1])
    }

    const gains = changes.filter((c) => c > 0)
    const losses = changes.filter((c) => c < 0).map((c) => Math.abs(c))

    const avgGain = gains.reduce((sum, val) => sum + val, 0) / 14
    const avgLoss = losses.reduce((sum, val) => sum + val, 0) / 14

    if (avgLoss === 0) return 100

    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  private calculateMACD(data: MarketData[]): { line: number; signal: number; histogram: number } {
    if (data.length < 26) {
      return { line: 0, signal: 0, histogram: 0 }
    }

    const prices = data.map((d) => d.close)

    // Simple EMA calculation
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)

    const macdLine = ema12 - ema26
    const signalLine = this.calculateEMA([...Array(prices.length - 26).fill(0), macdLine], 9)
    const histogram = macdLine - signalLine

    return { line: macdLine, signal: signalLine, histogram }
  }

  private calculateEMA(data: number[], period: number): number {
    const k = 2 / (period + 1)
    let ema = data[0]

    for (let i = 1; i < data.length; i++) {
      ema = data[i] * k + ema * (1 - k)
    }

    return ema
  }

  private calculateMovingAverages(data: MarketData[]): { ma20: number; ma50: number; ma200: number } {
    const prices = data.map((d) => d.close)

    const ma20 = prices.slice(-20).reduce((sum, price) => sum + price, 0) / Math.min(20, prices.length)
    const ma50 = prices.slice(-50).reduce((sum, price) => sum + price, 0) / Math.min(50, prices.length)
    const ma200 = prices.slice(-200).reduce((sum, price) => sum + price, 0) / Math.min(200, prices.length)

    return { ma20, ma50, ma200 }
  }

  private calculateSupport(data: MarketData[]): number {
    if (data.length < 10) return data[data.length - 1].low

    // Simple support calculation - lowest low in recent periods
    return Math.min(...data.slice(-10).map((d) => d.low))
  }

  private calculateResistance(data: MarketData[]): number {
    if (data.length < 10) return data[data.length - 1].high

    // Simple resistance calculation - highest high in recent periods
    return Math.max(...data.slice(-10).map((d) => d.high))
  }
}

// Export a function to get the instance
export function getAITradingBot(): AITradingBot {
  return AITradingBot.getInstance()
}

