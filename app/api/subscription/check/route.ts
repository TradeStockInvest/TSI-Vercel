import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { hasProAccess } from "@/lib/subscription-service"

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ isPro: false })
    }

    const isPro = await hasProAccess(session.user.id)

    return NextResponse.json({ isPro })
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return NextResponse.json({ isPro: false }, { status: 500 })
  }
}

