"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileNav } from "@/components/profile-nav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export function ProfileContent() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarSuccess, setAvatarSuccess] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load user data from localStorage or sessionStorage
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || ""
    setUserEmail(email)

    // Load other profile data if available
    const savedName = localStorage.getItem("userName") || ""
    const savedPhone = localStorage.getItem("userPhone") || ""
    const savedAvatar = localStorage.getItem("userAvatar") || ""

    setFullName(savedName)
    setPhone(savedPhone)
    if (savedAvatar) {
      setAvatarPreview(savedAvatar)
    }
  }, [])

  const handleSaveProfile = async () => {
    setLoading(true)
    setProfileSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save profile data to localStorage
      localStorage.setItem("userName", fullName)
      localStorage.setItem("userPhone", phone)

      setProfileSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordSuccess(false)
    setPasswordError(null)

    // Validate passwords
    if (!currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    if (!newPassword) {
      setPasswordError("New password is required")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would verify the current password and update to the new one

      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error changing password:", error)
      setPasswordError("Failed to change password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image size exceeds 5MB limit")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAvatarError("File must be an image")
      return
    }

    setAvatarFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)

      // Auto-save the avatar
      handleSaveAvatar(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAvatar = async (dataUrl: string) => {
    setAvatarLoading(true)
    setAvatarSuccess(false)
    setAvatarError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would upload the file to a server
      // For now, we'll just store it in localStorage
      localStorage.setItem("userAvatar", dataUrl)

      setAvatarSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setAvatarSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving avatar:", error)
      setAvatarError("Failed to save avatar. Please try again.")
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <ProfileNav />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Profile" />
                  ) : (
                    <>
                      <AvatarImage
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-18%2014.35.40%20-%20A%20modern%20and%20professional%20logo%20for%20TradeStockInvest%20%28TSI%29.%20The%20design%20features%20a%20black%20background%20with%20a%20sleek%20gold%20stock%20chart%2C%20symbolizing%20market%20.jpg-JHYKp4ZKHc0CIFeNUGzqWaSKQBTbLM.jpeg"
                        alt="Profile"
                      />
                      <AvatarFallback className="text-lg">
                        {fullName
                          ? fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : userEmail.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                {avatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground">
                  Click on the avatar to upload a new image.
                  <br />
                  Maximum size: 5MB
                </p>
                {avatarSuccess && (
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Avatar updated successfully
                  </p>
                )}
                {avatarError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {avatarError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            {profileSuccess && (
              <Alert
                variant="success"
                className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your profile has been updated successfully.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>

            {passwordSuccess && (
              <Alert
                variant="success"
                className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your password has been changed successfully.</AlertDescription>
              </Alert>
            )}

            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleChangePassword} disabled={loading}>
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

