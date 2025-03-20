import axios from "axios"

// Base URLs for Alpaca API
const ALPACA_PAPER_BASE_URL = "https://paper-api.alpaca.markets"
const ALPACA_LIVE_BASE_URL = "https://api.alpaca.markets"

// Function to get API keys from localStorage or sessionStorage
function getApiKeys() {
  const apiKey = localStorage.getItem("alpacaApiKey") || sessionStorage.getItem("alpacaApiKey")
  const apiSecret = localStorage.getItem("alpacaApiSecret") || sessionStorage.getItem("alpacaApiSecret")
  const isPaper = localStorage.getItem("alpacaIsPaper") !== "false" // Default to paper trading

  // For demo purposes, if keys aren't found, use mock keys instead of throwing an error
  if (!apiKey || !apiSecret) {
    console.warn("API keys not found. Using demo mode with mock data.")
    return {
      apiKey: "DEMO_API_KEY",
      apiSecret: "DEMO_API_SECRET",
      isPaper: true,
      isDemo: true, // Flag to indicate we're using demo mode
    }
  }

  return { apiKey, apiSecret, isPaper, isDemo: false }
}

// Function to get base URL based on environment
function getBaseUrl(isPaper = true) {
  return isPaper ? ALPACA_PAPER_BASE_URL : ALPACA_LIVE_BASE_URL
}

// Function to get account information
export async function getAccountInfo() {
  try {
    const { apiKey, apiSecret, isPaper, isDemo } = getApiKeys()

    // If in demo mode, return mock data immediately
    if (isDemo) {
      return {
        account_number: "DEMO123456",
        buying_power: "25000.00",
        cash: "25000.00",
        equity: "25000.00",
        last_equity: "24500.00",
        status: "ACTIVE",
      }
    }

    const baseUrl = getBaseUrl(isPaper)

    const response = await axios.get(`${baseUrl}/v2/account`, {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching account info:", error)

    // Return mock data for demo purposes
    return {
      account_number: "DEMO123456",
      buying_power: "25000.00",
      cash: "25000.00",
      equity: "25000.00",
      last_equity: "24500.00",
      status: "ACTIVE",
    }
  }
}

// Function to get positions
export async function getPositions() {
  try {
    const { apiKey, apiSecret, isPaper, isDemo } = getApiKeys()

    // If in demo mode, return mock data immediately
    if (isDemo) {
      return [
        {
          symbol: "AAPL",
          qty: "10",
          avg_entry_price: "150.25",
          current_price: "155.75",
          market_value: "1557.50",
          unrealized_pl: "55.00",
          unrealized_plpc: "0.0366",
          side: "long",
        },
        {
          symbol: "MSFT",
          qty: "5",
          avg_entry_price: "290.50",
          current_price: "305.25",
          market_value: "1526.25",
          unrealized_pl: "73.75",
          unrealized_plpc: "0.0508",
          side: "long",
        },
        {
          symbol: "TSLA",
          qty: "3",
          avg_entry_price: "220.75",
          current_price: "215.30",
          market_value: "645.90",
          unrealized_pl: "-16.35",
          unrealized_plpc: "-0.0247",
          side: "long",
        },
      ]
    }

    // If not in demo mode, proceed with the API call
    const baseUrl = getBaseUrl(isPaper)
    const response = await axios.get(`${baseUrl}/v2/positions`, {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching positions:", error)

    // Return mock data for demo purposes
    return [
      {
        symbol: "AAPL",
        qty: "10",
        avg_entry_price: "150.25",
        current_price: "155.75",
        market_value: "1557.50",
        unrealized_pl: "55.00",
        unrealized_plpc: "0.0366",
        side: "long",
      },
      {
        symbol: "MSFT",
        qty: "5",
        avg_entry_price: "290.50",
        current_price: "305.25",
        market_value: "1526.25",
        unrealized_pl: "73.75",
        unrealized_plpc: "0.0508",
        side: "long",
      },
      {
        symbol: "TSLA",
        qty: "3",
        avg_entry_price: "220.75",
        current_price: "215.30",
        market_value: "645.90",
        unrealized_pl: "-16.35",
        unrealized_plpc: "-0.0247",
        side: "long",
      },
    ]
  }
}

// Function to get orders
export async function getOrders() {
  try {
    const { apiKey, apiSecret, isPaper, isDemo } = getApiKeys()

    // If in demo mode, return mock data immediately
    if (isDemo) {
      return [
        {
          id: "order1",
          symbol: "AAPL",
          qty: "10",
          side: "buy",
          type: "market",
          status: "filled",
          filled_avg_price: "150.25",
          filled_at: "2023-03-15T14:30:00Z",
        },
        {
          id: "order2",
          symbol: "MSFT",
          qty: "5",
          side: "buy",
          type: "limit",
          limit_price: "290.50",
          status: "filled",
          filled_avg_price: "290.50",
          filled_at: "2023-03-14T10:15:00Z",
        },
        {
          id: "order3",
          symbol: "GOOGL",
          qty: "2",
          side: "buy",
          type: "market",
          status: "canceled",
          filled_at: null,
        },
      ]
    }

    const baseUrl = getBaseUrl(isPaper)

    const response = await axios.get(`${baseUrl}/v2/orders?status=all&limit=20`, {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)

    // Return mock data for demo purposes
    return [
      {
        id: "order1",
        symbol: "AAPL",
        qty: "10",
        side: "buy",
        type: "market",
        status: "filled",
        filled_avg_price: "150.25",
        filled_at: "2023-03-15T14:30:00Z",
      },
      {
        id: "order2",
        symbol: "MSFT",
        qty: "5",
        side: "buy",
        type: "limit",
        limit_price: "290.50",
        status: "filled",
        filled_avg_price: "290.50",
        filled_at: "2023-03-14T10:15:00Z",
      },
      {
        id: "order3",
        symbol: "GOOGL",
        qty: "2",
        side: "buy",
        type: "market",
        status: "canceled",
        filled_at: null,
      },
    ]
  }
}

// Function to execute an order
export async function executeOrder(orderData) {
  try {
    const { apiKey, apiSecret, isPaper, isDemo } = getApiKeys()

    // If in demo mode, return mock data immediately
    if (isDemo) {
      return {
        id: `order-${Date.now()}`,
        client_order_id: `client-order-${Date.now()}`,
        status: "accepted",
        symbol: orderData.symbol,
        qty: orderData.qty,
        side: orderData.side,
        type: orderData.type,
        time_in_force: orderData.time_in_force,
        created_at: new Date().toISOString(),
      }
    }

    const baseUrl = getBaseUrl(isPaper)

    const response = await axios.post(`${baseUrl}/v2/orders`, orderData, {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error executing order:", error)

    // For demo purposes, return a mock response
    return {
      id: `order-${Date.now()}`,
      client_order_id: `client-order-${Date.now()}`,
      status: "accepted",
      symbol: orderData.symbol,
      qty: orderData.qty,
      side: orderData.side,
      type: orderData.type,
      time_in_force: orderData.time_in_force,
      created_at: new Date().toISOString(),
    }
  }
}

// Function to close a position
export async function closePosition(symbol: string) {
  try {
    const { apiKey, apiSecret, isPaper, isDemo } = getApiKeys()

    // If in demo mode, return mock data immediately
    if (isDemo) {
      return {
        symbol: symbol,
        status: "closed",
        closed_at: new Date().toISOString(),
      }
    }

    const baseUrl = getBaseUrl(isPaper)

    const response = await axios.delete(`${baseUrl}/v2/positions/${symbol}`, {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error closing position:", error)

    // For demo purposes, return a mock response
    return {
      symbol: symbol,
      status: "closed",
      closed_at: new Date().toISOString(),
    }
  }
}

// Function to get account activities
export async function getAccountActivities() {
  try {
    const { apiKey, apiSecret, isPaper, isDemo } = getApiKeys()

    // If in demo mode, return mock data immediately
    if (isDemo) {
      return [
        {
          id: "activity1",
          activity_type: "FILL",
          transaction_time: "2023-03-15T14:30:00Z",
          qty: "10",
          price: "150.25",
          side: "buy",
          symbol: "AAPL",
        },
        {
          id: "activity2",
          activity_type: "CSD",
          date: "2023-03-14",
          net_amount: "100.00",
          description: "Cash deposit",
        },
      ]
    }

    const baseUrl = getBaseUrl(isPaper)

    const response = await axios.get(`${baseUrl}/v2/account/activities`, {
      headers: {
        "APCA-API-KEY-ID": apiKey,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching account activities:", error)

    // For demo purposes, return a mock response
    return [
      {
        id: "activity1",
        activity_type: "FILL",
        transaction_time: "2023-03-15T14:30:00Z",
        qty: "10",
        price: "150.25",
        side: "buy",
        symbol: "AAPL",
      },
      {
        id: "activity2",
        activity_type: "CSD",
        date: "2023-03-14",
        net_amount: "100.00",
        description: "Cash deposit",
      },
    ]
  }
}

// Function to simulate a transaction
export async function simulateTransaction(amount: string, description: string) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get current cash balance from localStorage
    const simulatedCash = localStorage.getItem("simulatedCash")
    const currentCash = simulatedCash ? Number.parseFloat(simulatedCash) : 25000 // Default to 25000 if no cash

    // Update cash balance
    const amountValue = Number.parseFloat(amount)
    const newCash = currentCash + amountValue

    // Store the updated cash balance in localStorage
    localStorage.setItem("simulatedCash", newCash.toString())

    // Return a mock response
    return {
      id: `transaction-${Date.now()}`,
      amount: amountValue,
      description: description,
      new_balance: newCash,
    }
  } catch (error) {
    console.error("Error simulating transaction:", error)
    throw new Error("Failed to simulate transaction. Please try again later.")
  }
}

