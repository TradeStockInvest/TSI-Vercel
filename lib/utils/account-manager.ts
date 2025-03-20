// Account management utility functions

/**
 * Resets all trading data for a fresh start
 */
export function resetAllTradingData() {
  // Clear all positions and trading history
  localStorage.removeItem("positions")
  localStorage.removeItem("orders")
  localStorage.removeItem("tradeHistory")
  localStorage.removeItem("aiPositions")
  localStorage.removeItem("aiTradeHistory")
  localStorage.removeItem("hasActiveAITrades")
  localStorage.removeItem("continuousAIEnabled")

  // Don't clear user login status or account balances
}

/**
 * Initializes a new user account with $100,000
 * @param email User's email address
 */
export function initializeUserAccount(email: string) {
  // Check if this user has a balance already
  const existingBalance = localStorage.getItem(`balance_${email}`)
  if (!existingBalance) {
    // Initialize with $100,000 if this is a new user
    localStorage.setItem(`balance_${email}`, "100000")
    localStorage.setItem("simulatedCash", "100000")
    localStorage.setItem("accountCash", "100000")
    localStorage.setItem("accountBuyingPower", "100000")
    localStorage.setItem("accountEquity", "100000")
    return true
  } else {
    // Use existing balance for returning users
    localStorage.setItem("simulatedCash", existingBalance)
    localStorage.setItem("accountCash", existingBalance)
    localStorage.setItem("accountBuyingPower", existingBalance)
    localStorage.setItem("accountEquity", existingBalance)
    return false
  }
}

/**
 * Adds funds to a user's account
 * @param email User's email address
 * @param amount Amount to add
 */
export function addFundsToAccount(email: string, amount: number) {
  const currentBalance = Number.parseFloat(localStorage.getItem(`balance_${email}`) || "0")
  const newBalance = currentBalance + amount

  localStorage.setItem(`balance_${email}`, newBalance.toString())
  localStorage.setItem("simulatedCash", newBalance.toString())
  localStorage.setItem("accountCash", newBalance.toString())
  localStorage.setItem("accountBuyingPower", newBalance.toString())
  localStorage.setItem("accountEquity", newBalance.toString())

  return newBalance
}

