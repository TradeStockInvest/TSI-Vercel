"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface TradingViewChartProps {
  symbol?: string
  interval?: string
  theme?: "light" | "dark"
  autosize?: boolean
  height?: number
  width?: number
  showAIPredictions?: boolean
  container?: string
}

export function TradingViewChart({
  symbol = "AAPL",
  interval = "D",
  theme: propTheme,
  autosize = true,
  height = 500,
  width = 800,
  showAIPredictions = false,
  container = "tradingview_chart",
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme: systemTheme } = useTheme()
  const chartTheme = propTheme || (systemTheme === "dark" ? "dark" : "light")

  // Use a stable ID that doesn't change between renders
  const [uniqueId] = useState(`${container}_${Math.random().toString(36).substring(2, 9)}`)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Function to load TradingView script
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve) => {
        if (document.getElementById("tradingview-widget-script")) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.id = "tradingview-widget-script"
        script.src = "https://s3.tradingview.com/tv.js"
        script.async = true
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    // Function to initialize the chart
    const initializeChart = async () => {
      // Make sure the script is loaded
      await loadTradingViewScript()

      // Wait for the DOM to be fully updated
      setTimeout(() => {
        if (!containerRef.current || !window.TradingView) {
          console.error("Container or TradingView not available")
          return
        }

        try {
          // Clear previous chart if it exists
          if (widgetRef.current) {
            try {
              // Some widgets have a remove method
              if (typeof widgetRef.current.remove === "function") {
                widgetRef.current.remove()
              }
            } catch (e) {
              console.warn("Could not remove previous widget:", e)
            }
            widgetRef.current = null
          }

          if (containerRef.current.innerHTML) {
            containerRef.current.innerHTML = ""
          }

          // Create new TradingView widget
          widgetRef.current = new window.TradingView.widget({
            autosize: autosize,
            symbol: symbol,
            interval: interval,
            container_id: uniqueId,
            library_path: "https://s3.tradingview.com/charting_library/",
            locale: "en",
            timezone: "exchange",
            theme: chartTheme,
            style: "1",
            toolbar_bg: chartTheme === "dark" ? "#1E1E1E" : "#F5F5F5",
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            save_image: false,
            height: height,
            width: width,
            studies: showAIPredictions ? ["RSI", "MACD"] : [],
            disabled_features: ["header_symbol_search", "header_compare"],
            enabled_features: ["use_localstorage_for_settings", "side_toolbar_in_fullscreen_mode"],
            loading_screen: { backgroundColor: chartTheme === "dark" ? "#1E1E1E" : "#FFFFFF" },
            debug: false,
          })

          setIsLoaded(true)
        } catch (error) {
          console.error("Error initializing TradingView chart:", error)
          setIsLoaded(false)
        }
      }, 100) // Small delay to ensure DOM is ready
    }

    // Initialize the chart
    if (containerRef.current) {
      initializeChart()
    }

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        try {
          // Some widgets have a remove method
          if (typeof widgetRef.current.remove === "function") {
            widgetRef.current.remove()
          }
        } catch (e) {
          console.warn("Could not remove widget on cleanup:", e)
        }
        widgetRef.current = null
      }

      // Clean up container
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol, interval, chartTheme, height, width, showAIPredictions, uniqueId])

  return (
    <div className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      <div id={uniqueId} ref={containerRef} className="w-full h-full" />
    </div>
  )
}

// Add TradingView types
declare global {
  interface Window {
    TradingView: {
      widget: any
    }
  }
}

