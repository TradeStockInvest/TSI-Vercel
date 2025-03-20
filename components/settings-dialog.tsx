"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [chartType, setChartType] = useState("candle")
  const [timeZone, setTimeZone] = useState("UTC")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your trading experience and account preferences</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Theme</h4>
                  <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Chart Type</h4>
                  <p className="text-sm text-muted-foreground">Default chart visualization</p>
                </div>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candle">Candlestick</SelectItem>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Time Zone</h4>
                  <p className="text-sm text-muted-foreground">Set your preferred time zone</p>
                </div>
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                    <SelectItem value="CST">Central Time (CST)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Alerts</h4>
                  <p className="text-sm text-muted-foreground">Receive trade confirmations and alerts via email</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} disabled={!notificationsEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Change Password</h4>
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="mt-2">Update Password</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input id="display-name" defaultValue="Trader" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="trader@example.com" />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">API Keys</h4>
                <p className="text-sm text-muted-foreground">Manage your Alpaca API keys</p>
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" defaultValue="PK9ZYOWC4BB8O4YC409P" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input id="api-secret" type="password" defaultValue="••••••••••••••••••••••••••••••" />
                </div>
                <Button className="mt-2">Update API Keys</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

