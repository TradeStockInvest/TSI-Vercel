"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { upgradeSubscription } from "@/app/actions/subscription"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionPlansProps {
  currentPlan?: string
}

export default function SubscriptionPlans({ currentPlan = "free" }: SubscriptionPlansProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpgrade = async (plan: string) => {
    if (plan === currentPlan) {
      toast({
        title: "Already subscribed",
        description: `You are already on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`,
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await upgradeSubscription({
        plan,
        interval: isYearly ? "yearly" : "monthly",
      })

      if (result.success) {
        toast({
          title: "Subscription updated",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update subscription",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    {
      name: "Free",
      id: "free",
      description: "Basic trading features for beginners",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: ["Basic market data", "Manual trading", "5 watchlist items", "Basic charts", "Email support"],
      limitations: ["No AI trading", "Limited analytics", "No advanced charts"],
    },
    {
      name: "Pro",
      id: "pro",
      description: "Advanced features for serious traders",
      price: {
        monthly: 29.99,
        yearly: 299.99,
      },
      features: [
        "Everything in Free",
        "AI trading agent",
        "Advanced analytics",
        "Unlimited watchlist",
        "Real-time data",
        "Advanced charts",
        "Priority support",
        "Trading signals",
        "Portfolio optimization",
      ],
      limitations: [],
      popular: true,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2">
          <span className={cn("text-sm", !isYearly && "font-medium text-foreground")}>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={cn("text-sm", isYearly && "font-medium text-foreground")}>
            Yearly <span className="text-primary">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn("relative overflow-hidden transition-all", plan.popular && "border-primary shadow-md")}
          >
            {plan.popular && (
              <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    ${isYearly ? plan.price.yearly.toFixed(2) : plan.price.monthly.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.price.monthly > 0 ? (isYearly ? "/year" : "/month") : "Free forever"}
                  </span>
                </div>
                {isYearly && plan.price.monthly > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Billed annually (${(plan.price.yearly / 12).toFixed(2)}/month)
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">What's included:</Label>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Limitations:</Label>
                    <ul className="space-y-2 text-sm">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  "w-full",
                  plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted-foreground/80 hover:bg-muted-foreground",
                )}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading || plan.id === currentPlan}
              >
                {isLoading ? "Processing..." : plan.id === currentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

