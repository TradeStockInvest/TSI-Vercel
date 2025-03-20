// Function to check if the market is open
export function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // Market is closed on weekends (0 = Sunday, 6 = Saturday)
  if (day === 0 || day === 6) {
    return false
  }

  // Convert to Eastern Time (ET) - this is a simplified approach
  // In production, use a proper timezone library
  const etHours = (hours + 24 - 5) % 24 // Assuming UTC-5 for ET

  // Regular market hours: 9:30 AM - 4:00 PM ET
  if (etHours < 9 || etHours > 16) {
    return false
  }

  if (etHours === 9 && minutes < 30) {
    return false
  }

  return true
}

// Function to check if a specific symbol's market is open
export function isSymbolMarketOpen(symbol: string): boolean {
  // Basic implementation - in production, you would have more sophisticated logic
  // for different markets (e.g., crypto markets are 24/7)

  // Check if it's a crypto symbol (simplified check)
  if (symbol.endsWith("USD") || symbol.endsWith("USDT") || symbol.includes("BTC") || symbol.includes("ETH")) {
    return true // Crypto markets are always open
  }

  // For stocks, check regular market hours
  return isMarketOpen()
}

