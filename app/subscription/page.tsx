import type { Metadata } from "next"
import { getUserPlan } from "../actions/subscription"
import SubscriptionPlans from "@/components/subscription-plans"

export const metadata: Metadata = {
  title: "Subscription Plans | TradeStockInvest",
  description: "Choose the right subscription plan for your trading needs",
}

export default async function SubscriptionPage() {
  const currentPlan = await getUserPlan()

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="mt-2 text-muted-foreground">Choose the right plan for your trading needs</p>
      </div>

      <SubscriptionPlans currentPlan={currentPlan} />
    </div>
  )
}

