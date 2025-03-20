"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

interface SubscriptionParams {
  plan: string
  interval: "monthly" | "yearly"
}

interface SubscriptionResult {
  success: boolean
  message: string
  redirectUrl?: string
}

/**
 * Gets the current user's subscription plan
 * @returns The user's current plan
 */
export async function getUserPlan(): Promise<string> {
  const session = await auth()

  // Check if user is authenticated
  if (!session || !session.user) {
    return "free" // Default to free plan if not authenticated
  }

  // Return the user's subscription plan from the session
  return session.user.plan || "free" // Default to free plan if not found
}

/**
 * Upgrades a user's subscription plan
 *
 * @param params The subscription parameters
 * @returns A result object with success status and message
 */
export async function upgradeSubscription(params: SubscriptionParams): Promise<SubscriptionResult> {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return {
        success: false,
        message: "You must be logged in to upgrade your subscription",
      }
    }

    // In a real implementation, this would connect to a payment provider
    // like Stripe to handle the subscription upgrade

    // For demo purposes, we'll simulate a successful upgrade
    console.log(`Upgrading user ${session.user.id} to ${params.plan} plan (${params.interval})`)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would update the user's subscription in the database

    // Revalidate relevant paths to reflect the subscription change
    revalidatePath("/dashboard")
    revalidatePath("/settings/subscription")

    return {
      success: true,
      message: `Successfully upgraded to the ${params.plan.charAt(0).toUpperCase() + params.plan.slice(1)} plan!`,
      redirectUrl: "/dashboard",
    }
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return {
      success: false,
      message: "Failed to upgrade subscription. Please try again later.",
    }
  }
}

