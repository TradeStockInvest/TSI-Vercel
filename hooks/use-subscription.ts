"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function useProAccess() {
  const [hasPro, setHasPro] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    const checkProAccess = () => {
      // Check localStorage first for immediate response
      const storedPlan = localStorage.getItem("userPlan")
      const isPro = storedPlan === "pro"
      setHasPro(isPro)
      setIsLoading(false)

      // Then verify with the server
      fetch("/api/subscription/check")
        .then((res) => res.json())
        .then((data) => {
          // Update if different from what we have
          if (data.isPro !== isPro) {
            setHasPro(data.isPro)
            localStorage.setItem("userPlan", data.isPro ? "pro" : "free")
          }
        })
        .catch((err) => {
          console.error("Error checking subscription:", err)
        })
    }

    checkProAccess()
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (hasPro === false && redirectTo) {
      toast({
        title: "Pro Plan Required",
        description: "This feature requires a Pro subscription",
        variant: "destructive",
      })
      router.push(redirectTo)
      setRedirectTo(null) // Reset redirectTo after navigation
    }
  }, [hasPro, isLoading, redirectTo, router, toast])

  const requirePro = (redirectToValue = "/subscription") => {
    setRedirectTo(redirectToValue)
    return hasPro
  }

  return { hasPro, isLoading, requirePro }
}

