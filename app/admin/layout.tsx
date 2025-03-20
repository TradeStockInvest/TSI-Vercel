import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, you would check for admin authentication here
  // For demo purposes, we'll use a simple localStorage check
  // This is client-side only, so we need to use useEffect in a client component
  // or implement proper server-side authentication

  // For now, we'll just render the children
  // The actual auth check will be in the page component
  return <div className="min-h-screen bg-slate-950 text-white">{children}</div>
}

