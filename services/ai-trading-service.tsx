"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { getUserAccount, updateUserAccount, addUserTrade, type Trade } from "./user-service"
import { isSymbolMarketOpen } from "@/utils/market-hours"

// Define risk level parameters
export const RISK_LEVELS = {
  1: {
    name: "Conservative",
    description: "Places only safe, conservative short/long trades with minimal risk of unprofitability.",
    maxPositions: 2,
    stopLossPercent: 1.5,
    takeProfitPercent: 2.5,
    maxLeverageRatio: 1,
    tradeFrequency: "low",
    diversificationRequired: true,
    allowedStrategies: ["trend_following", "mean_reversion"],
    volatilityThreshold: "low",
    confidenceThreshold: 0.85,
  },
  2: {
    name: "Cautious",
    description: "Places trades with slightly increased risk compared to level 1.",
    maxPositions: 3,
    stopLossPercent: 2.5,
    takeProfitPercent: 4,
    maxLeverageRatio: 1.5,
    tradeFrequency: "low_to_medium",
    diversificationRequired: true,
    allowedStrategies: ["trend_following", "mean_reversion", "breakout"],
    volatilityThreshold: "low_to_medium",
    confidenceThreshold: 0.75,
  },
  3: {
    name: "Moderate",
    description: "Adopts a moderate risk approach for its trades.",
    maxPositions: 5,
    stopLossPercent: 4,
    takeProfitPercent: 6,
    maxLeverageRatio: 2,
    tradeFrequency: "medium",
    diversificationRequired: true,
    allowedStrategies: ["trend_following", "mean_reversion", "breakout", "momentum"],
    volatilityThreshold: "medium",
    confidenceThreshold: 0.65,
  },
  4: {
    name: "Aggressive",
    description: "Engages in riskier trades, accepting a higher potential for both gain and loss.",
    maxPositions: 7,
    stopLossPercent: 6,
    takeProfitPercent: 10,
    maxLeverageRatio: 3,
    tradeFrequency: "medium_to_high",
    diversificationRequired: false,
    allowedStrategies: ["trend_following", "mean_reversion", "breakout", "momentum", "counter_trend"],
    volatilityThreshold: "medium_to_high",
    confidenceThreshold: 0.55,
  },
  5: {
    name: "Maximum",
    description:
      "Operates at the maximum risk level, with full freedom in placing trades while still striving to be profitable.",
    maxPositions: 10,
    stopLossPercent: 10,
    takeProfitPercent: 15,
    maxLeverageRatio: 4,
    tradeFrequency: "high",
    diversificationRequired: false,
    allowedStrategies: [
      "trend_following",
      "mean_reversion",
      "breakout",
      "momentum",
      "counter_trend",
      "pattern_recognition",
    ],
    volatilityThreshold: "high",
    confidenceThreshold: 0.45,
  },
}

export const useAITradingService = () => {
  const { user } = useAuth()
  const { checkFeatureAccess } = useSubscription()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [userAccount, setUserAccount] = useState(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize the service
  useEffect(() => {
    const initialize = async () => {
      if (!user?.id) return

      try {
        // Load user account data
        const account = await getUserAccount(user.id)
        setUserAccount(account)

        // Check if AI was previously enabled
        if (account?.aiSettings?.enabled) {
          // Do NOT auto-start AI trading, even if it was previously enabled
          // This ensures new logins don't automatically start trading
          await updateUserAccount(user.id, {
            aiSettings: {
              ...account.aiSettings,
              enabled: false,
            },
          })
        }

        setIsInitialized(true)
      } catch (err) {
        console.error("Failed to initialize AI Trading Service:", err)
        setError("Failed to initialize AI Trading Service")
      }
    }

    initialize()
  }, [user?.id])

  // Check if we're on the main dashboard
  const isMainDashboard = () => {
    return window.location.pathname === "/dashboard" || window.location.pathname === "/dashboard/"
  }

  // Check if the user can use AI trading
  const canUseAITrading = () => {
    if (!user?.id || !isInitialized) return false
    if (isMainDashboard()) return false
    return checkFeatureAccess("ai_trading")
  }

  // Start AI trading
  const startAITrading = async (settings) => {
    if (!canUseAITrading()) {
      setError("AI Trading is not available. Upgrade to PRO plan to access this feature.")
      return false
    }

    try {
      // Update user settings
      await updateUserAccount(user.id, {
        aiEnabled: true,
        aiSettings: {
          ...userAccount.aiSettings,
          ...settings,
          enabled: true,
        },
      })

      setIsRunning(true)
      return true
    } catch (err) {
      console.error("Failed to start AI Trading:", err)
      setError("Failed to start AI Trading")
      return false
    }
  }

  // Stop AI trading
  const stopAITrading = async () => {
    if (!user?.id || !isInitialized) return false

    try {
      // Update user settings
      await updateUserAccount(user.id, {
        aiEnabled: false,
        aiSettings: {
          ...userAccount.aiSettings,
          enabled: false,
        },
      })

      setIsRunning(false)
      return true
    } catch (err) {
      console.error("Failed to stop AI Trading:", err)
      setError("Failed to stop AI Trading")
      return false
    }
  }

  // Analyze market for a symbol based on risk level
  const analyzeMarket = async (symbol, riskLevel = 3) => {
    if (!canUseAITrading()) {
      return {
        recommendation: "HOLD",
        confidence: 0,
        reason: "AI Trading is not available",
        signals: [],
      }
    }

    // Check if market is open for this symbol
    if (!isSymbolMarketOpen(symbol)) {
      return {
        recommendation: "HOLD",
        confidence: 0,
        reason: "Market is closed for this symbol",
        signals: [],
      }
    }

    // Get risk parameters
    const riskParams = RISK_LEVELS[riskLevel] || RISK_LEVELS[3] // Default to moderate if invalid

    // Simulate market analysis with risk level consideration
    const randomValue = Math.random()
    let recommendation = "HOLD"
    let confidence = 0.5
    let reason = "Neutral market conditions."
    const signals = []

    // Adjust confidence threshold based on risk level
    const confidenceThreshold = riskParams.confidenceThreshold

    // More aggressive trading at higher risk levels
    if (randomValue > 1 - confidenceThreshold) {
      recommendation = "BUY"
      confidence = 0.5 + randomValue * 0.5 // Higher confidence at higher random values
      reason = `Positive market trends detected (Risk Level: ${riskLevel}).`
      signals.push(
        `Buy signal based on ${riskParams.allowedStrategies[Math.floor(Math.random() * riskParams.allowedStrategies.length)]} strategy.`,
      )
      signals.push(`Stop loss set at ${riskParams.stopLossPercent}%, take profit at ${riskParams.takeProfitPercent}%.`)
    } else if (randomValue < confidenceThreshold) {
      recommendation = "SELL"
      confidence = 0.5 + (1 - randomValue) * 0.5 // Higher confidence at lower random values
      reason = `Negative market trends detected (Risk Level: ${riskLevel}).`
      signals.push(
        `Sell signal based on ${riskParams.allowedStrategies[Math.floor(Math.random() * riskParams.allowedStrategies.length)]} strategy.`,
      )
      signals.push(`Stop loss set at ${riskParams.stopLossPercent}%, take profit at ${riskParams.takeProfitPercent}%.`)
    }

    return {
      recommendation,
      confidence,
      reason,
      signals,
      riskParams,
    }
  }

  // Check if a position should be scalped (closed for small profit)
  const shouldScalpPosition = (position, riskLevel = 3) => {
    if (!position) return false

    // Calculate profit percentage
    const profitPercent = position.profitLossPercent

    // Even at low risk levels, we allow scalping for small profits
    // Higher risk levels have higher thresholds before scalping
    const scalpThresholds = {
      1: 0.5, // 0.5% profit is enough to scalp at risk level 1
      2: 0.7, // 0.7% profit at risk level 2
      3: 1.0, // 1.0% profit at risk level 3
      4: 1.5, // 1.5% profit at risk level 4
      5: 2.0, // 2.0% profit at risk level 5
    }

    const threshold = scalpThresholds[riskLevel] || scalpThresholds[3]

    // If profit exceeds threshold, recommend scalping
    return profitPercent >= threshold
  }

  // Execute a trade with risk level consideration
  const executeTrade = async (symbol, action, quantity, price, riskLevel = 3) => {
    if (!canUseAITrading()) {
      setError("AI Trading is not available. Upgrade to PRO plan to access this feature.")
      return null
    }

    // Check if market is open for this symbol
    if (!isSymbolMarketOpen(symbol)) {
      setError(`Market is closed for ${symbol}. Trade not executed.`)
      return null
    }

    try {
      // Get risk parameters
      const riskParams = RISK_LEVELS[riskLevel] || RISK_LEVELS[3]

      // Adjust quantity based on risk level
      const adjustedQuantity = Math.ceil(quantity * (riskLevel / 3))

      // Create trade object
      const trade: Trade = {
        id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        action,
        quantity: adjustedQuantity,
        price,
        total: adjustedQuantity * price,
        timestamp: new Date(),
        aiInitiated: true,
        riskLevel,
        stopLossPercent: riskParams.stopLossPercent,
        takeProfitPercent: riskParams.takeProfitPercent,
      }

      // Add the trade to user's account
      await addUserTrade(user.id, trade)

      return {
        success: true,
        message: `Successfully executed ${action} order for ${adjustedQuantity} shares of ${symbol} at $${price} (Risk Level: ${riskLevel})`,
      }
    } catch (err) {
      console.error("Failed to execute trade:", err)
      setError("Failed to execute trade")
      return null
    }
  }

  return {
    isInitialized,
    isRunning,
    error,
    startAITrading,
    stopAITrading,
    analyzeMarket,
    executeTrade,
    shouldScalpPosition,
    canUseAITrading,
    riskLevels: RISK_LEVELS,
  }
}

export const getPortfolioSummary = async () => {
  // Simulate portfolio summary (replace with actual data retrieval)
  return {
    totalValue: 100000,
    positions: [
      { symbol: "AAPL", quantity: 100, currentValue: 17500 },
      { symbol: "GOOG", quantity: 50, currentValue: 15000 },
    ],
  }
}

