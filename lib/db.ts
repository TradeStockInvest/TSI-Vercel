import Dexie, { type Table } from "dexie"

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

export interface Position {
  id: string
  symbol: string
  quantity: number
  entryPrice: number
  currentPrice: number
  profitLoss: number
  profitLossPercent: number
  aiManaged: boolean
  openDate: Date
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

export class MySubClassedDexie extends Dexie {
  userAccounts!: Table<UserAccount>

  constructor() {
    super("TradeStockInvestDB")
    this.version(1).stores({
      userAccounts: "id, email, name",
    })
  }
}

export const db = new MySubClassedDexie()

