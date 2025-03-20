"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, ShieldAlert, Eye, EyeOff } from "lucide-react"
import { ProfileNav } from "@/components/profile-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ApiKeysContent() {
  const [activeTab, setActiveTab] = useState("tradelocker")

  // TradeLocker API keys
  const [tradelockerApiKey, setTradeLockerApiKey] = useState("")
  const [tradelockerApiSecret, setTradeLockerApiSecret] = useState("")
  const [showTradeLockerSecret, setShowTradeLockerSecret] = useState(false)

  // Alpaca API keys
  const [alpacaApiKey, setAlpacaApiKey] = useState("")
  const [alpacaApiSecret, setAlpacaApiSecret] = useState("")
  const [showAlpacaSecret, setShowAlpacaSecret] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load API keys if they exist
    const savedTradeLockerApiKey = localStorage.getItem("tradelockerApiKey") || ""
    const savedTradeLockerApiSecret = localStorage.getItem("tradelockerApiSecret") || ""
    const savedAlpacaApiKey = localStorage.getItem("alpacaApiKey") || ""
    const savedAlpacaApiSecret = localStorage.getItem("alpacaApiSecret") || ""

    setTradeLockerApiKey(savedTradeLockerApiKey)
    setTradeLockerApiSecret(savedTradeLockerApiSecret)
    setAlpacaApiKey(savedAlpacaApiKey)
    setAlpacaApiSecret(savedAlpacaApiSecret)
  }, [])

  const handleSaveTradeLockerKeys = () => {
    setLoading(true)

    // Save API keys to localStorage
    localStorage.setItem("tradelockerApiKey", tradelockerApiKey)
    localStorage.setItem("tradelockerApiSecret", tradelockerApiSecret)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert("TradeLocker API keys saved successfully!")
    }, 1000)
  }

  const handleSaveAlpacaKeys = () => {
    setLoading(true)

    // Save API keys to localStorage
    localStorage.setItem("alpacaApiKey", alpacaApiKey)
    localStorage.setItem("alpacaApiSecret", alpacaApiSecret)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert("Alpaca API keys saved successfully!")
    }, 1000)
  }

  const toggleTradeLockerSecretVisibility = () => {
    setShowTradeLockerSecret(!showTradeLockerSecret)
  }

  const toggleAlpacaSecretVisibility = () => {
    setShowAlpacaSecret(!showAlpacaSecret)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage your trading API keys</p>
      </div>

      <ProfileNav />

      <Alert variant="warning" className="mb-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Important Security Notice</AlertTitle>
        <AlertDescription>
          Your API keys are stored locally on your device and are not transmitted to our servers. We prioritize your
          security and do not store your API keys in our database. These keys provide access to your trading account, so
          keep them secure.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tradelocker">TradeLocker</TabsTrigger>
          <TabsTrigger value="alpaca">Alpaca</TabsTrigger>
        </TabsList>

        <TabsContent value="tradelocker">
          <Card>
            <CardHeader>
              <CardTitle>TradeLocker API Keys</CardTitle>
              <CardDescription>Enter your TradeLocker API keys to connect to your trading account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                variant="info"
                className="mb-4 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border-blue-100 dark:border-blue-800"
              >
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Note About TradeLocker API Access</AlertTitle>
                <AlertDescription>
                  TradeLocker typically provides API access to brokers and institutional clients. Most individual users
                  will not need API keys as TradeLocker offers its own AI strategy building tools on their platform.
                  This demo mode allows you to explore the platform's features without API keys.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="tradelocker-api-key">API Key</Label>
                <Input
                  id="tradelocker-api-key"
                  value={tradelockerApiKey}
                  onChange={(e) => setTradeLockerApiKey(e.target.value)}
                  placeholder="Enter your TradeLocker API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradelocker-api-secret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="tradelocker-api-secret"
                    type={showTradeLockerSecret ? "text" : "password"}
                    value={tradelockerApiSecret}
                    onChange={(e) => setTradeLockerApiSecret(e.target.value)}
                    placeholder="Enter your TradeLocker API Secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={toggleTradeLockerSecretVisibility}
                  >
                    {showTradeLockerSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showTradeLockerSecret ? "Hide" : "Show"} API Secret</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex">
                  <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">About TradeLocker API Access</h3>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        TradeLocker typically provides API access to brokers and institutional clients. If you're a
                        broker or institutional client, you can contact TradeLocker directly at{" "}
                        <a
                          href="https://tradelocker.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          tradelocker.com
                        </a>{" "}
                        to request API access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveTradeLockerKeys}
                disabled={loading || !tradelockerApiKey || !tradelockerApiSecret}
              >
                {loading ? "Saving..." : "Save TradeLocker API Keys"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alpaca">
          <Card>
            <CardHeader>
              <CardTitle>Alpaca API Keys</CardTitle>
              <CardDescription>
                Enter your Alpaca API keys to connect to your trading account. You can get these from your Alpaca
                dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                variant="info"
                className="mb-4 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border-blue-100 dark:border-blue-800"
              >
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Demo Mode Available</AlertTitle>
                <AlertDescription>
                  You can use the application in demo mode without API keys. All features will work with simulated data.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="alpaca-api-key">API Key</Label>
                <Input
                  id="alpaca-api-key"
                  value={alpacaApiKey}
                  onChange={(e) => setAlpacaApiKey(e.target.value)}
                  placeholder="Enter your Alpaca API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alpaca-api-secret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="alpaca-api-secret"
                    type={showAlpacaSecret ? "text" : "password"}
                    value={alpacaApiSecret}
                    onChange={(e) => setAlpacaApiSecret(e.target.value)}
                    placeholder="Enter your Alpaca API Secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={toggleAlpacaSecretVisibility}
                  >
                    {showAlpacaSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showAlpacaSecret ? "Hide" : "Show"} API Secret</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex">
                  <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">How to get your Alpaca API keys</h3>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        1. Log in to your Alpaca account at{" "}
                        <a
                          href="https://app.alpaca.markets"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          app.alpaca.markets
                        </a>
                        <br />
                        2. Navigate to Paper Trading
                        <br />
                        3. Click on "API Keys" in the left sidebar
                        <br />
                        4. Generate a new key pair or use an existing one
                        <br />
                        5. Copy and paste both the API Key ID and Secret Key here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAlpacaKeys} disabled={loading || !alpacaApiKey || !alpacaApiSecret}>
                {loading ? "Saving..." : "Save Alpaca API Keys"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

