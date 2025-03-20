"use client"

import { useAuth } from "@/contexts/auth-context"
import { addUserTrade } from "./user-service"

export const useTradeService = () => {
  const { user } = useAuth()

  // Execute a manual trade
  const executeTrade = async (symbol: string, action: "BUY" | "SELL", quantity: number, price: number) => {
    if (!user?.id) {
      throw new Error("User not authenticated")
    }

    try {
      // Create trade object
      const trade = {
        id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        action,
        quantity,
        price,
        total: quantity * price,
        timestamp: new Date(),
        aiInitiated: false,
      }

      // Add the trade to user's account
      await addUserTrade(user.id, trade)

      return {
        success: true,
        message: `Successfully executed ${action} order for ${quantity} shares of ${symbol} at $${price}`,
      }
    } catch (err) {
      console.error("Failed to execute trade:", err)
      throw new Error("Failed to execute trade")
    }
  }

  return {
    executeTrade,
  }
}

