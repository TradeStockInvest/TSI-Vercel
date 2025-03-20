import { db } from "@/lib/db"
import type { Position, TradeHistory } from "@/types/trading"

export interface UserAccount {
  id: string
  email: string
  name: string
  accountBalance: number
  buyingPower: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  positions: Position[]
  tradeHistory: Trade[]
  aiEnabled: boolean
  aiSettings: AISettings
  createdAt: Date
  updatedAt: Date
}

export interface Trade {
  id: string
  symbol: string
  action: "BUY" | "SELL"
  quantity: number
  price: number
  total: number
  timestamp: Date
  aiInitiated: boolean
}

export interface AISettings {
  enabled: boolean
  riskLevel: "low" | "medium" | "high"
  maxPositions: number
  maxLoss: number
  timeframes: string[]
  scalpingMode: boolean
  useHistoricalData: boolean
  continuousOperation: boolean
  favoriteSymbols: string[]
}

// Initialize a new user account with zero balances
export const initializeNewUserAccount = async (userId: string, email: string, name: string): Promise<UserAccount> => {
  const newAccount: UserAccount = {
    id: userId,
    email,
    name,
    accountBalance: 0,
    buyingPower: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
    positions: [],
    tradeHistory: [],
    aiEnabled: false,
    aiSettings: {
      enabled: false,
      riskLevel: "medium",
      maxPositions: 5,
      maxLoss: 5,
      timeframes: ["1D"],
      scalpingMode: false,
      useHistoricalData: false,
      continuousOperation: false,
      favoriteSymbols: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Save the new account to the database
  await db.userAccounts.create({
    data: newAccount,
  })

  return newAccount
}

// Get user account data
export const getUserAccount = async (userId: string): Promise<UserAccount | null> => {
  const account = await db.userAccounts.findUnique({
    where: { id: userId },
  })

  return account
}

// Update user account data
export const updateUserAccount = async (userId: string, data: Partial<UserAccount>): Promise<UserAccount> => {
  const updatedAccount = await db.userAccounts.update({
    where: { id: userId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  return updatedAccount
}

// Save user positions
export const saveUserPositions = async (userId: string, positions: Position[]): Promise<void> => {
  await db.userAccounts.update({
    where: { id: userId },
    data: {
      positions,
      updatedAt: new Date(),
    },
  })
}

// Save user trade history
export const saveUserTradeHistory = async (userId: string, tradeHistory: Trade[]): Promise<void> => {
  await db.userAccounts.update({
    where: { id: userId },
    data: {
      tradeHistory,
      updatedAt: new Date(),
    },
  })
}

// Add a new trade and update positions
export const addUserTrade = async (userId: string, trade: Trade): Promise<void> => {
  const account = await getUserAccount(userId)
  if (!account) return

  // Add the trade to history
  const updatedTradeHistory = [...account.tradeHistory, trade]

  // Update positions based on the trade
  let updatedPositions = [...account.positions]
  let updatedBalance = account.accountBalance
  let updatedBuyingPower = account.buyingPower

  // Calculate the trade impact on account
  const tradeValue = trade.price * trade.quantity

  if (trade.action === "BUY") {
    // Check if position already exists
    const existingPositionIndex = updatedPositions.findIndex((p) => p.symbol === trade.symbol)

    if (existingPositionIndex >= 0) {
      // Update existing position
      const existingPosition = updatedPositions[existingPositionIndex]
      const newQuantity = existingPosition.quantity + trade.quantity
      const newEntryPrice =
        (existingPosition.entryPrice * existingPosition.quantity + trade.price * trade.quantity) / newQuantity

      updatedPositions[existingPositionIndex] = {
        ...existingPosition,
        quantity: newQuantity,
        entryPrice: newEntryPrice,
        currentPrice: trade.price,
        profitLoss: (trade.price - newEntryPrice) * newQuantity,
        profitLossPercent: ((trade.price - newEntryPrice) / newEntryPrice) * 100,
      }
    } else {
      // Add new position
      updatedPositions.push({
        id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        symbol: trade.symbol,
        quantity: trade.quantity,
        entryPrice: trade.price,
        currentPrice: trade.price,
        profitLoss: 0,
        profitLossPercent: 0,
        aiManaged: trade.aiInitiated,
        openDate: new Date(),
      })
    }

    // Update account balance and buying power
    updatedBuyingPower -= tradeValue
  } else if (trade.action === "SELL") {
    // Find the position
    const positionIndex = updatedPositions.findIndex((p) => p.symbol === trade.symbol)

    if (positionIndex >= 0) {
      const position = updatedPositions[positionIndex]

      if (position.quantity === trade.quantity) {
        // Remove the position if all shares are sold
        updatedPositions = updatedPositions.filter((_, index) => index !== positionIndex)
      } else {
        // Update the position if partial shares are sold
        updatedPositions[positionIndex] = {
          ...position,
          quantity: position.quantity - trade.quantity,
          currentPrice: trade.price,
          profitLoss: (trade.price - position.entryPrice) * (position.quantity - trade.quantity),
          profitLossPercent: ((trade.price - position.entryPrice) / position.entryPrice) * 100,
        }
      }

      // Calculate profit/loss for this trade
      const tradeProfitLoss = (trade.price - position.entryPrice) * trade.quantity

      // Update account balance and buying power
      updatedBalance += tradeProfitLoss
      updatedBuyingPower += tradeValue
    }
  }

  // Calculate total profit/loss
  const totalProfitLoss = updatedPositions.reduce((sum, pos) => sum + pos.profitLoss, 0)
  const totalProfitLossPercent = account.accountBalance > 0 ? (totalProfitLoss / account.accountBalance) * 100 : 0

  // Update the account
  await updateUserAccount(userId, {
    positions: updatedPositions,
    tradeHistory: updatedTradeHistory,
    accountBalance: updatedBalance,
    buyingPower: updatedBuyingPower,
    totalProfitLoss,
    totalProfitLossPercent,
  })
}

// Mock data for positions
const mockPositions: Position[] = [
  {
    id: "1",
    symbol: "AAPL",
    quantity: 10,
    entryPrice: 150.25,
    currentPrice: 155.75,
    profitLoss: 55.0,
    profitLossPercentage: 3.66,
    openDate: new Date().toISOString(),
    isAIGenerated: true,
  },
  {
    id: "2",
    symbol: "MSFT",
    quantity: 5,
    entryPrice: 290.5,
    currentPrice: 305.25,
    profitLoss: 73.75,
    profitLossPercentage: 5.08,
    openDate: new Date().toISOString(),
    isAIGenerated: false,
  },
]

// Mock data for trade history
const mockTradeHistory: TradeHistory[] = [
  {
    id: "1",
    symbol: "AAPL",
    action: "BUY",
    quantity: 10,
    price: 150.25,
    date: new Date(Date.now() - 86400000).toISOString(),
    isAIGenerated: true,
  },
  {
    id: "2",
    symbol: "GOOGL",
    action: "SELL",
    quantity: 3,
    price: 2750.8,
    date: new Date(Date.now() - 172800000).toISOString(),
    isAIGenerated: false,
  },
]

export async function getPositions(): Promise<Position[]> {
  // In a real app, this would fetch from an API
  return Promise.resolve(mockPositions)
}

export async function getTradeHistory(): Promise<TradeHistory[]> {
  // In a real app, this would fetch from an API
  return Promise.resolve(mockTradeHistory)
}

/**
 * Updates a user's position with new information
 * @param userId The ID of the user
 * @param positionId The ID of the position to update
 * @param updates The updates to apply to the position
 * @returns The updated position
 */
export async function updatePosition(
  userId: string,
  positionId: string,
  updates: Partial<Position>,
): Promise<Position> {
  try {
    // In a real implementation, this would update the position in the database
    // For now, we'll return a mock updated position
    const mockUpdatedPosition: Position = {
      id: positionId,
      symbol: updates.symbol || "AAPL",
      entryPrice: updates.entryPrice || 150.0,
      currentPrice: updates.currentPrice || 155.0,
      quantity: updates.quantity || 10,
      entryDate: updates.entryDate || new Date().toISOString(),
      pnl: updates.pnl || 50.0,
      pnlPercentage: updates.pnlPercentage || 3.33,
      status: updates.status || "open",
      type: updates.type || "long",
      ...updates,
    }

    return mockUpdatedPosition
  } catch (error) {
    console.error("Error updating position:", error)
    throw new Error("Failed to update position")
  }
}

/**
 * Closes a user's position
 * @param userId The ID of the user
 * @param positionId The ID of the position to close
 * @returns The closed position
 */
export async function closePosition(userId: string, positionId: string): Promise<Position> {
  try {
    // In a real implementation, this would close the position in the database
    // For now, we'll return a mock closed position
    const mockClosedPosition: Position = {
      id: positionId,
      symbol: "AAPL",
      entryPrice: 150.0,
      currentPrice: 155.0,
      quantity: 10,
      entryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      exitDate: new Date().toISOString(),
      pnl: 50.0,
      pnlPercentage: 3.33,
      status: "closed",
      type: "long",
    }

    return mockClosedPosition
  } catch (error) {
    console.error("Error closing position:", error)
    throw new Error("Failed to close position")
  }
}

export async function closeAllAIPositions(): Promise<TradeHistory[]> {
  // Get all AI-generated positions
  const aiPositions = mockPositions.filter((p) => p.isAIGenerated)

  // Close each position
  const closedTrades = await Promise.all(aiPositions.map((position) => closePosition(position.id)))

  return closedTrades
}

