"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user data
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userLoggedIn", "true")

      toast({
        title: "Login successful",
        description: "Welcome back to TradeStockInvest!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate signup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user data
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userLoggedIn", "true")

      toast({
        title: "Account created",
        description: "Welcome to TradeStockInvest!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again with a different email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center noise-bg gradient-bg p-4">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.15),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(255,215,0,0.1),transparent_70%)]"></div>
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo />
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="#" className="underline underline-offset-2 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2 hover:text-primary">
            Privacy Policy
          </a>
          .
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">Market is Open</span>
        </div>
        <div className="text-xs text-muted-foreground">
          S&P 500: <span className="text-green-500">+1.2%</span>
        </div>
        <div className="text-xs text-muted-foreground">
          NASDAQ: <span className="text-green-500">+1.5%</span>
        </div>
      </div>
    </div>
  )
}

