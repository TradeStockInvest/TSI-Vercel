"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define subscription plan types
export type SubscriptionPlan = "FREE" | "PRO"

// Define the context shape
interface SubscriptionContextType {
  currentPlan: SubscriptionPlan
  isPro: boolean
  isLoading: boolean
  checkFeatureAccess: (feature: ProFeature) => boolean
}

// Define PRO features
export type ProFeature =
  | "ai_trading"
  | "advanced_analytics"
  | "multi_timeframe"
  | "scalping_mode"
  | "historical_analysis"
  | "continuous_operation"
  | "favorites"

// Create the context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  currentPlan: "FREE",
  isPro: false,
  isLoading: true,
  checkFeatureAccess: () => false,
})

// Hook for using the subscription context
export const useSubscription = () => useContext(SubscriptionContext)

// Provider component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("FREE")
  const [isLoading, setIsLoading] = useState(true)

  // Feature access map - which features are available on which plans
  const featureAccessMap: Record<ProFeature, SubscriptionPlan[]> = {
    ai_trading: ["PRO"],
    advanced_analytics: ["PRO"],
    multi_timeframe: ["PRO"],
    scalping_mode: ["PRO"],
    historical_analysis: ["PRO"],
    continuous_operation: ["PRO"],
    favorites: ["PRO"],
  }

  // Check if a specific feature is accessible with the current plan
  const checkFeatureAccess = (feature: ProFeature): boolean => {
    return featureAccessMap[feature]?.includes(currentPlan) || false
  }

  // Fetch user subscription on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // In a real app, this would be an API call to get the user's subscription
        // For now, we'll simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock response - in production, this would come from your backend
        // You could also store this in localStorage or a cookie
        const userPlan: SubscriptionPlan = "FREE" // Default to FREE for now

        setCurrentPlan(userPlan)
      } catch (error) {
        console.error("Failed to fetch subscription plan:", error)
        // Default to FREE plan on error for security
        setCurrentPlan("FREE")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        isPro: currentPlan === "PRO",
        isLoading,
        checkFeatureAccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

