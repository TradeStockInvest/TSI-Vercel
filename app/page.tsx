"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardContent } from "@/components/dashboard-content"
import { LoginForm } from "@/components/login-form"
import { ChatAssistant } from "@/components/chat-assistant"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showExitPrompt, setShowExitPrompt] = useState(false)

  // Reset all trading data for a fresh start
  useEffect(() => {
    // Clear all positions and trading history
    localStorage.removeItem("positions")
    localStorage.removeItem("orders")
    localStorage.removeItem("tradeHistory")
    localStorage.removeItem("aiPositions")
    localStorage.removeItem("aiTradeHistory")
    localStorage.removeItem("hasActiveAITrades")
    localStorage.removeItem("continuousAIEnabled")

    // Don't clear user login status or account balances
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn =
      localStorage.getItem("userLoggedIn") === "true" || sessionStorage.getItem("userLoggedIn") === "true"

    setIsLoggedIn(userLoggedIn)
    setLoading(false)

    // Add beforeunload event listener to prompt user before closing the page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasActiveAITrades = localStorage.getItem("hasActiveAITrades") === "true"
      const continuousAIEnabled = localStorage.getItem("continuousAIEnabled") === "true"

      if (hasActiveAITrades && !continuousAIEnabled) {
        // Cancel the event
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = ""
        return "You have active AI trades. If you leave, all positions will be closed. Do you want to continue?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Loading TradeStockInvest...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="login-background flex min-h-screen w-full overflow-hidden">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex flex-col items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-18%2014.35.40%20-%20A%20modern%20and%20professional%20logo%20for%20TradeStockInvest%20%28TSI%29.%20The%20design%20features%20a%20black%20background%20with%20a%20sleek%20gold%20stock%20chart%2C%20symbolizing%20market%20.jpg-JHYKp4ZKHc0CIFeNUGzqWaSKQBTbLM.jpeg"
                alt="TradeStockInvest Logo"
                className="w-20 h-20 rounded-full border-4 border-primary/20 shadow-lg"
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight">
                <span className="text-primary">Trade</span>
                <span>Stock</span>
                <span className="text-primary">Invest</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Professional trading platform for serious investors</p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary/20 to-background/90">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-start justify-center p-12">
            <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1">
              Professional Trading Platform
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Make your money <br />
              more profitable
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Advanced trading tools, real-time market data, and AI-powered insights to help you make better investment
              decisions.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm">Real-time market data and advanced charting</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm">AI-powered trading signals and insights</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <ChevronRight className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm">Comprehensive portfolio management tools</p>
              </div>
            </div>
            <Button className="mt-8 gap-2 group" size="lg">
              Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-primary/5 rounded-full"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 50 + 20}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: "scale(0)",
                opacity: 0,
                animation: `bubble-rise infinite linear`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardShell>
        <DashboardContent />
      </DashboardShell>
      <ChatAssistant />
    </>
  )
}

