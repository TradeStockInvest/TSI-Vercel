import type { User } from "@/types/auth"

// Types for our data models
export interface Trade {
  id: string
  userId: string
  symbol: string
  type: "buy" | "sell"
  quantity: number
  price: number
  timestamp: string
  status: "open" | "closed"
  profit?: number
  profitPercentage?: number
  aiManaged: boolean
}

export interface UserSettings {
  userId: string
  aiEnabled: boolean
  maxTradeAmount: number
  stopLossPercentage: number
  takeProfitPercentage: number
  maxPositions: number
  riskLevel: number
  selectedAssetClass: string
  selectedSymbol: string
  continuousOperation: boolean
  favoriteInstruments: string[]
  selectedTimeframes: string[]
}

// Service for handling data persistence
class DataPersistenceService {
  private static instance: DataPersistenceService
  private currentUser: User | null = null
  private isInitialized = false
  private dbName = "tradestockinvest_db"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  // Singleton pattern
  public static getInstance(): DataPersistenceService {
    if (!DataPersistenceService.instance) {
      DataPersistenceService.instance = new DataPersistenceService()
    }
    return DataPersistenceService.instance
  }

  // Initialize the database
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    // Check if we're in a browser environment
    if (typeof window === "undefined" || !window.indexedDB) {
      console.error("IndexedDB not supported")
      return false
    }

    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion)

        request.onerror = (event) => {
          console.error("Database error:", event)
          reject(false)
        }

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result
          this.isInitialized = true
          console.log("Database initialized successfully")
          resolve(true)
        }

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains("trades")) {
            const tradesStore = db.createObjectStore("trades", { keyPath: "id" })
            tradesStore.createIndex("userId", "userId", { unique: false })
            tradesStore.createIndex("symbol", "symbol", { unique: false })
            tradesStore.createIndex("status", "status", { unique: false })
          }

          if (!db.objectStoreNames.contains("settings")) {
            const settingsStore = db.createObjectStore("settings", { keyPath: "userId" })
          }
        }
      })
    } catch (error) {
      console.error("Error initializing database:", error)
      return false
    }
  }

  // Set the current user
  public setUser(user: User | null): void {
    this.currentUser = user

    // If user is null, we're logging out
    if (!user) {
      this.migrateLocalStorageToIndexedDB()
        .then(() => console.log("Local storage data migrated to IndexedDB"))
        .catch((err) => console.error("Error migrating data:", err))
    } else {
      // When a user logs in, load their data
      this.loadUserData()
        .then(() => console.log("User data loaded successfully"))
        .catch((err) => console.error("Error loading user data:", err))
    }
  }

  // Get the current user
  public getUser(): User | null {
    return this.currentUser
  }

  // Save trades to persistent storage
  public async saveTrades(trades: Trade[]): Promise<boolean> {
    if (!this.isInitialized) await this.initialize()
    if (!this.db) return false

    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(["trades"], "readwrite")
        const store = transaction.objectStore("trades")

        // Ensure all trades have the current user ID
        const userId = this.currentUser?.id || "anonymous"
        trades.forEach((trade) => {
          trade.userId = userId
          store.put(trade)
        })

        transaction.oncomplete = () => {
          // Also save to localStorage as backup
          this.saveToLocalStorage("aiTrades", trades)
          resolve(true)
        }

        transaction.onerror = (event) => {
          console.error("Transaction error:", event)
          // Fall back to localStorage
          this.saveToLocalStorage("aiTrades", trades)
          reject(false)
        }
      })
    } catch (error) {
      console.error("Error saving trades:", error)
      // Fall back to localStorage
      this.saveToLocalStorage("aiTrades", trades)
      return false
    }
  }

  // Load trades from persistent storage
  public async loadTrades(): Promise<Trade[]> {
    if (!this.isInitialized) await this.initialize()
    if (!this.db) return this.loadFromLocalStorage("aiTrades", [])

    try {
      return new Promise((resolve, reject) => {
        const userId = this.currentUser?.id || "anonymous"
        const transaction = this.db!.transaction(["trades"], "readonly")
        const store = transaction.objectStore("trades")
        const index = store.index("userId")
        const request = index.getAll(userId)

        request.onsuccess = () => {
          const trades = request.result as Trade[]
          resolve(trades)
        }

        request.onerror = (event) => {
          console.error("Error loading trades:", event)
          // Fall back to localStorage
          const trades = this.loadFromLocalStorage("aiTrades", [])
          resolve(trades)
        }
      })
    } catch (error) {
      console.error("Error loading trades:", error)
      // Fall back to localStorage
      return this.loadFromLocalStorage("aiTrades", [])
    }
  }

  // Save user settings
  public async saveSettings(settings: UserSettings): Promise<boolean> {
    if (!this.isInitialized) await this.initialize()
    if (!this.db) return false

    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(["settings"], "readwrite")
        const store = transaction.objectStore("settings")

        // Ensure settings have the current user ID
        settings.userId = this.currentUser?.id || "anonymous"
        store.put(settings)

        transaction.oncomplete = () => {
          // Also save to localStorage as backup
          this.saveToLocalStorage("aiAgentSettings", settings)
          resolve(true)
        }

        transaction.onerror = (event) => {
          console.error("Transaction error:", event)
          // Fall back to localStorage
          this.saveToLocalStorage("aiAgentSettings", settings)
          reject(false)
        }
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      // Fall back to localStorage
      this.saveToLocalStorage("aiAgentSettings", settings)
      return false
    }
  }

  // Load user settings
  public async loadSettings(): Promise<UserSettings | null> {
    if (!this.isInitialized) await this.initialize()
    if (!this.db) return this.loadFromLocalStorage("aiAgentSettings", null)

    try {
      return new Promise((resolve, reject) => {
        const userId = this.currentUser?.id || "anonymous"
        const transaction = this.db!.transaction(["settings"], "readonly")
        const store = transaction.objectStore("settings")
        const request = store.get(userId)

        request.onsuccess = () => {
          const settings = request.result as UserSettings
          if (!settings) {
            // Fall back to localStorage
            const localSettings = this.loadFromLocalStorage("aiAgentSettings", null)
            resolve(localSettings)
          } else {
            resolve(settings)
          }
        }

        request.onerror = (event) => {
          console.error("Error loading settings:", event)
          // Fall back to localStorage
          const settings = this.loadFromLocalStorage("aiAgentSettings", null)
          resolve(settings)
        }
      })
    } catch (error) {
      console.error("Error loading settings:", error)
      // Fall back to localStorage
      return this.loadFromLocalStorage("aiAgentSettings", null)
    }
  }

  // Helper method to save to localStorage
  private saveToLocalStorage(key: string, data: any): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data))
      }
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error)
    }
  }

  // Helper method to load from localStorage
  private loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem(key)
        if (data) {
          return JSON.parse(data) as T
        }
      }
      return defaultValue
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error)
      return defaultValue
    }
  }

  // Migrate data from localStorage to IndexedDB
  private async migrateLocalStorageToIndexedDB(): Promise<boolean> {
    if (!this.isInitialized) await this.initialize()
    if (!this.db) return false

    try {
      // Migrate trades
      const trades = this.loadFromLocalStorage<Trade[]>("aiTrades", [])
      if (trades.length > 0) {
        await this.saveTrades(trades)
      }

      // Migrate settings
      const settings = this.loadFromLocalStorage<UserSettings>("aiAgentSettings", null)
      if (settings) {
        await this.saveSettings(settings)
      }

      return true
    } catch (error) {
      console.error("Error migrating data:", error)
      return false
    }
  }

  // Load all user data after login
  private async loadUserData(): Promise<boolean> {
    try {
      // Load trades and settings
      await this.loadTrades()
      await this.loadSettings()

      // Dispatch an event to notify components that user data is loaded
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("userDataLoaded", {
            detail: { userId: this.currentUser?.id },
          }),
        )
      }

      return true
    } catch (error) {
      console.error("Error loading user data:", error)
      return false
    }
  }
}

// Export a function to get the instance
export function getDataPersistenceService(): DataPersistenceService {
  return DataPersistenceService.getInstance()
}

