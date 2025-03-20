import { auth as nextAuth } from "@/auth"

export const auth = nextAuth

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

export async function hasProAccess() {
  const session = await auth()
  return session?.user?.plan === "pro"
}

