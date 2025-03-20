"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileNav } from "@/components/profile-nav"

export function SettingsContent() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [tradingAlerts, setTradingAlerts] = useState(true)
  const [marketUpdates, setMarketUpdates] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [chartType, setChartType] = useState("candle")
  const [timeZone, setTimeZone] = useState("UTC")
  const [loading, setLoading] = useState(false)
  const [quickSell, setQuickSell] = useState(false)
  const [quickBuy, setQuickBuy] = useState(false)

  useEffect(() => {
    // Load settings from localStorage if available
    const savedEmailNotifications = localStorage.getItem("emailNotifications") === "true"
    const savedTradingAlerts = localStorage.getItem("tradingAlerts") === "true"
    const savedMarketUpdates = localStorage.getItem("marketUpdates") === "true"
    const savedTheme = localStorage.getItem("theme") || "dark"
    const savedChartType = localStorage.getItem("chartType") || "candle"
    const savedTimeZone = localStorage.getItem("timeZone") || "UTC"
    const savedQuickSell = localStorage.getItem("quickSell") === "true"
    const savedQuickBuy = localStorage.getItem("quickBuy") === "true"

    setEmailNotifications(savedEmailNotifications !== false)
    setTradingAlerts(savedTradingAlerts !== false)
    setMarketUpdates(savedMarketUpdates === true)
    setTheme(savedTheme)
    setChartType(savedChartType)
    setTimeZone(savedTimeZone)
    setQuickSell(savedQuickSell)
    setQuickBuy(savedQuickBuy)
  }, [])

  const handleSaveSettings = () => {
    setLoading(true)

    // Save settings to localStorage
    localStorage.setItem("emailNotifications", emailNotifications.toString())
    localStorage.setItem("tradingAlerts", tradingAlerts.toString())
    localStorage.setItem("marketUpdates", marketUpdates.toString())
    localStorage.setItem("theme", theme)
    localStorage.setItem("chartType", chartType)
    localStorage.setItem("timeZone", timeZone)
    localStorage.setItem("quickSell", quickSell.toString())
    localStorage.setItem("quickBuy", quickBuy.toString())

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <ProfileNav />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trading-alerts">Trading Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about important trading events</p>
              </div>
              <Switch id="trading-alerts" checked={tradingAlerts} onCheckedChange={setTradingAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="market-updates">Market Updates</Label>
                <p className="text-sm text-muted-foreground">Receive daily market summaries</p>
              </div>
              <Switch id="market-updates" checked={marketUpdates} onCheckedChange={setMarketUpdates} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chart-type">Default Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger id="chart-type">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candle">Candlestick</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-zone">Time Zone</Label>
              <Select value={timeZone} onValueChange={setTimeZone}>
                <SelectTrigger id="time-zone">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="CST">Central Time (CST)</SelectItem>
                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trading Settings</CardTitle>
            <CardDescription>Configure your trading preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quick-sell">Quick Sell</Label>
                <p className="text-sm text-muted-foreground">Close positions without confirmation prompts</p>
              </div>
              <Switch id="quick-sell" checked={quickSell} onCheckedChange={setQuickSell} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quick-buy">Quick Buy</Label>
                <p className="text-sm text-muted-foreground">Open positions without confirmation prompts</p>
              </div>
              <Switch id="quick-buy" checked={quickBuy} onCheckedChange={setQuickBuy} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

