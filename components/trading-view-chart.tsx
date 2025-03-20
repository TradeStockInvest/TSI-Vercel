"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react"

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewChartProps {
  symbol?: string
  showAIPredictions?: boolean
}

export function TradingViewChart({ symbol = "NASDAQ:AAPL", showAIPredictions = false }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const chartRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartError, setChartError] = useState<string | null>(null)

  useEffect(() => {
    // Load TradingView script
    setIsLoading(true)
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      initChart(symbol)
      setIsLoading(false)
    }
    script.onerror = () => {
      setChartError("Failed to load TradingView chart. Please try again later.")
      setIsLoading(false)
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [symbol])

  useEffect(() => {
    // Reinitialize chart when theme changes
    if (window.TradingView) {
      initChart(symbol)
    }
  }, [theme, symbol])

  const initChart = (chartSymbol: string) => {
    if (!containerRef.current || !window.TradingView) return

    // Clear previous chart if any
    containerRef.current.innerHTML = ""

    // Format symbol for TradingView
    let formattedSymbol = chartSymbol

    // Add exchange prefix if not present
    if (!formattedSymbol.includes(":")) {
      if (formattedSymbol.includes("-USD")) {
        formattedSymbol = `COINBASE:${formattedSymbol.replace("-USD", "USD")}`
      } else if (formattedSymbol.includes("-")) {
        formattedSymbol = `FX:${formattedSymbol.replace("-", "")}`
      } else if (["UKOIL", "USOIL", "NGAS"].includes(formattedSymbol)) {
        formattedSymbol = `TVC:${formattedSymbol}`
      } else if (["XAUUSD", "XAGUSD", "XPTUSD", "XPDUSD"].includes(formattedSymbol)) {
        formattedSymbol = `OANDA:${formattedSymbol}`
      } else {
        formattedSymbol = `NASDAQ:${formattedSymbol}`
      }
    }

    // Determine TradingView theme based on stored user preference or current theme
    const savedTheme = localStorage.getItem("theme") || "dark"
    const tvTheme = theme === "dark" || savedTheme === "dark" ? "dark" : "light"

    // Create the chart widget with onChartReady as a property, not a method call
    chartRef.current = new window.TradingView.widget({
      width: "100%",
      height: 500,
      symbol: formattedSymbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: tvTheme,
      style: "1",
      locale: "en",
      toolbar_bg: tvTheme === "dark" ? "#2b2b2b" : "#f1f3f6",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tv_chart_container",
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
      disabled_features: ["use_localstorage_for_settings"],
      drawings_access: { type: "all", tools: [{ name: "Trend Line" }] },
      overrides: {
        "mainSeriesProperties.showCountdown": true,
        "paneProperties.background": tvTheme === "dark" ? "#1e1e2d" : "#ffffff",
        "paneProperties.vertGridProperties.color": tvTheme === "dark" ? "#2a2a3c" : "#f0f3fa",
        "paneProperties.horzGridProperties.color": tvTheme === "dark" ? "#2a2a3c" : "#f0f3fa",
      },
      loading_screen: { backgroundColor: tvTheme === "dark" ? "#1e1e2d" : "#ffffff" },
      custom_css_url: "https://yourwebsite.com/tradingview-custom.css", // You would need to create this CSS file
      charts_storage_api_version: "1.1",
      client_id: "tradestockinvest",
      user_id: "user1",
      // Add the onChartReady callback as a property
      onChartReady: () => {
        console.log("Chart is ready")

        // Only add AI prediction overlay if showAIPredictions is true
        if (showAIPredictions && containerRef.current) {
          // Create overlay container
          const overlayContainer = document.createElement("div")
          overlayContainer.style.position = "absolute"
          overlayContainer.style.top = "80px"
          overlayContainer.style.left = "50px"
          overlayContainer.style.zIndex = "5"
          overlayContainer.style.pointerEvents = "none"

          // Create buy zone
          const buyZone = document.createElement("div")
          buyZone.style.background = "rgba(34, 197, 94, 0.2)"
          buyZone.style.border = "1px solid #22c55e"
          buyZone.style.padding = "5px"
          buyZone.style.borderRadius = "4px"
          buyZone.style.marginBottom = "5px"
          buyZone.innerHTML = '<span style="color: #22c55e; font-weight: bold;">AI BUY ZONE</span>'

          // Create sell zone
          const sellZone = document.createElement("div")
          sellZone.style.background = "rgba(239, 68, 68, 0.2)"
          sellZone.style.border = "1px solid #ef4444"
          sellZone.style.padding = "5px"
          sellZone.style.borderRadius = "4px"
          sellZone.style.marginBottom = "5px"
          sellZone.innerHTML = '<span style="color: #ef4444; font-weight: bold;">AI SELL ZONE</span>'

          // Add elements to the overlay
          overlayContainer.appendChild(buyZone)
          overlayContainer.appendChild(sellZone)

          // Add the overlay to the chart container
          containerRef.current.appendChild(overlayContainer)
        }
      },
    })
  }

  return (
    <div className="chart-container relative">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full bg-card rounded-lg border">
          <Skeleton className="h-[400px] w-[90%] rounded-lg" />
          <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        </div>
      ) : chartError ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full bg-card rounded-lg border">
          <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">{chartError}</p>
          <p className="text-sm text-muted-foreground mt-2">Please check your internet connection and try again.</p>
        </div>
      ) : (
        <>
          <div id="tv_chart_container" ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />

          {/* Custom AI prediction overlay - only show if showAIPredictions is true */}
          {showAIPredictions && (
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm z-10">
              <h4 className="text-xs font-medium mb-2">AI Predictions</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                    <TrendingUp className="h-3 w-3" /> Buy Signal
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 gap-1">
                    <TrendingDown className="h-3 w-3" /> Sell Signal
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
                    <BarChart2 className="h-3 w-3" /> Trend Prediction
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

