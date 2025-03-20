import { io, type Socket } from "socket.io-client"

// Define types
export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
}

export interface MarketDataSubscription {
  symbol: string
  callback: (data: MarketData) => void
}

// Market Data Service
class MarketDataService {
  private socket: Socket | null = null
  private subscriptions: Map<string, Set<(data: MarketData) => void>> = new Map()
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000
  private apiKey: string | null = null

  // Initialize the service
  public initialize(apiKey?: string): void {
    if (this.socket) {
      return
    }

    this.apiKey = apiKey || null

    // Connect to the market data service
    this.connect()
  }

  // Connect to the socket
  private connect(): void {
    try {
      const options: any = {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      }

      // Add API key if available
      if (this.apiKey) {
        options.query = { apiKey: this.apiKey }
      }

      this.socket = io("https://api.marketdata.app", options)

      // Set up event handlers
      this.socket.on("connect", this.handleConnect.bind(this))
      this.socket.on("disconnect", this.handleDisconnect.bind(this))
      this.socket.on("market_data", this.handleMarketData.bind(this))
      this.socket.on("error", this.handleError.bind(this))

      console.log("Market data service initialized")
    } catch (error) {
      console.error("Failed to initialize market data service:", error)
    }
  }

  // Handle connection
  private handleConnect(): void {
    console.log("Connected to market data service")
    this.connected = true
    this.reconnectAttempts = 0

    // Resubscribe to all symbols
    for (const symbol of this.subscriptions.keys()) {
      this.socket?.emit("subscribe", symbol)
    }
  }

  // Handle disconnection
  private handleDisconnect(): void {
    console.log("Disconnected from market data service")
    this.connected = false

    // Try to reconnect if max attempts not reached
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay)
    }
  }

  // Handle market data
  private handleMarketData(data: MarketData): void {
    const symbol = data.symbol
    const callbacks = this.subscriptions.get(symbol)

    if (callbacks) {
      for (const callback of callbacks) {
        callback(data)
      }
    }
  }

  // Handle errors
  private handleError(error: any): void {
    console.error("Market data service error:", error)
  }

  // Subscribe to a symbol
  public subscribe(symbol: string, callback: (data: MarketData) => void): void {
    // Add to subscriptions
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set())
    }

    this.subscriptions.get(symbol)?.add(callback)

    // Subscribe to the symbol if connected
    if (this.connected && this.socket) {
      this.socket.emit("subscribe", symbol)
    }
  }

  // Unsubscribe from a symbol
  public unsubscribe(symbol: string, callback: (data: MarketData) => void): void {
    const callbacks = this.subscriptions.get(symbol)

    if (callbacks) {
      callbacks.delete(callback)

      // If no more callbacks, unsubscribe from the symbol
      if (callbacks.size === 0) {
        this.subscriptions.delete(symbol)

        if (this.connected && this.socket) {
          this.socket.emit("unsubscribe", symbol)
        }
      }
    }
  }

  // Get the current price for a symbol
  public async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`https://api.marketdata.app/v1/stocks/quotes/${symbol}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch price for ${symbol}`)
      }

      const data = await response.json()

      if (data && data.last && typeof data.last === "number") {
        return data.last
      }

      throw new Error(`Invalid price data for ${symbol}`)
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error)

      // Fallback to backup prices
      const backupPrices = {
        AAPL: 175.5,
        MSFT: 325.75,
        GOOGL: 140.2,
        AMZN: 145.3,
        TSLA: 235.86, // Updated TSLA price
        META: 480.25,
        NVDA: 820.5,
        JPM: 195.4,
        V: 275.6,
        WMT: 60.3,
      }

      return backupPrices[symbol] || 100
    }
  }

  // Disconnect from the service
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      this.subscriptions.clear()
    }
  }
}

// Export a singleton instance
export const marketDataService = new MarketDataService()

