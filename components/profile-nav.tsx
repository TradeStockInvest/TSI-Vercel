"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function ProfileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Profile",
      href: "/profile",
      active: pathname === "/profile",
    },
    {
      title: "API Keys",
      href: "/profile/api-keys",
      active: pathname === "/profile/api-keys",
    },
    {
      title: "Billing",
      href: "/profile/billing",
      active: pathname === "/profile/billing",
    },
    {
      title: "Settings",
      href: "/profile/settings",
      active: pathname === "/profile/settings",
    },
  ]

  return (
    <nav className="flex overflow-x-auto border-b pb-px">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center px-4 py-2 font-medium transition-colors hover:text-primary",
            item.active ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

