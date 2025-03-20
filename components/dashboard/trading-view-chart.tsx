"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewChartProps {
  symbol?: string
  interval?: string
  theme?: "light" | "dark"
  autosize?: boolean
  height?: number
}

export function TradingViewChart({
  symbol = "NASDAQ:AAPL",
  interval = "1D",
  theme = "light",
  autosize = true,
  height = 500,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const widgetRef = useRef<any>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Function to load TradingView script
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) {
          scriptLoadedRef.current = true
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/tv.js"
        script.async = true
        script.onload = () => {
          scriptLoadedRef.current = true
          resolve()
        }
        script.onerror = () => {
          reject(new Error("Failed to load TradingView widget"))
        }
        document.head.appendChild(script)
      })
    }

    // Function to create or update the widget
    const createOrUpdateWidget = () => {
      if (!containerRef.current) return

      // If widget already exists, destroy it first
      if (widgetRef.current) {
        try {
          widgetRef.current.remove()
          widgetRef.current = null
        } catch (err) {
          console.error("Error removing TradingView widget:", err)
        }
      }

      try {
        // Create new widget with current props
        widgetRef.current = new window.TradingView.widget({
          container: containerRef.current,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          autosize: autosize,
          height: autosize ? "100%" : height,
          save_image: false,
          studies: ["RSI@tv-basicstudies", "MAExp@tv-basicstudies", "MACD@tv-basicstudies"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_side_toolbar: false,
          withdateranges: true,
          hide_volume: false,
          // Enable real-time updates
          datafeed_provider: "Real-time",
          live: true,
          auto_refresh: true,
          refresh: 1,
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error creating TradingView widget:", err)
        setError("Failed to initialize chart. Please refresh the page.")
        setIsLoading(false)
      }
    }

    // Main initialization function
    const initializeWidget = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (!scriptLoadedRef.current) {
          await loadTradingViewScript()
        }
        createOrUpdateWidget()
      } catch (err) {
        console.error("Error initializing TradingView widget:", err)
        setError("Failed to load chart. Please check your internet connection.")
        setIsLoading(false)
      }
    }

    initializeWidget()

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove()
          widgetRef.current = null
        } catch (err) {
          console.error("Error cleaning up TradingView widget:", err)
        }
      }
    }
  }, [symbol, interval, theme, autosize, height])

  // Handle window resize to ensure the chart resizes properly
  useEffect(() => {
    const handleResize = () => {
      if (widgetRef.current && widgetRef.current.resize) {
        widgetRef.current.resize()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Market Chart</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <Skeleton className="w-full h-[500px] rounded-md" />
        ) : (
          <div ref={containerRef} className="w-full" style={{ height: autosize ? "500px" : `${height}px` }} />
        )}
      </CardContent>
    </Card>
  )
}

