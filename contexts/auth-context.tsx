"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { initializeNewUserAccount, getUserAccount } from "@/services/user-service"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check local storage or session for auth token
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setLoading(false)
          return
        }

        // Validate token with backend (mock for now)
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
        if (userData.id) {
          setUser(userData)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setError("Authentication check failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // Mock API call to login
      // In a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const userData = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
      }

      // Check if user account exists, if not create one
      const account = await getUserAccount(userData.id)
      if (!account) {
        await initializeNewUserAccount(userData.id, userData.email, userData.name)
      }

      // Save auth data
      localStorage.setItem("auth_token", "mock_token")
      localStorage.setItem("user_data", JSON.stringify(userData))

      setUser(userData)
      return true
    } catch (err) {
      console.error("Login failed:", err)
      setError("Login failed. Please check your credentials and try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      // Mock API call to signup
      // In a real app, this would be an API request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful signup
      const userData = {
        id: `user_${Date.now()}`,
        email,
        name,
      }

      // Create new user account with zero balances
      await initializeNewUserAccount(userData.id, userData.email, userData.name)

      // Save auth data
      localStorage.setItem("auth_token", "mock_token")
      localStorage.setItem("user_data", JSON.stringify(userData))

      setUser(userData)
      return true
    } catch (err) {
      console.error("Signup failed:", err)
      setError("Signup failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true)

      // Save any pending data before logout
      if (user?.id) {
        // This would save any unsaved data to the user's account
        // For example, positions, trade history, etc.
      }

      // Clear auth data
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")

      setUser(null)
    } catch (err) {
      console.error("Logout failed:", err)
      setError("Logout failed")
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

