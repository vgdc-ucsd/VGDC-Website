import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  // Local UI testing only: set DEV_SKIP_AUTH=true in .env.development.local; never applies to builds
  const skipAuth = process.env.NODE_ENV === "development" && process.env.DEV_SKIP_AUTH === "true"

  if (!skipAuth && !((session?.user as any)?.role == "officer")) {
    redirect(`/unauthorized?redirect=/dashboard`)
  }

  return <DashboardClient userName="Officer" />
}
