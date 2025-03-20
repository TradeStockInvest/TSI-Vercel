import { RISK_LEVELS } from "./ai-trading-service"
import { isSymbolMarketOpen } from "@/utils/market-hours"
import { getUserAccount, updateUserAccount, addUserTrade, updatePosition, closePosition } from "./user-service"
import { marketDataService } from "./market-data-service"

// Define types for better type safety
export interface TradingBotSettings {
  enabled: boolean
  riskLevel: number
  maxPositions: number
  maxLoss: number
  timeframes: string[]
  scalpingMode: boolean
  useHistoricalData: boolean
  continuousOperation: boolean
  favoriteSymbols: string[]
  stopLossPercent?: number // User-defined stop loss
  takeProfitPercent?: number // User-defined take profit
  stopLossEnabled: boolean // Flag to enable/disable stop loss
  takeProfitEnabled: boolean // Flag to enable/disable take profit
}

export interface TradingBotPosition {
  id: string
  symbol: string
  quantity: number
  entryPrice: number
  currentPrice: number
  profitLoss: number
  profitLossPercent: number
  openDate: Date
  aiManaged: boolean
  stopLossPrice: number
  takeProfitPrice: number
}

export interface TradingBotTrade {
  id: string
  symbol: string
  action: "BUY" | "SELL"
  quantity: number
  price: number
  total: number
  timestamp: Date
  aiInitiated: boolean
  reason?: string
}

export interface MarketAnalysis {
  symbol: string
  recommendation: "BUY" | "SELL" | "HOLD"
  confidence: number
  currentPrice: number
  signals: string[]
  timestamp: Date
}

// AI Trading Bot implementation
export class TradingBot {
  private userId: string
  private settings: TradingBotSettings
  private positions: TradingBotPosition[] = []
  private tradeHistory: TradingBotTrade[] = []
  private isRunning = false
  private analysisInterval: NodeJS.Timeout | null = null
  private positionMonitorInterval: NodeJS.Timeout | null = null
  private marketDataInterval: NodeJS.Timeout | null = null
  private lastAnalysis: Record<string, MarketAnalysis> = {}
  private accountBalance = 0
  private buyingPower = 0
  private totalProfitLoss = 0
  private marketDataSubscriptions: Map<string, (data: any) => void> = new Map()

  // Callbacks for UI updates
  private onPositionUpdate: (positions: TradingBotPosition[]) => void
  private onTradeExecuted: (trade: TradingBotTrade) => void
  private onAnalysisUpdate: (analysis: Record<string, MarketAnalysis>) => void
  private onStatusUpdate: (status: { running: boolean; message: string }) => void
  private onError: (error: string) => void

  constructor(
    userId: string,
    settings: TradingBotSettings,
    callbacks: {
      onPositionUpdate?: (positions: TradingBotPosition[]) => void
      onTradeExecuted?: (trade: TradingBotTrade) => void
      onAnalysisUpdate?: (analysis: Record<string, MarketAnalysis>) => void
      onStatusUpdate?: (status: { running: boolean; message: string }) => void
      onError?: (error: string) => void
    } = {},
  ) {
    this.userId = userId
    this.settings = settings

    // Set callbacks with defaults
    this.onPositionUpdate = callbacks.onPositionUpdate || (() => {})
    this.onTradeExecuted = callbacks.onTradeExecuted || (() => {})
    this.onAnalysisUpdate = callbacks.onAnalysisUpdate || (() => {})
    this.onStatusUpdate = callbacks.onStatusUpdate || (() => {})
    this.onError = callbacks.onError || console.error

    // Initialize market data service
    marketDataService.initialize()

    // Initialize
    this.initialize()
  }

  // Initialize the bot
  private async initialize(): Promise<void> {
    try {
      // Load user account data
      const account = await getUserAccount(this.userId)
      if (!account) {
        throw new Error("User account not found")
      }

      // Set account data
      this.accountBalance = account.accountBalance || 0
      this.buyingPower = account.buyingPower || 0
      this.totalProfitLoss = account.totalProfitLoss || 0

      // Load positions
      this.positions = account.positions || []

      // Load trade history
      this.tradeHistory = account.tradeHistory || []

      // Subscribe to market data for positions
      this.subscribeToMarketData()

      // Start the bot if enabled
      if (this.settings.enabled) {
        this.start()
      }

      this.onStatusUpdate({
        running: this.isRunning,
        message: "Trading bot initialized successfully",
      })
    } catch (error) {
      this.onError(`Failed to initialize trading bot: ${error.message}`)
    }
  }

  // Subscribe to market data for positions
  private subscribeToMarketData(): void {
    // Clear existing subscriptions
    for (const [symbol, callback] of this.marketDataSubscriptions.entries()) {
      marketDataService.unsubscribe(symbol, callback)
    }
    this.marketDataSubscriptions.clear()

    // Subscribe to market data for all positions
    for (const position of this.positions) {
      this.subscribeToSymbol(position.symbol)
    }

    // Subscribe to favorite symbols
    for (const symbol of this.settings.favoriteSymbols) {
      this.subscribeToSymbol(symbol)
    }

    // Subscribe to default symbols if no favorites
    if (this.settings.favoriteSymbols.length === 0) {
      const defaultSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA"]
      for (const symbol of defaultSymbols) {
        this.subscribeToSymbol(symbol)
      }
    }
  }

  // Subscribe to a specific symbol
  private subscribeToSymbol(symbol: string): void {
    if (this.marketDataSubscriptions.has(symbol)) {
      return
    }

    const callback = (data: any) => {
      this.handleMarketDataUpdate(symbol, data.price)
    }

    marketDataService.subscribe(symbol, callback)
    this.marketDataSubscriptions.set(symbol, callback)
  }

  // Handle market data update
  private handleMarketDataUpdate(symbol: string, price: number): void {
    // Update positions with this symbol
    let updated = false
    this.positions = this.positions.map((position) => {
      if (position.symbol === symbol) {
        updated = true
        const newPosition = { ...position, currentPrice: price }

        // Calculate profit/loss
        newPosition.profitLoss = position.quantity * (price - position.entryPrice)
        newPosition.profitLossPercent = (price / position.entryPrice - 1) * 100

        return newPosition
      }
      return position
    })

    // If positions were updated, notify listeners
    if (updated) {
      this.onPositionUpdate(this.positions)
    }
  }

  // Start the trading bot
  public start(): void {
    if (this.isRunning) return

    try {
      this.isRunning = true

      // Start market data updates (every 5 seconds)
      this.marketDataInterval = setInterval(() => {
        this.updateMarketData()
      }, 5000)

      // Start analysis (every 30 seconds)
      this.analysisInterval = setInterval(() => {
        this.analyzeMarket()
      }, 30000)

      // Start position monitoring (every 10 seconds)
      this.positionMonitorInterval = setInterval(() => {
        this.monitorPositions()
      }, 10000)

      // Run initial analysis
      this.analyzeMarket()

      this.onStatusUpdate({
        running: true,
        message: "Trading bot started",
      })

      console.log("Trading Bot started with settings:", this.settings)
    } catch (error) {
      this.isRunning = false
      this.onError(`Failed to start trading bot: ${error.message}`)
    }
  }

  // Stop the trading bot
  public stop(): void {
    if (!this.isRunning) return

    try {
      this.isRunning = false

      // Clear all intervals
      if (this.marketDataInterval) {
        clearInterval(this.marketDataInterval)
        this.marketDataInterval = null
      }

      if (this.analysisInterval) {
        clearInterval(this.analysisInterval)
        this.analysisInterval = null
      }

      if (this.positionMonitorInterval) {
        clearInterval(this.positionMonitorInterval)
        this.positionMonitorInterval = null
      }

      this.onStatusUpdate({
        running: false,
        message: "Trading bot stopped",
      })

      console.log("Trading Bot stopped")
    } catch (error) {
      this.onError(`Error stopping trading bot: ${error.message}`)
    }
  }

  // Update bot settings
  public updateSettings(settings: Partial<TradingBotSettings>): void {
    const wasRunning = this.isRunning

    // Stop the bot if it's running
    if (wasRunning) {
      this.stop()
    }

    // Update settings
    this.settings = { ...this.settings, ...settings }

    // Update market data subscriptions if favorite symbols changed
    if (settings.favoriteSymbols) {
      this.subscribeToMarketData()
    }

    // Restart if it was running and should still be enabled
    if (wasRunning && this.settings.enabled) {
      this.start()
    } else if (this.settings.enabled && !wasRunning) {
      // Start if it wasn't running but should be enabled
      this.start()
    }

    console.log("Trading Bot settings updated:", this.settings)
  }

  // Update market data
  private async updateMarketData(): Promise<void> {
    if (!this.isRunning) return

    try {
      // Get symbols to update
      const symbols = this.getSymbolsToMonitor()

      // Update prices for all symbols
      for (const symbol of symbols) {
        // Skip if we already have a subscription for this symbol
        if (this.marketDataSubscriptions.has(symbol)) {
          continue
        }

        const currentPrice = await marketDataService.getCurrentPrice(symbol)

        // Update positions with this symbol
        this.positions = this.positions.map((position) => {
          if (position.symbol === symbol) {
            const newPosition = { ...position, currentPrice }

            // Calculate profit/loss
            newPosition.profitLoss = position.quantity * (currentPrice - position.entryPrice)
            newPosition.profitLossPercent = (currentPrice / position.entryPrice - 1) * 100

            return newPosition
          }
          return position
        })
      }

      // Update UI
      this.onPositionUpdate(this.positions)
    } catch (error) {
      this.onError(`Error updating market data: ${error.message}`)
    }
  }

  // Analyze the market
  private async analyzeMarket(): Promise<void> {
    if (!this.isRunning) return

    try {
      // Get symbols to analyze
      const symbols = this.getSymbolsToMonitor()

      // Check if we've reached max positions
      if (this.positions.length >= this.settings.maxPositions) {
        console.log(`Max positions (${this.settings.maxPositions}) reached, skipping analysis`)
        return
      }

      // Analyze each symbol
      for (const symbol of symbols) {
        // Skip if we already have a position for this symbol
        if (this.positions.some((p) => p.symbol === symbol)) {
          continue
        }

        // Check if market is open
        if (!isSymbolMarketOpen(symbol)) {
          console.log(`Market closed for ${symbol}, skipping analysis`)
          continue
        }

        // Analyze the symbol
        const analysis = await this.analyzeSymbol(symbol)

        // Store the analysis
        this.lastAnalysis[symbol] = analysis

        // Check if we should take a position
        if (analysis.recommendation === "BUY" && analysis.confidence >= 0.65) {
          // Calculate position size
          const positionSize = this.calculatePositionSize(symbol, analysis.currentPrice)

          // Check if we have enough buying power
          if (positionSize * analysis.currentPrice > this.buyingPower) {
            console.log(`Not enough buying power for ${symbol}`)
            continue
          }

          // Execute the trade
          await this.executeTrade({
            symbol,
            action: "BUY",
            quantity: positionSize,
            price: analysis.currentPrice,
            reason: "AI Analysis",
          })
        }
      }

      // Update UI with latest analysis
      this.onAnalysisUpdate(this.lastAnalysis)
    } catch (error) {
      this.onError(`Error analyzing market: ${error.message}`)
    }
  }

  // Monitor positions for stop loss, take profit, or scalping opportunities
  private async monitorPositions(): Promise<void> {
    if (!this.isRunning || this.positions.length === 0) return

    try {
      // Check each position
      for (let i = 0; i < this.positions.length; i++) {
        const position = this.positions[i]

        // Skip if not AI managed
        if (!position.aiManaged) continue

        // Get current price
        const currentPrice = await marketDataService.getCurrentPrice(position.symbol)

        // Update position
        position.currentPrice = currentPrice
        position.profitLoss = position.quantity * (currentPrice - position.entryPrice)
        position.profitLossPercent = (currentPrice / position.entryPrice - 1) * 100

        // Check if we should close the position
        let shouldClose = false
        let closeReason = ""

        // Check stop loss if enabled
        if (this.settings.stopLossEnabled) {
          // Calculate stop loss price - use user-defined stop loss if available
          const stopLossPercent =
            this.settings.stopLossPercent !== undefined
              ? this.settings.stopLossPercent
              : RISK_LEVELS[this.settings.riskLevel]?.stopLossPercent || 5

          const stopLossPrice = position.entryPrice * (1 - stopLossPercent / 100)

          // Check if stop loss is triggered
          if (currentPrice <= stopLossPrice) {
            shouldClose = true
            closeReason = "Stop Loss"
          }
        }

        // Check take profit if enabled
        if (!shouldClose && this.settings.takeProfitEnabled) {
          // Calculate take profit price - use user-defined take profit if available
          const takeProfitPercent =
            this.settings.takeProfitPercent !== undefined
              ? this.settings.takeProfitPercent
              : RISK_LEVELS[this.settings.riskLevel]?.takeProfitPercent || 10

          const takeProfitPrice = position.entryPrice * (1 + takeProfitPercent / 100)

          // Check if take profit is triggered
          if (currentPrice >= takeProfitPrice) {
            shouldClose = true
            closeReason = "Take Profit"
          }
        }

        // Check if we should scalp (if enabled)
        if (!shouldClose && this.settings.scalpingMode && position.profitLossPercent > 0) {
          // Scalping thresholds based on risk level
          const scalpThresholds = {
            1: 0.5, // 0.5% profit is enough to scalp at risk level 1
            2: 0.7, // 0.7% profit at risk level 2
            3: 1.0, // 1.0% profit at risk level 3
            4: 1.5, // 1.5% profit at risk level 4
            5: 2.0, // 2.0% profit at risk level 5
          }

          const threshold = scalpThresholds[this.settings.riskLevel] || scalpThresholds[3]

          if (position.profitLossPercent >= threshold) {
            shouldClose = true
            closeReason = "Scalping"
          }
        }

        // Close the position if needed
        if (shouldClose) {
          await this.executeTrade({
            symbol: position.symbol,
            action: "SELL",
            quantity: position.quantity,
            price: currentPrice,
            reason: closeReason,
          })

          // Remove from positions
          this.positions.splice(i, 1)
          i-- // Adjust index after removal

          console.log(
            `Closed position for ${position.symbol} (${closeReason}): ${position.profitLossPercent.toFixed(2)}%`,
          )
        } else {
          // Update position in database
          await updatePosition(this.userId, position.id, {
            currentPrice,
            profitLoss: position.profitLoss,
            profitLossPercent: position.profitLossPercent,
          })
        }
      }

      // Update UI
      this.onPositionUpdate(this.positions)
    } catch (error) {
      this.onError(`Error monitoring positions: ${error.message}`)
    }
  }

  // Get symbols to monitor
  private getSymbolsToMonitor(): string[] {
    // Prioritize favorite symbols if available
    if (this.settings.favoriteSymbols && this.settings.favoriteSymbols.length > 0) {
      return this.settings.favoriteSymbols
    }

    // Default symbols
    return ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "WMT"]
  }

  // Analyze a specific symbol
  private async analyzeSymbol(symbol: string): Promise<MarketAnalysis> {
    // Get current price
    const currentPrice = await marketDataService.getCurrentPrice(symbol)

    // Get risk parameters
    const riskLevel = this.settings.riskLevel
    const riskParams = RISK_LEVELS[riskLevel] || RISK_LEVELS[3]

    // Analyze based on timeframes
    const timeframes = this.settings.timeframes || ["1h"]
    const signals: string[] = []

    // Simulate different signals based on timeframes
    let buySignals = 0
    let sellSignals = 0

    for (const timeframe of timeframes) {
      // Simulate technical analysis for this timeframe
      const signal = this.simulateTechnicalAnalysis(symbol, timeframe)
      signals.push(`${timeframe}: ${signal.signal} (${signal.indicator})`)

      if (signal.signal === "BUY") buySignals++
      if (signal.signal === "SELL") sellSignals++
    }

    // Determine recommendation based on signals
    let recommendation: "BUY" | "SELL" | "HOLD" = "HOLD"
    let confidence = 0.5

    // Calculate confidence based on signal agreement
    const totalSignals = timeframes.length

    if (buySignals > sellSignals && buySignals / totalSignals > 0.5) {
      recommendation = "BUY"
      confidence = 0.5 + (buySignals / totalSignals) * 0.5
    } else if (sellSignals > buySignals && sellSignals / totalSignals > 0.5) {
      recommendation = "SELL"
      confidence = 0.5 + (sellSignals / totalSignals) * 0.5
    }

    // Adjust confidence based on risk level
    // Higher risk levels are more willing to trade on lower confidence
    const confidenceAdjustment = (5 - riskLevel) * 0.05 // 0.2 for risk 1, 0 for risk 5
    confidence = Math.max(0, confidence - confidenceAdjustment)

    // Use historical data if enabled
    if (this.settings.useHistoricalData) {
      // Simulate historical analysis
      const historicalSignal = Math.random() > 0.5 ? "strengthens" : "weakens"
      const historicalConfidence = (Math.random() * 0.2).toFixed(2)

      signals.push(`Historical analysis ${historicalSignal} ${recommendation} signal by ${historicalConfidence}`)

      // Adjust confidence based on historical analysis
      if (historicalSignal === "strengthens") {
        confidence = Math.min(1, confidence + Number.parseFloat(historicalConfidence))
      } else {
        confidence = Math.max(0, confidence - Number.parseFloat(historicalConfidence))
      }
    }

    return {
      symbol,
      recommendation,
      confidence,
      currentPrice,
      signals,
      timestamp: new Date(),
    }
  }

  // Simulate technical analysis for a timeframe
  private simulateTechnicalAnalysis(
    symbol: string,
    timeframe: string,
  ): { signal: "BUY" | "SELL" | "HOLD"; indicator: string } {
    // List of technical indicators
    const indicators = [
      "Moving Average Crossover",
      "RSI",
      "MACD",
      "Bollinger Bands",
      "Stochastic Oscillator",
      "Fibonacci Retracement",
      "Volume Profile",
      "Ichimoku Cloud",
    ]

    // Randomly select an indicator
    const indicator = indicators[Math.floor(Math.random() * indicators.length)]

    // Randomly determine signal
    const random = Math.random()
    let signal: "BUY" | "SELL" | "HOLD"

    if (random < 0.4) {
      signal = "BUY"
    } else if (random < 0.8) {
      signal = "SELL"
    } else {
      signal = "HOLD"
    }

    return { signal, indicator }
  }

  // Calculate position size
  private calculatePositionSize(symbol: string, price: number): number {
    // Get risk level
    const riskLevel = this.settings.riskLevel

    // Base position size (percentage of buying power)
    const basePercentage = 0.1 // 10% of buying power

    // Adjust based on risk level (higher risk = larger positions)
    const riskMultiplier = riskLevel / 3 // 0.33 for risk 1, 1.67 for risk 5

    // Calculate maximum position size based on buying power
    const maxPositionValue = this.buyingPower * basePercentage * riskMultiplier

    // Calculate quantity
    const quantity = Math.floor(maxPositionValue / price)

    // Ensure minimum quantity
    return Math.max(1, quantity)
  }

  // Execute a trade
  private async executeTrade(trade: {
    symbol: string
    action: "BUY" | "SELL"
    quantity: number
    price: number
    reason?: string
  }): Promise<void> {
    try {
      const { symbol, action, quantity, price, reason } = trade

      // Calculate total value
      const total = quantity * price

      // Create trade object
      const newTrade: TradingBotTrade = {
        id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        action,
        quantity,
        price,
        total,
        timestamp: new Date(),
        aiInitiated: true,
        reason,
      }

      // Add to trade history
      this.tradeHistory.push(newTrade)

      // Update positions
      if (action === "BUY") {
        // Get stop loss and take profit percentages based on settings
        const stopLossPercent =
          this.settings.stopLossEnabled && this.settings.stopLossPercent !== undefined
            ? this.settings.stopLossPercent
            : RISK_LEVELS[this.settings.riskLevel]?.stopLossPercent || 5

        const takeProfitPercent =
          this.settings.takeProfitEnabled && this.settings.takeProfitPercent !== undefined
            ? this.settings.takeProfitPercent
            : RISK_LEVELS[this.settings.riskLevel]?.takeProfitPercent || 10

        // Create new position
        const newPosition: TradingBotPosition = {
          id: `position-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          symbol,
          quantity,
          entryPrice: price,
          currentPrice: price,
          profitLoss: 0,
          profitLossPercent: 0,
          openDate: new Date(),
          aiManaged: true,
          stopLossPrice: price * (1 - stopLossPercent / 100),
          takeProfitPrice: price * (1 + takeProfitPercent / 100),
        }

        // Add to positions
        this.positions.push(newPosition)

        // Subscribe to market data for this symbol
        this.subscribeToSymbol(symbol)

        // Update buying power
        this.buyingPower -= total
      } else if (action === "SELL") {
        // Find the position
        const positionIndex = this.positions.findIndex((p) => p.symbol === symbol)

        if (positionIndex !== -1) {
          const position = this.positions[positionIndex]

          // Calculate profit/loss
          const profitLoss = (price - position.entryPrice) * quantity

          // Update account balance and buying power
          this.accountBalance += profitLoss
          this.buyingPower += total + profitLoss
          this.totalProfitLoss += profitLoss

          // Remove position
          this.positions.splice(positionIndex, 1)

          // Close position in database
          await closePosition(this.userId, position.id, {
            closePrice: price,
            profitLoss,
            closeDate: new Date(),
            closeReason: reason || "AI Managed",
          })
        }
      }

      // Add trade to database
      await addUserTrade(this.userId, newTrade)

      // Update account in database
      await updateUserAccount(this.userId, {
        accountBalance: this.accountBalance,
        buyingPower: this.buyingPower,
        totalProfitLoss: this.totalProfitLoss,
      })

      // Notify listeners
      this.onTradeExecuted(newTrade)
      this.onPositionUpdate(this.positions)

      console.log(`Executed ${action} for ${quantity} shares of ${symbol} at $${price} (${reason || "AI Managed"})`)
    } catch (error) {
      this.onError(`Error executing trade: ${error.message}`)
    }
  }

  // Get bot status
  public getStatus(): { running: boolean; positions: number; lastAnalysis: Date | null } {
    const lastAnalysisDate =
      Object.values(this.lastAnalysis).length > 0 ? Object.values(this.lastAnalysis)[0].timestamp : null

    return {
      running: this.isRunning,
      positions: this.positions.length,
      lastAnalysis: lastAnalysisDate,
    }
  }

  // Clean up resources when the bot is destroyed
  public destroy(): void {
    // Stop the bot
    this.stop()

    // Unsubscribe from all market data
    for (const [symbol, callback] of this.marketDataSubscriptions.entries()) {
      marketDataService.unsubscribe(symbol, callback)
    }
    this.marketDataSubscriptions.clear()
  }
}

