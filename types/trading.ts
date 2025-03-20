export interface Position {
  id: string
  symbol: string
  entryPrice: number
  currentPrice: number
  quantity: number
  entryDate: string
  exitDate?: string
  pnl: number
  pnlPercentage: number
  status: "open" | "closed"
  type: "long" | "short"
  isAIGenerated?: boolean
}

export interface Trade {
  id: string
  symbol: string
  action: TradeAction
  price: number
  quantity: number
  timestamp: string
  total: number
  status: "completed" | "pending" | "failed"
  userId: string
  aiInitiated?: boolean
}

export type TradeAction = "buy" | "sell"

export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  high: number
  low: number
  open: number
  previousClose: number
}

export interface AITradingConfig {
  enabled: boolean
  symbol: string
  maxPositions: number
  riskLevel: "low" | "medium" | "high"
  continuousOperation: boolean
  favorite: boolean
}

export interface AITradingAnalysis {
  symbol: string
  buySignals: Array<{ timestamp: string; price: number; confidence: number }>
  sellSignals: Array<{ timestamp: string; price: number; confidence: number }>
  trendPrediction: Array<{ timestamp: string; direction: "up" | "down" | "neutral"; confidence: number }>
}

export type TradeHistory = Trade

