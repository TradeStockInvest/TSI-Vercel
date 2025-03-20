"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TradingViewChart } from "@/components/trading-view-chart"
import { OrderPanel } from "@/components/order-panel"
import { PositionsTable } from "@/components/positions-table"
import { OrdersTable } from "@/components/orders-table"
import { AccountSummary } from "@/components/account-summary"
import { MarketNews } from "@/components/market-news"
import { Button } from "@/components/ui/button"
import { AlertCircle, Search, Sparkles, TrendingUp, ChevronRight, Clock, BarChart2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import your API modules
import { getAccountInfo } from "@/lib/api/tradelockers"
import { analyzeText } from "@/lib/api/openai"

export function DashboardContent() {
  const [accountInfo, setAccountInfo] = useState({
    account_number: "Loading...",
    buying_power: "$0.00",
    cash: "$0.00",
    equity: "$0.00",
    pnl: "+$0.00",
    pnl_percent: "+0.00%",
  })
  const [loading, setLoading] = useState(true)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [symbolSearch, setSymbolSearch] = useState("")
  const [marketInstruments, setMarketInstruments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("positions")
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [aiInsight, setAiInsight] = useState("")

  // Available symbols by asset class
  const availableSymbols = {
    stocks: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "WMT"],
    crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "ADA-USD", "DOT-USD", "AVAX-USD", "MATIC-USD"],
    forex: ["EUR-USD", "GBP-USD", "USD-JPY", "AUD-USD", "USD-CAD", "NZD-USD", "USD-CHF"],
    indices: ["SPX", "NDX", "DJI", "RUT", "VIX", "FTSE", "DAX"],
    commodities: ["UKOIL", "USOIL", "NGAS", "XAUUSD", "XAGUSD", "XPTUSD", "XPDUSD"],
  }

  // Initialize market instruments
  useEffect(() => {
    const instruments = []

    Object.entries(availableSymbols).forEach(([assetClass, symbols]) => {
      symbols.forEach((symbol) => {
        // Generate realistic market data
        const basePrice =
          assetClass === "crypto"
            ? Math.random() * 50000 + 100
            : assetClass === "forex"
              ? Math.random() * 2 + 0.5
              : assetClass === "commodities" && symbol.includes("XAU")
                ? Math.random() * 1000 + 1500
                : Math.random() * 200 + 50

        const bid = Number.parseFloat(basePrice.toFixed(2))
        const spread = Number.parseFloat((Math.random() * 0.01 * basePrice).toFixed(2))
        const ask = Number.parseFloat((bid + spread).toFixed(2))
        const dayHigh = Number.parseFloat((ask + Math.random() * 0.05 * ask).toFixed(2))
        const dayLow = Number.parseFloat((bid - Math.random() * 0.05 * bid).toFixed(2))

        // Determine if market is open based on asset class and time
        const now = new Date()
        const hour = now.getUTCHours()
        const day = now.getUTCDay()

        // Crypto markets are always open
        // Stock markets are open 9:30-16:00 EST (14:30-21:00 UTC) Monday-Friday
        // Forex markets are open 24/5 (closed weekends)
        let isOpen = true

        if (assetClass === "stocks" || assetClass === "indices") {
          isOpen = day >= 1 && day <= 5 && hour >= 14 && hour < 21
        } else if (assetClass === "forex" || assetClass === "commodities") {
          isOpen = day >= 1 && day <= 5
        }

        // Add a trend indicator (up, down, or neutral)
        const trendValue = Math.random()
        const trend = trendValue > 0.6 ? "up" : trendValue < 0.4 ? "down" : "neutral"

        instruments.push({
          symbol,
          name: getInstrumentName(symbol, assetClass),
          assetClass,
          bid,
          ask,
          spread,
          dayHigh,
          dayLow,
          isOpen,
          trend,
          lastUpdated: new Date().toISOString(),
        })
      })
    })

    setMarketInstruments(instruments)
  }, [])

  // Get instrument name
  const getInstrumentName = (symbol: string, assetClass: string) => {
    const names: Record<string, string> = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corporation",
      GOOGL: "Alphabet Inc.",
      AMZN: "Amazon.com Inc.",
      TSLA: "Tesla Inc.",
      META: "Meta Platforms Inc.",
      NVDA: "NVIDIA Corporation",
      JPM: "JPMorgan Chase & Co.",
      V: "Visa Inc.",
      WMT: "Walmart Inc.",
      "BTC-USD": "Bitcoin",
      "ETH-USD": "Ethereum",
      "SOL-USD": "Solana",
      "ADA-USD": "Cardano",
      "DOT-USD": "Polkadot",
      "AVAX-USD": "Avalanche",
      "MATIC-USD": "Polygon",
      "EUR-USD": "Euro vs US Dollar",
      "GBP-USD": "British Pound vs US Dollar",
      "USD-JPY": "US Dollar vs Japanese Yen",
      "AUD-USD": "Australian Dollar vs US Dollar",
      "USD-CAD": "US Dollar vs Canadian Dollar",
      "NZD-USD": "New Zealand Dollar vs US Dollar",
      "USD-CHF": "US Dollar vs Swiss Franc",
      SPX: "S&P 500 Index",
      NDX: "Nasdaq 100 Index",
      DJI: "Dow Jones Industrial Average",
      RUT: "Russell 2000 Index",
      VIX: "CBOE Volatility Index",
      FTSE: "FTSE 100 Index",
      DAX: "DAX 40 Index",
      UKOIL: "Brent Crude Oil",
      USOIL: "US Light Sweet Oil",
      NGAS: "Natural Gas",
      XAUUSD: "Gold vs US Dollar",
      XAGUSD: "Silver vs US Dollar",
      XPTUSD: "Platinum vs US Dollar",
      XPDUSD: "Palladium vs US Dollar",
    }

    return names[symbol] || `${symbol} (${assetClass})`
  }

  // Fetch account info from Alpaca API
  useEffect(() => {
    async function fetchAccountInfo() {
      try {
        const account = await getAccountInfo()

        // Check if we have updated values in localStorage (from wallet transactions)
        const storedCash = localStorage.getItem("accountCash")
        const storedBuyingPower = localStorage.getItem("accountBuyingPower")
        const storedEquity = localStorage.getItem("accountEquity")

        // Use stored values if available, otherwise use API values
        const cash = storedCash ? storedCash : account.cash
        const buyingPower = storedBuyingPower ? storedBuyingPower : account.buying_power
        const equity = storedEquity ? storedEquity : account.equity

        setAccountInfo({
          account_number: account.account_number || "DEMO123456",
          buying_power: `$${Number.parseFloat(buyingPower).toFixed(2)}`,
          cash: `$${Number.parseFloat(cash).toFixed(2)}`,
          equity: `$${Number.parseFloat(equity).toFixed(2)}`,
          // Calculate P/L if available, otherwise use placeholder
          pnl:
            equity > account.last_equity
              ? `+$${(equity - account.last_equity).toFixed(2)}`
              : `-$${Math.abs(equity - account.last_equity).toFixed(2)}`,
          pnl_percent:
            account.last_equity > 0
              ? `${(((equity - account.last_equity) / account.last_equity) * 100).toFixed(2)}%`
              : "+0.00%",
        })
      } catch (error) {
        console.error("Error fetching account info:", error)
        // Use placeholder data if API fails
        setAccountInfo({
          account_number: "ERROR",
          buying_power: "$0.00",
          cash: "$0.00",
          equity: "$0.00",
          pnl: "+$0.00",
          pnl_percent: "+0.00%",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAccountInfo()
  }, [])

  // Function to trigger AI analysis
  const handleAIAnalysis = async () => {
    try {
      setAiAnalysisLoading(true)
      setAiError(null)
      setShowAIInsights(true)

      const analysis = await analyzeText(
        `Provide a brief market analysis for ${selectedSymbol} stock. What are the key factors affecting its price today? Keep it under 100 words.`,
      )

      setAiInsight(analysis)
    } catch (error: any) {
      console.error("Error with AI analysis:", error)

      // Set error state to display in the UI
      setAiError(
        error.response?.data?.error?.message || "Unable to generate AI analysis at this time. Please try again later.",
      )
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  // Filter instruments based on search
  const getFilteredInstruments = () => {
    if (!symbolSearch) return marketInstruments.slice(0, 10) // Show first 10 by default

    return marketInstruments.filter(
      (i) =>
        i.symbol.toLowerCase().includes(symbolSearch.toLowerCase()) ||
        i.name.toLowerCase().includes(symbolSearch.toLowerCase()),
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-rose-500 rotate-180" />
      default:
        return <BarChart2 className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Trading Dashboard</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <Clock className="mr-1 h-3 w-3" /> Market Open
            </Badge>
            <Badge
              variant="outline"
              className="bg-secondary/10 text-secondary-foreground border-secondary/20 px-3 py-1"
            >
              <Sparkles className="mr-1 h-3 w-3" /> Pro Features
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">Monitor your portfolio and execute trades with real-time market data</p>
      </div>

      {aiError && (
        <Alert variant="destructive" className="animate-fadeIn">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Analysis Error</AlertTitle>
          <AlertDescription>{aiError}</AlertDescription>
        </Alert>
      )}

      <div className="dashboard-grid animate-slideUp">
        <AccountSummary accountInfo={accountInfo} loading={loading} />
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-xl border shadow-sm bg-card">
        <ResizablePanel defaultSize={66} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{selectedSymbol}</h2>
                <Badge variant="outline" className="text-xs font-normal">
                  {getInstrumentName(selectedSymbol, "stocks")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                        onClick={handleAIAnalysis}
                        disabled={aiAnalysisLoading}
                      >
                        {aiAnalysisLoading ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            AI Insights
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get AI-powered market analysis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <TradingViewChart symbol={selectedSymbol} showAIPredictions={false} />

              {showAIInsights && (
                <div className="absolute bottom-4 right-4 w-72 animate-fadeIn rounded-lg border bg-card p-4 shadow-lg">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-medium">AI Market Insights</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAIInsights(false)}>
                      ×
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{aiInsight || "Loading insights..."}</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-muted" />

        <ResizablePanel defaultSize={34} minSize={25}>
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Trading</h2>
                <div className="relative w-full max-w-[200px]">
                  <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search symbols..."
                    className="pl-8 h-9 text-xs rounded-lg"
                    value={symbolSearch}
                    onChange={(e) => setSymbolSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg border max-h-[150px] overflow-y-auto mb-3">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="p-2">Symbol</TableHead>
                      <TableHead className="p-2">Bid/Ask</TableHead>
                      <TableHead className="p-2">Trend</TableHead>
                      <TableHead className="p-2">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredInstruments().map((instrument) => (
                      <TableRow
                        key={instrument.symbol}
                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedSymbol === instrument.symbol ? "bg-primary/10" : ""}`}
                        onClick={() => setSelectedSymbol(instrument.symbol)}
                      >
                        <TableCell className="font-medium p-2">{instrument.symbol}</TableCell>
                        <TableCell className="p-2">
                          <div className="flex flex-col">
                            <span>${instrument.bid.toFixed(2)}</span>
                            <span className="text-[10px] text-muted-foreground">${instrument.ask.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">{getTrendIcon(instrument.trend)}</TableCell>
                        <TableCell className="p-2">
                          <Badge
                            variant={instrument.isOpen ? "default" : "secondary"}
                            className="text-[10px] px-1 py-0"
                          >
                            {instrument.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <OrderPanel balance={accountInfo.cash} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fadeIn">
        <TabsList className="grid w-full grid-cols-3 rounded-lg">
          <TabsTrigger value="positions" className="rounded-lg">
            Positions
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-lg">
            Order History
          </TabsTrigger>
          <TabsTrigger value="news" className="rounded-lg">
            Market News
          </TabsTrigger>
        </TabsList>
        <TabsContent value="positions">
          <Card className="border shadow-sm">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Open Positions</CardTitle>
                  <CardDescription>View and manage your current market positions</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PositionsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card className="border shadow-sm">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your recent order history and status</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <OrdersTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="news">
          <Card className="border shadow-sm">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Market News</CardTitle>
                  <CardDescription>Latest financial news and market updates</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MarketNews />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

