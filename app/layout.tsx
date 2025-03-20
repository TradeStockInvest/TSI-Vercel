import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { SubscriptionProvider } from "@/contexts/subscription-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TradeStockInvest - Professional Trading Platform",
  description: "Advanced trading platform for serious investors",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SubscriptionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </ThemeProvider>
        </SubscriptionProvider>
      </body>
    </html>
  )
}

