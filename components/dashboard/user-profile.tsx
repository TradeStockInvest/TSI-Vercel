"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, LogOut, User } from "lucide-react"

export function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = () => {
    if (showConfirm) {
      logout()
      router.push("/login")
    } else {
      setShowConfirm(true)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>You are not signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please sign in to access your profile and ensure your trading data is saved.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/login")} className="w-full">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-lg">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {showConfirm && (
          <Alert variant="warning" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Confirm Logout</AlertTitle>
            <AlertDescription>
              Are you sure you want to log out? Your data will be saved and accessible when you log back in.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/settings")}>
          <User className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant={showConfirm ? "destructive" : "secondary"} onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {showConfirm ? "Confirm Logout" : "Sign Out"}
        </Button>
      </CardFooter>
    </Card>
  )
}

