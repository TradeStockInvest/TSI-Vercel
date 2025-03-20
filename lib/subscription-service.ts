import { db } from "@/lib/db"
import { sendEmail } from "@/lib/email-service"
import { formatCurrency } from "@/lib/utils"

export type SubscriptionPlan = "free" | "pro"

export interface SubscriptionDetails {
  plan: SubscriptionPlan
  startDate: Date
  endDate: Date
  autoRenew: boolean
  price: number
  interval: "monthly" | "yearly"
  paymentMethod: string
  lastFour?: string
}

export async function upgradeUserToPro(
  userId: string,
  paymentDetails: {
    paymentMethod: string
    lastFour?: string
    interval: "monthly" | "yearly"
  },
): Promise<boolean> {
  try {
    const now = new Date()
    const endDate = new Date()

    // Set end date based on subscription interval
    if (paymentDetails.interval === "monthly") {
      endDate.setMonth(now.getMonth() + 1)
    } else {
      endDate.setFullYear(now.getFullYear() + 1)
    }

    const price = paymentDetails.interval === "monthly" ? 29.99 : 299.99

    // Update user subscription in database
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: "pro",
        subscriptionDetails: {
          plan: "pro",
          startDate: now,
          endDate: endDate,
          autoRenew: true,
          price: price,
          interval: paymentDetails.interval,
          paymentMethod: paymentDetails.paymentMethod,
          lastFour: paymentDetails.lastFour,
        },
      },
    })

    // Generate and send receipt
    await sendSubscriptionReceipt(userId, {
      plan: "pro",
      startDate: now,
      endDate: endDate,
      autoRenew: true,
      price: price,
      interval: paymentDetails.interval,
      paymentMethod: paymentDetails.paymentMethod,
      lastFour: paymentDetails.lastFour,
    })

    // Update local storage to reflect pro status immediately
    if (typeof window !== "undefined") {
      localStorage.setItem("userPlan", "pro")
    }

    return true
  } catch (error) {
    console.error("Failed to upgrade user to Pro plan:", error)
    return false
  }
}

export async function sendSubscriptionReceipt(userId: string, subscriptionDetails: SubscriptionDetails): Promise<void> {
  try {
    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })

    if (!user || !user.email) {
      throw new Error("User email not found")
    }

    const receiptNumber = `TSI-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Create receipt HTML
    const receiptHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">TradeStockInvest</h1>
          <p style="font-size: 18px; color: #666;">Subscription Receipt</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p><strong>Receipt #:</strong> ${receiptNumber}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Customer:</strong> ${user.name || user.email}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        </div>
        
        <div style="margin-bottom: 20px; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; padding: 10px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px;">Description</th>
              <th style="text-align: right; padding: 8px;">Amount</th>
            </tr>
            <tr>
              <td style="padding: 8px; border-top: 1px solid #e0e0e0;">
                TradeStockInvest Pro Plan (${subscriptionDetails.interval})
                <br>
                <span style="color: #666; font-size: 14px;">
                  Subscription period: ${new Date(subscriptionDetails.startDate).toLocaleDateString()} to 
                  ${new Date(subscriptionDetails.endDate).toLocaleDateString()}
                </span>
              </td>
              <td style="padding: 8px; border-top: 1px solid #e0e0e0; text-align: right;">
                ${formatCurrency(subscriptionDetails.price)}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">
                ${formatCurrency(subscriptionDetails.price)}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p><strong>Payment Method:</strong> ${subscriptionDetails.paymentMethod} ${
            subscriptionDetails.lastFour ? `ending in ${subscriptionDetails.lastFour}` : ""
          }</p>
          <p><strong>Auto-Renewal:</strong> ${subscriptionDetails.autoRenew ? "Enabled" : "Disabled"}</p>
        </div>
        
        <div style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
          <p>Thank you for subscribing to TradeStockInvest Pro!</p>
          <p>If you have any questions, please contact our support team at support@tradestockinvest.com</p>
        </div>
      </div>
    `

    // Send email with receipt
    await sendEmail({
      to: user.email,
      subject: "Your TradeStockInvest Pro Subscription Receipt",
      html: receiptHtml,
    })

    // Store receipt in database for future reference
    await db.receipt.create({
      data: {
        userId,
        receiptNumber,
        amount: subscriptionDetails.price,
        description: `TradeStockInvest Pro Plan (${subscriptionDetails.interval})`,
        date: new Date(),
        paymentMethod: subscriptionDetails.paymentMethod,
        lastFour: subscriptionDetails.lastFour,
      },
    })
  } catch (error) {
    console.error("Failed to send subscription receipt:", error)
    throw error
  }
}

// Function to check if a user has pro access
export async function hasProAccess(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionDetails: true,
      },
    })

    if (!user) return false

    // If user is on free plan, they don't have pro access
    if (user.subscriptionPlan === "free") return false

    // Check if subscription is still valid
    if (user.subscriptionDetails) {
      const details = user.subscriptionDetails as unknown as SubscriptionDetails
      const now = new Date()
      const endDate = new Date(details.endDate)

      // If subscription has expired and auto-renew is off, they don't have pro access
      if (now > endDate && !details.autoRenew) {
        // Downgrade user to free plan
        await db.user.update({
          where: { id: userId },
          data: { subscriptionPlan: "free" },
        })
        return false
      }
    }

    return user.subscriptionPlan === "pro"
  } catch (error) {
    console.error("Error checking pro access:", error)
    return false
  }
}

// Function to handle subscription renewal
export async function renewSubscription(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionDetails: true,
        email: true,
      },
    })

    if (!user || !user.subscriptionDetails) return false

    const details = user.subscriptionDetails as unknown as SubscriptionDetails

    // Only renew if auto-renew is enabled
    if (!details.autoRenew) return false

    const newStartDate = new Date(details.endDate)
    const newEndDate = new Date(details.endDate)

    if (details.interval === "monthly") {
      newEndDate.setMonth(newEndDate.getMonth() + 1)
    } else {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1)
    }

    // Update subscription details
    const updatedDetails: SubscriptionDetails = {
      ...details,
      startDate: newStartDate,
      endDate: newEndDate,
    }

    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionDetails: updatedDetails,
      },
    })

    // Send renewal receipt
    await sendSubscriptionReceipt(userId, updatedDetails)

    return true
  } catch (error) {
    console.error("Failed to renew subscription:", error)
    return false
  }
}

