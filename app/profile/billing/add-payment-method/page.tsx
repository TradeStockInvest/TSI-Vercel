"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileNav } from "@/components/profile-nav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CreditCard, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddPaymentMethodPage() {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`
    }

    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      setError("Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid 16-digit card number")
      setIsSubmitting(false)
      return
    }

    if (expiryDate.length !== 5) {
      setError("Please enter a valid expiry date (MM/YY)")
      setIsSubmitting(false)
      return
    }

    if (cvc.length < 3) {
      setError("Please enter a valid CVC code")
      setIsSubmitting(false)
      return
    }

    try {
      // In a real app, this is where you would integrate with Stripe
      // For example:
      // 1. Create a payment method with Stripe.js
      // 2. Send the payment method ID to your server
      // 3. Attach the payment method to the customer

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setIsSuccess(true)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/profile/billing")
      }, 2000)
    } catch (err) {
      setError("An error occurred while processing your payment method. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Add Payment Method</h1>
          <p className="text-muted-foreground">Add a new payment method to your account</p>
        </div>

        <ProfileNav />

        {isSuccess ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Payment Method Added</h2>
              <p className="mt-2 text-center text-muted-foreground">
                Your payment method has been successfully added to your account.
              </p>
              <Button className="mt-6" onClick={() => router.push("/profile/billing")}>
                Return to Billing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your credit card details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input
                      id="expiry-date"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                      maxLength={4}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Alert variant="outline">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Your payment information is securely processed by Stripe. We do not store your full card details on
                    our servers.
                  </AlertDescription>
                </Alert>
              </form>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={() => router.push("/profile/billing")}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Add Payment Method"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

