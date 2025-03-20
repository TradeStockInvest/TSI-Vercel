import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Pro-only paths that should be protected
const PRO_PATHS = ["/ai-trading", "/advanced-analytics", "/portfolio-optimization"]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Check if the path is a Pro-only path
  const isProPath = PRO_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProPath) {
    // If not logged in, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user has Pro access
    try {
      const userPlan = token.subscriptionPlan || "free"

      if (userPlan !== "pro") {
        // Redirect to subscription page if not Pro
        return NextResponse.redirect(new URL("/subscription", request.url))
      }
    } catch (error) {
      console.error("Error in middleware:", error)
      // If there's an error, redirect to subscription page to be safe
      return NextResponse.redirect(new URL("/subscription", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/ai-trading/:path*", "/advanced-analytics/:path*", "/portfolio-optimization/:path*"],
}

