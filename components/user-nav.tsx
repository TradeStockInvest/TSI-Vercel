"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, LogOut, Settings, User, Key, Bell, HelpCircle, ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUserPlan } from "@/app/actions/subscription"
import { auth } from "@/auth"
import Link from "next/link"

export async function UserNav() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "trader@example.com"
    }
    return "trader@example.com"
  })

  const [avatarSrc, setAvatarSrc] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userAvatar") || "/placeholder.svg?height=32&width=32"
    }
    return "/placeholder.svg?height=32&width=32"
  })

  const [userPlan, setUserPlan] = useState("Free")
  const session = await auth()
  const plan = await getUserPlan()

  const handleLogout = () => {
    // Clear stored user data
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userLoggedIn")
    sessionStorage.removeItem("userEmail")
    sessionStorage.removeItem("userLoggedIn")

    // Reload the page to show login screen
    window.location.reload()
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  useEffect(() => {
    const handleStorageChange = () => {
      const newAvatar = localStorage.getItem("userAvatar")
      if (newAvatar) {
        setAvatarSrc(newAvatar)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 gap-1 pl-0 pr-2">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage
              src={avatarSrc}
              alt="@user"
              onError={(e) => {
                // If avatar fails to load, use the TSI logo as fallback
                const tsiLogo =
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-18%2014.35.40%20-%20A%20modern%20and%20professional%20logo%20for%20TradeStockInvest%20%28TSI%29.%20The%20design%20features%20a%20black%20background%20with%20a%20sleek%20gold%20stock%20chart%2C%20symbolizing%20market%20.jpg-JHYKp4ZKHc0CIFeNUGzqWaSKQBTbLM.jpeg"
                e.currentTarget.src = tsiLogo
                setAvatarSrc(tsiLogo)
              }}
            />
            <AvatarFallback>{userEmail.split("@")[0].substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex md:flex-col md:items-start md:leading-none">
            <span className="text-sm font-medium">
              {userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)}
            </span>
            <Badge variant="outline" className="mt-0.5 px-1 py-0 text-[10px]">
              {userPlan} Plan
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigateTo("/profile")} className="gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/profile/billing")} className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
            <Badge className="ml-auto text-[10px]">Free</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/profile/api-keys")} className="gap-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/profile/settings")} className="gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/subscription">
            <div className="flex items-center justify-between w-full">
              <span>Subscription</span>
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                  plan === "pro" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {plan === "pro" ? "PRO" : "FREE"}
              </span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigateTo("/help")} className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigateTo("/notifications")} className="gap-2">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
          <Badge className="ml-auto h-4 w-4 rounded-full p-0 text-[10px]">3</Badge>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="gap-2 text-rose-500 focus:text-rose-500">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

