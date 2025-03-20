"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileNav } from "@/components/profile-nav"
import { CheckCircle2, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function BillingContent() {
  const router = useRouter()
  const [subscriptionStatus, setSubscriptionStatus] = useState<"FREE" | "PRO">("FREE")
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null)
  const [cancelDate, setCancelDate] = useState<Date | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"FREE" | "PRO">("PRO")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Simulate fetching subscription status from backend
    setTimeout(() => {
      // Check if user is subscribed (e.g., from localStorage)
      const isSubscribed = localStorage.getItem("isSubscribed") === "true"
      setSubscriptionStatus(isSubscribed ? "PRO" : "FREE")

      // Set next billing date if subscribed
      if (isSubscribed) {
        const subscriptionStartDate = localStorage.getItem("subscriptionStartDate")
        if (subscriptionStartDate) {
          const startDate = new Date(subscriptionStartDate)
          const nextMonth = new Date(startDate)
          nextMonth.setMonth(nextMonth.getMonth() + 1)
          setNextBillingDate(nextMonth)
        } else {
          const startDate = new Date()
          const nextMonth = new Date(startDate)
          nextMonth.setMonth(nextMonth.getMonth() + 1)
          setNextBillingDate(nextMonth)
          localStorage.setItem("subscriptionStartDate", startDate.toISOString())
        }

        // Check if subscription is canceled but still active
        const canceledDate = localStorage.getItem("subscriptionCanceledDate")
        if (canceledDate) {
          setCancelDate(new Date(canceledDate))
        }
      }
    }, 500)
  }, [])

  const handleCancelSubscription = () => {
    setIsCanceling(true)

    // Simulate canceling subscription
    setTimeout(() => {
      // Store cancellation date
      const now = new Date()
      localStorage.setItem("subscriptionCanceledDate", now.toISOString())
      setCancelDate(now)

      // Keep isSubscribed true until billing cycle ends
      setIsCanceling(false)
      alert(
        "Your subscription has been canceled. You will have access to PRO features until the end of your current billing cycle.",
      )
    }, 1500)
  }

  const handleChangePlan = () => {
    setShowPlanDialog(true)
  }

  const handlePlanSelection = () => {
    setIsProcessing(true)

    // Simulate processing plan change
    setTimeout(() => {
      if (selectedPlan === "PRO") {
        // Subscribe to Pro plan
        const startDate = new Date()
        localStorage.setItem("isSubscribed", "true")
        localStorage.setItem("subscriptionStartDate", startDate.toISOString())
        localStorage.removeItem("subscriptionCanceledDate")

        const nextMonth = new Date(startDate)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        setNextBillingDate(nextMonth)
        setSubscriptionStatus("PRO")
        setCancelDate(null)

        alert("You've successfully subscribed to the PRO plan!")
      } else {
        // Switch to Free plan (same as canceling)
        const now = new Date()
        localStorage.setItem("subscriptionCanceledDate", now.toISOString())
        setCancelDate(now)

        if (subscriptionStatus === "FREE") {
          alert("You're already on the FREE plan.")
        } else {
          alert(
            "You've switched to the FREE plan. You will have access to PRO features until the end of your current billing cycle.",
          )
        }
      }

      setIsProcessing(false)
      setShowPlanDialog(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      <ProfileNav />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your current subscription plan and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{subscriptionStatus === "PRO" ? "Pro Plan" : "Free Plan"}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscriptionStatus === "PRO"
                    ? "Advanced trading features and AI assistance"
                    : "Basic trading features"}
                </p>
              </div>
              <Badge variant={subscriptionStatus === "PRO" ? "default" : "secondary"}>{subscriptionStatus}</Badge>
            </div>

            {cancelDate && nextBillingDate && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Subscription Canceled</AlertTitle>
                <AlertDescription>
                  Your PRO subscription has been canceled. You will have access to PRO features until{" "}
                  {nextBillingDate.toLocaleDateString()}.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md bg-muted p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    {subscriptionStatus === "PRO" ? "Unlimited AI trading signals" : "Limited AI trading signals"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Real-time market data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    {subscriptionStatus === "PRO" ? "Advanced charting tools" : "Basic charting tools"}
                  </span>
                </div>
                {subscriptionStatus === "PRO" && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Priority customer support</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-medium">{subscriptionStatus === "PRO" ? "$49.99 / month" : "Free"}</p>
                <p className="text-xs text-muted-foreground">
                  {nextBillingDate ? `Next billing date: ${nextBillingDate.toLocaleDateString()}` : "No billing date"}
                </p>
              </div>
              <Button variant="outline" onClick={handleChangePlan}>
                {subscriptionStatus === "FREE" ? "Upgrade to Pro" : "Change Plan"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {subscriptionStatus === "PRO" && !cancelDate && (
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCanceling}>
                {isCanceling ? "Canceling..." : "Cancel Subscription"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/profile/billing/add-payment-method")}
            >
              Add Payment Method
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <h3 className="text-sm font-medium">Billing History</h3>
            <div className="w-full rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">Pro Plan - Monthly</p>
                  <p className="text-xs text-muted-foreground">March 15, 2025</p>
                </div>
                <p className="text-sm font-medium">$49.99</p>
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <div>
                  <p className="text-sm font-medium">Pro Plan - Monthly</p>
                  <p className="text-xs text-muted-foreground">February 15, 2025</p>
                </div>
                <p className="text-sm font-medium">$49.99</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a Plan</DialogTitle>
            <DialogDescription>Select the plan that best fits your trading needs</DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={selectedPlan}
            onValueChange={(value) => setSelectedPlan(value as "FREE" | "PRO")}
            className="mt-4 space-y-4"
          >
            <div
              className={`flex items-start space-x-3 rounded-md border p-4 ${selectedPlan === "FREE" ? "border-primary" : ""}`}
            >
              <RadioGroupItem value="FREE" id="free-plan" />
              <div className="flex flex-col">
                <Label htmlFor="free-plan" className="font-medium">
                  Free Plan
                </Label>
                <p className="text-sm text-muted-foreground">Basic trading features with limited AI capabilities</p>
                <p className="mt-1 font-medium">$0.00 / month</p>
              </div>
            </div>

            <div
              className={`flex items-start space-x-3 rounded-md border p-4 ${selectedPlan === "PRO" ? "border-primary" : ""}`}
            >
              <RadioGroupItem value="PRO" id="pro-plan" />
              <div className="flex flex-col">
                <Label htmlFor="pro-plan" className="font-medium">
                  Pro Plan
                </Label>
                <p className="text-sm text-muted-foreground">Advanced trading features with unlimited AI assistance</p>
                <p className="mt-1 font-medium">$49.99 / month</p>
                <ul className="mt-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Unlimited AI trading signals
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Advanced charting tools
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Priority customer support
                  </li>
                </ul>
              </div>
            </div>
          </RadioGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePlanSelection} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Confirm Selection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

